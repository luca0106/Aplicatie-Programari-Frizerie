import { Router } from "express";
import {
  hasScheduleCollision,
  parseId,
  validateAppointment
} from "../validation.js";

const router = Router();

// Stage 9: data lives in memory and resets on server restart (Stage 10 moves it to MariaDB)
let appointments = [
  {
    id: 1,
    clientName: "Alexander Pierce",
    title: "Alexander Pierce",
    tag: "Combo",
    serviceName: "Haircut & Beard Trim",
    duration: 60,
    price: "85 RON",
    desc: "Includes wash and styling",
    barber: "Nicholas Andrei",
    date: "2026-11-24",
    time: "10:00",
    done: false
  },
  {
    id: 2,
    clientName: "Marcus Vance",
    title: "Marcus Vance",
    tag: "Haircut",
    serviceName: "Classic Haircut",
    duration: 40,
    price: "60 RON",
    desc: "Includes wash and styling",
    barber: "Nicholas Andrei",
    date: "2026-11-24",
    time: "11:10",
    done: true
  },
  {
    id: 3,
    clientName: "Julian Mercer",
    title: "Julian Mercer",
    tag: "Beard",
    serviceName: "Beard Trim with Razor",
    duration: 30,
    price: "30 RON",
    desc: "Straight razor contouring & hot towel",
    barber: "Nicholas Andrei",
    date: "2026-11-25",
    time: "14:00",
    done: false
  },
  {
    id: 4,
    clientName: "Daniel Sterling",
    title: "Daniel Sterling",
    tag: "Haircut",
    serviceName: "Medium Haircut (Fade)",
    duration: 60,
    price: "75 RON",
    desc: "Scissors and fade, includes wash and styling",
    barber: "Nicholas Andrei",
    date: "2026-11-28",
    time: "10:00",
    done: false
  }
];
let nextId = 5;

// Validates :id and finds the appointment index, or sends 400 / 404
function findAppointmentIndex(req, res) {
  const id = parseId(req.params.id);
  if (!id) {
    res.status(400).json({ error: "Invalid ID" });
    return -1;
  }

  const index = appointments.findIndex((a) => a.id === id);
  if (index === -1) {
    res.status(404).json({ error: "Appointment not found" });
  }
  return index;
}

// GET /appointments
router.get("/", (req, res) => {
  res.json(appointments);
});

// GET /appointments/:id
router.get("/:id", (req, res) => {
  const index = findAppointmentIndex(req, res);
  if (index === -1) return;
  res.json(appointments[index]);
});

// POST /appointments
router.post("/", (req, res) => {
  const { errors, data } = validateAppointment(req.body ?? {});
  if (errors.length > 0) {
    return res.status(400).json({ error: errors.join("; ") });
  }

  if (hasScheduleCollision(data, appointments)) {
    return res.status(400).json({
      error:
        "Selected time slot conflicts with an existing appointment (including the 10-minute studio break)"
    });
  }

  const appointment = { id: nextId++, ...data };
  appointments.push(appointment);
  res.status(201).json(appointment);
});

// PATCH /appointments/:id (partial update)
router.patch("/:id", (req, res) => {
  const index = findAppointmentIndex(req, res);
  if (index === -1) return;

  const { errors, data } = validateAppointment(req.body ?? {}, {
    partial: true
  });
  if (errors.length > 0) {
    return res.status(400).json({ error: errors.join("; ") });
  }

  const updated = { ...appointments[index], ...data };
  if (hasScheduleCollision(updated, appointments, updated.id)) {
    return res.status(400).json({
      error:
        "Selected time slot conflicts with an existing appointment (including the 10-minute studio break)"
    });
  }

  appointments[index] = updated;
  res.json(appointments[index]);
});

// DELETE /appointments/:id
router.delete("/:id", (req, res) => {
  const index = findAppointmentIndex(req, res);
  if (index === -1) return;

  appointments.splice(index, 1);
  res.status(204).end();
});

export default router;

// Server-side validation: client input is never trusted (Zero-Trust boundary).
// Fixed values MUST stay identical to frontend/src/constants.js and tw.json.
export const TAGS = ["Combo", "Haircut", "Beard"];

const CLIENT_NAME_MAX = 100;
const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const TIME_24H_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;
const MANDATORY_BREAK_MINUTES = 10;

// Default service metadata when a minimal API client (e.g. curl or automated test)
// sends only { clientName, tag, done } without full booking details.
const DEFAULT_SERVICE_BY_TAG = {
  Combo: {
    serviceName: "Haircut & Beard Trim",
    duration: 60,
    price: "85 RON",
    desc: "Includes wash and styling"
  },
  Haircut: {
    serviceName: "Classic Haircut",
    duration: 40,
    price: "60 RON",
    desc: "Includes wash and styling"
  },
  Beard: {
    serviceName: "Beard Trim",
    duration: 20,
    price: "25 RON",
    desc: "Beard shaping and contouring"
  }
};

function parseISODateLocal(isoStr) {
  const [y, m, d] = isoStr.split("-").map(Number);
  const dt = new Date(y, m - 1, d, 12, 0, 0);
  // Reject impossible dates like 2026-02-31
  if (
    dt.getFullYear() !== y ||
    dt.getMonth() !== m - 1 ||
    dt.getDate() !== d
  ) {
    return null;
  }
  return dt;
}

function timeToMinutes(timeStr) {
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + m;
}

// Working schedule:
// - Monday (1) & Sunday (0): closed
// - Tuesday - Friday (2..5): 10:00 - 19:00
// - Saturday (6): 09:00 - 15:00
function getStudioHours(dateObj) {
  const day = dateObj.getDay();
  if (day === 0 || day === 1) return null;
  if (day === 6) return { open: 9 * 60, close: 15 * 60, label: "09:00 - 15:00" };
  return { open: 10 * 60, close: 19 * 60, label: "10:00 - 19:00" };
}

/**
 * Validates and whitelists appointment payload fields.
 * - partial = false (POST): enforces required fields and fills sensible defaults.
 * - partial = true (PATCH): validates only fields explicitly present in body.
 * Any unknown field (e.g. id, role, isAdmin) is silently stripped (whitelist).
 */
export function validateAppointment(body, { partial = false } = {}) {
  const errors = [];
  const data = {};

  // 1. clientName (required on POST, max 100 chars)
  if (!partial || body.clientName !== undefined) {
    if (typeof body.clientName !== "string" || body.clientName.trim() === "") {
      errors.push("Client name is required");
    } else if (body.clientName.trim().length > CLIENT_NAME_MAX) {
      errors.push(`Client name must be at most ${CLIENT_NAME_MAX} characters`);
    } else {
      const cleanName = body.clientName.trim();
      data.clientName = cleanName;
      data.title = cleanName;
    }
  }

  // 2. tag (must be one of TAGS; defaults to "Combo" on POST)
  if (!partial || body.tag !== undefined) {
    const tagValue = body.tag ?? "Combo";
    if (!TAGS.includes(tagValue)) {
      errors.push(`Tag must be one of: ${TAGS.join(", ")}`);
    } else {
      data.tag = tagValue;
    }
  }

  // 3. done (boolean; defaults to false on POST)
  if (body.done !== undefined) {
    if (typeof body.done !== "boolean") {
      errors.push("Done status must be true or false");
    } else {
      data.done = body.done;
    }
  } else if (!partial) {
    data.done = false;
  }

  // 4. Optional barbershop domain fields (whitelisted)
  const fallbackService =
    DEFAULT_SERVICE_BY_TAG[data.tag] || DEFAULT_SERVICE_BY_TAG.Combo;

  if (body.serviceName !== undefined) {
    if (typeof body.serviceName !== "string" || body.serviceName.trim() === "") {
      errors.push("Service name must be a non-empty string");
    } else {
      data.serviceName = body.serviceName.trim().slice(0, 100);
    }
  } else if (!partial) {
    data.serviceName = fallbackService.serviceName;
  }

  if (body.duration !== undefined) {
    const dur = Number(body.duration);
    if (!Number.isInteger(dur) || dur < 5 || dur > 240) {
      errors.push("Duration must be an integer between 5 and 240 minutes");
    } else {
      data.duration = dur;
    }
  } else if (!partial) {
    data.duration = fallbackService.duration;
  }

  if (body.price !== undefined) {
    if (typeof body.price !== "string" || body.price.trim() === "") {
      errors.push("Price must be a non-empty string");
    } else {
      data.price = body.price.trim().slice(0, 40);
    }
  } else if (!partial) {
    data.price = fallbackService.price;
  }

  if (body.desc !== undefined) {
    if (typeof body.desc !== "string") {
      errors.push("Description must be a string");
    } else {
      data.desc = body.desc.trim().slice(0, 200);
    }
  } else if (!partial) {
    data.desc = fallbackService.desc;
  }

  if (body.barber !== undefined) {
    if (typeof body.barber !== "string" || body.barber.trim() === "") {
      errors.push("Barber name must be a non-empty string");
    } else {
      data.barber = body.barber.trim().slice(0, 80);
    }
  } else if (!partial) {
    data.barber = "Nicholas Andrei";
  }

  // 5. Optional schedule fields (date & time): validate working hours if explicitly sent
  let parsedDate = null;
  if (body.date !== undefined) {
    if (typeof body.date !== "string" || !ISO_DATE_REGEX.test(body.date)) {
      errors.push("Date must use YYYY-MM-DD format");
    } else {
      parsedDate = parseISODateLocal(body.date);
      if (!parsedDate) {
        errors.push("Date is not a valid calendar date");
      } else if (!getStudioHours(parsedDate)) {
        errors.push("The studio is closed on Mondays and Sundays");
      } else {
        data.date = body.date;
      }
    }
  }

  if (body.time !== undefined) {
    if (typeof body.time !== "string" || !TIME_24H_REGEX.test(body.time)) {
      errors.push("Time must use HH:MM 24-hour format");
    } else {
      data.time = body.time;
    }
  }

  // If both date and time are valid, enforce studio opening/closing hours
  if (parsedDate && data.time) {
    const hours = getStudioHours(parsedDate);
    const startMin = timeToMinutes(data.time);
    const durationMin = data.duration ?? fallbackService.duration;
    if (hours && (startMin < hours.open || startMin + durationMin > hours.close)) {
      errors.push(`Appointment time must fit within studio hours (${hours.label})`);
    }
  }

  return { errors, data };
}

/**
 * Checks whether a candidate appointment overlaps any existing active appointment
 * on the same date, including the mandatory 10-minute studio break buffer.
 */
export function hasScheduleCollision(
  candidate,
  existingAppointments,
  ignoreId = null
) {
  if (!candidate.date || !candidate.time || candidate.done) {
    return false;
  }

  const candidateStart = timeToMinutes(candidate.time);
  const candidateEnd = candidateStart + (candidate.duration || 40);

  return existingAppointments.some((existing) => {
    if (existing.id === ignoreId || existing.done) return false;
    if (existing.date !== candidate.date || !existing.time) return false;

    const existingStart = timeToMinutes(existing.time);
    const existingEnd = existingStart + (existing.duration || 40);

    return (
      candidateStart < existingEnd + MANDATORY_BREAK_MINUTES &&
      candidateEnd + MANDATORY_BREAK_MINUTES > existingStart
    );
  });
}

// Route params always arrive as strings; accept only positive integers.
export function parseId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

import { useState, useMemo } from "react";

// Complete Studio Service Catalog in English with fixed lowest prices and exact durations
const SERVICES_CATALOG = [
  {
    id: "Haircut",
    name: "Classic Haircut",
    duration: 40,
    price: "60 RON",
    desc: "Includes wash and styling",
    tag: "Haircut"
  },
  {
    id: "Combo",
    name: "Haircut & Beard Trim",
    duration: 60,
    price: "85 RON",
    desc: "Includes wash and styling",
    tag: "Combo"
  },
  {
    id: "fade",
    name: "Medium Haircut (Fade)",
    duration: 60,
    price: "75 RON",
    desc: "Scissors and fade, includes wash and styling",
    tag: "Haircut"
  },
  {
    id: "kids",
    name: "Kid's Haircut",
    duration: 40,
    price: "50 RON",
    desc: "Ages 3–10 years",
    tag: "Haircut"
  },
  {
    id: "buzz",
    name: "Buzz Cut",
    duration: 30,
    price: "45 RON",
    desc: "Clippers only haircut",
    tag: "Haircut"
  },
  {
    id: "razor",
    name: "Beard Trim with Razor",
    duration: 30,
    price: "30 RON",
    desc: "Straight razor contouring & hot towel",
    tag: "Beard"
  },
  {
    id: "Beard",
    name: "Beard Trim",
    duration: 20,
    price: "25 RON",
    desc: "Beard shaping and contouring",
    tag: "Beard"
  },
  {
    id: "wash",
    name: "Hair Wash",
    duration: 5,
    price: "10 RON",
    desc: "Refreshing hair wash",
    tag: "Haircut"
  },
  {
    id: "styling",
    name: "Styling",
    duration: 15,
    price: "20 RON",
    desc: "Wash, blow-dry, and premium styling product",
    tag: "Haircut"
  },
  {
    id: "double",
    name: "Double Haircut (x2)",
    duration: 90,
    price: "120 RON",
    desc: "Two haircuts, includes wash and styling",
    tag: "Combo"
  }
];

// Helper to format duration display (e.g. "1 h", "1 h 30 min", "40 min")
function formatDurationLabel(minutes) {
  if (minutes === 60) return "1 h";
  if (minutes === 90) return "1 h 30 min";
  return `${minutes} min`;
}

// Parse ISO date string ("YYYY-MM-DD") in local timezone at noon to prevent any timezone shifts
function parseISODate(isoStr) {
  const [y, m, d] = (isoStr || "").split("-").map(Number);
  return new Date(y, m - 1, d, 12, 0, 0);
}

// Format local Date object to "YYYY-MM-DD" without UTC shift
function formatDateToISO(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function getTodayDate() {
  return formatDateToISO(new Date());
}

// Barbershop Working Hours:
// - Monday (1) & Sunday (0): CLOSED (Day off)
// - Tuesday – Friday (2 - 5): 10:00 – 19:00
// - Saturday (6): 09:00 – 15:00
function getStudioHours(dateStr) {
  if (!dateStr) return null;
  const date = parseISODate(dateStr);
  const day = date.getDay(); // 0 = Sunday, 1 = Monday, 2 = Tuesday ... 6 = Saturday

  // Sunday & Monday are closed days
  if (day === 0 || day === 1) {
    return null;
  }

  // Saturday: 09:00 – 15:00
  if (day === 6) {
    return {
      openMinutes: 9 * 60, // 09:00 (540 min)
      closeMinutes: 15 * 60, // 15:00 (900 min)
      label: "Saturday: 09:00 – 15:00"
    };
  }

  // Tuesday – Friday: 10:00 – 19:00
  return {
    openMinutes: 10 * 60, // 10:00 (600 min)
    closeMinutes: 19 * 60, // 19:00 (1140 min)
    label: "Tue – Fri: 10:00 – 19:00"
  };
}

function isDayClosed(dateStr) {
  return getStudioHours(dateStr) === null;
}

// Find first open working day starting from base date
function getFirstOpenDate(baseDateStr) {
  const date = parseISODate(baseDateStr);
  while (date.getDay() === 0 || date.getDay() === 1) {
    date.setDate(date.getDate() + 1);
  }
  return formatDateToISO(date);
}

// Convert "HH:MM" string to minutes from midnight
function timeToMinutes(timeStr) {
  if (!timeStr) return 0;
  const [h, m] = timeStr.split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
}

// Convert minutes from midnight to "HH:MM" string
function minutesToTime(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

// Collision calculation with mandatory 10-minute buffer between any two appointments
function isColliding(candidateStart, candidateDuration, existingStart, existingDuration) {
  const candidateEnd = candidateStart + candidateDuration;
  const existingEnd = existingStart + existingDuration;
  return candidateStart < existingEnd + 10 && candidateEnd + 10 > existingStart;
}

// Generate intelligent available slots based on studio schedule and 10-minute break buffer
function getAvailableTimeSlots(dateStr, duration, appointments = []) {
  const hours = getStudioHours(dateStr);
  if (!hours) return []; // Closed on Monday and Sunday

  const openingMinutes = hours.openMinutes;
  const closingMinutes = hours.closeMinutes;
  const step = 20; // 20-minute clean interval

  // Filter pending/active appointments on the selected date
  const dateAppointments = appointments
    .filter((a) => a.date === dateStr && !a.done)
    .map((a) => ({
      start: timeToMinutes(a.time),
      duration: a.duration || 40
    }));

  const candidateMinutesSet = new Set();

  // Add standard intervals
  for (let m = openingMinutes; m + duration <= closingMinutes; m += step) {
    candidateMinutesSet.add(m);
  }

  // Also include openings right after existing appointments + 10 min break
  dateAppointments.forEach((app) => {
    const afterBreak = app.start + app.duration + 10;
    if (afterBreak >= openingMinutes && afterBreak + duration <= closingMinutes) {
      candidateMinutesSet.add(afterBreak);
    }
  });

  const sortedCandidates = Array.from(candidateMinutesSet).sort((a, b) => a - b);

  const available = [];
  for (const start of sortedCandidates) {
    const collides = dateAppointments.some((app) =>
      isColliding(start, duration, app.start, app.duration)
    );
    if (!collides) {
      available.push(minutesToTime(start));
    }
  }

  return available;
}

// Generate 7 days for the week navigation strip
function getDaysOfWeek(baseDateStr, weekOffset = 0) {
  const base = parseISODate(baseDateStr);
  base.setDate(base.getDate() + weekOffset * 7);

  // Find Monday of target week (0 for Monday, 6 for Sunday)
  const dayOfWeek = base.getDay();
  const distanceToMonday = (dayOfWeek + 6) % 7;
  const monday = new Date(base);
  monday.setDate(base.getDate() - distanceToMonday);

  const days = [];
  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  for (let i = 0; i < 7; i++) {
    const cur = new Date(monday);
    cur.setDate(monday.getDate() + i);
    const isoDate = formatDateToISO(cur);
    days.push({
      isoDate,
      dayNumber: cur.getDate(),
      dayName: dayNames[i],
      monthShort: cur.toLocaleString("en-US", { month: "short" }),
      isClosed: isDayClosed(isoDate)
    });
  }

  return days;
}

// Client-side validation
function valideaza(nume, serviceId, selectedTime, isClosed, availableSlotsCount) {
  const t = (nume || "").trim();
  if (t === "") {
    return "Client name is required.";
  }
  if (t.length > 100) {
    return "Client name cannot exceed 100 characters.";
  }
  if (!serviceId) {
    return "Please select a service package.";
  }
  if (isClosed) {
    return "The studio is closed on Mondays and Sundays. Please select Tuesday – Saturday.";
  }
  if (availableSlotsCount === 0) {
    return "No available slots on this date. Please select another day.";
  }
  if (!selectedTime) {
    return "Please select an available time slot.";
  }
  return "";
}

export default function AppointmentForm({ onAdd, onCreeaza, appointments = [] }) {
  const todayStr = useMemo(() => getTodayDate(), []);
  const initialOpenDate = useMemo(() => getFirstOpenDate(todayStr), [todayStr]);

  const [clientName, setClientName] = useState("");
  const [serviceId, setServiceId] = useState(""); // default unselected
  const [selectedDate, setSelectedDate] = useState(initialOpenDate);
  const [weekOffset, setWeekOffset] = useState(0);
  const [userSelectedTime, setUserSelectedTime] = useState("");
  const [eroare, setEroare] = useState("");
  const [trimite, setTrimite] = useState(false);

  const selectedService = SERVICES_CATALOG.find((s) => s.id === serviceId) || null;

  // Dynamic available time slots for selected date and service duration
  const availableSlots = useMemo(() => {
    if (!selectedService) return [];
    return getAvailableTimeSlots(selectedDate, selectedService.duration, appointments);
  }, [selectedDate, selectedService, appointments]);

  // Selected time: user choice or first available slot
  const selectedTime = availableSlots.includes(userSelectedTime)
    ? userSelectedTime
    : availableSlots[0] || "";

  // 7 days of the current target week
  const daysOfWeek = useMemo(() => {
    return getDaysOfWeek(todayStr, weekOffset);
  }, [todayStr, weekOffset]);

  const weekRangeText = `${daysOfWeek[0].dayNumber} ${daysOfWeek[0].monthShort} – ${daysOfWeek[6].dayNumber} ${daysOfWeek[6].monthShort}`;
  const isSelectedDateClosed = isDayClosed(selectedDate);
  const studioHours = getStudioHours(selectedDate);

  function handleChange(e) {
    setClientName(e.target.value);
    if (eroare) setEroare("");
  }

  function handleServiceChange(e) {
    setServiceId(e.target.value);
    setUserSelectedTime("");
    if (eroare) setEroare("");
  }

  function handleWeekChange(newOffset) {
    setWeekOffset(newOffset);
    const newDays = getDaysOfWeek(todayStr, newOffset);
    // Automatically select the first open working day (Tuesday) of that week
    const firstOpen = newDays.find((d) => !d.isClosed) || newDays[1];
    setSelectedDate(firstOpen.isoDate);
    setUserSelectedTime("");
    if (eroare) setEroare("");
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const mesajEroare = valideaza(
      clientName,
      serviceId,
      selectedTime,
      isSelectedDateClosed,
      availableSlots.length
    );

    if (mesajEroare) {
      setEroare(mesajEroare);
      return;
    }

    setTrimite(true);
    setEroare("");

    try {
      const callback = onAdd || onCreeaza;
      if (callback && selectedService) {
        await callback({
          clientName: clientName.trim(),
          title: clientName.trim(),
          tag: selectedService.tag,
          serviceName: selectedService.name,
          duration: selectedService.duration,
          price: selectedService.price,
          barber: "Nicholas Andrei",
          date: selectedDate,
          time: selectedTime,
          done: false
        });
      }

      // Reset form on success
      setClientName("");
      setServiceId("");
      setUserSelectedTime("");
    } catch (err) {
      setEroare(err.message || "Failed to create appointment.");
    } finally {
      setTrimite(false);
    }
  }

  // Format heading date with local timezone
  const prettySelectedDate = parseISODate(selectedDate).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric"
  });

  return (
    <form
      className="task-form appointment-form"
      onSubmit={handleSubmit}
      noValidate
      data-testid="form"
    >
      <div className="form-header-group">
        <h3 className="form-heading">New Appointment</h3>
        <p className="form-subheading">Book an executive grooming slot with real-time schedule sync</p>
      </div>

      <div className="form-group">
        <label htmlFor="appointment-client-input" className="form-label">
          Client Name <span className="required-star">*</span>
        </label>
        <input
          id="appointment-client-input"
          type="text"
          className="form-input"
          placeholder="e.g. Andrew Smith"
          value={clientName}
          onChange={handleChange}
          maxLength={100}
          aria-invalid={Boolean(eroare)}
          aria-describedby={eroare ? "form-error-message" : undefined}
          data-testid="form-title"
        />
      </div>

      {/* Service package selector: starts unselected by default */}
      <div className="form-group">
        <label htmlFor="appointment-service-select" className="form-label">
          Service Package <span className="required-star">*</span>
        </label>
        <select
          id="appointment-service-select"
          className="form-select"
          value={serviceId}
          onChange={handleServiceChange}
          data-testid="form-tag"
        >
          <option value="">-- Select a service package --</option>
          {SERVICES_CATALOG.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} ({formatDurationLabel(s.duration)} — {s.price})
            </option>
          ))}
        </select>

        {/* Live Service Detail Hint */}
        {selectedService && (
          <div className="service-meta-hint">
            <span className="hint-pill">⏱ {formatDurationLabel(selectedService.duration)}</span>
            <span className="hint-pill">💰 {selectedService.price}</span>
            {selectedService.desc && <span className="hint-desc">{selectedService.desc}</span>}
          </div>
        )}
      </div>

      {/* Conditional: Only show schedule & time slots AFTER a service is selected */}
      {!serviceId ? (
        <div className="schedule-empty-placeholder">
          <span className="placeholder-icon">✂️</span>
          <p className="placeholder-text">Please choose a service package above</p>
          <span className="placeholder-sub">
            Opening Hours: Tue – Fri (10:00 – 19:00) • Sat (09:00 – 15:00)
          </span>
        </div>
      ) : (
        <div className="booking-schedule-group">
          {/* Week navigation strip */}
          <div className="week-nav-bar">
            <button
              type="button"
              className="btn-week-nav"
              onClick={() => handleWeekChange(weekOffset - 1)}
              aria-label="Previous week"
            >
              ‹ Prev
            </button>
            <span className="week-range-text">{weekRangeText}</span>
            <button
              type="button"
              className="btn-week-nav"
              onClick={() => handleWeekChange(weekOffset + 1)}
              aria-label="Next week"
            >
              Next ›
            </button>
          </div>

          {/* 7 Days of the Week Strip */}
          <div className="week-days-strip">
            {daysOfWeek.map((day) => {
              const isSelected = selectedDate === day.isoDate;
              return (
                <button
                  key={day.isoDate}
                  type="button"
                  className={`day-card-btn ${day.isClosed ? "closed" : ""} ${isSelected ? "active" : ""}`}
                  disabled={day.isClosed}
                  onClick={() => {
                    if (!day.isClosed) {
                      setSelectedDate(day.isoDate);
                      setUserSelectedTime("");
                      if (eroare) setEroare("");
                    }
                  }}
                  title={day.isClosed ? "Closed on Mondays and Sundays" : `${day.dayName}, ${day.monthShort} ${day.dayNumber}`}
                >
                  <span className="day-name">{day.dayName}</span>
                  <span className="day-number-circle">{day.dayNumber}</span>
                  {day.isClosed && <span className="day-closed-sub">Closed</span>}
                </button>
              );
            })}
          </div>

          {/* Available times heading */}
          <div className="available-times-bar">
            <div className="available-title-wrap">
              <span className="available-heading-text">
                Available Times: <strong>{prettySelectedDate}</strong>
              </span>
              {studioHours && (
                <span className="studio-schedule-note">{studioHours.label}</span>
              )}
            </div>
            {!isSelectedDateClosed && (
              <span className="slots-count-pill">{availableSlots.length} available</span>
            )}
          </div>

          {/* Time slots scrollable list */}
          <div className="time-slots-container">
            {isSelectedDateClosed ? (
              <div className="no-slots-box closed-day-box">
                <p className="no-slots-msg">Studio Closed on Mondays & Sundays</p>
                <span className="no-slots-sub">
                  Working hours: Tue – Fri (10:00 – 19:00), Sat (09:00 – 15:00)
                </span>
              </div>
            ) : availableSlots.length === 0 ? (
              <div className="no-slots-box">
                <p className="no-slots-msg">No slots available on this date.</p>
                <span className="no-slots-sub">
                  All sessions are occupied with 10-min buffers. Please select another day.
                </span>
              </div>
            ) : (
              <div className="time-slots-list">
                {availableSlots.map((slot) => {
                  const isSelected = selectedTime === slot;
                  return (
                    <button
                      key={slot}
                      type="button"
                      className={`time-slot-card ${isSelected ? "selected" : ""}`}
                      onClick={() => {
                        setUserSelectedTime(slot);
                        if (eroare) setEroare("");
                      }}
                      aria-pressed={isSelected}
                    >
                      <div className="slot-left-col">
                        <span className="slot-time-bold">{slot}</span>
                        {isSelected && <span className="slot-active-badge">✓ Selected</span>}
                      </div>
                      <div className="slot-right-col">
                        <span className="slot-price-label">{selectedService.price}</span>
                        <span className="slot-arrow">›</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {eroare && (
        <p
          id="form-error-message"
          className="error form-error"
          data-testid="form-error"
          role="alert"
        >
          {eroare}
        </p>
      )}

      <button
        type="submit"
        className="btn-submit"
        disabled={trimite || !serviceId || isSelectedDateClosed || !selectedTime}
        data-testid="form-submit"
      >
        {trimite
          ? "Saving..."
          : !serviceId
          ? "Select a service to book"
          : isSelectedDateClosed
          ? "Studio closed on this date"
          : `Book Appointment for ${selectedTime}`}
      </button>
    </form>
  );
}

import { useState, useMemo } from "react";
import { SERVICES_CATALOG, formatDurationLabel } from "../constants.js";
import styles from "./AppointmentForm.module.css";

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
  const day = date.getDay();

  if (day === 0 || day === 1) {
    return null;
  }

  if (day === 6) {
    return {
      openMinutes: 9 * 60,
      closeMinutes: 15 * 60,
      label: "Saturday: 09:00 – 15:00"
    };
  }

  return {
    openMinutes: 10 * 60,
    closeMinutes: 19 * 60,
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
  if (!hours) return [];

  const openingMinutes = hours.openMinutes;
  const closingMinutes = hours.closeMinutes;
  const step = 20;

  const dateAppointments = appointments
    .filter((a) => a.date === dateStr && !a.done)
    .map((a) => ({
      start: timeToMinutes(a.time),
      duration: a.duration || 40
    }));

  const candidateMinutesSet = new Set();

  for (let m = openingMinutes; m + duration <= closingMinutes; m += step) {
    candidateMinutesSet.add(m);
  }

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
function valideaza(nume, isClosed, availableSlotsCount) {
  const t = (nume || "").trim();
  if (t === "") {
    return "Client name is required.";
  }
  if (t.length > 100) {
    return "Client name cannot exceed 100 characters.";
  }
  if (isClosed) {
    return "The studio is closed on Mondays and Sundays. Please select Tuesday – Saturday.";
  }
  if (availableSlotsCount === 0) {
    return "No available slots on this date. Please select another day.";
  }
  return "";
}

export default function AppointmentForm({ onAdd, onCreeaza, appointments = [] }) {
  const todayStr = useMemo(() => getTodayDate(), []);
  const initialOpenDate = useMemo(() => getFirstOpenDate(todayStr), [todayStr]);

  const [clientName, setClientName] = useState("");
  const [serviceId, setServiceId] = useState(""); // default unselected in UI
  const [selectedDate, setSelectedDate] = useState(initialOpenDate);
  const [weekOffset, setWeekOffset] = useState(0);
  const [userSelectedTime, setUserSelectedTime] = useState("");
  const [eroare, setEroare] = useState("");
  const [trimite, setTrimite] = useState(false);

  const selectedService = SERVICES_CATALOG.find((s) => s.id === serviceId) || null;
  const effectiveService = selectedService || SERVICES_CATALOG[1];

  // Dynamic available time slots for selected date and service duration
  const availableSlots = useMemo(() => {
    return getAvailableTimeSlots(selectedDate, effectiveService.duration, appointments);
  }, [selectedDate, effectiveService.duration, appointments]);

  // Selected time: user choice or first available slot
  const selectedTime = availableSlots.includes(userSelectedTime)
    ? userSelectedTime
    : availableSlots[0] || "10:00";

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
    const firstOpen = newDays.find((d) => !d.isClosed) || newDays[1];
    setSelectedDate(firstOpen.isoDate);
    setUserSelectedTime("");
    if (eroare) setEroare("");
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const mesajEroare = valideaza(
      clientName,
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
      if (callback) {
        await callback({
          clientName: clientName.trim(),
          title: clientName.trim(),
          tag: effectiveService.tag,
          serviceName: effectiveService.name,
          duration: effectiveService.duration,
          price: effectiveService.price,
          desc: effectiveService.desc,
          barber: "Nicholas Andrei",
          date: selectedDate,
          time: selectedTime,
          done: false
        });
      }

      setClientName("");
      setServiceId("");
      setUserSelectedTime("");
    } catch (err) {
      setEroare(err.message || "Failed to create appointment.");
    } finally {
      setTrimite(false);
    }
  }

  const prettySelectedDate = parseISODate(selectedDate).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric"
  });

  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit}
      noValidate
      data-testid="form"
    >
      <div className={styles.headerGroup}>
        <h3 className={styles.heading}>New Appointment</h3>
        <p className={styles.subheading}>Book an executive grooming slot with real-time schedule sync</p>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="appointment-client-input" className={styles.label}>
          Client Name <span className={styles.requiredStar}>*</span>
        </label>
        <input
          id="appointment-client-input"
          type="text"
          className={styles.input}
          placeholder="e.g. Andrew Smith"
          value={clientName}
          onChange={handleChange}
          maxLength={100}
          aria-invalid={Boolean(eroare)}
          aria-describedby={eroare ? "form-error-message" : undefined}
          data-testid="form-title"
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="appointment-service-select" className={styles.label}>
          Service Package <span className={styles.requiredStar}>*</span>
        </label>
        <select
          id="appointment-service-select"
          className={styles.select}
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

        {selectedService && (
          <div className={styles.metaHint}>
            <span className={styles.hintPill}>⏱ {formatDurationLabel(selectedService.duration)}</span>
            <span className={styles.hintPill}>💰 {selectedService.price}</span>
            {selectedService.desc && <span className={styles.hintDesc}>{selectedService.desc}</span>}
          </div>
        )}
      </div>

      {/* Conditional: Only show schedule & time slots AFTER a service is selected */}
      {!serviceId ? (
        <div className={styles.emptyPlaceholder}>
          <span className={styles.placeholderIcon}>✂️</span>
          <p className={styles.placeholderText}>Please choose a service package above</p>
          <span className={styles.placeholderSub}>
            Opening Hours: Tue – Fri (10:00 – 19:00) • Sat (09:00 – 15:00)
          </span>
        </div>
      ) : (
        <div className={styles.scheduleGroup}>
          <div className={styles.weekNavBar}>
            <button
              type="button"
              className={styles.btnWeekNav}
              onClick={() => handleWeekChange(weekOffset - 1)}
              aria-label="Previous week"
            >
              ‹ Prev
            </button>
            <span className={styles.weekRangeText}>{weekRangeText}</span>
            <button
              type="button"
              className={styles.btnWeekNav}
              onClick={() => handleWeekChange(weekOffset + 1)}
              aria-label="Next week"
            >
              Next ›
            </button>
          </div>

          <div className={styles.weekDaysStrip}>
            {daysOfWeek.map((day) => {
              const isSelected = selectedDate === day.isoDate;
              return (
                <button
                  key={day.isoDate}
                  type="button"
                  className={`${styles.dayCardBtn} ${day.isClosed ? styles.closed : ""} ${
                    isSelected ? styles.active : ""
                  }`}
                  disabled={day.isClosed}
                  onClick={() => {
                    if (!day.isClosed) {
                      setSelectedDate(day.isoDate);
                      setUserSelectedTime("");
                      if (eroare) setEroare("");
                    }
                  }}
                  title={
                    day.isClosed
                      ? "Closed on Mondays and Sundays"
                      : `${day.dayName}, ${day.monthShort} ${day.dayNumber}`
                  }
                >
                  <span className={styles.dayName}>{day.dayName}</span>
                  <span className={styles.dayNumberCircle}>{day.dayNumber}</span>
                  {day.isClosed && <span className={styles.dayClosedSub}>Closed</span>}
                </button>
              );
            })}
          </div>

          <div className={styles.availableTimesBar}>
            <div className={styles.availableTitleWrap}>
              <span className={styles.availableHeadingText}>
                Available Times: <strong>{prettySelectedDate}</strong>
              </span>
              {studioHours && (
                <span className={styles.studioScheduleNote}>{studioHours.label}</span>
              )}
            </div>
            {!isSelectedDateClosed && (
              <span className={styles.slotsCountPill}>{availableSlots.length} available</span>
            )}
          </div>

          <div className={styles.timeSlotsContainer}>
            {isSelectedDateClosed ? (
              <div className={`${styles.noSlotsBox} ${styles.closedDayBox}`}>
                <p className={styles.noSlotsMsg}>Studio Closed on Mondays & Sundays</p>
                <span className={styles.noSlotsSub}>
                  Working hours: Tue – Fri (10:00 – 19:00), Sat (09:00 – 15:00)
                </span>
              </div>
            ) : availableSlots.length === 0 ? (
              <div className={styles.noSlotsBox}>
                <p className={styles.noSlotsMsg}>No slots available on this date.</p>
                <span className={styles.noSlotsSub}>
                  All sessions are occupied with 10-min buffers. Please select another day.
                </span>
              </div>
            ) : (
              <div className={styles.timeSlotsList}>
                {availableSlots.map((slot) => {
                  const isSelected = selectedTime === slot;
                  return (
                    <button
                      key={slot}
                      type="button"
                      className={`${styles.timeSlotCard} ${isSelected ? styles.selected : ""}`}
                      onClick={() => {
                        setUserSelectedTime(slot);
                        if (eroare) setEroare("");
                      }}
                      aria-pressed={isSelected}
                    >
                      <div className={styles.slotLeftCol}>
                        <span className={styles.slotTimeBold}>{slot}</span>
                        {isSelected && <span className={styles.slotActiveBadge}>✓ Selected</span>}
                      </div>
                      <div className={styles.slotRightCol}>
                        <span className={styles.slotPriceLabel}>{effectiveService.price}</span>
                        <span className={styles.slotArrow}>›</span>
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
          className="error"
          data-testid="form-error"
          role="alert"
        >
          {eroare}
        </p>
      )}

      <button
        type="submit"
        className={`btn ${styles.submitBtn}`}
        disabled={trimite}
        data-testid="form-submit"
      >
        {trimite
          ? "Saving..."
          : serviceId
          ? `Book Appointment for ${selectedTime}`
          : "Book Appointment"}
      </button>
    </form>
  );
}

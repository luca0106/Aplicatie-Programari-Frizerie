// Single appointment item component, receives data and callbacks via props
const ETICHETE_TAG = {
  Combo: "Haircut & Beard Package",
  Haircut: "Signature Haircut",
  Beard: "Beard Contouring"
};

function getInitials(name) {
  if (!name) return "BF";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  try {
    const [, month, day] = dateStr.split("-");
    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    const mIdx = parseInt(month, 10) - 1;
    return `${day} ${months[mIdx] || month}`;
  } catch {
    return dateStr;
  }
}

export default function AppointmentCard({
  appointment,
  programare,
  task,
  onToggle,
  onDelete
}) {
  const item = appointment || programare || task;
  if (!item) return null;

  const isDone = item.done !== undefined ? item.done : Boolean(item.gata);
  const clientName = item.clientName || item.titlu || "Client";
  const initials = getInitials(clientName);
  const prettyDate = formatDate(item.date);

  return (
    <li className={`item-card task-card appointment-ticket ${isDone ? "done" : ""}`}>
      {/* 1. Time & Date Block (Ticket Style) */}
      <div className="ticket-time-col">
        <span className="ticket-time">{item.time || "—"}</span>
        <span className="ticket-date">{prettyDate || "TODAY"}</span>
        <span className="ticket-duration">{item.duration ? `${item.duration} min` : "45 min"}</span>
      </div>

      <div className="ticket-divider" aria-hidden="true"></div>

      {/* 2. Client & Service Details inside <label> for effortless toggle click */}
      <label className="ticket-main-col appointment-main task-main">
        {/* Controlled checkbox */}
        <input
          type="checkbox"
          className="appointment-checkbox"
          checked={isDone}
          onChange={() => onToggle && onToggle(item.id)}
          aria-label={`Mark appointment for ${clientName} as ${isDone ? "upcoming" : "completed"}`}
        />

        <div className="client-avatar" title={clientName}>
          {initials}
        </div>

        <div className="ticket-details">
          <div className="ticket-client-row">
            <h3 className="client-name">{clientName}</h3>
            {item.tag && (
              <span className={`tag-badge tag-${item.tag.toLowerCase()}`}>
                {ETICHETE_TAG[item.tag] || item.tag}
              </span>
            )}
          </div>

          {item.serviceName && (
            <p className="service-name">
              <svg className="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="6" cy="6" r="3" />
                <circle cx="6" cy="18" r="3" />
                <line x1="20" y1="4" x2="8.12" y2="15.88" />
                <line x1="14.47" y1="14.48" x2="20" y2="20" />
                <line x1="8.12" y1="8.12" x2="12" y2="12" />
              </svg>
              {item.serviceName}
            </p>
          )}

          {item.barber && (
            <p className="barber-assigned">
              <svg className="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              Specialist: <strong>{item.barber}</strong>
            </p>
          )}
        </div>
      </label>

      {/* 3. Session Status and Action Buttons */}
      <div className="ticket-actions-col">
        <span className={`card-status ${isDone ? "status-done" : "status-active"}`}>
          {!isDone && <span className="status-pulse-dot"></span>}
          {isDone ? "✓ Completed" : "Upcoming"}
        </span>

        {/* Accessible delete button */}
        <button
          type="button"
          className="btn-danger"
          onClick={() => onDelete && onDelete(item.id)}
          aria-label={`Delete appointment for ${clientName}`}
        >
          Delete
        </button>
      </div>
    </li>
  );
}

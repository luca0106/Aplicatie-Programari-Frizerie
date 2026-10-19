// Single list item component, received via props.
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

export default function AppointmentCard({ appointment, programare }) {
  const item = appointment || programare;
  if (!item) return null;

  const initials = getInitials(item.clientName);
  const prettyDate = formatDate(item.date);

  return (
    <li className={`item-card appointment-ticket ${item.done ? "done" : ""}`}>
      {/* 1. Time & Date Block (Ticket Style) */}
      <div className="ticket-time-col">
        <span className="ticket-time">{item.time}</span>
        <span className="ticket-date">{prettyDate}</span>
        <span className="ticket-duration">{item.duration} min</span>
      </div>

      <div className="ticket-divider" aria-hidden="true"></div>

      {/* 2. Client & Service Details */}
      <div className="ticket-main-col">
        <div className="client-avatar" title={item.clientName}>
          {initials}
        </div>
        <div className="ticket-details">
          <div className="ticket-client-row">
            <h3 className="client-name">{item.clientName}</h3>
            {item.tag && (
              <span className={`tag-badge tag-${item.tag.toLowerCase()}`}>
                {ETICHETE_TAG[item.tag] || item.tag}
              </span>
            )}
          </div>
          <p className="service-name">
            <svg className="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="6" cy="6" r="3"/>
              <circle cx="6" cy="18" r="3"/>
              <line x1="20" y1="4" x2="8.12" y2="15.88"/>
              <line x1="14.47" y1="14.48" x2="20" y2="20"/>
              <line x1="8.12" y1="8.12" x2="12" y2="12"/>
            </svg>
            {item.serviceName}
          </p>
          <p className="barber-assigned">
            <svg className="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            Specialist: <strong>{item.barber}</strong>
          </p>
        </div>
      </div>

      {/* 3. Session Status */}
      <div className="ticket-status-col">
        <span className={`card-status ${item.done ? "status-done" : "status-active"}`}>
          {!item.done && <span className="status-pulse-dot"></span>}
          {item.done ? "✓ Completed" : "Upcoming"}
        </span>
      </div>
    </li>
  );
}

import AppointmentCard from "./AppointmentCard.jsx";

export default function AppointmentList({ programari, appointments }) {
  const lista = appointments || programari || [];

  // 1. Check for empty list (early return)
  if (lista.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon-wrap">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
        </div>
        <p className="empty">No appointments scheduled.</p>
        <span className="empty-sub">All grooming sessions are completed or none have been booked yet.</span>
      </div>
    );
  }

  // 2. Render list with map and key={item.id} directly on returned element
  return (
    <ul className="item-list">
      {lista.map((item) => (
        <AppointmentCard key={item.id} appointment={item} />
      ))}
    </ul>
  );
}

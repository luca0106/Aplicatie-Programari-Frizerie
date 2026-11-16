import AppointmentCard from "./AppointmentCard.jsx";
import styles from "./AppointmentList.module.css";

export default function AppointmentList({
  programari,
  appointments,
  taskuri,
  onToggle,
  onDelete
}) {
  const lista = appointments || programari || taskuri || [];

  if (lista.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIconWrap}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        </div>
        <p className="empty" data-testid="empty">No appointments scheduled.</p>
        <span className={styles.emptySub}>
          All grooming sessions are completed or none have been booked yet.
        </span>
      </div>
    );
  }

  return (
    <ul className={styles.list}>
      {lista.map((item) => (
        <AppointmentCard
          key={item.id}
          appointment={item}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}

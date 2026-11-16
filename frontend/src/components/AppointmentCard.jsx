import { Link } from "react-router-dom";
import {
  ETICHETE_TAG,
  formatDurationLabel,
  getInitials,
  formatDateShort
} from "../constants.js";
import styles from "./AppointmentCard.module.css";

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
  const clientName = item.clientName || item.titlu || item.title || "Client";
  const initials = getInitials(clientName);
  const prettyDate = formatDateShort(item.date);

  return (
    <li
      className={isDone ? `${styles.card} ${styles.done}` : styles.card}
      data-testid="item"
      data-id={item.id}
    >
      {/* 1. Time & Date Block */}
      <div className={styles.timeCol}>
        <span className={styles.time}>{item.time || "—"}</span>
        <span className={styles.date}>{prettyDate || "TODAY"}</span>
        <span className={styles.duration}>{formatDurationLabel(item.duration)}</span>
      </div>

      <div className={styles.divider} aria-hidden="true"></div>

      {/* 2. Client & Service Details inside <div> so <Link> navigates cleanly */}
      <div className={styles.main}>
        <input
          type="checkbox"
          className={styles.checkbox}
          checked={isDone}
          onChange={() => onToggle && onToggle(item.id)}
          aria-label={`Mark appointment for ${clientName} as ${isDone ? "upcoming" : "completed"}`}
          data-testid="item-toggle"
        />

        <div className={styles.avatar} title={clientName}>
          {initials}
        </div>

        <div className={styles.details}>
          <div className={styles.clientRow}>
            <Link
              to={`/appointments/${item.id}`}
              className={styles.title}
              data-testid="item-link"
            >
              {clientName}
            </Link>
            {item.tag && (
              <span
                className={`badge badge-${item.tag.toLowerCase()} tag-badge tag-${item.tag.toLowerCase()}`}
              >
                {ETICHETE_TAG[item.tag] || item.tag}
              </span>
            )}
          </div>

          {item.serviceName && (
            <p className={styles.serviceName}>
              <svg
                className={styles.iconSvg}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="6" cy="6" r="3" />
                <circle cx="6" cy="18" r="3" />
                <line x1="20" y1="4" x2="8.12" y2="15.88" />
                <line x1="14.47" y1="14.48" x2="20" y2="20" />
                <line x1="8.12" y1="8.12" x2="12" y2="12" />
              </svg>
              {item.serviceName}
              {item.price ? ` • ${item.price}` : ""}
            </p>
          )}

          {item.barber && (
            <p className={styles.barberAssigned}>
              <svg
                className={styles.iconSvg}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              Specialist: <strong>{item.barber}</strong>
            </p>
          )}
        </div>
      </div>

      {/* 3. Session Status and Action Buttons */}
      <div className={styles.actionsCol}>
        <span
          className={`${styles.cardStatus} ${
            isDone ? styles.statusDone : styles.statusActive
          }`}
        >
          {!isDone && <span className={styles.pulseDot}></span>}
          {isDone ? "✓ Completed" : "Upcoming"}
        </span>

        <button
          type="button"
          className="btn-danger"
          onClick={() => onDelete && onDelete(item.id)}
          aria-label={`Delete appointment for ${clientName}`}
          data-testid="item-delete"
        >
          Delete
        </button>
      </div>
    </li>
  );
}

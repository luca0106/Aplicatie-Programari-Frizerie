import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchAppointment } from "../api.js";
import {
  ETICHETE_TAG,
  formatDurationLabel,
  getInitials,
  SERVICES_CATALOG
} from "../constants.js";
import styles from "./AppointmentDetailPage.module.css";

export default function AppointmentDetailPage() {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;

    fetchAppointment(id)
      .then((data) => {
        if (!ignore) {
          setTask(data);
          setError(null);
        }
      })
      .catch((err) => {
        if (!ignore) setError(err.message);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [id]);

  if (loading) {
    return (
      <p className="info" data-testid="loading">
        Loading appointment details...
      </p>
    );
  }

  if (error || !task) {
    return (
      <section className="panel">
        <p className="error" data-testid="error">
          Appointment could not be loaded: {error || "Not found"}
        </p>
        <Link to="/" className={styles.back}>
          ← Back to appointments
        </Link>
      </section>
    );
  }

  const isDone = task.done !== undefined ? task.done : Boolean(task.gata);
  const clientName = task.clientName || task.titlu || task.title || "Client";
  const tag = task.tag || "Combo";
  const catalogMatch = SERVICES_CATALOG.find((s) => s.name === task.serviceName);
  const priceDisplay = task.price || (catalogMatch ? catalogMatch.price : "60 RON");
  const descDisplay =
    task.desc ||
    (catalogMatch
      ? catalogMatch.desc
      : "Includes executive consultation, hair wash, and signature styling");

  return (
    <section className={`panel ${styles.detail}`} data-testid="detail">
      <Link to="/" className={styles.back}>
        ← Back to appointments
      </Link>

      <div className={styles.headerBanner}>
        <div className={styles.avatarLarge}>{getInitials(clientName)}</div>
        <div className={styles.headerText}>
          <h2
            className={isDone ? styles.done : undefined}
            data-testid="detail-title"
          >
            {clientName}
          </h2>
          <p className={styles.subtitle}>
            Executive Grooming Reservation • Reference #{task.id}
          </p>
        </div>
      </div>

      <dl className={styles.fields}>
        <dt>Category</dt>
        <dd>
          <span
            className={`badge badge-${tag.toLowerCase()} tag-badge tag-${tag.toLowerCase()}`}
          >
            {ETICHETE_TAG[tag] || tag}
          </span>
        </dd>

        <dt>Service Package</dt>
        <dd>{task.serviceName || "Executive Haircut & Grooming"}</dd>

        <dt>Included Benefits</dt>
        <dd>{descDisplay}</dd>

        <dt>Session Duration</dt>
        <dd>{formatDurationLabel(task.duration || 40)} (+ 10 min studio sanitization break)</dd>

        <dt>Fixed Price</dt>
        <dd className={styles.priceHighlight}>{priceDisplay}</dd>

        <dt>Assigned Specialist</dt>
        <dd>{task.barber || "Nicholas Andrei"}</dd>

        <dt>Scheduled Date</dt>
        <dd>{task.date || "2026-11-17"}</dd>

        <dt>Scheduled Time</dt>
        <dd>{task.time || "10:00"}</dd>

        <dt>Status</dt>
        <dd className={isDone ? styles.statusCompleted : styles.statusActive}>
          {isDone ? "✓ Completed" : "● Active / Upcoming"}
        </dd>

        <dt>ID</dt>
        <dd>{task.id}</dd>
      </dl>
    </section>
  );
}

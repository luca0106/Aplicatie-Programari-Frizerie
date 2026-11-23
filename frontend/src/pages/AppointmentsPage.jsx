import { useEffect, useState } from "react";
import AppointmentList from "../components/AppointmentList.jsx";
import AppointmentForm from "../components/AppointmentForm.jsx";
import {
  createAppointment,
  deleteAppointment,
  fetchAppointments,
  updateAppointment
} from "../api.js";
import styles from "./AppointmentsPage.module.css";

export default function AppointmentsPage() {
  const [programari, setProgramari] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;

    async function load() {
      try {
        const data = await fetchAppointments();
        if (!ignore) setProgramari(data);
      } catch (err) {
        if (!ignore) setError(err.message);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();

    return () => {
      ignore = true;
    };
  }, []);

  async function handleAdd(nouaProgramare) {
    const creat = await createAppointment(nouaProgramare);
    setProgramari((prev) => [...prev, creat]);
  }

  async function handleToggle(id) {
    const curent = programari.find((p) => p.id === id);
    if (!curent) return;

    try {
      const actualizat = await updateAppointment(id, { done: !curent.done });
      setProgramari((prev) =>
        prev.map((p) => (p.id === id ? actualizat : p))
      );
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    try {
      await deleteAppointment(id);
      setProgramari((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  const active = programari.filter((p) => !p.done).length;
  const completed = programari.length - active;

  return (
    <div className={styles.pageWrapper}>
      {/* Executive KPIs */}
      <div className={styles.kpisRow}>
        <div className={styles.kpiCard}>
          <span className={styles.kpiNumber}>{programari.length}</span>
          <span className={styles.kpiLabel}>Total Bookings</span>
        </div>
        <div className={`${styles.kpiCard} ${styles.kpiHighlight}`}>
          <span className={styles.kpiNumber}>{active}</span>
          <span className={styles.kpiLabel}>Active / Upcoming</span>
        </div>
        <div className={styles.kpiCard}>
          <span className={styles.kpiNumber}>{completed}</span>
          <span className={styles.kpiLabel}>Completed Sessions</span>
        </div>
      </div>

      {/* Main 2-column grid */}
      <div className={styles.grid}>
        <section className={`panel ${styles.formPanel}`}>
          <AppointmentForm onAdd={handleAdd} appointments={programari} />
        </section>

        <section className="panel">
          <div className={styles.panelHeaderRow}>
            <h2>Studio Appointments</h2>
            <span className={styles.liveStatusPill}>
              <span className={styles.livePulse}></span>
              Live Studio
            </span>
          </div>

          <p className={styles.summary}>
            {programari.length} appointments, of which {active} active
          </p>

          {loading && (
            <p className="info" data-testid="loading">
              Loading appointments...
            </p>
          )}

          {error && (
            <p className="error" data-testid="error">
              Failed to communicate with server: {error}. Is the backend running? Run{" "}
              <code>npm run dev</code> in <code>backend/</code>.
            </p>
          )}

          {!loading && (
            <AppointmentList
              programari={programari}
              onToggle={handleToggle}
              onDelete={handleDelete}
            />
          )}
        </section>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import AppointmentList from "./components/AppointmentList.jsx";
import AppointmentForm from "./components/AppointmentForm.jsx";
import {
  createAppointment,
  deleteAppointment,
  fetchAppointments,
  updateAppointment
} from "./api.js";

// Initial theme: detected from system preference (OS color scheme)
function temaInitiala() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export default function App() {
  const [programari, setProgramari] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tema, setTema] = useState(temaInitiala);

  // Runs once on mount to fetch data from json-server
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

  // Stage 7: POST new appointment; errors propagate to AppointmentForm
  async function handleAdd(nouaProgramare) {
    const creat = await createAppointment(nouaProgramare);
    setProgramari((prev) => [...prev, creat]);
  }

  // Stage 7: PATCH toggle state; persists to json-server
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

  // Stage 7: DELETE appointment; persists to json-server
  async function handleDelete(id) {
    try {
      await deleteAppointment(id);
      setProgramari((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  // Theme switch: update local state for button label and set HTML data-theme attribute
  function handleTema() {
    const noua = tema === "dark" ? "light" : "dark";
    setTema(noua);
    document.documentElement.dataset.theme = noua;
  }

  // Derived values: recalculated dynamically on every render
  const active = programari.filter((p) => !p.done).length;
  const completed = programari.length - active;

  return (
    <div className="app-root">
      <header className="app-header">
        {/* Theme toggle placed first inside header */}
        <button
          className="theme-toggle"
          onClick={handleTema}
          aria-pressed={tema === "dark"}
        >
          {tema === "dark" ? "Light Mode" : "Dark Mode"}
        </button>

        <div className="header-badge">EST. 2026 • EXECUTIVE BARBER SUITE</div>
        <h1 className="brand-title">BarberFlow</h1>
        <p className="header-subtitle">
          Intelligent appointment scheduling and executive grooming management.
        </p>

        {/* Dashboard KPIs */}
        <div className="header-kpis">
          <div className="kpi-card">
            <span className="kpi-number">{programari.length}</span>
            <span className="kpi-label">Total Bookings</span>
          </div>
          <div className="kpi-card kpi-highlight">
            <span className="kpi-number">{active}</span>
            <span className="kpi-label">Active / Upcoming</span>
          </div>
          <div className="kpi-card">
            <span className="kpi-number">{completed}</span>
            <span className="kpi-label">Completed Sessions</span>
          </div>
        </div>

        {/* Official course requirement counter */}
        <p className="app-count">
          {programari.length} appointments, of which {active} active
        </p>
      </header>

      {/* Stage 7: Responsive 2-column layout with Form on left, Appointments list on right */}
      <main className="container">
        <section className="panel form-panel">
          <AppointmentForm onAdd={handleAdd} appointments={programari} />
        </section>

        <section className="panel list-panel">
          <div className="panel-header-row">
            <div>
              <h2>Studio Appointments</h2>
              <p className="panel-sub">Daily client workflow & barber schedule allocation</p>
            </div>
            <span className="live-status-pill">
              <span className="live-pulse"></span>
              Live Studio
            </span>
          </div>

          {/* Loading indicator */}
          {loading && (
            <p className="info" data-testid="loading">
              Loading appointments...
            </p>
          )}

          {/* Global error message */}
          {error && (
            <p className="error" data-testid="error">
              Failed to communicate with server: {error}. Is the server running? Run <code>npm run api</code> in a terminal.
            </p>
          )}

          {/* Render appointments list once initial load completes */}
          {!loading && (
            <AppointmentList
              programari={programari}
              onToggle={handleToggle}
              onDelete={handleDelete}
            />
          )}
        </section>
      </main>

      <footer className="app-footer">
        <p>BarberFlow Executive Platform © 2026 — Executive Studio Management System</p>
      </footer>
    </div>
  );
}

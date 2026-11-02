import { useEffect, useState } from "react";
import AppointmentList from "./components/AppointmentList.jsx";
import { fetchAppointments } from "./api.js";

// Initial theme: detected from system preference (OS color scheme)
function temaInitiala() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export default function App() {
  // Stage 6: Data is now loaded from the REST API server into local state
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

  // Immutable toggle: new array, new object for toggled item (local in Stage 6, synced with API in Stage 7)
  function handleToggle(id) {
    setProgramari((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  }

  // Immutable delete: returns new array filtered without deleted item
  function handleDelete(id) {
    setProgramari((prev) => prev.filter((t) => t.id !== id));
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

      <main className="container">
        <section className="panel">
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

          {/* Stage 6: The three loading, error, and success states */}
          {loading && <p className="info">Loading appointments...</p>}

          {error && (
            <p className="error">
              Failed to load data: {error}. Is the server running? Run <code>npm run api</code> in a terminal.
            </p>
          )}

          {!loading && !error && (
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

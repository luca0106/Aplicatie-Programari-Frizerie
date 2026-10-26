import { useState } from "react";
import AppointmentList from "./components/AppointmentList.jsx";

// Initial appointments dataset (matches README specifications)
const PROGRAMARI_INITIALE = [
  {
    id: 1,
    clientName: "Andrew Smith",
    serviceName: "Haircut & Beard Trim",
    duration: 60,
    barber: "Nicholas Andrei",
    date: "2026-06-10",
    time: "10:00",
    done: false,
    tag: "Combo"
  },
  {
    id: 2,
    clientName: "Michael Johnson",
    serviceName: "Signature Haircut",
    duration: 40,
    barber: "Madalin Plesa",
    date: "2026-06-10",
    time: "11:00",
    done: true,
    tag: "Haircut"
  },
  {
    id: 3,
    clientName: "Christian Davis",
    serviceName: "Beard Trim with Razor",
    duration: 30,
    barber: "Nicholas Andrei",
    date: "2026-06-10",
    time: "12:00",
    done: false,
    tag: "Beard"
  }
];

// Initial theme: detected from system preference (OS color scheme)
function temaInitiala() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export default function App() {
  const [programari, setProgramari] = useState(PROGRAMARI_INITIALE);
  const [tema, setTema] = useState(temaInitiala);

  // Immutable toggle: new array, new object for toggled item
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

          <AppointmentList
            programari={programari}
            onToggle={handleToggle}
            onDelete={handleDelete}
          />
        </section>
      </main>

      <footer className="app-footer">
        <p>BarberFlow Executive Platform © 2026 — Executive Studio Management System</p>
      </footer>
    </div>
  );
}

import AppointmentList from "./components/AppointmentList.jsx";

const programari = [
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

export default function App() {
  const active = programari.filter((p) => !p.done).length;
  const completed = programari.length - active;

  return (
    <div className="app-root">
      <header className="app-header">
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

        {/* Official counter requirement */}
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

          <AppointmentList programari={programari} />
        </section>
      </main>

      <footer className="app-footer">
        <p>BarberFlow Executive Platform © 2026 — Executive Studio Management System</p>
      </footer>
    </div>
  );
}

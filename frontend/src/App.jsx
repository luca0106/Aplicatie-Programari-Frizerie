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

  return (
    <>
      <header className="app-header">
        <h1>BarberFlow</h1>
        <p>Sistem inteligent de programări și management pentru frizerie.</p>
        <p className="app-count">
          {programari.length} programări, dintre care {active} active
        </p>
      </header>

      <main className="container">
        <section className="panel">
          <h2>Programările din sistem</h2>
          <AppointmentList programari={programari} />
        </section>
      </main>
    </>
  );
}

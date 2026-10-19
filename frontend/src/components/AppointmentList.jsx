import AppointmentCard from "./AppointmentCard.jsx";

export default function AppointmentList({ programari, appointments }) {
  const lista = appointments || programari || [];

  // 1. Verificare listă goală (return timpuriu)
  if (lista.length === 0) {
    return <p className="empty">Nu există nicio programare înregistrată.</p>;
  }

  // 2. Randare listă cu map și key={item.id} pe componenta întoarsă direct
  return (
    <ul className="item-list">
      {lista.map((item) => (
        <AppointmentCard key={item.id} appointment={item} />
      ))}
    </ul>
  );
}


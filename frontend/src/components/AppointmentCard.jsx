// Un singur element din listă, primit prin props.
const ETICHETE_TAG = {
  Combo: "Pachet Păr & Barbă",
  Haircut: "Tuns",
  Beard: "Barbă"
};

export default function AppointmentCard({ appointment, programare }) {
  const item = appointment || programare;
  if (!item) return null;

  return (
    <li className={item.done ? "item-card done" : "item-card"}>
      <div>
        <h3>
          {item.clientName} — {item.serviceName}
          {item.tag && (
            <span className={`tag-badge tag-${item.tag.toLowerCase()}`}>
              {ETICHETE_TAG[item.tag] || item.tag}
            </span>
          )}
        </h3>
        <p>
          Data: <strong>{item.date}</strong> @ <strong>{item.time}</strong> ({item.duration} min) | Frizer: <strong>{item.barber}</strong>
        </p>
      </div>
      <span className="card-status">
        {item.done ? "✓ Finalizată" : "● În așteptare"}
      </span>
    </li>
  );
}


import { Link } from "react-router-dom";
import styles from "./NotFoundPage.module.css";

export default function NotFoundPage() {
  return (
    <section className={`panel ${styles.notFound}`} data-testid="not-found">
      <span className={styles.codeBadge}>ERROR 404</span>
      <h2>Page Not Found</h2>
      <p className="info">The requested address does not lead anywhere in BarberFlow Studio.</p>
      <Link to="/" className="btn">
        ← Back to Appointments
      </Link>
    </section>
  );
}

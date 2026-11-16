import { SERVICES_CATALOG, formatDurationLabel } from "../constants.js";
import styles from "./AboutPage.module.css";

export default function AboutPage() {
  return (
    <div className={styles.aboutContainer}>
      {/* Hero Studio Presentation */}
      <section className={`panel ${styles.heroPanel}`}>
        <span className={styles.heroTag}>Executive Grooming Lounge</span>
        <h2 className={styles.heroTitle}>Refined Barbering for the Modern Gentleman</h2>
        <p className={styles.leadText}>
          Welcome to BarberFlow Executive Studio. We specialize in classic craftsmanship, precision fades, luxury hot towel shaves, and bespoke grooming rituals. Designed as a calm oasis in the city, every chair in our studio is dedicated to delivering effortless elegance, uncompromising hygiene, and total customer relaxation.
        </p>

        <div className={styles.pillarsGrid}>
          <div className={styles.pillarCard}>
            <div className={styles.pillarIcon}>✂️</div>
            <h3>Master Barbers</h3>
            <p>
              Dedicated artisans with years of bespoke styling expertise, utilizing hand-forged Japanese shears and traditional straight razors.
            </p>
          </div>

          <div className={styles.pillarCard}>
            <div className={styles.pillarIcon}>🧴</div>
            <h3>Premium Formulations</h3>
            <p>
              Exclusively natural tonics, soothing aftershaves, and organic pomades that nourish your hair and skin without harsh additives.
            </p>
          </div>

          <div className={styles.pillarCard}>
            <div className={styles.pillarIcon}>☕</div>
            <h3>Executive Lounge</h3>
            <p>
              Relax in our sound-dampened lounge. Enjoy complimentary craft espresso, aged whiskey, or cold refreshments while you wait.
            </p>
          </div>
        </div>
      </section>

      {/* How Booking Works for Clients */}
      <section className="panel">
        <h3 className={styles.sectionTitle}>How Our Booking Experience Works</h3>
        <p className={styles.leadText}>
          Booking your session takes less than 30 seconds. We value your time as much as you do:
        </p>

        <div className={styles.stepsGrid}>
          <div className={styles.stepCard}>
            <span className={styles.stepNumber}>1</span>
            <h4>Choose Your Service</h4>
            <p>
              Select your haircut, beard sculpting, or combo treatment from our transparent menu with fixed pricing and exact durations.
            </p>
          </div>

          <div className={styles.stepCard}>
            <span className={styles.stepNumber}>2</span>
            <h4>Select Live Date &amp; Time</h4>
            <p>
              Our interactive schedule displays real-time available slots. We never double-book, so your chair is reserved exclusively for you.
            </p>
          </div>

          <div className={styles.stepCard}>
            <span className={styles.stepNumber}>3</span>
            <h4>Zero Waiting Guarantee</h4>
            <p>
              A mandatory 10-minute sanitation buffer is auto-applied before every session, ensuring your station is pristine the moment you walk in.
            </p>
          </div>
        </div>
      </section>

      {/* Studio Hours & Location */}
      <div className={styles.infoGrid}>
        <section className={`panel ${styles.infoCard}`}>
          <h3>Studio Working Hours</h3>
          <ul className={styles.scheduleList}>
            <li className={styles.scheduleRow}>
              <span className={styles.scheduleDay}>Tuesday – Friday</span>
              <span className={styles.scheduleHours}>10:00 – 19:00</span>
            </li>
            <li className={styles.scheduleRow}>
              <span className={styles.scheduleDay}>Saturday</span>
              <span className={styles.scheduleHours}>09:00 – 15:00</span>
            </li>
            <li className={styles.scheduleRow}>
              <span className={styles.scheduleDay}>Sunday &amp; Monday</span>
              <span className={`${styles.scheduleHours} ${styles.closedTag}`}>
                Closed (Team Rest)
              </span>
            </li>
          </ul>
        </section>

        <section className={`panel ${styles.infoCard}`}>
          <h3>Location &amp; Concierge</h3>
          <ul className={styles.contactList}>
            <li>
              <strong>Studio Address:</strong> 122 Calea Victoriei, Sector 1, Bucharest
            </li>
            <li>
              <strong>Phone Reservations:</strong> +40 (722) 123 456
            </li>
            <li>
              <strong>Email:</strong> concierge@barberflow.ro
            </li>
            <li>
              <strong>Walk-in Policy:</strong> Subject to chair availability; online booking strongly recommended.
            </li>
          </ul>
        </section>
      </div>

      {/* Studio Etiquette */}
      <section className="panel">
        <h3 className={styles.sectionTitle}>Studio Etiquette &amp; Guest Guidelines</h3>
        <div className={styles.etiquetteGrid}>
          <div className={styles.etiquetteCard}>
            <h4>Punctuality</h4>
            <p>
              Please arrive 5 minutes prior to your scheduled time to enjoy a welcome beverage and consult with your barber.
            </p>
          </div>
          <div className={styles.etiquetteCard}>
            <h4>Cancellations</h4>
            <p>
              If your plans change, please notify us at least 2 hours in advance or cancel directly via your booking link.
            </p>
          </div>
          <div className={styles.etiquetteCard}>
            <h4>Consultation</h4>
            <p>
              Every haircut includes a complimentary 5-minute style consultation to find the perfect silhouette for your hair type.
            </p>
          </div>
        </div>
      </section>

      {/* Official Service Menu */}
      <section className="panel">
        <h3 className={styles.sectionTitle}>Official Service &amp; Treatment Menu</h3>
        <p className={styles.leadText}>
          All prices are fixed and include hair wash, scalp massage, and styling products.
        </p>

        <div className={styles.catalogList}>
          {SERVICES_CATALOG.map((service) => (
            <div key={service.id} className={styles.catalogItem}>
              <div>
                <span className={styles.catalogName}>{service.name}</span>
                <span className={styles.catalogSub}>{service.desc}</span>
              </div>
              <div className={styles.catalogMeta}>
                <span className={styles.catalogPrice}>{service.price}</span>
                <span className={styles.catalogDuration}>
                  {formatDurationLabel(service.duration)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

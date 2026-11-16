import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import styles from "./Layout.module.css";

function temaInitiala() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

// NavLink automatically marks the active route
function navClass({ isActive }) {
  return isActive ? `${styles.link} ${styles.active}` : styles.link;
}

export default function Layout() {
  const [tema, setTema] = useState(temaInitiala);

  function handleTema() {
    const noua = tema === "dark" ? "light" : "dark";
    setTema(noua);
    document.documentElement.dataset.theme = noua;
  }

  return (
    <div className={styles.appShell}>
      <header className={styles.header}>
        <div className={styles.inner}>
          <div className={styles.brandGroup}>
            <span className={styles.badge}>EST. 2026 • EXECUTIVE BARBER SUITE</span>
            <span className={styles.logo}>BarberFlow</span>
          </div>

          <div className={styles.controlsGroup}>
            <nav className={styles.nav} data-testid="nav">
              <NavLink to="/" end className={navClass}>
                Appointments
              </NavLink>
              <NavLink to="/about" className={navClass}>
                About Studio
              </NavLink>
            </nav>

            <button
              type="button"
              className={styles.themeToggle}
              onClick={handleTema}
              aria-pressed={tema === "dark"}
            >
              {tema === "dark" ? "Light Mode" : "Dark Mode"}
            </button>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <Outlet />
      </main>

      <footer className={styles.footer}>
        BarberFlow Executive Platform © 2026 — Executive Studio Management System
      </footer>
    </div>
  );
}

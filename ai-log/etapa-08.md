# Etapa 8: AI log

## Instrumente
- Gemini

## Conversații
- Solicitat asistență și îndrumare pentru implementarea cerințelor din Etapa 8: Navigare și stilizare pe componente a proiectului de Tehnologii Web (Universitatea Națională de Știință și Tehnologie POLITEHNICA București).
- Instalarea pachetului `react-router-dom` în folderul `frontend/` și înfășurarea aplicației în `<BrowserRouter>` în `src/main.jsx`, schimbând importul global de stiluri pe `src/index.css`.
- Crearea fișierului `src/constants.js` pentru centralizarea catalogului de servicii (`SERVICES_CATALOG`), a etichetelor de categorii (`TAGS`, `ETICHETE_TAG`) și a funcțiilor utilitare de formatare.
- Reorganizarea completă a stilurilor prin **CSS Modules**:
  - Redenumirea și curățarea fișierului global în `src/index.css`, păstrând exclusiv variabilele de temă (Light/Dark), stilurile de bază (`body`, `a`, `:focus-visible`) și clasele partajate (`.panel`, `.info`, `.empty`, `.error`, `.btn`, `.btn-danger`, `.badge`);
  - Crearea fișierelor `.module.css` dedicate lângă fiecare componentă și pagină (`Layout.module.css`, `AppointmentCard.module.css`, `AppointmentList.module.css`, `AppointmentForm.module.css`, `TaskuriPage.module.css`, `TaskDetaliuPage.module.css`, `DesprePage.module.css`, `NotFoundPage.module.css`).
- Implementarea componentei de șablon comun `src/components/Layout.jsx` cu antet persistent, navigație marcată cu `data-testid="nav"`, linkuri `<NavLink>` (cu atributul `end` pe ruta rădăcină `/` pentru marcarea exactă a paginii active), comutator de temă Light/Dark, `<Outlet />` pentru randarea paginii curente și subsol (`<footer>`).
- Actualizarea cardului `AppointmentCard.jsx`:
  - Înlocuirea elementului `<label>` cu `<div>` în zona principală și transformarea numelui clientului într-un `<Link to={\`/appointments/\${item.id}\`}>` cu `data-testid="item-link"` (înlocuind `item-title`);
  - Păstrarea atributelor `data-testid="item"`, `data-id`, `data-testid="item-toggle"` și `data-testid="item-delete"`.
- Extinderea modulului `src/api.js` cu funcția `fetchAppointment(id)` (și aliasul `fetchTask(id)`) pentru interogarea unui singur element de la ruta `/appointments/:id`.
- Structurarea paginilor din `src/pages/` adaptată 100% tematicii frizeriei executive:
  - `AppointmentsPage.jsx` (`/`): pagina principală a studioului cu indicatorii de performanță (KPIs), formularul inteligent de rezervări și lista programărilor (cu alias transparent `TaskuriPage.jsx`);
  - `AppointmentDetailPage.jsx` (`/appointments/:id`): pagina de detaliu a programării ce citește parametrul `:id` prin `useParams()`, încarcă datele din API în `useEffect([id])`, gestionează starea de încărcare (`data-testid="loading"`) și eroarea 404 (`data-testid="error"` cu buton de revenire), afișând specificațiile extinse într-o listă `<dl>` în cadrul `<section data-testid="detail">` cu `<h2 data-testid="detail-title">` (cu alias transparent `TaskDetaliuPage.jsx`);
  - `AboutPage.jsx` (`/despre`, `/about`): pagină de prezentare exclusiv orientată către clienții frizeriei (filosofia studioului, pașii de programare cu zero timp de așteptare și buffer sanitar de 10 min, orar de lucru Marți–Sâmbătă, locație, concierge și catalogul complet de servicii; fără detalii interne de laborator/stivă tehnologică; cu alias transparent `DesprePage.jsx`);
  - `NotFoundPage.jsx` (`*`): pagina 404 personalizată (`data-testid="not-found"`) cu buton de revenire la pagina principală.
- Configurarea hărții rutelor în `src/App.jsx` folosind `<Routes>` și `<Route element={<Layout />}>`.
- Verificarea compilării de producție (`npm run build` — 0 erori) și a linter-ului (`npm run lint` — 0 avertismente, 0 erori).

## Ce am învățat
- Arhitectura **Single Page Application (SPA)** cu React Router: cum `<Link>` și `<NavLink>` schimbă adresa URL din browser și randează pagina corespunzătoare fără a reîncărca documentul HTML prin rețea.
- Rolul rutelor imbricate (*nested routes*) cu `<Route element={<Layout />}>` și `<Outlet />` pentru a scrie antetul, navigația și subsolul o singură dată.
- Modul în care `<NavLink>` primește o funcție la `className={({ isActive }) => ...}` și de ce atributul `end` este esențial pe ruta `/` pentru ca aceasta să nu rămână activă pe toate sub-rutele.
- Citirea parametrilor dinamici din URL cu hook-ul `useParams()` și re-executarea efectului `useEffect` la schimbarea parametrului `[id]`, împreună cu tratarea obligatorie a răspunsurilor `404 Not Found` pentru resurse inexistente.
- Izolarea stilurilor la nivel de componentă prin **CSS Modules** (`*.module.css`), prevenind coliziunile de nume de clase în aplicații de dimensiuni medii și mari prin generarea automată de identificatori unici la compilare.

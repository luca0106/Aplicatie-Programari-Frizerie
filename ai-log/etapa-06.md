# Etapa 6: AI log

## Instrumente
- Gemini

## Conversații
- Solicitat asistență și îndrumare pentru implementarea cerințelor din Etapa 6 a proiectului de Tehnologii Web (Universitatea Națională de Știință și Tehnologie POLITEHNICA București).
- Instalarea pachetului `json-server@0.17.4` ca dependență de dezvoltare (`devDependencies`) în folderul `frontend/`, fixând versiunea pentru a preveni id-urile text aleatorii generate de versiunile 1.x.
- Adăugarea scriptului de rulare `"api": "json-server --watch db.json --port 3001"` în `frontend/package.json`.
- Mutarea datelor aplicației din codul React într-un server REST simulat prin `frontend/db.json` la resursa `/appointments`, configurând 5 înregistrări variate ca stare (`done: false` / `done: true`) și categorii de servicii (`Combo`, `Haircut`, `Beard`).
- Crearea modulului de comunicare prin rețea `frontend/src/api.js`, izolând toate apelurile `fetch` și citind adresa serverului dintr-o variabilă de mediu (`import.meta.env.VITE_API_URL ?? "http://localhost:3001"`), cu verificarea obligatorie a proprietății `res.ok` și aruncarea erorilor HTTP explicite.
- Crearea fișierului `frontend/.env.example` pentru documentarea variabilei de mediu `VITE_API_URL`.
- Modificarea componentei `App.jsx`:
  - Inițializarea listei cu un array gol `useState([])`, eliminând datele hardcodate din codul React;
  - Adăugarea a două stări noi: `loading` (inițial `true`) și `error` (inițial `null`);
  - Utilizarea hook-ului `useEffect` cu array de dependențe gol `[]` pentru încărcarea datelor o singură dată, la montarea componentei;
  - Implementarea funcției asincrone interne `load()` cu structură `try / catch / finally` și curățarea efectului prin variabila `ignore` pentru a preveni actualizările redundante în modul de dezvoltare cu montare dublă (StrictMode);
  - Randarea condiționată a celor 3 stări posibile ale unei cereri HTTP: stare de încărcare (`loading`), stare de eroare explicită cu instrucțiune de rulare a serverului (`error`), și starea de succes cu afișarea listei `<AppointmentList />`.
- Extinderea stilurilor din `frontend/src/App.css` cu regulile pentru `.info` și `.error`, precum și variabilele CSS corespunzătoare (`--error-bg`, `--error-border`, `--error-text`) configurate atât pentru Light Mode, cât și pentru Dark Mode.
- Păstrarea strictă a regulii de afișare 100% în limba engleză pe întreaga interfață a aplicației BarberFlow.
- Validarea compilării de producție `npm run build` (0 erori) și testarea răspunsului API-ului pe portul 3001.

## Ce am învățat
- Cum se construiește și se rulează un API REST simulat folosind `json-server`, expunând automat rute CRUD pe baza cheilor dintr-un fișier JSON.
- De ce cererile HTTP trebuie izolate într-un modul separat de API (`api.js`) și cum se configurează adresa endpoint-ului prin variabile de mediu (`import.meta.env`).
- Funcționarea hook-ului `useEffect` pentru efecte secundare (side effects) și rolul listei de dependențe (un array gol `[]` execută efectul strict la montarea componentei).
- Tehnica de curățare (*cleanup pattern*) cu un flag boolean (`let ignore = false`) pentru a evita scrierea în starea unei componente dacă aceasta a fost demontată sau re-montată de React StrictMode.
- Necesitatea tratării celor trei stări ale comunicării prin rețea: încărcare (loading), succes (data) și eroare (error), oferind utilizatorului un feedback vizual clar și acționabil.


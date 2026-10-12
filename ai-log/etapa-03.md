# Etapa 3: AI log

## Instrumente
- Gemini

## Conversații
- Solicitat asistență pentru inițializarea proiectului React cu Vite în folderul `frontend/`, conform ghidului de laborator pentru Etapa 3 (Politehnica București).
- Mutarea fișierelor statice din etapele anterioare (`index.html`, `style.css`, `appointments.js`) în folderul `mockup/` pentru a nu interfera cu noul proiect.
- Eliminarea fișierelor demonstrative generate de Vite (`assets/`, iconițe din `public/`, `index.css`).
- Portarea stilurilor din `mockup/style.css` în `frontend/src/App.css` și actualizarea regulii `.container` pentru afișarea pe o singură coloană specifică acestei etape.
- Scrierea componentei `App.jsx` adaptate la tema BarberFlow:
  - Definirea array-ului `programari` cu înregistrările din Etapa 2 / README;
  - Calcularea valorilor dinamice în antet (`{programari.length} programări, dintre care {active} active`);
  - Afișarea datelor brute în format JSON folosind `<pre>{JSON.stringify(programari, null, 2)}</pre>`, pregătind terenul pentru componentele din Etapa 4.
- Verificarea compilării de producție prin `npm run build` și confirmarea ignorării `node_modules/` și `dist/` în `.gitignore`.

## Ce am învățat
- Rolul managerului de pachete `npm` și al fișierului `package.json` în gestionarea dependențelor.
- Avantajele serverului de dezvoltare Vite (HMR - actualizare instantanee a paginii la salvare).
- Sintaxa JSX: utilizarea `className` în loc de `class`, interpolarea expresiilor JavaScript între acolade `{}` și returnarea unui singur element rădăcină (sau fragment `<>...</>`).
- Amplasarea corectă a datelor statice deasupra componentei pentru a evita recrearea inutilă la fiecare re-randare.


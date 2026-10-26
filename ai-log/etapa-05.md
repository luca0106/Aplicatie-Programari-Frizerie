# Etapa 5: AI log

## Instrumente
- Gemini

## Conversații
- Solicitat îndrumare și asistență pentru implementarea cerințelor din Etapa 5 a proiectului de Tehnologii Web (Universitatea Națională de Știință și Tehnologie POLITEHNICA București).
- Mutarea listei de date din variabilă statică în starea locală a componentei părinte (`App.jsx`), inițializată cu `useState(PROGRAMARI_INITIALE)`.
- Implementarea actualizărilor de stare imutabile folosind forma funcțională `setProgramari((prev) => ...)`:
  - `handleToggle(id)`: parcurgerea colecției cu `map` și crearea unui nou obiect prin shallow copy `{ ...t, done: !t.done }` pentru elementul identificat prin `id`;
  - `handleDelete(id)`: filtrarea colecției cu `filter((t) => t.id !== id)` pentru a returna un nou array fără elementul selectat.
- Păstrarea contoarelor din antet (`active` și `completed`) exclusiv ca valori derivate calculate în timpul randării (`programari.filter((p) => !p.done).length`), evitând sincronizarea redundantă într-un alt `useState`.
- Propagarea funcțiilor callback (`onToggle` și `onDelete`) de la `App` către `AppointmentList` și apoi către `AppointmentCard`.
- Transformarea cardului într-un element complet interactiv:
  - Adăugarea unui checkbox controlat (`checked={isDone}`, `onChange={() => onToggle(item.id)}`), încapsulat împreună cu datele clientului într-un element `<label className="appointment-main task-main">` pentru a permite bifarea prin clic pe întreaga zonă a textului;
  - Adăugarea butonului de ștergere accesibil (`<button className="btn-danger" onClick={() => onDelete(item.id)} aria-label="...">Delete</button>`), folosind corect o funcție săgeată pentru a preveni apelarea imediată la randare (`onClick={() => onDelete(item.id)}` în loc de `onClick={onDelete(item.id)}`).
- Implementarea comutării dinamice de temă (Light / Dark Mode):
  - Detectarea preferinței de culoare a sistemului de operare prin `window.matchMedia("(prefers-color-scheme: dark)")` și inițializarea stării `tema`;
  - Plasarea butonului de comutare a temei ca prim element în `<header className="app-header">`, cu eticheta derivată din starea opusă (`Light Mode` / `Dark Mode`) și atributul `aria-pressed`;
  - Actualizarea atributului `data-theme` pe elementul `document.documentElement` la fiecare comutare;
  - Suport în `App.css` prin variabile CSS organizate pe niveluri de prioritizare: valorile implicite de mod luminos în `:root`, aplicarea temei de sistem prin `@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) { ... } }`, și suprascrierile explicite `:root[data-theme="dark"]` și `:root[data-theme="light"]`.
- Respectarea riguroasă a regulii de afișare 100% în limba engleză a întregii interfețe web a aplicației BarberFlow.
- Validarea build-ului de producție prin `npm run build` fără erori sau avertismente în consolă.

## Ce am învățat
- Gestionarea stării locale în React cu `useState` și înțelegerea modelului unidirecțional de flux de date (props coboară în arbore, evenimentele urcă prin funcții callback).
- Importanța imutabilității în React: obiectele și array-urile din state nu trebuie modificate direct (fără `push`, `splice` sau atribuiri pe proprietăți), ci înlocuite cu noi instanțe generate prin `map` și `filter` pentru a garanta detecția modificărilor prin compararea referințelor.
- Folosirea formei funcționale `setState((prev) => ...)` pentru a evita stările perimate (stale state) atunci când noua valoare depinde de starea anterioară.
- Diferența dintre starea React (valori care declanșează randarea) și valorile derivate (calcule rapide executate pe loc în corpul funcției, garantând consistența contorului).
- Construirea de controale accesibile: rolul `aria-label` pentru butoane acționate prin iconițe/text generic, utilizarea corectă a tag-ului `<label>` pentru a lărgi aria de clic a checkbox-ului și utilizarea `aria-pressed` pentru butoanele de comutare (toggle).
- Tehnica modernă de comutare a temei luminoasă/întunecată combinând starea React, atributul de date `dataset.theme` pe rădăcina documentului HTML și variabilele CSS cu selectorul de excludere `:not([data-theme="light"])`.


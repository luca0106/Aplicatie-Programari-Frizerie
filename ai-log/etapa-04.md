# Etapa 4: AI log

## Instrumente
- Gemini

## Conversații
- Solicitat îndrumare și generare de cod pentru task-urile din Etapa 4 a proiectului (Universitatea Națională de Știință și Tehnologie POLITEHNICA București).
- Crearea folderului `frontend/src/components/` și separarea responsabilităților în două componente React distincte:
  1. `AppointmentCard.jsx` (componentă copil responsabilă de afișarea unui singur element primit prin props);
  2. `AppointmentList.jsx` (componentă responsabilă de iterarea prin array-ul de programări și randarea condiționată a listei).
- Înlocuirea afișării temporare a datelor brute în format JSON (`<pre>{JSON.stringify(...)}</pre>`) din `App.jsx` cu componenta dedicată `<AppointmentList programari={programari} />`.
- Implementarea atributului obligatoriu `key={item.id}` direct pe componenta întoarsă din metoda `map` pentru a asigura reconcilierea corectă în React și evitarea avertismentelor în consola browserului.
- Implementarea randării condiționate:
  - Verificare de tip „early return” în `AppointmentList` pentru afișarea mesajului explicit `Nu există nicio programare înregistrată.` atunci când array-ul este gol;
  - Aplicarea dinamică a clasei `done` (`item-card done`) și a textului de stare (`Finalizată` vs `În așteptare`) în `AppointmentCard`.
- Verificarea compilării de producție prin `npm run build` și asigurarea că nu există avertismente în consolă.

## Ce am învățat
- Cum se împarte o interfață web în componente React modulare, plasate în fișiere separate.
- Modul de transmitere a datelor între părinte și copil exclusiv prin intermediul `props`, precum și destructurarea directă a acestora în antetul funcției (`{ programare }`).
- Rolul esențial al atributului `key` în algoritmii de reconciliere ai React (trebuie să fie o valoare unică și stabilă din date, de regulă `id`-ul, nu indexul din array).
- Tehnici de randare condiționată în JSX (atât prin return timpuriu pentru mesaje de tip listă goală, cât și prin operatori ternari pentru clase CSS și conținut dinamic).


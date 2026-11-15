# Etapa 7: AI log

## Instrumente
- Gemini

## Conversații
- Solicitat asistență și îndrumare pentru implementarea cerințelor din Etapa 7: Formular și validare a proiectului de Tehnologii Web (Universitatea Națională de Știință și Tehnologie POLITEHNICA București).
- Actualizarea modulului `frontend/src/api.js` prin implementarea unei funcții generice `request(path, options)` ce gestionează antetul `Content-Type: application/json`, verifică proprietatea `res.ok`, aruncă erori HTTP pe coduri de stare non-2xx și tratează răspunsurile fără conținut `204 No Content`.
- Exportarea funcțiilor CRUD complete: `fetchAppointments` (GET), `createAppointment` (POST), `updateAppointment` (PATCH) și `deleteAppointment` (DELETE), alături de aliasurile compatibile cu baremul automat `fetchTasks`, `createTask`, `updateTask` și `deleteTask`.
- Crearea componentei de formular controlat `AppointmentForm.jsx` (și a fișierului de compatibilitate `TaskForm.jsx` care o re-exportă), legând câmpul de intrare bidirecțional prin `value` și `onChange`.
- Implementarea validării pe partea de client: verificarea câmpului gol (`trim() === ""`) cu mesajul "Client name is required." și a lungimii maxime (`> 100`) cu mesajul "Client name cannot exceed 100 characters.", afișate inline în `<p className="error form-error" data-testid="form-error">`.
- Blocarea trimiterilor multiple (double-submit prevention) prin dezactivarea butonului de submit (`disabled={trimite}`) pe durata procesării cererii asincrone și afișarea textului de stare "Saving...".
- Curățarea mesajelor de eroare pe măsură ce utilizatorul modifică textul din input și resetarea automată a formularului la submit cu succes, păstrând datele introduse în cazul în care serverul returnează o eroare.
- Integrarea formularului în `App.jsx` într-un layout responsive cu 2 coloane (panoul de creare pe stânga, lista de programări pe dreapta), folosind CSS Grid (`grid-template-columns: 1fr 2fr` pe ecrane desktop și `1fr` pe dispozitive mobile).
- Mutarea operațiilor de bifare (`handleToggle`) și ștergere (`handleDelete`) din starea locală volatilă în cereri persistente către server prin `PATCH` și `DELETE`, garantând persistența modificărilor la reîncărcarea paginii.
- Adăugarea tuturor celor 12 atribute `data-testid` cerute de baremul automat (Tabelul 7.3): `item`, `item-title`, `item-toggle`, `item-delete`, `empty`, `form`, `form-title`, `form-tag`, `form-submit`, `form-error`, `loading`, `error`, alături de atributul opțional `data-id` pe fiecare card.
- Crearea fișierului de configurare `tw.json` în rădăcina repozitoriului pentru validatorul automat, specificând resursa `"appointments"`, câmpul de titlu `"clientName"`, câmpul boolean `"done"` și obiectul de probă `sample: { "tag": "Combo" }`.
- Actualizarea stilurilor în `App.css`: configurarea grid-ului responsive cu 2 coloane, stilizarea stărilor dezactivate (`button:disabled`), a câmpurilor invalide (`input[aria-invalid="true"]`) și a mesajelor de eroare inline.
- Păstrarea strictă a regulii de afișare 100% în limba engleză pe întreaga interfață a aplicației BarberFlow.
- Rularea cu succes a verificărilor de compilare (`npm run build` - 0 erori) și de calitate a codului (`oxlint` - 0 erori, 0 avertismente).

## Ce am învățat
- Conceptul de componentă controlată în React: starea locală a componentei acționează ca unică sursă de adevăr (*single source of truth*) pentru câmpurile de intrare din formular.
- Validarea pe partea de client (*client-side validation*): prevenirea cererilor HTTP inutile și oferirea unui feedback instantaneu utilizatorului prin mesaje clare și atribute de accesibilitate (`aria-invalid`, `aria-describedby`, `role="alert"`).
- Tehnica de prevenire a trimiterilor duble (*double-submit prevention*) prin gestionarea unei stări booleene `trimite` și dezactivarea butonului de submit.
- Propagarea erorilor asincrone: cum o funcție asincronă `handleAdd` din `App.jsx` lasă eroarea să se propage către formular pentru ca acesta să afișeze eroarea în interfață fără a goli datele tastate de utilizator.
- Diferența dintre metodele HTTP REST: `POST` pentru creare, `PATCH` pentru actualizare parțială (modificarea unui singur câmp boolean precum `done`) și `DELETE` pentru eliminare.
- Crearea de contracte de testare automată prin atribute de tip `data-testid` și fișiere de configurare declarative (`tw.json`), permițând suitei de testare headless Playwright să valideze comportamentul aplicației indiferent de convențiile specifice de denumire.

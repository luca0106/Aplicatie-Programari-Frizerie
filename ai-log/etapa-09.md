# Etapa 9: AI log

## Instrumente
- Gemini

## Conversații
- Analiza cerințelor din ghidul Etapei 9 (Backend propriu cu Node.js și Express 5) și alinierea deciziilor de arhitectură înainte de implementare (rute adaptate resursei `appointments`, mesaje de eroare în limba engleză consecvente cu interfața, validare de tip whitelist compatibilă cu testul automat `tw.json` și regulile de business ale frizeriei).
- Inițializarea proiectului `backend/` lângă `frontend/` (`npm init -y`, `npm install express cors`), configurarea `"type": "module"`, scripturilor `start` (`node src/server.js`) și `dev` (`node --watch src/server.js`), alături de `backend/.gitignore` și `backend/.env.example`.
- Implementarea modulului `backend/src/validation.js`:
  - Lista de valori fixe `TAGS = ["Combo", "Haircut", "Beard"]`, identică cu `frontend/src/constants.js` și `tw.json`;
  - Funcția `validateAppointment(body, { partial })` care aplică lista albă de câmpuri (eliminând câmpurile necunoscute precum `id` sau `role`), validează `clientName`, `tag`, `done` și câmpurile opționale de frizerie, și verifică orarul de lucru (Marți–Vineri 10:00–19:00, Sâmbătă 09:00–15:00, Luni & Duminică închis) atunci când `date` și `time` sunt trimise explicit;
  - Funcția `hasScheduleCollision` pentru prevenirea suprapunerilor cu pauza obligatorie de 10 minute și `parseId` pentru validarea strictă a parametrilor `:id` ca întregi pozitivi.
- Implementarea rutelor REST în `backend/src/routes/appointments.js` cu `express.Router()` pentru toate cele 5 operații (`GET /`, `GET /:id`, `POST /`, `PATCH /:id`, `DELETE /:id`) și coduri HTTP corecte (`200`, `201`, `204`, `400`, `404`), plus helper-ul `findAppointmentIndex`.
- Separarea `backend/src/app.js` (configurare `cors`, `express.json()`, `/health`, montare `/appointments`, rută catch-all `404` și middleware centralizat de erori cu 4 parametri) de `backend/src/server.js` (pornirea pe `PORT`).
- Actualizarea funcției `request()` din `frontend/src/api.js` pentru a citi și afișa mesajul real `{ error: "..." }` trimis de serverul Express (cu `.catch(() => ({}))` pentru siguranță).
- Eliminarea completă a `json-server` din proiect: ștergerea `frontend/db.json`, eliminarea scriptului `api` și a dependinței `json-server` din `frontend/package.json`, și rularea `npm install` în `frontend/` pentru actualizarea `package-lock.json`.
- Testarea automată a tuturor rutelor, codurilor HTTP, validărilor, erorilor și antetelor CORS, precum și verificarea `npm run lint` și `npm run build` în `frontend/`.

## Ce am învățat
- Cum funcționează un server HTTP în Node.js cu **Express 5**, organizarea modulară cu `Router` și importanța ordinii middleware-urilor (`cors` → `express.json()` → rute → catch-all `404` → handler centralizat de erori cu 4 parametri `(err, req, res, next)`).
- De ce separăm `app.js` de `server.js`: permite instanțierea și testarea aplicației Express fără a ocupa un port TCP.
- Principiul **Zero-Trust** și validarea pe server cu **listă albă de câmpuri** (prevenirea atacurilor de tip *Mass Assignment* și a datelor invalide trimise direct prin `curl`, ocolind formularul React).
- De ce apare eroarea **CORS** între `localhost:5173` și `localhost:3001` (origini diferite) și de ce se rezolvă exclusiv pe server prin antetul `Access-Control-Allow-Origin` configurat din `CORS_ORIGIN`.
- Cum arhitectura din Etapa 6 (centralizarea tuturor cererilor în `frontend/src/api.js`) a permis înlocuirea completă a `json-server` cu propriul backend fără a modifica nicio componentă React.

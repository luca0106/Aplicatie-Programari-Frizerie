# BarberFlow: Executive Studio Manager

BarberFlow is a premium web-based dashboard designed to streamline appointment scheduling for modern barbershops. It enables professionals to effortlessly track client sessions, manage service queues, and monitor daily workflows, featuring both a Client Portal and a Barber Dashboard.

## Core Data Architecture

The application manages appointment entities. Each record consists of the following attributes:

| Attribute | Data Type | Implementation Details |
| :--- | :--- | :--- |
| **Identifier (`id`)** | Number | Unique numeric ID generated dynamically. |
| **Client Name (`clientName`)** | Text | Required field for the client's full name (max 100 characters). |
| **Service (`serviceName`)** | Text | Selected package from the service catalog (includes price and duration). |
| **Duration (`duration`)** | Number | Minutes occupied on the barber's schedule (e.g., 20, 30, 40, 60, 90). |
| **Assigned Barber (`barber`)** | Relation / Text | Categorizes the appointment by staff (Nicholas Andrei, Madalin Plesa). |
| **Date & Time (`date`, `time`)** | Date / Time | ISO Date string (`YYYY-MM-DD`) and 24h start time (`HH:MM`). |
| **Session Status (`done`)** | Boolean | Indicates if the appointment is completed (`true`) or pending (`false`). |
| **Service Tag (`tag`)** | Text / Enum | Categorization tag: `Haircut`, `Beard`, `Combo`. |

### Initial Dataset
The application uses an in-memory seed dataset served by the Express backend (`backend/src/routes/appointments.js`; Stage 10 moves persistence to MariaDB):
1. **Alexander Pierce** - Upcoming (`done: false`) - *Haircut & Beard Trim* (60 min, 85 RON) - Tag: `Combo`
2. **Marcus Vance** - Completed (`done: true`) - *Classic Haircut* (40 min, 60 RON) - Tag: `Haircut`
3. **Julian Mercer** - Upcoming (`done: false`) - *Beard Trim with Razor* (30 min, 30 RON) - Tag: `Beard`
4. **Daniel Sterling** - Upcoming (`done: false`) - *Medium Haircut (Fade)* (60 min, 75 RON) - Tag: `Haircut`

---

## Stage 9: own backend
`json-server` is gone. The API is an Express 5 server in `backend/`, with REST routes for `/appointments`, server-side whitelist validation (including studio working hours and 10-minute collision checks), centralized error handling, `/health` endpoint, and CORS configured for `http://localhost:5173`. Data is still kept in memory and resets on restart (Stage 10 moves it to MariaDB).

## How to run
```bash
cd backend && npm install && npm run dev    # terminal 1, port 3001
cd frontend && npm install && npm run dev   # terminal 2, port 5173
```
Then open `http://localhost:5173` in your browser.

### Testing the API directly (`curl`)
```bash
curl -s -w ' -> %{http_code}\n' http://localhost:3001/health
curl -s -w ' -> %{http_code}\n' http://localhost:3001/appointments
curl -s -w ' -> %{http_code}\n' -X POST http://localhost:3001/appointments \
  -H "Content-Type: application/json" \
  -d '{"clientName":"From curl","tag":"Combo"}'
curl -s -w ' -> %{http_code}\n' -X POST http://localhost:3001/appointments \
  -H "Content-Type: application/json" \
  -d '{"clientName":""}'
curl -s -w ' -> %{http_code}\n' -X PATCH http://localhost:3001/appointments/5 \
  -H "Content-Type: application/json" \
  -d '{"done":true}'
curl -s -w ' -> %{http_code}\n' http://localhost:3001/appointments/999
curl -s -w ' -> %{http_code}\n' -X DELETE http://localhost:3001/appointments/5
```

## Status
- [x] Stage 5: local state and events
- [x] Stage 6: data from a mock API
- [x] Stage 7: form and validation
- [x] Stage 8: routing and detail page
- [x] Stage 9: own backend with Express
- [ ] Stage 10: MariaDB and full CRUD

---

## Stage 8: routing and detail page
Three pages behind React Router: the list, a detail page at `/appointments/:id`,
and an about page, plus a 404 page. Component styles moved to CSS Modules.

---

## Stage 7: form and validation
The application features a controlled form component (`AppointmentForm.jsx`) for booking new appointments with instant client-side validation. Creating a new appointment persists to the mock REST API (`POST /appointments`) and automatically updates the studio queue. Toggling and deleting appointments issue persistent `PATCH` and `DELETE` requests so modifications survive browser reloads.

---

## Stage 6: data from a mock API
The list is served by json-server from `db.json`. The app fetches it on load and shows a loading state and an error state.

---

## Stage 5: local state and events
The list lives in React state. Checking and deleting work from the page, and the counters in the header follow automatically. A button in the header switches between light and dark mode. Changes are lost on refresh, which is what stage 6 and stage 10 fix.

---

## Stage 4: components
The list is rendered from the data, through two components:
- `AppointmentList` receives the whole array and renders one card per item (handling the empty list state).
- `AppointmentCard` receives a single item through props and displays it.

---

## Stage 3: Vite and React project
The app lives in `frontend/`, built with Vite.

To build the frontend for production:
```bash
cd frontend
npm run build
```

---

## Stage 2 Archive
The vanilla HTML/CSS/JS mockups and initial implementation from previous stages have been preserved in the `mockup/` folder for historical verification (`mockup/index.html`, `mockup/style.css`, `mockup/appointments.js`).

---

## Artificial Intelligence Integration

| Tool Utilized | Application Area |
| :--- | :--- |
| **Google Gemini** | Assisted in architecting CSS Grid and Flexbox responsive dashboard layout for Stage 1, pure JavaScript data logic and algorithms for Stage 2, Vite + React scaffolding in Stage 3, component-based UI rendering with props and conditional states in Stage 4, local state management with immutable updates and CSS theme switching in Stage 5, mock REST API integration with json-server, useEffect data loading, and loading/error states handling in Stage 6, controlled form inputs with client-side validation, full REST API persistence (POST, PATCH, DELETE), and automated testid contracts in Stage 7, multi-page SPA routing with React Router (`Layout`, `Outlet`, `NavLink`, `useParams`), dynamic detail page, 404 route handling, and CSS Modules architecture in Stage 8, and custom Node.js + Express 5 REST backend (`backend/`), server-side whitelist & schedule validation, CORS configuration, centralized error handling, and `json-server` removal in Stage 9. |

*For comprehensive transcripts and prompting details, please refer to `ai-log/etapa-01.md` through `ai-log/etapa-09.md`.*

---

## Development Status & Verification Matrix

- [x] **Stage 1: Static UI Mockup**
- [x] **Stage 2: JavaScript Data Logic & Interactive Interface**
- [x] **Stage 3: Vite and React project**
- [x] **Stage 4: components rendered from data**
- [x] **Stage 5: local state and events**
- [x] **Stage 6: data from a mock API**
- [x] **Stage 7: form and validation**
- [x] **Stage 8: routing and detail page**
- [x] **Stage 9: own backend with Express**
- [ ] **Stage 10: MariaDB and full CRUD**

### Stage 9 Verification Table

| ID | Requirement | Where | How to check |
| :--- | :--- | :--- | :--- |
| **S9-R1** | `npm run dev` in `backend/` starts the API on 3001 | `backend/package.json#L6-L10`, `backend/src/server.js#L1-L7` | run `npm run dev` in `backend/`, open `http://localhost:3001/health` |
| **S9-R2** | all five routes answer with the right codes | `backend/src/routes/appointments.js#L80-L142` | run the `curl` commands from README (`200, 201, 200, 200, 204, 404`) |
| **S9-R3** | invalid data returns 400 with a clear message | `backend/src/validation.js#L64-L246` | `POST /appointments` with `{}` and `{"clientName":""}` |
| **S9-R4** | React app works with `json-server` removed | `frontend/package.json`, `frontend/src/api.js#L11-L15` | stop everything except Express backend + Vite, verify CRUD and server error display |
| **S9-R5** | no CORS errors in the browser console | `backend/src/app.js#L8` | inspect `Access-Control-Allow-Origin: http://localhost:5173` and browser console |
| **S9-R6** | README Stage 9 section + AI log | `README.md`, `ai-log/etapa-09.md` | read files in repository |
| **S9-R7** | commit "Stage 9" pushed | Git commit history | `git log -1` |

---

### Stage 8 Verification Table (Historical Reference)

| ID | Requirement | Where | How to check |
| :--- | :--- | :--- | :--- |
| **S8-R1** | header navigation changes page without reload | `frontend/src/App.jsx#L10-L20`, `frontend/src/components/Layout.jsx#L33-L40` | click links, watch Network |
| **S8-R2** | click on an item opens its detail page | `frontend/src/components/AppointmentCard.jsx#L56-L62`, `frontend/src/pages/AppointmentDetailPage.jsx` | click a title |
| **S8-R3** | refresh on the detail URL works; missing id shows an error | `frontend/src/pages/AppointmentDetailPage.jsx#L18-L60` | refresh `/appointments/1`, open `/appointments/999` |
| **S8-R4** | unknown URL shows the app 404 page | `frontend/src/App.jsx#L18` (`path="*"`), `frontend/src/pages/NotFoundPage.jsx` | open `/ceva` |
| **S8-R5** | each component has its .module.css; index.css only shared styles | `frontend/src/components/`, `frontend/src/pages/`, `frontend/src/index.css` | read |
| **S8-R6** | data-testid attributes from tables 7.3 and 8.2; detail route `/<resource>/:id` | `frontend/src/components/Layout.jsx`, `frontend/src/components/AppointmentCard.jsx`, `frontend/src/pages/AppointmentDetailPage.jsx`, `frontend/src/pages/NotFoundPage.jsx` | `querySelector` in the console |
| **S8-R7** | README Stage 8 section + AI log | `README.md`, `ai-log/etapa-08.md` | read |
| **S8-R8** | commit "Stage 8" pushed | Git commit history | `git log -1` |

---

### Stage 7 Verification Table (Historical Reference)

| ID | Requirement | Where | How to check |
| :--- | :--- | :--- | :--- |
| **S7-R1** | Controlled form (value + onChange on title input) | `frontend/src/components/AppointmentForm.jsx#L92-L107` | Inspect code, type into input |
| **S7-R2** | Client-side validation: empty and >100 chars blocked with inline error | `frontend/src/components/AppointmentForm.jsx#L18-L27`, `frontend/src/components/AppointmentForm.jsx#L125-L133` | Submit empty form, enter >100 characters |
| **S7-R3** | Submission & reset: onAdd called via POST, item added to list, form cleared | `frontend/src/components/AppointmentForm.jsx#L69-L73`, `frontend/src/App.jsx#L42-L46` | Fill name, click Book Appointment, check list and reset |
| **S7-R4** | Testing attributes: all 12 data-testid present per Table 7.3 | `frontend/src/components/*.jsx`, `frontend/src/App.jsx` | Inspect DOM in DevTools for `data-testid` |
| **S7-R5** | Automated validator configuration in tw.json | `tw.json` | Verify JSON resource, title, done, and sample fields |
| **S7-R6** | Server persistence for toggle and delete | `frontend/src/App.jsx#L48-L72`, `frontend/src/api.js#L33-L45` | Toggle/delete item, refresh page (`F5`), state is retained |
| **S7-R7** | README Stage 7 section + AI log | `README.md`, `ai-log/etapa-07.md` | Read repository documentation |
| **S7-R8** | Git commit with exact message pushed to main | Git commit history | `git log -1` |

---

### Stage 6 Verification Table (Historical Reference)

| ID | Requirement | Where | How to check |
| :--- | :--- | :--- | :--- |
| **S6-R1** | npm run api starts, route shows JSON | `frontend/package.json#L8`, `frontend/db.json` | open `http://localhost:3001/appointments` |
| **S6-R2** | data no longer in React code | `frontend/src/App.jsx#L12` (`useState([])`) | read |
| **S6-R3** | loading message while waiting | `frontend/src/App.jsx#L116` | test with `--delay 4000` |
| **S6-R4** | error message when API is down | `frontend/src/App.jsx#L118-L122` | stop npm run api, refresh |
| **S6-R5** | fetch only in api.js, URL from env | `frontend/src/api.js#L2-L13`, `frontend/.env.example` | search for fetch |
| **S6-R6** | README Stage 6 section + AI log | `README.md`, `ai-log/etapa-06.md` | read |
| **S6-R7** | commit "Stage 6: data from a mock API" pushed | Git commit history | `git log` |

---

### Stage 5 Verification Table (Historical Reference)

| ID | Requirement | Where | How to check |
| :--- | :--- | :--- | :--- |
| **S5-R1** | list kept in useState, in App | `frontend/src/App.jsx` | read |
| **S5-R2** | toggling changes state and card look | `frontend/src/App.jsx`, `frontend/src/components/AppointmentCard.jsx` | click a checkbox |
| **S5-R3** | delete removes the item | `frontend/src/App.jsx`, `frontend/src/components/AppointmentCard.jsx` | click Delete |
| **S5-R4** | header counter derived, not in state | `frontend/src/App.jsx` | toggle, watch header |
| **S5-R5** | immutable updates (no push, splice, assignment) | `frontend/src/App.jsx` | read |
| **S5-R6** | light / dark toggle: state + data-theme on html | `frontend/src/App.jsx`, `frontend/src/App.css` | click the button, both system themes |
| **S5-R7** | no console warnings; README + AI log | `README.md`, `ai-log/etapa-05.md` | F12, Console |
| **S5-R8** | commit "Stage 5: local state and events" pushed | Git commit history | `git log` |

---

### Stage 4 Verification Table (Historical Reference)

| ID | Requirement | Where | How to check |
| :--- | :--- | :--- | :--- |
| **S4-R1** | 2+ components in src/components/ | `frontend/src/components/` | open folder |
| **S4-R2** | card receives data through props | `frontend/src/components/AppointmentCard.jsx` | read code |
| **S4-R3** | map + key={id}, no console warnings | `frontend/src/components/AppointmentList.jsx` | F12, Console |
| **S4-R4** | message for empty list | `frontend/src/components/AppointmentList.jsx` | set array to `[]` in App.jsx |
| **S4-R5** | state changes the card look | `frontend/src/components/AppointmentCard.jsx` | toggle a `done` flag |
| **S4-R6** | README Stage 4 section + AI log | `README.md`, `ai-log/etapa-04.md` | read files in repository |
| **S4-R7** | commit "Stage 4: components rendered from data" pushed | Git commit history | `git log` |

---

### Stage 3 Verification Table (Historical Reference)

| ID | Requirement | Where | How to check |
| :--- | :--- | :--- | :--- |
| **S3-R1** | npm run dev starts without errors | `frontend/package.json` | `cd frontend`, `npm install`, `npm run dev` |
| **S3-R2** | app name and counter computed from data | `frontend/src/App.jsx` | edit data, save, check browser |
| **S3-R3** | data from README, not from the example | `frontend/src/App.jsx` | compare with README dataset |
| **S3-R4** | stage 1 styles reused | `frontend/src/App.css` | check layout and styles in browser |
| **S3-R5** | node_modules ignored, build passes | `frontend/.gitignore` | `cd frontend`, `npm run build` |
| **S3-R6** | README Stage 3 section + AI log | `README.md`, `ai-log/etapa-03.md` | read files in repository |
| **S3-R7** | commit "Stage 3: Vite and React project" pushed | Git commit history | `git log` |

---

### Stage 2 Verification Table (Historical Reference)

| ID | Requirement | Where | How to check |
| :--- | :--- | :--- | :--- |
| **S2-R1** | JS file linked, logs on page load | `mockup/index.html#L141` | Open in browser, press F12 Console |
| **S2-R2** | 3+ items with id, name, state, tag | `mockup/appointments.js#L21-L25` | Inspect `INITIAL_APPOINTMENTS` |
| **S2-R3** | list, count, search, add, toggle, delete | `mockup/appointments.js#L57-L142` | Console output & live UI interaction |
| **S2-R4** | add rejects empty name and overlapping slots | `mockup/appointments.js#L103-L138` | Console test group & UI Toast alerts |
| **S2-R5** | original array unchanged after add | `mockup/appointments.js#L530-L542` | Console immutability check |
| **S2-R6** | README Stage 2 section + AI log | `README.md`, `ai-log/etapa-02.md` | Read files in repository |
| **S2-R7** | commit "Stage 2" pushed | Git commit history | Run `git log` |

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
The application uses the following dataset (stored in `frontend/db.json` and served via mock REST API):
1. **Andrew Smith** - Pending session (`done: false`) - *Haircut & Beard Trim* (60 min) - Barber: *Nicholas Andrei* - Tag: `Combo`
2. **Michael Johnson** - Completed session (`done: true`) - *Signature Haircut* (40 min) - Barber: *Madalin Plesa* - Tag: `Haircut`
3. **Christian Davis** - Pending session (`done: false`) - *Beard Trim with Razor* (30 min) - Barber: *Nicholas Andrei* - Tag: `Beard`
4. **Liam Walker** - Pending session (`done: false`) - *Royal Shave & Facial* (45 min) - Barber: *Madalin Plesa* - Tag: `Beard`
5. **Daniel Brooks** - Completed session (`done: true`) - *Executive Haircut* (45 min) - Barber: *Nicholas Andrei* - Tag: `Haircut`

---

## Stage 6: data from a mock API
The list is served by json-server from `db.json`. The app fetches it on load and shows a loading state and an error state.

```bash
npm run api # terminal 1, http://localhost:3001
npm run dev # terminal 2, http://localhost:5173
```

## Status
- [x] Stage 5: local state and events
- [x] Stage 6: data from a mock API
- [ ] Stage 7: form and validation

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
The app now lives in `frontend/`, built with Vite.

## How to run
To run the full stack (API + Frontend):
```bash
# Terminal 1: Mock REST API
cd frontend
npm run api

# Terminal 2: Vite React Frontend
cd frontend
npm run dev
```
Then open the address printed in the terminal (http://localhost:5173).

To build for production:
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
| **Google Gemini** | Assisted in architecting CSS Grid and Flexbox responsive dashboard layout for Stage 1, pure JavaScript data logic and algorithms for Stage 2, Vite + React scaffolding in Stage 3, component-based UI rendering with props and conditional states in Stage 4, local state management with immutable updates and CSS theme switching in Stage 5, and mock REST API integration with json-server, useEffect data loading, and loading/error states handling in Stage 6. |

*For comprehensive transcripts and prompting details, please refer to the `ai-log/etapa-01.md`, `ai-log/etapa-02.md`, `ai-log/etapa-03.md`, `ai-log/etapa-04.md`, `ai-log/etapa-05.md`, and `ai-log/etapa-06.md` files.*

---

## Development Status & Verification Matrix

- [x] **Stage 1: Static UI Mockup**
- [x] **Stage 2: JavaScript Data Logic & Interactive Interface**
- [x] **Stage 3: Vite and React project**
- [x] **Stage 4: components rendered from data**
- [x] **Stage 5: local state and events**
- [x] **Stage 6: data from a mock API**

### Stage 6 Verification Table

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

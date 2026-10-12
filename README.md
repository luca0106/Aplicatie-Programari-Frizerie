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
The application uses the following dataset (consistent across stages):
1. **Andrew Smith** - Pending session (`done: false`) - *Haircut & Beard Trim* (60 min) - Barber: *Nicholas Andrei* - Tag: `Combo`
2. **Michael Johnson** - Completed session (`done: true`) - *Signature Haircut* (40 min) - Barber: *Madalin Plesa* - Tag: `Haircut`
3. **Christian Davis** - Pending session (`done: false`) - *Beard Trim with Razor* (30 min) - Barber: *Nicholas Andrei* - Tag: `Beard`

---

## Stage 3: Vite and React project
The app now lives in `frontend/`, built with Vite. The data from stage 2 moved into the main component; the list is still printed raw (JSON format).

## How to run
```bash
cd frontend
npm install
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
| **Google Gemini** | Assisted in architecting CSS Grid and Flexbox responsive dashboard layout for Stage 1, pure JavaScript data logic and algorithms for Stage 2, and migrating project architecture to Vite + React in Stage 3. |

*For comprehensive transcripts and prompting details, please refer to the `ai-log/etapa-01.md`, `ai-log/etapa-02.md`, and `ai-log/etapa-03.md` files.*

---

## Development Status & Verification Matrix

- [x] **Stage 1: Static UI Mockup**
- [x] **Stage 2: JavaScript Data Logic & Interactive Interface**
- [x] **Stage 3: Vite and React project**
- [ ] Stage 4: Componente React și randare dinamică

### Stage 3 Verification Table

| ID | Requirement | Where | How to check |
| :--- | :--- | :--- | :--- |
| **S3-R1** | npm run dev starts without errors | `frontend/package.json` | `cd frontend`, `npm install`, `npm run dev` |
| **S3-R2** | app name and counter computed from data | `frontend/src/App.jsx#L37-L48` | edit data, save, check browser |
| **S3-R3** | data from README, not from the example | `frontend/src/App.jsx#L1-L35` | compare with README dataset |
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
# BarberFlow: Executive Studio Manager

BarberFlow is a premium web-based dashboard designed to streamline appointment scheduling for modern barbershops. It enables professionals to effortlessly track client sessions, manage service queues, and monitor daily workflows, featuring both a Client Portal and a Barber Dashboard.

## Core Data Architecture

The application manages appointment entities. Each record consists of the following attributes:

| Attribute | Data Type | Implementation Details |
| :--- | :--- | :--- |
| **Identifier (`id`)** | Number | Unique numeric ID generated dynamically via `.reduce()`. |
| **Client Name (`clientName`)** | Text | Required field for the client's full name (max 100 characters). |
| **Service (`serviceName`)** | Text | Selected package from the service catalog (includes price and duration). |
| **Duration (`duration`)** | Number | Minutes occupied on the barber's schedule (e.g., 20, 30, 40, 60, 90). |
| **Assigned Barber (`barber`)** | Relation / Text | Categorizes the appointment by staff (Nicholas Andrei, Madalin Plesa). |
| **Date & Time (`date`, `time`)** | Date / Time | ISO Date string (`YYYY-MM-DD`) and 24h start time (`HH:MM`). |
| **Session Status (`done`)** | Boolean | Indicates if the appointment is completed (`true`) or pending (`false`). |
| **Service Tag (`tag`)** | Text / Enum | Categorization tag: `Haircut`, `Beard`, `Combo`. |

### Initial Dataset (Stage 2 Compliant)
The application is pre-seeded with the following 3 records (satisfying requirement S2-R2):
1. **Andrew Smith** - Pending session (`done: false`) - *Haircut & Beard Trim* (60 min) - Barber: *Nicholas Andrei* - Tag: `Combo`
2. **Michael Johnson** - Completed session (`done: true`) - *Signature Haircut* (40 min) - Barber: *Madalin Plesa* - Tag: `Haircut`
3. **Christian Davis** - Pending session (`done: false`) - *Beard Trim with Razor* (30 min) - Barber: *Nicholas Andrei* - Tag: `Beard`

---

## Stage 2: Data Logic & Interactive UI
Plain JavaScript implementation with functional programming standards:
- **Immutability First**: Array modifications use pure functions (`map`, `filter`, `reduce`, spread syntax `[...]`) without mutating original state.
- **Conflict Prevention**: Mathematical interval algorithm (`isSlotTaken`) prevents duplicate bookings on the same barber's calendar.
- **Non-blocking UX**: Replaced intrusive browser alert popups with a modern, floating Toast notification banner and console logs.
- **Persistence**: Synced with browser `localStorage` to preserve client bookings across page reloads.
- **Queue Search**: Real-time multi-attribute search across clients, services, barbers, and tags.
- **Future-Ready Architecture**: The pure data functions and domain models are cleanly isolated from DOM manipulation, ready to be converted into custom React hooks (`useAppointments`) and reducer actions in Stage 3.

---

## Artificial Intelligence Integration

| Tool Utilized | Application Area |
| :--- | :--- |
| **Google Gemini** | Assisted in architecting CSS Grid and Flexbox responsive dashboard layout for Stage 1, followed by pure JavaScript data logic, conflict prevention algorithms, search filters, non-blocking UI notifications, and preparation for React migration in Stage 2. |

*For comprehensive transcripts and prompting details, please refer to the `ai-log/stage-01.md`, `ai-log/stage-02.md`, `ai-log/etapa-01.md`, and `ai-log/etapa-02.md` files.*

---

## Local Execution Guide

To view and run the project locally:
1. Clone the repository or open the project folder in VS Code.
2. Open `index.html` in any modern web browser (e.g., Chrome, Firefox, Safari) or use VS Code Live Server. No build tools or package installations are required for Stage 1 & 2.
3. Open the browser Developer Console (`F12` -> `Console`) to view the automated verification tests.

---

## Development Status & Verification Matrix

- [x] **Stage 1: Static UI Mockup**
- [x] **Stage 2: JavaScript Data Logic & Interactive Interface**
- [ ] **Stage 3: Vite and React project**

### Stage 2 Verification Table

| ID | Requirement | Where | How to check |
| :--- | :--- | :--- | :--- |
| **S2-R1** | JS file linked, logs on page load | `index.html#L141` (script tag) | Open page, press F12 Console |
| **S2-R2** | 3+ items with id, name, state, tag | `appointments.js#L21-L25` | Inspect `INITIAL_APPOINTMENTS` |
| **S2-R3** | list, count, search, add, toggle, delete | `appointments.js#L57-L142` | Console output & live UI interaction |
| **S2-R4** | add rejects empty name and overlapping slots | `appointments.js#L103-L138` | Console test group & UI Toast alerts |
| **S2-R5** | original array unchanged after add | `appointments.js#L530-L542` | Console immutability check |
| **S2-R6** | README Stage 2 section + AI log | `README.md`, `ai-log/stage-02.md`, `ai-log/etapa-02.md` | Read files in repository |
| **S2-R7** | commit "Stage 2" pushed | Git commit history | Run `git log` |
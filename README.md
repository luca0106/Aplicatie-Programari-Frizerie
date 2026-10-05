# BarberFlow: Executive Studio Manager

BarberFlow is a premium web-based dashboard designed to streamline appointment scheduling for modern barbershops. It enables professionals to effortlessly track client sessions, manage service queues, and monitor daily workflows, featuring both a Client Portal and a Barber Dashboard.

## Core Data Architecture

The application manages appointment entities. Each record consists of the following attributes:

| Attribute | Data Type | Implementation Details |
| :--- | :--- | :--- |
| **Client Identifier** | Text | Required field for the client's full name (max 100 characters). |
| **Session Status** | Boolean | Indicates if the appointment is completed (`true`) or pending (`false`). |
| **Service Tier** | Fixed / Enum | Options: Signature Haircut, Haircut & Beard Trim, Medium Haircut, Kid's Haircut, etc. |
| **Assigned Barber** | Relation | Categorizes the appointment by staff (e.g., Nicholas Andrei, Madalin Plesa). |
| **Record Owner** | Relation | References the system user who created the booking (planned for Week 11). |

### Initial Dataset
The interface is currently populated with the following dummy records for testing purposes:
1. **Andrew Smith** - Pending session - *Haircut & Beard Trim*
2. **Michael Johnson** - Completed session - *Signature Haircut*
3. **Christian Davis** - Pending session - *Beard Trim*

## Stage 2: Data Logic & Interactive UI
Plain JavaScript implementation. `appointments.js` holds the initial array, the immutable functions that read and process data, anti-overlap validation logic, and DOM manipulation for the dual client-barber interface. Test logs are also printed in the browser console (F12).

## Artificial Intelligence Integration

| Tool Utilized | Application Area |
| :--- | :--- |
| **Google Gemini** | Assisted in architecting a custom CSS Grid and Flexbox layout for the Stage 1 UI mockup, and implemented pure JavaScript functions, time-slot management, and overlap prevention for Stage 2. |

*For comprehensive transcripts and prompting details, please refer to the `ai-log/etapa-01.md` and `ai-log/etapa-02.md` files.*

## Local Execution Guide

To view and run the project locally:
1. Clone the repository or open the project folder in VS Code.
2. Open `index.html` in any modern web browser (e.g., Chrome, Firefox, Safari) or use Live Server. No complex build process or dependencies are required at this stage.

## Development Status & Verification Matrix

- [x] **Stage 1: Static UI Mockup**
- [x] **Stage 2: JavaScript Data Logic & Interactive Interface**
- [ ] Stage 3: Vite and React project

### Stage 2 Verification Table

| ID | Requirement | Where (permalink) | How to check |
| :--- | :--- | :--- | :--- |
| **S2-R1** | JS file linked, logs on page load | `index.html#L..` (script tag) | open page, F12 Console |
| **S2-R2** | 3+ items with id, name, state, tag | `appointments.js#L..-L..` | read code |
| **S2-R3** | list, count, search, add, toggle, delete | `appointments.js#L..-L..` | console output & UI |
| **S2-R4** | add rejects empty name and overlapping slots | `appointments.js#L..-L..` | console & UI alerts |
| **S2-R5** | original array unchanged after add | `appointments.js#L..` | console line check |
| **S2-R6** | README Stage 2 section + AI log | `README.md`, `ai-log/etapa-02.md` | read files |
| **S2-R7** | commit "Stage 2" pushed | link to commit | commit history |
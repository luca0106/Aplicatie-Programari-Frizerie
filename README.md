# BarberFlow: Executive Studio Manager

BarberFlow is a premium web-based dashboard designed to streamline appointment scheduling for modern barbershops. It enables professionals to effortlessly track client sessions, manage service queues, and monitor daily workflows.

## Core Data Architecture

The application manages appointment entities. Each record consists of the following attributes:

| Attribute | Data Type | Implementation Details |
| :--- | :--- | :--- |
| **Client Identifier** | Text | Required field for the client's full name (max 100 characters). |
| **Session Status** | Boolean | Indicates if the appointment is completed (`true`) or pending (`false`). |
| **Service Tier** | Fixed / Enum | Options: Executive Haircut, Luxury Beard Trim, Haircut & Hot Towel, Wash & Style. |
| **Assigned Barber** | Relation | Categorizes the appointment by staff (e.g., Alex, Michael, Christian). |
| **Record Owner** | Relation | References the system user who created the booking (planned for Week 11). |

### Initial Dataset
The interface is currently populated with the following dummy records for testing purposes:
1. **Andrew Smith** - Pending session - *Haircut & Hot Towel*
2. **Michael Johnson** - Completed session - *Executive Haircut*
3. **Christian Davis** - Pending session - *Luxury Beard Trim*

## Artificial Intelligence Integration

| Tool Utilized | Application Area |
| :--- | :--- |
| **Google Gemini** | Assisted in architecting a custom CSS Grid and Flexbox layout for the Stage 1 UI mockup, ensuring responsive design principles and dark mode integration. |

*For comprehensive transcripts and prompting details, please refer to the `ai-log/etapa-01.md` file.*

## Local Execution Guide

This project is currently a static frontend mockup. To view it:
Simply open the `index.html` file in any modern web browser (e.g., Chrome, Firefox, Safari). No local server, build process, or dependencies are required at this stage.

## Development Status & Verification Matrix

[x] **Stage 1: Static UI Mockup**
[ ] Stage 2: JavaScript Data Logic


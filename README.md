# BarberFlow
O aplicație web pentru gestionarea programărilor la o frizerie.
Permite organizarea clienților pe categorii de servicii și monitorizarea statusului.

## Data model
| Field | Type | Notes |
| :--- | :--- | :--- |
| Nume Client | text | required, max 100 chars |
| Finalizată | boolean | toggled from the list, default false |
| Serviciu | fixed values | Tuns, Barbă, Tuns + Barbă, Spălat |
| Frizer (Categorie) | relation | Alex, Mihai, Andrei |
| Creator | relation | the owner of the item (from week 11) |

Sample data used across all stages:
1. Andrei Popescu, active, Tuns + Barbă
2. Mihai Ionescu, done, Tuns
3. Cristian Radu, active, Barbă

## AI usage
| Tool | Used for |
| :--- | :--- |
| Gemini | CSS Flexbox layout, stage 1 |

Details per stage: see the `ai-log/` folder.

## How to run
Open `index.html` in a browser. No build step, no server.

## Status
[x] Stage 1: static mockup
[ ] Stage 2: data logic in JavaScript
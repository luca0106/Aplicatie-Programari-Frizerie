# BarberFlow
A web application for managing barbershop appointments.
It allows organizing clients by service categories and tracking their status.

## Data model
| Field | Type | Notes |
| :--- | :--- | :--- |
| Client Name | text | required, max 100 chars |
| Done | boolean | toggled from the list, default false |
| Service | fixed values | Haircut, Beard, Haircut + Beard, Wash |
| Barber (Category) | relation | Alex, Michael, Andrew |
| Creator | relation | the owner of the item (from week 11) |

Sample data used across all stages:
1. Andrew Smith, active, Haircut + Beard
2. Michael Johnson, done, Haircut
3. Christian Davis, active, Beard

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
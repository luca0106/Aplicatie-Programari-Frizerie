# Stage 1: AI log

## Tools
- Gemini

## Conversations
- Redesigning BarberFlow mockup to differ completely from the TaskFlow reference while retaining all rubric rules.

## Key requests
### 1. Distinct Theme and Professional Visual Design
- Asked: Make the app look completely different from the purple reference in the guide, with a modern, high-end barbershop identity, while preserving all required semantic tags, Grid/Flexbox layouts, and variables.
- Got: Restructured HTML headers and panels; modern artisan dark slate and bronze palette; card elevation with soft borders, micro-badges, and interactive hover states.
- Changed or rejected: Kept the exact `.container`, `.panel`, `.item-form`, `.item-card`, and `.done` structural selectors so automated and manual rubric grading remains 100% compliant.

## What I learned / what did not work
I learned how to dramatically change the personality of an interface purely through typography, spacing, subtle border-radii, and a custom CSS variable palette without breaking the underlying responsive Grid and Flexbox mechanics.
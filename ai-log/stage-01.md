# Stage 1: AI log

## Tools
- Gemini

## Conversations
- Requested Gemini to generate a completely original, premium SaaS-style interface for the Barbershop app, ensuring absolutely no visual similarity to the TaskFlow PDF example, while strictly following all grading requirements.

## Key requests
### 1. Complete Layout Redesign (Dashboard Approach)
- Asked: Forget the PDF layout. Build a completely original HTML/CSS structure that looks highly professional and modern, but still meets the technical requirements (Grid, Flexbox, focus states, responsive, dark mode).
- Got: A fresh "Executive Dashboard" layout. The form is now isolated in a fixed-width dark sidebar on the left, and the appointments are displayed as elegant "tickets" in a responsive auto-fit Grid on the right. 
- Changed or rejected: Kept the generated code exactly as provided because it perfectly separates the design from the school's template while fulfilling every rubric criteria (e.g., the media query stacking everything on mobile).

## What I learned / what did not work
I learned how to use CSS Grid in two different ways: `grid-template-columns: 320px 1fr` for the main page skeleton, and `grid-template-columns: repeat(auto-fit, minmax(280px, 1fr))` to automatically wrap cards without needing complex media queries. I also learned how to use contrast to draw attention to the form by making the sidebar dark even in light mode.
# NOTES

Initial landing page design (will evolve over time)

minimal IBM themed page

tech landing page

cards linking to all modules (SQL, Python, Robot Gardner, etc)

right now i only have 3 modules, but i will be adding a few more

should have the logo

should have a link to StaticaLabs page (staticalabs.com), link should open on a new tab

keep the page simple

use IBM carbon design system

UI should look professional / enterprise level and prod ready

---

# PROMPT

# Role & Framework

You are an expert Frontend Engineer specializing in enterprise-grade UI/UX. Build a production-ready, highly professional technology landing page using the IBM Carbon Design System framework.

# Design & Theme (IBM Carbon)

- **Theme:** Strict IBM Carbon theme (utilize Gray 100 or Gray 90 corporate palette).
- **Aesthetic:** Minimalist, clean, and enterprise-level. High contrast, sharp typography, and intentional whitespace.
- **Header/Navigation:**
    - Include a placeholder for a corporate/product logo on the top left.
    - On the top right, include a clean navigation link to "StaticaLabs" that points to `staticalabs.com`. Security requirement: This link MUST open in a new tab (`target="_blank"` with `rel="noopener noreferrer"`).

# Layout & Content

- **Hero Section:** A simple, high-impact typography headline and brief subtitle defining the platform (e.g., "Enterprise Module Ecosystem").
- **Module Grid:** Create a responsive grid layout using Carbon's grid system.
- **Cards:** Right now, render exactly 3 distinct, interactive cards representing the initial modules:
    1. SQL Module
    2. Python Module
    3. Robot Gardener Module
- **Scalability Code Comment:** Write the grid and data mapping logic so that it is trivially easy to add 5+ more modules in the future (use a clean data array/object to drive the card rendering loop).

# Code Quality & Implementation Details

- **Simplicity:** Keep the DOM architecture flat and clean. No unnecessary decorative elements or "fluff."
- **Production-Ready:** Ensure semantic HTML, proper spacing utility classes, clean component encapsulation, and full responsiveness across mobile, tablet, and desktop viewports.

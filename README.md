# ❄️ ColdChain Monitor — Refrigerated Freight Telemetry & Spoilage Alerts

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Bootstrap 5](https://img.shields.io/badge/Bootstrap_5-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)](https://getbootstrap.com/)
[![Vercel Live](https://img.shields.io/badge/Vercel-Live%20Demo-black?style=for-the-badge&logo=vercel)](https://coldchain-monitor1.vercel.app)
[![GitHub Pages Ready](https://img.shields.io/badge/GitHub%20Pages-Ready-success?style=for-the-badge&logo=github)](https://pages.github.com/)

> **Applied AI Frontend Development Basics | OJT Capstone Project**  
> *Polaris School of Technology Bangalore*  
> Mentored under **Kshitij Sir** | Built by **Arnav Pratap Singh**

> ?? **Live Production URL:** [https://coldchain-monitor1.vercel.app](https://coldchain-monitor1.vercel.app)


---

## 📋 Overview

**ColdChain Monitor** is a production-grade, responsive single-page web application (SPA) engineered for end-to-end cold-chain logistics operations. It simulates IoT telemetry for temperature-sensitive cargo (pharmaceuticals, vaccines, dairy, biologics, and fresh produce), automatically detecting thermal excursions, triggering tiered alerts, and providing role-based workflows for warehouse operators and logistics managers.

The system enforces strict operational compliance: whenever sensor readings deviate from configured safe temperature bands, automated alerts are raised, requiring documented inspection notes and resolution workflows before clearance.

---

## 🌟 Key Features

### 1. 🌡️ IoT Telemetry Simulation & Monitoring
* **Real-Time Sensor Pings:** Live simulation engine generating realistic thermal fluctuations across active freight routes.
* **Configurable Safe Thresholds:** Per-shipment minimum and maximum temperature boundaries (e.g., vaccines at `+2°C` to `+8°C`, frozen biologics at `-20°C` to `-10°C`).
* **Instant Excursion Classification:**
  * 🟢 **Normal:** In safe threshold range.
  * 🟡 **Warning:** Nearing operational boundaries.
  * 🔴 **Critical:** Dangerous breach; active spoilage risk flagged immediately.

### 2. 🚨 Alert Lifecycle Management
* **Automated Incident Logging:** Immediate alert generation upon critical threshold excursions.
* **Two-Step Resolution Flow:**
  * **Acknowledge:** Operator notes the excursion event.
  * **Resolve:** Documented incident inspection notes entered before closing out the alert.
* **Manager Authorization Guard:** Clearing historical alerts requires administrative authentication.

### 3. 👥 Role-Based Access Control (RBAC) & Editable Profiles
* Pre-configured personas with custom views, permissions, and editable profile cards:
  * **Logistics Manager (`Arnav`):** Fleet-wide operational oversight, route creation, cancellation requests, status report authoring, and deletion authorization.
  * **Warehouse Operator (`Sourabh`):** Terminal-level inspection, delivery confirmation, cancellation approvals, report Q&A, and alert notifications.
* **Editable Profiles & Photos:** Both users can update their display name, responsibilities, contact details, hub, shift hours, and upload or remove a profile photo synced to the cloud.

### 4. 📦 Spoiled, Cancellation & Archive Workflows
* **Spoiled Packages Record:** Critical-condition shipments can be declared **Spoiled** with inspection notes, moving them out of active transit into a dedicated Spoiled archive and resolving open temperature alerts.
* **Cancellation Requests:** Structured cancellation pipeline requiring formal justification and Warehouse Operator sign-off.
* **Historical Archives:** Dedicated views for **Delivered**, **Cancelled**, and **Spoiled** shipments with full telemetry histories.

### 5. 📝 Package Status Reports, Warehouse Q&A & Mutual-Consent Deletion
* **Color-Coded Reports:** Logistics Manager files package status reports color-coded by state (`Normal - In Transit` / `Delivered` in blue, `Warning` in yellow, `Critical` in red, `Spoiled` in amber orange, `Cancelled` in muted grey).
* **Two-Way Q&A:** Warehouse Operator can ask questions directly on any report, and the Logistics Manager replies inline with required details.
* **Mutual-Consent Report Deletion:** Deleting a report requires password verification and sends a consent request to the **Alerts** tab for the other role (`Agree & Delete` vs. `Do Not Agree`). Without consent from both, the report is preserved and a refusal notice is delivered.

### 6. 🔍 Interactive KPI Filtering & Stateful Alert Badges
* **Interactive KPI Cards:** Clicking **Active Shipments**, **Normal Range**, **Warning Alerts**, or **Critical Excursions** dynamically filters the freight table and highlights the active card.
* **Stateful Unread Badge:** The Alerts badge tracks unread alerts per role and clears to `0` once viewed, incrementing only when new alerts or consent requests arrive.

### 7. ☁️ Real-Time Cloud Sync (Firebase Realtime Database)
* **Zero `localStorage` for Shared Data:** 100% data-driven state (`shipments`, `alerts`, `cancellations`, `reports`, `profiles`) stored in **Firebase Realtime Database** (`coldchain-monitor-eb213`) so updates sync live across all connected browsers and devices.
* **Zero Seed Data:** Starts completely empty (`0` records) and populates solely from user-registered shipments.
* **Zero External Build Tooling:** Pure Vanilla ES6+ JavaScript, Semantic HTML5, CSS3 (with Light/Dark mode), Bootstrap 5 CDN, and Firebase Compat SDK.

---

## 🔑 Demo Credentials

Test the application immediately using the pre-configured accounts:

| Role | Username | Password | Full Name | Primary Responsibilities |
|---|---|---|---|---|
| **Logistics Manager** | `Arnav` | `123` | Arnav Pratap Singh | Fleet oversight, route creation, cancellation approvals, security auth |
| **Warehouse Operator** | `Sourabh` | `123` | Sourabh | Hub receiving, temperature inspection, alert acknowledgement & resolution |

*(Tip: You can view complete profile metadata including shift hours, contact info, and station hub by clicking your profile avatar in the navigation bar.)*

---

## 📁 Repository Structure

```text
coldchain-monitor/
├── index.html          # Main SPA entrypoint & semantic HTML5 markup
├── style.css           # Custom CSS3 styles, CSS variables, transitions & badges
├── script.js           # Core controller, state management, RBAC, & telemetry engine
├── README.md           # Project documentation & reference manual
└── docs/               # Comprehensive project guides, presentations & PRD
    ├── 1_ColdChain_HTML_Explained_English.pdf
    ├── 1_ColdChain_HTML_Explained_Hinglish.pdf
    ├── 2_ColdChain_CSS_Explained_English.pdf
    ├── 2_ColdChain_CSS_Explained_Hinglish.pdf
    ├── 3_ColdChain_JavaScript_Explained_English.pdf
    ├── 3_ColdChain_JavaScript_Explained_Hinglish.pdf
    ├── 4_ColdChain_Feature_Showcase_English.pptx
    ├── 5_ColdChain_Login_to_End_Code_Walkthrough_Hinglish.pptx
    ├── 6_ColdChain_Login_to_End_Code_Walkthrough_English.pptx
    └── ColdChain_Monitor_PRD_Arnav_Pratap_Singh.pdf
```

---

## 📚 Documentation & Walkthroughs

All detailed study guides, architecture teardowns, slide decks, and specifications are preserved in the [`docs/`](./docs) folder:

| Document | Language | Format | Description |
|---|---|---|---|
| [**HTML Architecture Explained**](./docs/1_ColdChain_HTML_Explained_English.pdf) | English | PDF | Comprehensive breakdown of Semantic HTML5 elements, modal structures, and ARIA accessibility |
| [**HTML Architecture Explained**](./docs/1_ColdChain_HTML_Explained_Hinglish.pdf) | Hinglish | PDF | Deep dive into HTML structure explained in conversational Hinglish |
| [**CSS Styling & Design System**](./docs/2_ColdChain_CSS_Explained_English.pdf) | English | PDF | Layout principles, CSS variables, color contrast, responsive grids, and transitions |
| [**CSS Styling & Design System**](./docs/2_ColdChain_CSS_Explained_Hinglish.pdf) | Hinglish | PDF | CSS styling and layout mechanisms explained in Hinglish |
| [**JavaScript Controller & Logic**](./docs/3_ColdChain_JavaScript_Explained_English.pdf) | English | PDF | State management, array methods, DOM manipulation, telemetry math, and event delegation |
| [**JavaScript Controller & Logic**](./docs/3_ColdChain_JavaScript_Explained_Hinglish.pdf) | Hinglish | PDF | Full JavaScript logic walkthrough explained in Hinglish |
| [**Feature Showcase Deck**](./docs/4_ColdChain_Feature_Showcase_English.pptx) | English | PPTX | High-level presentation deck demonstrating every feature and capability |
| [**End-to-End Walkthrough**](./docs/5_ColdChain_Login_to_End_Code_Walkthrough_Hinglish.pptx) | Hinglish | PPTX | Complete code walkthrough presentation from login to resolution in Hinglish |
| [**End-to-End Walkthrough**](./docs/6_ColdChain_Login_to_End_Code_Walkthrough_English.pptx) | English | PPTX | Complete code walkthrough presentation from login to resolution in English |
| [**Product Requirements Document (PRD)**](./docs/ColdChain_Monitor_PRD_Arnav_Pratap_Singh.pdf) | English | PDF | Official OJT Capstone PRD outlining business logic, user personas, and deliverables |

---

## 🚀 Getting Started

### Option 1: Direct File Launch (No Setup)
Simply double-click `index.html` or open it directly in any modern web browser (Chrome, Edge, Firefox, Safari).

### Option 2: Local HTTP Server
Using VS Code Live Server or Python's built-in web server:

```bash
# Clone the repository
git clone https://github.com/dhairya-arnav-ps601/coldchain-monitor.git
cd coldchain-monitor

# Run a local web server (Python 3)
python -m http.server 8080

# Open in browser
http://localhost:8080
```

### Option 3: Deploy to GitHub Pages
1. Go to your repository on GitHub: `Settings` > `Pages`.
2. Under **Build and deployment** > **Source**, select `Deploy from a branch`.
3. Choose branch `main` and folder `/(root)`.
4. Click **Save**. Your site will be live at `https://dhairya-arnav-ps601.github.io/coldchain-monitor/` in under a minute!

---

## 🛠️ Technology Stack & Concepts Demonstrated

* **HTML5:** Semantic tags (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<table>`, `<form>`), form validation attributes, modal view containers.
* **CSS3:** Custom properties (`--navy`, `--cyan`, `--normal`, `--warning`, `--critical`), Flexbox, responsive grid integration, CSS keyframes, card badge styles.
* **Bootstrap 5 (v5.3.3) & Bootstrap Icons (v1.11.3):** Responsive utility classes, modal controllers, alert styling, responsive navigation.
* **Modern JavaScript (ES6+) & Cloud Sync:**
  * Array operations (`map`, `filter`, `find`, `some`, `forEach`)
  * Arrow functions, destructuring, object rest/spread
  * DOM manipulation, form validation, and `FileReader` image uploads
  * Firebase Realtime Database (`on("value")` live sync & `set()`) + `sessionStorage` tab auth

---

## 👤 Author & Acknowledgements

* **Developer:** Arnav Pratap Singh ([@dhairya-arnav-ps601](https://github.com/dhairya-arnav-ps601))
* **Institution:** Polaris School of Technology, Bangalore
* **Program:** Applied AI Frontend Development Basics
* **Special Thanks:** **Kshitij Sir** for mentorship and guidance throughout the OJT Capstone Project.

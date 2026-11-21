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

### 3. 👥 Role-Based Access Control (RBAC)
* Pre-configured personas with custom views, permissions, and profile inspection cards:
  * **Logistics Manager (`Arnav`):** Fleet-wide operational oversight, route administration, cancellation approvals, and data export.
  * **Warehouse Operator (`Sourabh`):** Terminal-level inspection, real-time alert acknowledgement, temperature telemetry logging, and incident notes.

### 4. 📦 Cancellation & Archive Workflows
* **Cancellation Requests:** Structured cancellation pipeline requiring formal justification and manager sign-off.
* **Historical Archives:** Dedicated views for **Delivered** and **Cancelled** shipments with complete audit histories.

### 5. 🔍 Data Filtering, Search & Analytics
* **Real-Time KPIs:** Live count cards for Total Shipments, Normal, Warning, and Critical statuses.
* **Instant Filter & Search:** Real-time query matching across Shipment ID, Cargo Type, Origin Hub, and Destination.
* **Status Filtering:** Fast triage by operational state.

### 6. 💾 Client-Side Persistence & Performance
* **Zero Backend Required:** Fully standalone client app powered by `localStorage` persistence.
* **Zero External Build Tooling:** Pure Vanilla ES6+ JavaScript, Semantic HTML5, and Bootstrap 5 CDN.

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
* **Modern JavaScript (ES6+):**
  * Array operations (`map`, `filter`, `find`, `reduce`, `some`, `forEach`)
  * Arrow functions, destructuring, object rest/spread
  * Event delegation and DOM manipulation
  * Browser `localStorage` CRUD lifecycle
  * String escaping and defensive parsing

---

## 👤 Author & Acknowledgements

* **Developer:** Arnav Pratap Singh ([@dhairya-arnav-ps601](https://github.com/dhairya-arnav-ps601))
* **Institution:** Polaris School of Technology, Bangalore
* **Program:** Applied AI Frontend Development Basics
* **Special Thanks:** **Kshitij Sir** for mentorship and guidance throughout the OJT Capstone Project.

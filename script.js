/**
 * ===================================================================
 * COLDCHAIN MONITOR V2.0 - MASTER CONTROLLER (script.js)
 * Enterprise Cold-Chain Logistics, Excursion Governance & IoT Telemetry
 * Preserves 100% of existing workflows, RBAC rules, & LocalStorage schemas
 * ===================================================================
 */

// 1. Authorized User Accounts & Personas
const USERS = [
  { username: "Arnav", pass: "123", name: "Arnav", role: "Logistics Manager" },
  { username: "Sourabh", pass: "123", name: "Sourabh", role: "Warehouse Operator" }
];

// 2. Individual Profile Metadata
const PROFILES = {
  Arnav: {
    username: "Arnav",
    name: "Arnav",
    role: "Logistics Manager",
    badgeClass: "bg-primary",
    duty: "Fleet oversight, route dispatch, thermal regulation & incident authorization",
    details: {
      "Email": "arnavpratap60@gmail.com",
      "Phone": "852 8600 376",
      "Station / Hub": "Polaris School of Technology Bangalore (Command HQ)",
      "Shift Hours": "08:00 - 17:00 IST",
      "Authority Level": "Tier 3 - Master Dispatch & Emergency Regulation"
    }
  },
  Sourabh: {
    username: "Sourabh",
    name: "Sourabh",
    role: "Warehouse Operator",
    badgeClass: "bg-teal text-white",
    duty: "In-bound receiving, physical seal inspection, alert acknowledgement & cancellation decisions",
    details: {
      "Email": "sourabh@coldchain.io",
      "Phone": "70195 885 90",
      "Station / Hub": "Polaris School of Technology Bangalore (Depot 4B)",
      "Shift Hours": "14:00 - 23:00 IST",
      "Authority Level": "Tier 2 - Terminal Inspection & Cancellation Sign-Off"
    }
  }
};

// 3. Baseline Shipments Sample
const INITIAL_SHIPMENTS = [
  // --- 8 ACTIVE REFRIGERATED CONSIGNMENTS ---
  {
    id: "SHP-101",
    cargo: "Fresh Produce",
    origin: "Mumbai",
    dest: "Pune",
    min: 2,
    max: 8,
    status: "Active",
    readings: [
      { temp: 5.2, time: "10:00" },
      { temp: 6.1, time: "10:30" }
    ]
  },
  {
    id: "SHP-102",
    cargo: "mRNA Vaccines",
    origin: "Hyderabad",
    dest: "Bengaluru",
    min: -25,
    max: -15,
    status: "Active",
    readings: [
      { temp: -21.4, time: "09:00" },
      { temp: -20.5, time: "09:45" }
    ]
  },
  {
    id: "SHP-103",
    cargo: "Dairy Products",
    origin: "Anand",
    dest: "Delhi",
    min: 1,
    max: 4,
    status: "Active",
    readings: [
      { temp: 2.5, time: "08:00" },
      { temp: 7.2, time: "08:30" }
    ]
  },
  {
    id: "SHP-104",
    cargo: "Frozen Seafood",
    origin: "Kochi",
    dest: "Chennai",
    min: -18,
    max: -12,
    status: "Active",
    readings: [
      { temp: -15.1, time: "11:00" },
      { temp: -14.8, time: "11:30" }
    ]
  },
  {
    id: "SHP-105",
    cargo: "Blood Plasma & Biologics",
    origin: "Jaipur",
    dest: "Delhi",
    min: 2,
    max: 6,
    status: "Active",
    readings: [
      { temp: 4.2, time: "07:30" },
      { temp: 7.1, time: "08:15" }
    ]
  },
  {
    id: "SHP-106",
    cargo: "Insulin Vials",
    origin: "Ahmedabad",
    dest: "Kolkata",
    min: 2,
    max: 8,
    status: "Active",
    readings: [
      { temp: 5.0, time: "06:00" },
      { temp: 11.4, time: "07:00" }
    ]
  },
  {
    id: "SHP-107",
    cargo: "Chilled Poultry",
    origin: "Chandigarh",
    dest: "Lucknow",
    min: 0,
    max: 4,
    status: "Active",
    readings: [
      { temp: 1.8, time: "09:15" },
      { temp: 2.1, time: "10:00" }
    ]
  },
  {
    id: "SHP-108",
    cargo: "Premium Chocolates",
    origin: "Indore",
    dest: "Bhopal",
    min: 12,
    max: 18,
    status: "Active",
    readings: [
      { temp: 14.2, time: "10:45" },
      { temp: 15.5, time: "11:15" }
    ]
  },

  // --- 3 DELIVERED PACKAGES ---
  {
    id: "SHP-201",
    cargo: "Ice Cream & Desserts",
    origin: "Nagpur",
    dest: "Raipur",
    min: -22,
    max: -16,
    status: "Delivered",
    deliveredAt: "15/11/2026 14:30",
    readings: [
      { temp: -18.2, time: "14:15" }
    ]
  },
  {
    id: "SHP-202",
    cargo: "Diagnostic Test Kits",
    origin: "Bengaluru",
    dest: "Chennai",
    min: 2,
    max: 8,
    status: "Delivered",
    deliveredAt: "15/11/2026 16:15",
    readings: [
      { temp: 4.8, time: "16:00" }
    ]
  },
  {
    id: "SHP-203",
    cargo: "Frozen Organic Berries",
    origin: "Shimla",
    dest: "Delhi",
    min: -20,
    max: -14,
    status: "Delivered",
    deliveredAt: "15/11/2026 18:00",
    readings: [
      { temp: -16.5, time: "17:45" }
    ]
  },

  // --- 4 CANCELLED PACKAGES ---
  {
    id: "SHP-301",
    cargo: "Seasonal Cut Fruits",
    origin: "Nashik",
    dest: "Mumbai",
    min: 2,
    max: 6,
    status: "Cancelled",
    cancelReason: "Severe Spoilage / Thermal Shock",
    cancelNotes: "Cooling system failed near Igatpuri ghats. Ambient reached 18°C.",
    cancelRequestedBy: "Arnav (Logistics Manager)",
    cancelApprovedBy: "Sourabh (Warehouse Operator)",
    cancelledAt: "15/11/2026 11:20",
    readings: [
      { temp: 18.2, time: "11:00" }
    ]
  },
  {
    id: "SHP-302",
    cargo: "Live Bacterial Cultures",
    origin: "Vadodara",
    dest: "Surat",
    min: -20,
    max: -15,
    status: "Cancelled",
    cancelReason: "Refrigeration Unit Mechanical Failure",
    cancelNotes: "Compressor drive belt snapped; vehicle diverted safely to depot.",
    cancelRequestedBy: "Arnav (Logistics Manager)",
    cancelApprovedBy: "Sourabh (Warehouse Operator)",
    cancelledAt: "15/11/2026 13:45",
    readings: [
      { temp: -8.4, time: "13:30" }
    ]
  },
  {
    id: "SHP-303",
    cargo: "Imported Gourmet Butter",
    origin: "Goa",
    dest: "Pune",
    min: 1,
    max: 4,
    status: "Cancelled",
    cancelReason: "Damaged Cargo Seals",
    cancelNotes: "Container security seal compromised at toll plaza inspection.",
    cancelRequestedBy: "Arnav (Logistics Manager)",
    cancelApprovedBy: "Sourabh (Warehouse Operator)",
    cancelledAt: "15/11/2026 15:10",
    readings: [
      { temp: 3.2, time: "14:50" }
    ]
  },
  {
    id: "SHP-304",
    cargo: "Veterinary Vaccines",
    origin: "Mysuru",
    dest: "Hubballi",
    min: 2,
    max: 8,
    status: "Cancelled",
    cancelReason: "Route Diverted / Client Cancelled",
    cancelNotes: "Consignee cold warehouse flooded; order cancelled by client.",
    cancelRequestedBy: "Arnav (Logistics Manager)",
    cancelApprovedBy: "Sourabh (Warehouse Operator)",
    cancelledAt: "15/11/2026 17:30",
    readings: [
      { temp: 5.5, time: "17:15" }
    ]
  }
];

const INITIAL_CANCELLATIONS = [
  {
    id: "REQ-301",
    shipmentId: "SHP-301",
    cargo: "Seasonal Cut Fruits",
    reason: "Severe Spoilage / Thermal Shock",
    notes: "Cooling system failed near Igatpuri ghats. Ambient reached 18°C.",
    requestedBy: "Arnav (Logistics Manager)",
    resolvedBy: "Sourabh (Warehouse Operator)",
    resolvedAt: "15/11/2026 11:20",
    time: "15/11/2026 11:05",
    state: "Approved"
  },
  {
    id: "REQ-302",
    shipmentId: "SHP-302",
    cargo: "Live Bacterial Cultures",
    reason: "Refrigeration Unit Mechanical Failure",
    notes: "Compressor drive belt snapped; vehicle diverted safely to depot.",
    requestedBy: "Arnav (Logistics Manager)",
    resolvedBy: "Sourabh (Warehouse Operator)",
    resolvedAt: "15/11/2026 13:45",
    time: "15/11/2026 13:20",
    state: "Approved"
  },
  {
    id: "REQ-303",
    shipmentId: "SHP-303",
    cargo: "Imported Gourmet Butter",
    reason: "Damaged Cargo Seals",
    notes: "Container security seal compromised at toll plaza inspection.",
    requestedBy: "Arnav (Logistics Manager)",
    resolvedBy: "Sourabh (Warehouse Operator)",
    resolvedAt: "15/11/2026 15:10",
    time: "15/11/2026 14:50",
    state: "Approved"
  },
  {
    id: "REQ-304",
    shipmentId: "SHP-304",
    cargo: "Veterinary Vaccines",
    reason: "Route Diverted / Client Cancelled",
    notes: "Consignee cold warehouse flooded; order cancelled by client.",
    requestedBy: "Arnav (Logistics Manager)",
    resolvedBy: "Sourabh (Warehouse Operator)",
    resolvedAt: "15/11/2026 17:30",
    time: "15/11/2026 17:15",
    state: "Approved"
  }
];

const ALL_VIEWS = [
  "Dashboard",
  "Shipments",
  "Alerts",
  "Cancellations",
  "Delivered",
  "Cancelled",
  "Devices",
  "Reports",
  "Settings"
];

const VIEW_METADATA = {
  Dashboard: { title: "Overview", breadcrumb: "Operations • Real-time Fleet Telemetry" },
  Shipments: { title: "Active Shipments", breadcrumb: "Fleet Operations • Live Transit Inventory" },
  Alerts: { title: "Alert Center", breadcrumb: "Thermal Excursions & Spoilage Prevention" },
  Cancellations: { title: "Approvals Queue", breadcrumb: "Two-Person Verification & Cancellation Governance" },
  Delivered: { title: "Delivered History", breadcrumb: "Completed Consignments & Compliance Log" },
  Cancelled: { title: "Cancelled Records", breadcrumb: "Terminated Shipments & Operator Approvals Archive" },
  Devices: { title: "IoT Device Fleet", breadcrumb: "Hardware Probe Health, RF Signal & Calibration" },
  Reports: { title: "Analytics & Reports", breadcrumb: "Regulatory Compliance Metrics & Audit Downloads" },
  Settings: { title: "Settings & Profile", breadcrumb: "Operator Identity & Telemetry Sensitivity Guidelines" }
};

const STORAGE_VER = "v5_cancellation_alerts";

/* ---------- Utility Helpers ---------- */
const $ = id => document.getElementById(id);
const nowTime = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
const stamp = () => new Date().toLocaleDateString("en-GB") + " " + nowTime();
const esc = t => String(t ?? "").replace(/[&<>"']/g, c => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
}[c]));

/* ---------- Modal Controller (Bootstrap 5 + Fallback) ---------- */
function openModal(id) {
  const el = $(id);
  if (!el) return;
  try {
    if (window.bootstrap && window.bootstrap.Modal) {
      bootstrap.Modal.getOrCreateInstance(el).show();
      return;
    }
  } catch (err) {
    console.warn("Bootstrap modal fallback:", err);
  }
  el.classList.add("show");
  el.style.display = "block";
  el.setAttribute("aria-modal", "true");
  el.removeAttribute("aria-hidden");
}

function closeModal(id) {
  const el = $(id);
  if (!el) return;
  try {
    if (window.bootstrap && window.bootstrap.Modal) {
      const inst = bootstrap.Modal.getInstance(el);
      if (inst) inst.hide();
    }
  } catch (err) {
    // fallback
  }
  el.classList.remove("show");
  el.style.display = "none";
  el.removeAttribute("aria-modal");
  el.setAttribute("aria-hidden", "true");
  const backdrop = document.querySelector(".modal-backdrop");
  if (backdrop) backdrop.remove();
}

/* ---------- State Sanitizer & Loader ---------- */
function sanitizeShipment(s, idx) {
  if (!s || typeof s !== "object") return null;
  const id = String(s.id || `SHP-${101 + idx}`).trim();
  const cargo = String(s.cargo || s.cargoType || "Freight Cargo").trim();
  const origin = String(s.origin || s.source || "Origin Hub").trim();
  const dest = String(s.dest || s.destination || "Destination Hub").trim();
  const min = typeof s.min === "number" ? s.min : (typeof s.minTemperature === "number" ? s.minTemperature : 2.0);
  const max = typeof s.max === "number" ? s.max : (typeof s.maxTemperature === "number" ? s.maxTemperature : 8.0);
  const status = s.status === "Delivered" ? "Delivered" : (s.status === "Cancelled" ? "Cancelled" : "Active");

  let readings = [];
  if (Array.isArray(s.readings) && s.readings.length > 0) {
    readings = s.readings.map(r => ({
      temp: typeof r.temp === "number" ? r.temp : (typeof r.temperature === "number" ? r.temperature : +(min + (max - min) / 2).toFixed(1)),
      time: String(r.time || nowTime()),
      alertDeleted: !!r.alertDeleted
    }));
  } else {
    readings = [{ temp: +(min + (max - min) / 2).toFixed(1), time: nowTime(), alertDeleted: false }];
  }

  return {
    id, cargo, origin, dest, min, max, status,
    deliveredAt: s.deliveredAt || "",
    cancelReason: s.cancelReason || "",
    cancelNotes: s.cancelNotes || "",
    cancelRequestedBy: s.cancelRequestedBy || "",
    cancelApprovedBy: s.cancelApprovedBy || "",
    cancelledAt: s.cancelledAt || "",
    readings
  };
}

function loadInitialState() {
  let loadedShipments = [];
  try {
    const raw = localStorage.getItem("cc_shipments");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length >= 10) {
        loadedShipments = parsed.map((s, idx) => sanitizeShipment(s, idx)).filter(Boolean);
      }
    }
  } catch (err) {
    loadedShipments = [];
  }

  if (loadedShipments.length < 10) {
    loadedShipments = INITIAL_SHIPMENTS.map((s, idx) => sanitizeShipment(s, idx));
    localStorage.setItem("cc_shipments", JSON.stringify(loadedShipments));
  }

  let loadedAlerts = [];
  try {
    const rawA = localStorage.getItem("cc_alerts");
    if (rawA) {
      const parsedA = JSON.parse(rawA);
      if (Array.isArray(parsedA)) loadedAlerts = parsedA;
    }
  } catch (err) {
    loadedAlerts = [];
  }

  let loadedCancels = [];
  try {
    const rawC = localStorage.getItem("cc_cancellations");
    if (rawC) {
      const parsedC = JSON.parse(rawC);
      if (Array.isArray(parsedC)) loadedCancels = parsedC;
    }
  } catch (err) {
    loadedCancels = [];
  }
  if (!loadedCancels.length) {
    loadedCancels = INITIAL_CANCELLATIONS.map(c => ({ ...c }));
  }

  let loadedNotifications = [];
  try {
    const rawN = localStorage.getItem("cc_manager_notifications");
    if (rawN) {
      const parsedN = JSON.parse(rawN);
      if (Array.isArray(parsedN)) loadedNotifications = parsedN;
    }
  } catch (err) {
    loadedNotifications = [];
  }

  return { loadedShipments, loadedAlerts, loadedCancels, loadedNotifications };
}

const { loadedShipments, loadedAlerts, loadedCancels, loadedNotifications } = loadInitialState();
let shipments = loadedShipments;
let alerts = loadedAlerts;
let cancellations = loadedCancels;
let managerNotifications = loadedNotifications;
let currentUser = loadUser();
let currentShipmentId = null;
let currentActiveView = "Dashboard";
let pendingDeleteShipmentId = null;
let activeAlertFilter = "ALL";
let seq = Date.now();

// Assign unique aid if missing
alerts.forEach(a => { if (!a.aid) a.aid = "ALT-" + (seq++); });

// Chart references
let overviewComplianceChartInstance = null;
let conditionDoughnutChartInstance = null;
let shipmentDetailChartInstance = null;

function latestOf(s) {
  if (!s || !Array.isArray(s.readings) || s.readings.length === 0) {
    return { temp: 0, time: "00:00" };
  }
  return s.readings[s.readings.length - 1];
}

const activeShipments = () => shipments.filter(s => s && s.status === "Active");

function loadUser() {
  try {
    const saved = localStorage.getItem("cc_user");
    if (!saved) return null;
    const parsed = JSON.parse(saved);
    const targetName = typeof parsed === "string" ? parsed : (parsed && parsed.username ? parsed.username : null);
    if (!targetName) return null;
    return USERS.find(u => u.username.toLowerCase() === targetName.toLowerCase()) || null;
  } catch (err) {
    return null;
  }
}

function saveState() {
  try {
    localStorage.setItem("cc_shipments", JSON.stringify(shipments));
    localStorage.setItem("cc_alerts", JSON.stringify(alerts));
    localStorage.setItem("cc_cancellations", JSON.stringify(cancellations));
    localStorage.setItem("cc_manager_notifications", JSON.stringify(managerNotifications));
    localStorage.setItem("cc_user", JSON.stringify(currentUser ? currentUser.username : null));
    localStorage.setItem("cc_storage_ver", STORAGE_VER);
  } catch (err) {
    console.error("Storage save failed:", err);
  }
}

/* ---------- Excursion Evaluator (Normal, Warning <2.0°C, Critical >=2.0°C) ---------- */
function evaluateTemp(temp, min, max) {
  if (typeof temp !== "number" || isNaN(temp)) {
    return { status: "Normal", text: "text-secondary", delta: 0 };
  }
  if (temp >= min && temp <= max) {
    return { status: "Normal", text: "text-success", delta: 0 };
  }
  const diff = temp > max ? temp - max : min - temp;
  const isCrit = +diff.toFixed(1) >= 2.0;
  return {
    status: isCrit ? "Critical" : "Warning",
    text: isCrit ? "text-danger" : "text-warning",
    delta: +diff.toFixed(1)
  };
}

function statusPillHtml(status) {
  const icons = {
    Normal: "bi-shield-check",
    Warning: "bi-exclamation-triangle-fill",
    Critical: "bi-x-octagon-fill"
  };
  return `<span class="status-pill status-pill-${status}"><i class="bi ${icons[status] || 'bi-info-circle'}"></i>${status}</span>`;
}

function randomReading(s) {
  const roll = Math.random();
  if (roll < 0.40) {
    return +(s.min + Math.random() * (s.max - s.min)).toFixed(1);
  }
  const isHigh = Math.random() < 0.5;
  if (roll < 0.75) {
    const diff = 0.2 + Math.random() * 1.6;
    return +(isHigh ? s.max + diff : s.min - diff).toFixed(1);
  }
  const diff = 2.0 + Math.random() * 3.0;
  return +(isHigh ? s.max + diff : s.min - diff).toFixed(1);
}

/* ===================================================================
   MAIN APPLICATION DOM CONTROLLER
   =================================================================== */
document.addEventListener("DOMContentLoaded", () => {

  // Global modal dismiss handler
  document.addEventListener("click", e => {
    const dismissBtn = e.target.closest("[data-bs-dismiss='modal']");
    if (dismissBtn) {
      const modalEl = dismissBtn.closest(".modal");
      if (modalEl) closeModal(modalEl.id);
    }
  });

  // Date banner update
  const dateEl = $("liveClockDate");
  if (dateEl) {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    dateEl.textContent = new Date().toLocaleDateString('en-GB', options);
  }

  function runEvaluation() {
    activeShipments().forEach(s => {
      const latest = latestOf(s);
      const res = evaluateTemp(latest.temp, s.min, s.max);
      const exists = alerts.some(a => a.id === s.id && a.temp === latest.temp && a.time === latest.time);
      if (res.status !== "Normal" && !latest.alertDeleted && !exists) {
        alerts.unshift({
          aid: "ALT-" + (seq++),
          id: s.id,
          cargo: s.cargo,
          temp: latest.temp,
          status: res.status,
          time: latest.time,
          state: "Active",
          requested: false,
          requestNote: ""
        });
      }
    });
    saveState();
  }

  /* ---------- Authentication State & RBAC Rules ---------- */
  function setAuth(user) {
    currentUser = user;
    saveState();
    if (user) {
      $("loginSection").classList.add("d-none");
      $("appSection").classList.remove("d-none");

      // Populate user widgets
      $("navUserName").textContent = user.name;
      $("welcomeUserName").textContent = user.name;
      $("userRoleBadge").textContent = user.role;
      $("sidebarAvatarInitial").textContent = user.name.charAt(0).toUpperCase();

      // Warehouse Operator cancellation badge visibility
      const isOperator = user.role === "Warehouse Operator";
      const isManager = user.role === "Logistics Manager";

      // If manager logs in while on Cancellations view, switch to Dashboard
      if (!isOperator && currentActiveView === "Cancellations") {
        currentActiveView = "Dashboard";
      }

      switchView(currentActiveView);
    } else {
      $("loginSection").classList.remove("d-none");
      $("appSection").classList.add("d-none");
      $("loginUsername").value = "";
      $("loginPassword").value = "";
      $("loginError").classList.add("d-none");
    }
  }

  function tryLogin(inputUser, inputPass) {
    const cleanU = (inputUser || "").trim().toLowerCase();
    const cleanP = (inputPass || "").trim();

    if (!cleanU || !cleanP) {
      $("loginError").classList.remove("d-none");
      return;
    }

    const found = USERS.find(u => u.username.toLowerCase() === cleanU && u.pass === cleanP);
    if (found) {
      $("loginError").classList.add("d-none");
      setAuth(found);
    } else {
      $("loginError").classList.remove("d-none");
    }
  }

  // Quick Demo account fill buttons
  $("fillManagerCreds").onclick = () => {
    $("loginUsername").value = "Arnav";
    $("loginPassword").value = "123";
    $("loginError").classList.add("d-none");
  };

  $("fillOperatorCreds").onclick = () => {
    $("loginUsername").value = "Sourabh";
    $("loginPassword").value = "123";
    $("loginError").classList.add("d-none");
  };

  // Password visibility toggle
  $("togglePassword").onclick = () => {
    const input = $("loginPassword");
    const isPass = input.type === "password";
    input.type = isPass ? "text" : "password";
    $("togglePasswordIcon").className = isPass ? "bi bi-eye-slash me-1" : "bi bi-eye me-1";
    $("togglePasswordText").textContent = isPass ? "Hide" : "Show";
  };

  $("loginForm").onsubmit = (e) => {
    e.preventDefault();
    tryLogin($("loginUsername").value, $("loginPassword").value);
  };

  $("btnLogout").onclick = () => setAuth(null);

  // Quick switch role modal
  $("btnQuickSwitchRole").onclick = () => openModal("switchRoleModal");
  if ($("btnSettingsSwitchRole")) {
    $("btnSettingsSwitchRole").onclick = () => openModal("switchRoleModal");
  }

  $("switchCardArnav").onclick = () => {
    const arnav = USERS.find(u => u.username === "Arnav");
    if (arnav) setAuth(arnav);
    closeModal("switchRoleModal");
  };

  $("switchCardSourabh").onclick = () => {
    const sourabh = USERS.find(u => u.username === "Sourabh");
    if (sourabh) setAuth(sourabh);
    closeModal("switchRoleModal");
  };

  /* ---------- Mobile Drawer Sidebar ---------- */
  const sidebar = $("appSidebar");
  const overlay = $("mobileOverlay");
  $("openSidebarBtn").onclick = () => {
    sidebar.classList.add("mobile-open");
    overlay.classList.add("active");
  };
  $("closeSidebarBtn").onclick = () => {
    sidebar.classList.remove("mobile-open");
    overlay.classList.remove("active");
  };
  overlay.onclick = () => {
    sidebar.classList.remove("mobile-open");
    overlay.classList.remove("active");
  };

  /* ---------- Single Profile Modal ---------- */
  function openUserProfileModal() {
    if (!currentUser) return;
    const profile = PROFILES[currentUser.username] || {
      name: currentUser.name,
      role: currentUser.role,
      duty: "OJT project under Kshitij sir",
      details: { "Email": `${currentUser.username.toLowerCase()}@coldchain.io` }
    };

    $("profModalName").textContent = profile.name;
    $("profModalRole").textContent = profile.role;
    $("profModalDuty").textContent = profile.duty;

    const detailsList = $("profModalDetailsList");
    if (detailsList && profile.details) {
      detailsList.innerHTML = Object.keys(profile.details).map(label => `
        <dt class="col-5 text-secondary fw-semibold mb-2">${esc(label)}</dt>
        <dd class="col-7 mb-2 text-dark font-monospace">${esc(profile.details[label] || "—")}</dd>
      `).join("");
    }

    openModal("userProfileModal");
  }

  $("userProfileChip").onclick = openUserProfileModal;

  /* ---------- Master Navigation Switcher ---------- */
  function switchView(name) {
    if (!ALL_VIEWS.includes(name)) name = "Dashboard";
    currentActiveView = name;

    // Close mobile sidebar if open
    sidebar.classList.remove("mobile-open");
    overlay.classList.remove("active");

    // Update Topbar Title & Breadcrumb
    const meta = VIEW_METADATA[name] || { title: name, breadcrumb: "Operations" };
    $("topbarViewTitle").textContent = meta.title;
    $("topbarBreadcrumb").textContent = meta.breadcrumb;

    // Toggle view visibility
    ALL_VIEWS.forEach(v => {
      const viewEl = $("view" + v);
      const navBtn = $("nav" + v);
      if (viewEl) viewEl.classList.toggle("d-none", v !== name);
      if (navBtn) navBtn.classList.toggle("active", v === name);
    });

    renderAll();
  }

  // Bind Sidebar Nav Buttons
  ALL_VIEWS.forEach(v => {
    const btn = $("nav" + v);
    if (btn) btn.onclick = () => switchView(v);
  });

  $("btnQuickViewAllShipments").onclick = () => switchView("Shipments");
  $("kpiCriticalCard").onclick = () => switchView("Alerts");
  $("kpiCriticalCard").onkeydown = (e) => { if (e.key === "Enter") switchView("Alerts"); };

  /* ---------- Master Render Pipeline ---------- */
  function renderAll() {
    runEvaluation();
    renderOverview();
    renderShipmentsTable();
    renderAlerts();
    renderRequests();
    renderDelivered();
    renderCancelled();
    renderDevices();
    renderSettings();
  }

  /* ---------- Manager Notifications Banner ---------- */
  function renderManagerNotifications() {
    const container = $("managerNotificationsContainer");
    if (!container) return;

    const isManager = currentUser && currentUser.role === "Logistics Manager";
    if (!isManager || !managerNotifications || managerNotifications.length === 0) {
      container.innerHTML = "";
      return;
    }

    container.innerHTML = `
      <div class="card border-0 shadow-sm mb-4" style="background: #FFFBFB; border: 1px solid #FECACA !important; border-radius: var(--cc-radius-md);">
        <div class="card-header bg-white py-2 px-3 d-flex justify-content-between align-items-center" style="border-bottom: 1px solid #FECACA;">
          <div class="fw-bold text-danger d-flex align-items-center gap-2 small">
            <i class="bi bi-bell-fill fs-6"></i>
            <span>Warehouse Operator Cancellation Decisions Dispatch</span>
            <span class="badge bg-danger rounded-pill">${managerNotifications.length}</span>
          </div>
          <button class="btn btn-sm btn-link text-decoration-none text-muted py-0 small" onclick="clearAllManagerNotifications()">
            <i class="bi bi-check2-all me-1"></i>Dismiss All
          </button>
        </div>
        <div class="card-body p-2">
          ${managerNotifications.map(n => {
            const isApproved = n.type === "Approved";
            return `
              <div class="alert ${isApproved ? "alert-success border-success" : "alert-danger border-danger"} d-flex justify-content-between align-items-start py-2 px-3 mb-2 shadow-xs" style="border-radius: 8px;">
                <div class="d-flex align-items-start gap-2">
                  <i class="bi ${isApproved ? "bi-check-circle-fill text-success" : "bi-x-circle-fill text-danger"} fs-5 mt-1"></i>
                  <div>
                    <div class="fw-bold ${isApproved ? "text-success" : "text-danger"}">${esc(n.title)}</div>
                    <div class="text-dark small">${esc(n.message)}</div>
                    <div class="text-muted" style="font-size: 0.72rem;">${esc(n.time)}</div>
                  </div>
                </div>
                <button type="button" class="btn btn-sm btn-link text-secondary p-0 ms-2" onclick="dismissManagerNotification('${n.id}')" title="Dismiss">
                  <i class="bi bi-x-lg"></i>
                </button>
              </div>
            `;
          }).join("")}
        </div>
      </div>
    `;
  }

  window.dismissManagerNotification = (id) => {
    managerNotifications = managerNotifications.filter(n => n.id !== id);
    saveState();
    renderAll();
  };

  window.clearAllManagerNotifications = () => {
    managerNotifications = [];
    saveState();
    renderAll();
  };

  /* ---------- Overview Dashboard & Charts ---------- */
  function renderOverview() {
    renderManagerNotifications();

    let normal = 0, warn = 0, crit = 0;
    const active = activeShipments();

    active.forEach(s => {
      const cond = evaluateTemp(latestOf(s).temp, s.min, s.max);
      if (cond.status === "Normal") normal++;
      if (cond.status === "Warning") warn++;
      if (cond.status === "Critical") crit++;
    });

    $("statTotal").textContent = active.length;
    $("statNormal").textContent = normal;
    $("statWarning").textContent = warn;
    $("statCritical").textContent = crit;
    $("sidebarShipmentsBadge").textContent = active.length;

    // Quick Freight Snapshot Table (First 5 active packages)
    const quickRows = active.slice(0, 5).map(s => {
      const latest = latestOf(s);
      const cond = evaluateTemp(latest.temp, s.min, s.max);
      return `
        <tr>
          <td class="fw-bold font-monospace text-primary"><i class="bi bi-upc-scan me-1 text-muted"></i>${esc(s.id)}</td>
          <td><strong>${esc(s.cargo)}</strong></td>
          <td class="small text-muted">${esc(s.origin)} <i class="bi bi-arrow-right text-muted mx-1"></i> ${esc(s.dest)}</td>
          <td class="font-monospace small">${s.min}°C to ${s.max}°C</td>
          <td class="fw-bold font-monospace ${cond.text}">${latest.temp > 0 ? "+" : ""}${latest.temp}°C</td>
          <td>${statusPillHtml(cond.status)}</td>
          <td class="text-end">
            <button class="btn btn-sm btn-crm-outline py-0" onclick="showDetails('${s.id}')">
              Diagnostics
            </button>
          </td>
        </tr>
      `;
    });

    $("dashboardQuickTableBody").innerHTML = quickRows.join("") ||
      `<tr><td colspan="7" class="text-center text-muted py-3">No active refrigerated freight registered.</td></tr>`;

    // Render Overview Charts
    renderCharts(active, normal, warn, crit);
  }

  function renderCharts(active, normal, warn, crit) {
    if (!window.Chart) return;

    // 1. Temperature Compliance Chart (Line/Bar across packages)
    const ctxOverview = document.getElementById("overviewComplianceChart");
    if (ctxOverview) {
      const labels = active.map(s => s.id);
      const currentTemps = active.map(s => latestOf(s).temp);
      const minBounds = active.map(s => s.min);
      const maxBounds = active.map(s => s.max);

      if (overviewComplianceChartInstance) {
        overviewComplianceChartInstance.destroy();
      }

      overviewComplianceChartInstance = new Chart(ctxOverview, {
        type: "line",
        data: {
          labels,
          datasets: [
            {
              label: "Current Sensor Reading (°C)",
              data: currentTemps,
              borderColor: "#3478F6",
              backgroundColor: "rgba(52, 120, 246, 0.1)",
              borderWidth: 2.5,
              tension: 0.3,
              pointRadius: 5,
              pointBackgroundColor: "#3478F6",
              fill: true
            },
            {
              label: "Max Safe Limit (°C)",
              data: maxBounds,
              borderColor: "#C2413B",
              borderDash: [5, 5],
              borderWidth: 1.5,
              pointRadius: 0,
              fill: false
            },
            {
              label: "Min Safe Limit (°C)",
              data: minBounds,
              borderColor: "#17845D",
              borderDash: [5, 5],
              borderWidth: 1.5,
              pointRadius: 0,
              fill: false
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "top",
              labels: { font: { family: "Inter", size: 11 }, boxWidth: 12 }
            },
            tooltip: {
              backgroundColor: "#0F172A",
              titleFont: { family: "Inter" },
              bodyFont: { family: "Inter" }
            }
          },
          scales: {
            y: {
              title: { display: true, text: "Degrees Celsius (°C)", font: { family: "Inter", size: 10 } },
              grid: { color: "#F1F5F9" }
            },
            x: {
              grid: { display: false }
            }
          }
        }
      });
    }

    // 2. Condition Doughnut Chart
    const ctxDoughnut = document.getElementById("conditionDoughnutChart");
    if (ctxDoughnut) {
      if (conditionDoughnutChartInstance) {
        conditionDoughnutChartInstance.destroy();
      }

      const total = normal + warn + crit;
      const normalPct = total > 0 ? Math.round((normal / total) * 100) : 100;
      $("conditionDoughnutSummary").innerHTML = `<strong>${normalPct}%</strong> of active fleet is within strictly compliant safe bounds.`;

      conditionDoughnutChartInstance = new Chart(ctxDoughnut, {
        type: "doughnut",
        data: {
          labels: ["Compliant", "Warning Margin", "Critical Excursion"],
          datasets: [
            {
              data: [normal, warn, crit],
              backgroundColor: ["#17845D", "#B7791F", "#C2413B"],
              borderWidth: 2,
              borderColor: "#FFFFFF"
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: "70%",
          plugins: {
            legend: {
              position: "bottom",
              labels: { font: { family: "Inter", size: 11 }, boxWidth: 10 }
            }
          }
        }
      });
    }
  }

  /* ---------- Full Shipments Table with Search, Filter & Role Controls ---------- */
  function renderShipmentsTable() {
    const q = ($("searchInput") ? $("searchInput").value : "").trim().toLowerCase();
    const statusFilter = $("statusFilter") ? $("statusFilter").value : "ALL";
    const cargoFilter = $("cargoFilter") ? $("cargoFilter").value : "ALL";

    const isOperator = currentUser && currentUser.role === "Warehouse Operator";
    const isManager = currentUser && currentUser.role === "Logistics Manager";

    const filtered = activeShipments().filter(s => {
      const latest = latestOf(s);
      const cond = evaluateTemp(latest.temp, s.min, s.max);

      // Search match
      const matchSearch = (s.id + " " + s.cargo + " " + s.origin + " " + s.dest).toLowerCase().includes(q);
      if (!matchSearch) return false;

      // Status match
      if (statusFilter !== "ALL" && cond.status !== statusFilter) return false;

      // Cargo category match
      if (cargoFilter === "Vaccines" && !s.cargo.toLowerCase().includes("vaccine") && !s.cargo.toLowerCase().includes("biologics")) return false;
      if (cargoFilter === "Produce" && !s.cargo.toLowerCase().includes("produce") && !s.cargo.toLowerCase().includes("chocolates")) return false;
      if (cargoFilter === "Dairy" && !s.cargo.toLowerCase().includes("dairy") && !s.cargo.toLowerCase().includes("seafood") && !s.cargo.toLowerCase().includes("poultry")) return false;

      return true;
    });

    if ($("shipmentCountSummary")) {
      $("shipmentCountSummary").textContent = `Showing ${filtered.length} active consignments`;
    }

    const rows = filtered.map(s => {
      const latest = latestOf(s);
      const cond = evaluateTemp(latest.temp, s.min, s.max);
      const hasPendingCancel = cancellations.some(c => c.shipmentId === s.id && c.state === "Pending");

      // Action buttons based on Role-Based Access Control
      let actionButtons = `
        <button class="btn btn-sm btn-crm-outline py-0" onclick="showDetails('${s.id}')" title="View Diagnostics & Telemetry Chart">
          Diagnostics
        </button>
      `;

      // Mark Delivered ONLY for Warehouse Operator
      if (isOperator) {
        actionButtons += `
          <button class="btn btn-sm btn-outline-success py-0 ms-1" onclick="markDelivered('${s.id}')" title="Mark Consignment as Delivered">
            <i class="bi bi-check-lg me-1"></i>Delivered
          </button>
        `;
      }

      // Cancel Request and Delete ONLY for Logistics Manager
      if (isManager) {
        if (hasPendingCancel) {
          actionButtons += `
            <button class="btn btn-sm btn-outline-secondary py-0 ms-1 disabled" disabled title="Cancellation request pending Warehouse Operator approval">
              <i class="bi bi-hourglass-split"></i>
            </button>
            <button class="btn btn-sm btn-outline-danger py-0 ms-1" onclick="promptDeleteShipment('${s.id}')" title="Security Delete Consignment">
              <i class="bi bi-trash"></i>
            </button>
          `;
        } else {
          actionButtons += `
            <button class="btn btn-sm btn-outline-warning py-0 ms-1 text-dark" onclick="openCancelModal('${s.id}')" title="Request Shipment Cancellation">
              <i class="bi bi-x-circle"></i>
            </button>
            <button class="btn btn-sm btn-outline-danger py-0 ms-1" onclick="promptDeleteShipment('${s.id}')" title="Security Delete Consignment">
              <i class="bi bi-trash"></i>
            </button>
          `;
        }
      }

      const cancelPendingBadge = hasPendingCancel ? `
        <span class="badge bg-warning text-dark border ms-1" title="Cancellation request pending Warehouse Operator approval">
          <i class="bi bi-hourglass-split me-1"></i>Cancel Pending
        </span>
      ` : "";

      return `
        <tr>
          <td class="fw-bold font-monospace text-primary">
            <i class="bi bi-upc-scan me-1 text-muted"></i>${esc(s.id)}
          </td>
          <td><strong>${esc(s.cargo)}</strong></td>
          <td class="small text-muted">${esc(s.origin)} <i class="bi bi-arrow-right text-muted mx-1"></i> ${esc(s.dest)}</td>
          <td class="font-monospace small">${s.min}°C to ${s.max}°C</td>
          <td class="fw-bold font-monospace ${cond.text}">${latest.temp > 0 ? "+" : ""}${latest.temp}°C</td>
          <td>${statusPillHtml(cond.status)}${cancelPendingBadge}</td>
          <td class="text-end text-nowrap">${actionButtons}</td>
        </tr>
      `;
    });

    $("shipmentTableBody").innerHTML = rows.join("") ||
      `<tr><td colspan="7" class="text-center text-muted py-4">No active shipments match the selected filters.</td></tr>`;
  }

  /* ---------- Alert Center View ---------- */
  function renderAlerts() {
    const unresolved = alerts.filter(a => a.state !== "Resolved").length;
    $("navAlertsBadge").textContent = unresolved;

    // Filter counts
    const criticalCount = alerts.filter(a => a.status === "Critical" && a.state !== "Resolved").length;
    const warningCount = alerts.filter(a => a.status === "Warning" && a.state !== "Resolved").length;
    const requestCount = alerts.filter(a => a.requested && a.state !== "Resolved").length;
    const resolvedCount = alerts.filter(a => a.state === "Resolved").length;

    $("alertStatCritical").textContent = criticalCount;
    $("alertStatWarning").textContent = warningCount;
    $("alertStatRequests").textContent = requestCount;
    $("alertStatResolved").textContent = resolvedCount;

    const isOperator = currentUser && currentUser.role === "Warehouse Operator";
    const isManager = currentUser && currentUser.role === "Logistics Manager";

    const filteredAlerts = alerts.filter(a => {
      if (activeAlertFilter === "Critical") return a.status === "Critical" && a.state !== "Resolved";
      if (activeAlertFilter === "Warning") return a.status === "Warning" && a.state !== "Resolved";
      if (activeAlertFilter === "Cancellations") return a.type === "Cancellation";
      if (activeAlertFilter === "Resolved") return a.state === "Resolved";
      return true; // ALL
    });

    $("alertsList").innerHTML = filteredAlerts.map(a => {
      // 1. Cancellation Decision Notice (Operator Approved/Rejected)
      if (a.type === "Cancellation") {
        const isApproved = a.decision === "Approved";
        return `
          <div class="alert-card-v2 Cancellation ${isApproved ? 'border-success' : 'border-danger'}">
            <div class="d-flex flex-wrap justify-content-between align-items-start gap-2">
              <div class="d-flex align-items-start gap-3">
                <i class="bi ${isApproved ? 'bi-check-circle-fill text-success' : 'bi-x-circle-fill text-danger'} fs-4 mt-1"></i>
                <div>
                  <div class="d-flex align-items-center gap-2 mb-1">
                    <strong class="fs-6 font-monospace text-dark">${esc(a.id)}</strong>
                    ${a.cargo ? `<span class="badge bg-light text-dark border">${esc(a.cargo)}</span>` : ""}
                    <span class="badge ${isApproved ? 'bg-success' : 'bg-danger'}">${esc(a.decision)}</span>
                    <span class="badge ${a.state === 'Resolved' ? 'bg-secondary' : 'bg-primary'}">${a.state === 'Resolved' ? 'Acknowledged' : 'New Notice'}</span>
                  </div>
                  <div class="fw-semibold ${isApproved ? 'text-success' : 'text-danger'} mb-1">${esc(a.title)}</div>
                  <div class="text-dark small mb-1">${esc(a.message)}</div>
                  <div class="small text-muted">
                    <i class="bi bi-person-check me-1"></i>Decision authority: <strong>${esc(a.resolvedBy || "Warehouse Operator")}</strong> | <i class="bi bi-clock me-1"></i>${esc(a.time)}
                  </div>
                </div>
              </div>
              <div class="d-flex align-items-center gap-1">
                ${a.state !== "Resolved" ? `
                  <button class="btn btn-sm btn-crm-outline" onclick="acknowledgeAlert('${a.aid}')">
                    <i class="bi bi-check2 me-1"></i>Acknowledge
                  </button>
                ` : '<span class="badge bg-secondary">Read</span>'}
                <button class="btn btn-sm btn-outline-danger py-1" onclick="deleteAlert('${a.aid}')" title="Delete Notice">
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </div>
          </div>
        `;
      }

      // 2. Standard Temperature Excursion Alert
      const isResolved = a.state === "Resolved";

      const managerNotificationHtml = (isManager && a.requested && !isResolved) ? `
        <div class="alert alert-warning py-2 px-3 my-2 small d-flex align-items-center gap-2 border-warning rounded-3">
          <i class="bi bi-envelope-exclamation-fill text-danger fs-5"></i>
          <div>
            <strong>Warehouse Operator Request Received:</strong> Package is in <span class="text-danger fw-bold">${esc(a.status)}</span> condition. Immediate regulation requested.
          </div>
        </div>
      ` : "";

      let actionControlHtml = "";
      if (!isResolved) {
        if (isOperator) {
          if (!a.requested) {
            actionControlHtml = `
              <button class="btn btn-sm btn-warning py-1" onclick="sendAlertRequest('${a.aid}')" title="Dispatch alert notice to Logistics Manager">
                <i class="bi bi-send me-1"></i>Send Request
              </button>
            `;
          } else {
            actionControlHtml = `
              <span class="badge bg-warning text-dark border p-2">
                <i class="bi bi-check2-circle me-1"></i>Request Dispatched to Manager
              </span>
            `;
          }
        } else if (isManager) {
          actionControlHtml = `
            <button class="btn btn-sm btn-crm-primary py-1" onclick="openResolveModal('${a.aid}')">
              <i class="bi bi-sliders me-1"></i>Regulate &amp; Resolve
            </button>
          `;
        }
      } else {
        actionControlHtml = '<span class="badge bg-secondary p-2">Resolved</span>';
      }

      return `
        <div class="alert-card-v2 ${a.status} ${a.state}">
          <div class="d-flex flex-wrap justify-content-between align-items-center gap-2">
            <div>
              <div class="d-flex align-items-center gap-2 mb-1">
                <strong class="font-monospace fs-6 text-dark">${esc(a.id)}</strong>
                <span class="badge bg-light text-dark border">${esc(a.cargo)}</span>
                ${statusPillHtml(a.status)}
              </div>
              <div class="small text-muted">
                Observed Excursion: <strong class="text-danger fs-6">${a.temp}°C</strong> | Time: <strong>${esc(a.time)}</strong> | State: <strong>${esc(a.state)}</strong>
              </div>
            </div>
            <div class="d-flex align-items-center gap-2">
              ${actionControlHtml}
              <button class="btn btn-sm btn-outline-danger py-1" onclick="deleteAlert('${a.aid}')" title="Delete Alert">
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </div>
          ${managerNotificationHtml}
        </div>
      `;
    }).join("") || '<p class="text-muted small text-center my-4">No alerts recorded in this filter view. All shipments within bounds.</p>';
  }

  // Severity Tab Click Handlers
  const alertTabMap = {
    filterAlertAll: "ALL",
    filterAlertCritical: "Critical",
    filterAlertWarning: "Warning",
    filterAlertCancellations: "Cancellations",
    filterAlertResolved: "Resolved"
  };

  Object.keys(alertTabMap).forEach(btnId => {
    const btn = $(btnId);
    if (btn) {
      btn.onclick = () => {
        activeAlertFilter = alertTabMap[btnId];
        Object.keys(alertTabMap).forEach(b => {
          const tab = $(b);
          if (tab) {
            tab.className = b === btnId
              ? "btn btn-sm btn-link text-decoration-none fw-semibold active text-primary border-bottom border-primary pb-2 rounded-0"
              : "btn btn-sm btn-link text-decoration-none text-muted pb-2 rounded-0";
          }
        });
        renderAlerts();
      };
    }
  });

  window.acknowledgeAlert = (aid) => {
    const a = alerts.find(item => item.aid === aid);
    if (!a) return;
    a.state = "Resolved";
    saveState();
    renderAll();
  };

  window.sendAlertRequest = (aid) => {
    const a = alerts.find(item => item.aid === aid);
    if (!a) return;
    a.requested = true;
    a.requestNote = `Package is in ${a.status} condition, please resolve it.`;
    saveState();
    renderAll();
    alert(`Request dispatched to Logistics Manager: Consignment ${a.id} is in ${a.status} condition. Immediate regulation required.`);
  };

  $("btnDeleteAllAlerts").onclick = () => {
    if (!alerts.length) return alert("No active alerts to delete.");
    if (confirm(`Are you sure you want to clear all ${alerts.length} incident alerts?`)) {
      alerts.forEach(a => {
        const shipment = shipments.find(s => s.id === a.id);
        const reading = shipment && shipment.readings && shipment.readings.find(r => r.time === a.time && r.temp === a.temp);
        if (reading) reading.alertDeleted = true;
      });
      alerts = [];
      saveState();
      renderAll();
    }
  };

  window.deleteAlert = (aid) => {
    const a = alerts.find(item => item.aid === aid);
    if (!a || !confirm(`Permanently remove alert record ${a.aid}?`)) return;
    const shipment = shipments.find(s => s.id === a.id);
    const reading = shipment && shipment.readings && shipment.readings.find(r => r.time === a.time && r.temp === a.temp);
    if (reading) reading.alertDeleted = true;
    alerts = alerts.filter(item => item.aid !== aid);
    saveState();
    renderAll();
  };

  /* ---------- Cancellation Approvals Queue ---------- */
  function renderRequests() {
    const pending = cancellations.filter(c => c.state === "Pending").length;
    $("navCancelBadge").textContent = pending;
    $("pendingCancelBadge").textContent = `${pending} Pending Decisions`;

    const isOperator = currentUser && currentUser.role === "Warehouse Operator";

    $("cancellationsList").innerHTML = cancellations.map(c => {
      const isPending = c.state === "Pending";
      const isApproved = c.state === "Approved";
      const badgeClass = isPending ? "bg-warning text-dark" : (isApproved ? "bg-success" : "bg-danger");

      return `
        <div class="alert-card-v2 mb-3 bg-white ${isApproved ? 'border-success' : (isPending ? 'border-warning' : 'border-danger')}">
          <div class="d-flex flex-wrap justify-content-between align-items-start gap-2">
            <div>
              <div class="d-flex align-items-center gap-2 mb-2">
                <span class="fs-6 fw-bold font-monospace text-dark">${esc(c.shipmentId)}</span>
                ${c.cargo ? `<span class="badge bg-light text-dark border">${esc(c.cargo)}</span>` : ""}
                <span class="badge ${badgeClass} px-2 py-1">${c.state}</span>
              </div>
              <div class="small mb-1">
                <strong>Justification:</strong> <span class="fw-semibold text-danger">${esc(c.reason)}</span>
              </div>
              <div class="small text-muted mb-2">
                <i class="bi bi-person me-1"></i>Requested by: <strong>${esc(c.requestedBy)}</strong> | <i class="bi bi-clock me-1"></i>${esc(c.time)}
              </div>
              ${c.notes ? `<div class="small text-secondary fst-italic mb-2 bg-light p-2 rounded-3 border">"${esc(c.notes)}"</div>` : ""}
              ${c.resolvedBy ? `<div class="small text-dark mt-1"><strong>Decision by:</strong> ${esc(c.resolvedBy)} at ${esc(c.resolvedAt || "")}</div>` : ""}
            </div>
            <div>
              ${isPending && isOperator ? `
                <div class="btn-group">
                  <button class="btn btn-sm btn-success px-3" onclick="handleCancelRequest('${c.id}', true)">
                    <i class="bi bi-check-circle me-1"></i>Approve Cancellation
                  </button>
                  <button class="btn btn-sm btn-outline-danger px-3 ms-1" onclick="handleCancelRequest('${c.id}', false)">
                    <i class="bi bi-x-circle me-1"></i>Reject
                  </button>
                </div>
              ` : `<span class="badge ${badgeClass} p-2">${c.state}</span>`}
            </div>
          </div>
        </div>
      `;
    }).join("") || '<p class="text-muted small text-center my-4">No cancellation requests currently pending approval.</p>';
  }

  window.handleCancelRequest = (reqId, approved) => {
    const req = cancellations.find(c => c.id === reqId);
    if (!req) return;

    const opName = currentUser ? currentUser.name : "Sourabh";
    const s = shipments.find(item => item.id === req.shipmentId);

    if (approved) {
      req.state = "Approved";
      req.resolvedBy = `${opName} (Warehouse Operator)`;
      req.resolvedAt = stamp();

      if (s) {
        s.status = "Cancelled";
        s.cancelReason = req.reason;
        s.cancelNotes = req.notes;
        s.cancelRequestedBy = req.requestedBy;
        s.cancelApprovedBy = `${opName} (Warehouse Operator)`;
        s.cancelledAt = stamp();
      }

      // Close active temp alerts for this cancelled shipment
      alerts = alerts.filter(a => !(a.id === req.shipmentId && a.type !== "Cancellation" && a.state !== "Resolved"));

      alerts.unshift({
        aid: "ALT-CAN-" + (seq++),
        id: req.shipmentId,
        cargo: s ? s.cargo : (req.cargo || ""),
        type: "Cancellation",
        decision: "Approved",
        status: "Approved",
        state: "Active",
        title: `Cancellation Request Approved: ${req.shipmentId}`,
        message: `Your cancellation request for consignment ${req.shipmentId}${s ? ` (${s.cargo})` : ""} was APPROVED by Warehouse Operator (${opName}). Package has been archived under Cancelled Records.`,
        time: stamp(),
        resolvedBy: `${opName} (Warehouse Operator)`
      });

      managerNotifications.unshift({
        id: "NOTIF-" + (seq++),
        shipmentId: req.shipmentId,
        type: "Approved",
        title: `Cancellation Approved: ${req.shipmentId}`,
        message: `Cancellation for consignment ${req.shipmentId}${s ? ` (${s.cargo})` : ""} was APPROVED by Warehouse Operator (${opName}). Package moved to Cancelled tab.`,
        time: stamp()
      });

      alert(`Cancellation request for ${req.shipmentId} APPROVED.\nAudit trail updated and Logistics Manager notified.`);
    } else {
      req.state = "Rejected";
      req.resolvedBy = `${opName} (Warehouse Operator)`;
      req.resolvedAt = stamp();

      alerts.unshift({
        aid: "ALT-CAN-" + (seq++),
        id: req.shipmentId,
        cargo: s ? s.cargo : (req.cargo || ""),
        type: "Cancellation",
        decision: "Rejected",
        status: "Rejected",
        state: "Active",
        title: `Cancellation Request Rejected: ${req.shipmentId}`,
        message: `Your cancellation request for consignment ${req.shipmentId}${s ? ` (${s.cargo})` : ""} was REJECTED by Warehouse Operator (${opName}). Package remains Active in transit.`,
        time: stamp(),
        resolvedBy: `${opName} (Warehouse Operator)`
      });

      managerNotifications.unshift({
        id: "NOTIF-" + (seq++),
        shipmentId: req.shipmentId,
        type: "Rejected",
        title: `Cancellation Rejected: ${req.shipmentId}`,
        message: `Cancellation request for package ${req.shipmentId} was REJECTED by Warehouse Operator (${opName}). Package remains Active.`,
        time: stamp()
      });

      alert(`Cancellation request for ${req.shipmentId} REJECTED.\nLogistics Manager has been notified.`);
    }

    saveState();
    renderAll();
  };

  /* ---------- Delivered Section ---------- */
  function renderDelivered() {
    const list = shipments.filter(s => s.status === "Delivered");
    $("navDeliveredBadge").textContent = list.length;
    $("deliveredBody").innerHTML = list.map(s => `
      <tr>
        <td class="fw-bold font-monospace text-primary"><i class="bi bi-check2-circle text-success me-1"></i>${esc(s.id)}</td>
        <td><strong>${esc(s.cargo)}</strong></td>
        <td class="small text-muted">${esc(s.origin)} <i class="bi bi-arrow-right text-muted mx-1"></i> ${esc(s.dest)}</td>
        <td class="font-monospace small">${s.min}°C to ${s.max}°C</td>
        <td class="fw-bold font-monospace">${latestOf(s).temp}°C</td>
        <td class="small text-muted">${esc(s.deliveredAt || "—")}</td>
        <td class="text-end">
          <button class="btn btn-sm btn-crm-outline py-0" onclick="showDetails('${s.id}')">Diagnostics</button>
          ${currentUser && currentUser.role === "Logistics Manager" ? `
            <button class="btn btn-sm btn-outline-danger py-0 ms-1" onclick="promptDeleteShipment('${s.id}')" title="Delete record">
              <i class="bi bi-trash"></i>
            </button>
          ` : ""}
        </td>
      </tr>`).join("") || `<tr><td colspan="7" class="text-center text-muted py-4">No delivered consignments recorded in archive.</td></tr>`;
  }

  /* ---------- Cancelled Section ---------- */
  function renderCancelled() {
    const list = shipments.filter(s => s.status === "Cancelled");
    $("navCancelledBadge").textContent = list.length;
    $("cancelledBody").innerHTML = list.map(s => `
      <tr>
        <td class="fw-bold font-monospace text-danger text-decoration-line-through">${esc(s.id)}</td>
        <td><strong>${esc(s.cargo)}</strong></td>
        <td class="small text-muted">${esc(s.origin)} <i class="bi bi-arrow-right text-muted mx-1"></i> ${esc(s.dest)}</td>
        <td class="fw-semibold text-danger">${esc(s.cancelReason || "—")}</td>
        <td class="small fst-italic text-muted">${esc(s.cancelNotes || "—")}</td>
        <td class="small text-muted">${esc(s.cancelRequestedBy || "—")}</td>
        <td class="small text-success fw-semibold">${esc(s.cancelApprovedBy || "Sourabh (Warehouse Operator)")}</td>
        <td class="small text-muted">${esc(s.cancelledAt || "—")}</td>
        <td class="text-end">
          <button class="btn btn-sm btn-crm-outline py-0" onclick="showDetails('${s.id}')">Diagnostics</button>
          ${currentUser && currentUser.role === "Logistics Manager" ? `
            <button class="btn btn-sm btn-outline-danger py-0 ms-1" onclick="promptDeleteShipment('${s.id}')" title="Delete record">
              <i class="bi bi-trash"></i>
            </button>
          ` : ""}
        </td>
      </tr>`).join("") || `<tr><td colspan="9" class="text-center text-muted py-4">No cancelled consignments recorded.</td></tr>`;
  }

  /* ---------- IoT Device Fleet Module (New V2.0) ---------- */
  function renderDevices() {
    const grid = $("deviceFleetGrid");
    if (!grid) return;

    const active = activeShipments();
    grid.innerHTML = active.map((s, idx) => {
      const sensorId = `SEN-T${101 + idx}`;
      const latest = latestOf(s);
      const cond = evaluateTemp(latest.temp, s.min, s.max);
      const battery = 88 - (idx * 4); // Simulated healthy battery levels
      const signal = -64 - (idx * 3); // Simulated strong RF signal in dBm

      return `
        <div class="col-12 col-md-6 col-lg-3">
          <div class="device-card-v2">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <span class="fw-bold font-monospace text-primary">${sensorId}</span>
              <span class="badge bg-success-subtle text-success border border-success"><i class="bi bi-wifi me-1"></i>Online</span>
            </div>
            <div class="small text-muted mb-2">Associated Cargo: <strong>${esc(s.cargo)}</strong> (${esc(s.id)})</div>
            <div class="d-flex justify-content-between small text-muted mb-1">
              <span>Battery: <strong>${battery}%</strong></span>
              <span>RF: <strong>${signal} dBm</strong></span>
            </div>
            <div class="device-signal-bar mb-3">
              <div class="device-signal-fill" style="width: ${battery}%;"></div>
            </div>
            <div class="d-flex justify-content-between align-items-center small pt-2 border-top">
              <span class="text-muted">Last Ping: <strong>${latest.time}</strong></span>
              <span class="fw-bold font-monospace ${cond.text}">${latest.temp > 0 ? "+" : ""}${latest.temp}°C</span>
            </div>
          </div>
        </div>
      `;
    }).join("");
  }

  /* ---------- Settings & Profile View (New V2.0) ---------- */
  function renderSettings() {
    if (!currentUser) return;
    const profile = PROFILES[currentUser.username] || {
      name: currentUser.name,
      role: currentUser.role,
      duty: "Cold-chain governance and logistics supervision",
      details: { "Email": `${currentUser.username.toLowerCase()}@coldchain.io` }
    };

    if ($("settingsProfileName")) $("settingsProfileName").textContent = profile.name;
    if ($("settingsProfileRole")) $("settingsProfileRole").textContent = profile.role;

    const detailsList = $("settingsProfileDetails");
    if (detailsList && profile.details) {
      detailsList.innerHTML = Object.keys(profile.details).map(label => `
        <dt class="col-5 text-secondary fw-semibold mb-2">${esc(label)}</dt>
        <dd class="col-7 mb-2 text-dark font-monospace">${esc(profile.details[label] || "—")}</dd>
      `).join("");
    }
  }

  /* ---------- CSV Export Functionality (New V2.0) ---------- */
  function exportToCSV(filename, rows) {
    const processRow = row => row.map(val => {
      let v = String(val ?? "");
      if (v.search(/("|,|\n)/g) >= 0) v = `"${v.replace(/"/g, '""')}"`;
      return v;
    }).join(",");

    const csvContent = "data:text/csv;charset=utf-8," + rows.map(processRow).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Bind Export Buttons
  if ($("btnExportShipmentsCSV")) {
    $("btnExportShipmentsCSV").onclick = () => {
      const headers = ["Shipment ID", "Cargo", "Origin", "Destination", "Min Temp (°C)", "Max Temp (°C)", "Latest Temp (°C)", "Status"];
      const rows = [headers, ...activeShipments().map(s => [
        s.id, s.cargo, s.origin, s.dest, s.min, s.max, latestOf(s).temp, s.status
      ])];
      exportToCSV(`coldchain_active_shipments_${Date.now()}.csv`, rows);
    };
  }

  if ($("btnExportDeliveredCSV")) {
    $("btnExportDeliveredCSV").onclick = () => {
      const headers = ["Shipment ID", "Cargo", "Origin", "Destination", "Safe Limits", "Final Temp (°C)", "Delivered At"];
      const list = shipments.filter(s => s.status === "Delivered");
      const rows = [headers, ...list.map(s => [
        s.id, s.cargo, s.origin, s.dest, `${s.min}°C to ${s.max}°C`, latestOf(s).temp, s.deliveredAt
      ])];
      exportToCSV(`coldchain_delivered_archive_${Date.now()}.csv`, rows);
    };
  }

  if ($("btnExportCancelledCSV")) {
    $("btnExportCancelledCSV").onclick = () => {
      const headers = ["Shipment ID", "Cargo", "Origin", "Destination", "Reason", "Remarks", "Requested By", "Approved By", "Cancelled At"];
      const list = shipments.filter(s => s.status === "Cancelled");
      const rows = [headers, ...list.map(s => [
        s.id, s.cargo, s.origin, s.dest, s.cancelReason, s.cancelNotes, s.cancelRequestedBy, s.cancelApprovedBy, s.cancelledAt
      ])];
      exportToCSV(`coldchain_cancelled_audit_${Date.now()}.csv`, rows);
    };
  }

  if ($("btnDownloadFullAudit")) {
    $("btnDownloadFullAudit").onclick = () => {
      const headers = ["Record Type", "ID", "Cargo", "Route", "Telemetry", "Decision / State", "Audit Timestamp"];
      const rows = [headers];
      shipments.forEach(s => {
        rows.push(["Shipment", s.id, s.cargo, `${s.origin} -> ${s.dest}`, `${latestOf(s).temp}°C`, s.status, stamp()]);
      });
      cancellations.forEach(c => {
        rows.push(["Cancellation Request", c.shipmentId, c.cargo, "N/A", c.reason, c.state, c.time]);
      });
      alerts.forEach(a => {
        rows.push(["Incident Alert", a.id, a.cargo, "N/A", `${a.temp}°C`, a.state, a.time]);
      });
      exportToCSV(`coldchain_master_gxp_audit_${Date.now()}.csv`, rows);
    };
  }

  /* ---------- Resolve Modal (Logistics Manager Regulate Temp) ---------- */
  window.openResolveModal = (aid) => {
    const alertItem = alerts.find(a => a.aid === aid && a.state !== "Resolved");
    const shipment = alertItem && shipments.find(s => s.id === alertItem.id);
    if (!shipment) return;

    $("resolveAlertId").value = aid;
    $("resolveShipmentId").value = shipment.id;
    $("resShipmentRef").textContent = shipment.id;
    $("resCargo").textContent = shipment.cargo;
    $("resSafeRange").textContent = `${shipment.min}°C to ${shipment.max}°C`;
    $("resCurrentTemp").textContent = `${alertItem.temp}°C`;
    $("regulatedTempInput").value = "";
    $("resolveWarningBox").classList.add("d-none");
    openModal("resolveModal");
  };

  $("resolveForm").onsubmit = (e) => {
    e.preventDefault();
    const shipment = shipments.find(s => s.id === $("resolveShipmentId").value);
    const alertItem = alerts.find(a => a.aid === $("resolveAlertId").value);
    const regTemp = parseFloat($("regulatedTempInput").value);

    if (isNaN(regTemp) || regTemp < shipment.min || regTemp > shipment.max) {
      $("resolveWarningMsg").textContent = `Warning: Regulated reading must be within authorized range (${shipment.min}°C to ${shipment.max}°C).`;
      $("resolveWarningBox").classList.remove("d-none");
      return;
    }

    shipment.readings.push({ temp: regTemp, time: nowTime(), alertDeleted: false });
    if (alertItem) alertItem.state = "Resolved";
    saveState();
    closeModal("resolveModal");
    renderAll();
  };

  /* ---------- Cancel Shipment Modal (Manager Initiates Request) ---------- */
  window.openCancelModal = (id) => {
    const s = shipments.find(item => item.id === id);
    if (!s) return;
    $("cancelShipmentId").value = s.id;
    $("cancelShipmentLabel").textContent = `${s.id} (${s.cargo})`;
    $("cancelReasonSelect").selectedIndex = 0;
    $("customReasonBox").classList.add("d-none");
    $("customReasonError").classList.add("d-none");
    $("customReasonInput").value = "";
    $("cancelReasonNotes").value = "";
    openModal("cancelRequestModal");
  };

  $("cancelReasonSelect").onchange = () => {
    const isNone = $("cancelReasonSelect").value === "NONE";
    $("customReasonBox").classList.toggle("d-none", !isNone);
    $("customReasonError").classList.add("d-none");
    if (isNone) $("customReasonInput").focus();
  };

  $("cancelRequestForm").onsubmit = (e) => {
    e.preventDefault();
    const shipmentId = $("cancelShipmentId").value;
    let reason = $("cancelReasonSelect").value;
    if (reason === "NONE") {
      reason = $("customReasonInput").value.trim();
      if (!reason) {
        $("customReasonError").classList.remove("d-none");
        $("customReasonInput").focus();
        return;
      }
    }
    const notes = $("cancelReasonNotes").value.trim();
    const s = shipments.find(item => item.id === shipmentId);

    cancellations.unshift({
      id: "REQ-" + (seq++),
      shipmentId,
      cargo: s ? s.cargo : "",
      reason,
      notes,
      requestedBy: currentUser ? `${currentUser.name} (Logistics Manager)` : "Logistics Manager",
      time: stamp(),
      state: "Pending"
    });

    closeModal("cancelRequestModal");
    saveState();
    renderAll();
    alert(`Cancellation request for consignment ${shipmentId} dispatched to Warehouse Operator (Sourabh) for terminal verification.`);
  };

  /* ---------- Register New Shipment ---------- */
  const setupAddModal = () => {
    $("addShipmentForm").reset();
    $("addShipmentError").classList.add("d-none");
    openModal("addShipmentModal");
  };

  $("btnOpenAddShipment").onclick = setupAddModal;
  if ($("btnOpenAddShipmentFromList")) {
    $("btnOpenAddShipmentFromList").onclick = setupAddModal;
  }

  $("addShipmentForm").onsubmit = (e) => {
    e.preventDefault();
    const id = $("newShipmentId").value.trim().toUpperCase();
    const min = parseFloat($("newMinTemp").value);
    const max = parseFloat($("newMaxTemp").value);
    const initialTemp = parseFloat($("newInitialTemp").value);
    let msg = "";

    if (!/^[A-Z0-9-]{3,12}$/.test(id)) msg = "Consignment ID must be 3 to 12 alphanumeric characters or dashes.";
    else if (shipments.some(s => s.id === id)) msg = "Consignment ID already exists in the system.";
    else if (min >= max) msg = "Minimum temperature threshold must be strictly below maximum.";
    else if (isNaN(initialTemp)) msg = "Please enter a valid initial telemetry reading.";

    if (msg) {
      $("addShipmentError").textContent = msg;
      $("addShipmentError").classList.remove("d-none");
      return;
    }
    $("addShipmentError").classList.add("d-none");

    shipments.unshift({
      id,
      cargo: $("newCargo").value.trim(),
      origin: $("newOrigin").value.trim(),
      dest: $("newDest").value.trim(),
      min,
      max,
      status: "Active",
      readings: [{ temp: initialTemp, time: nowTime(), alertDeleted: false }]
    });

    saveState();
    closeModal("addShipmentModal");
    $("addShipmentForm").reset();
    renderAll();
  };

  /* ---------- Mark Delivered (Operator Action) ---------- */
  window.markDelivered = (id) => {
    const s = shipments.find(item => item.id === id);
    if (s && confirm(`Mark consignment ${id} as delivered? It will move to the Delivered History archive.`)) {
      s.status = "Delivered";
      s.deliveredAt = stamp();
      saveState();
      renderAll();
    }
  };

  /* ---------- Delete Authorization (Manager Action) ---------- */
  window.promptDeleteShipment = (id) => {
    pendingDeleteShipmentId = id;
    $("deleteTargetShipmentId").textContent = id;
    $("deleteAuthUserId").value = currentUser ? currentUser.username : "";
    $("deleteAuthPassword").value = "";
    $("deleteAuthError").classList.add("d-none");
    openModal("deleteAuthModal");
  };

  $("deleteAuthForm").onsubmit = (e) => {
    e.preventDefault();
    const inputUser = $("deleteAuthUserId").value.trim().toLowerCase();
    const inputPass = $("deleteAuthPassword").value.trim();

    const matchedUser = USERS.find(u => u.username.toLowerCase() === inputUser && u.pass === inputPass);

    if (!matchedUser) {
      $("deleteAuthError").textContent = "Invalid User ID or Password. Deletion denied.";
      $("deleteAuthError").classList.remove("d-none");
      return;
    }

    if (matchedUser.role !== "Logistics Manager") {
      $("deleteAuthError").textContent = "Access denied: Only Logistics Managers are authorized to delete consignments.";
      $("deleteAuthError").classList.remove("d-none");
      return;
    }

    const targetId = pendingDeleteShipmentId;
    shipments = shipments.filter(item => item.id !== targetId);
    alerts = alerts.filter(a => a.id !== targetId);
    cancellations = cancellations.filter(c => c.shipmentId !== targetId);
    managerNotifications = managerNotifications.filter(n => n.shipmentId !== targetId);
    saveState();
    closeModal("deleteAuthModal");
    pendingDeleteShipmentId = null;
    renderAll();
  };

  $("btnDeleteDelivered").onclick = () => {
    const count = shipments.filter(s => s.status === "Delivered").length;
    if (!count) return alert("No delivered consignments to clear.");
    if (confirm(`Permanently remove all ${count} delivered records from the archive?`)) {
      shipments = shipments.filter(s => s.status !== "Delivered");
      saveState();
      renderAll();
    }
  };

  /* ---------- Detailed Diagnostics Modal with Chart ---------- */
  window.showDetails = (id) => {
    currentShipmentId = id;
    const s = shipments.find(item => item.id === id);
    if (!s) return;

    $("modalTitle").textContent = `${s.id} — ${s.cargo}`;
    $("modalLimits").textContent = `${s.min}°C to ${s.max}°C`;
    $("modalCurrent").textContent = `${latestOf(s).temp}°C`;
    $("modalSensorId").textContent = `SEN-IoT-${s.id.replace('SHP-', '')}`;
    $("addPingForm").classList.toggle("d-none", s.status !== "Active");

    // Chronological Ping stream table
    $("modalHistoryList").innerHTML = s.readings.slice().reverse().map(r => {
      const cond = evaluateTemp(r.temp, s.min, s.max);
      const deltaText = cond.delta > 0 ? `+${cond.delta}°C breach` : "Within limits";
      return `
        <tr>
          <td class="font-monospace small text-muted">${esc(r.time)}</td>
          <td class="font-monospace fw-bold ${cond.text}">${r.temp > 0 ? "+" : ""}${r.temp}°C</td>
          <td class="small text-muted">${deltaText}</td>
          <td>${statusPillHtml(cond.status)}</td>
        </tr>
      `;
    }).join("");

    // Render detailed shipment chart
    renderShipmentDetailChart(s);

    openModal("detailsModal");
  };

  function renderShipmentDetailChart(s) {
    if (!window.Chart) return;
    const ctx = document.getElementById("shipmentDetailChart");
    if (!ctx) return;

    if (shipmentDetailChartInstance) {
      shipmentDetailChartInstance.destroy();
    }

    const labels = s.readings.map(r => r.time);
    const data = s.readings.map(r => r.temp);
    const minLine = s.readings.map(() => s.min);
    const maxLine = s.readings.map(() => s.max);

    shipmentDetailChartInstance = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Observed Temp (°C)",
            data,
            borderColor: "#3478F6",
            backgroundColor: "rgba(52, 120, 246, 0.1)",
            borderWidth: 2.5,
            tension: 0.2,
            pointRadius: 4,
            pointBackgroundColor: "#3478F6",
            fill: true
          },
          {
            label: "Max Safe Bound",
            data: maxLine,
            borderColor: "#C2413B",
            borderDash: [4, 4],
            borderWidth: 1.5,
            pointRadius: 0,
            fill: false
          },
          {
            label: "Min Safe Bound",
            data: minLine,
            borderColor: "#17845D",
            borderDash: [4, 4],
            borderWidth: 1.5,
            pointRadius: 0,
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: "top", labels: { font: { family: "Inter", size: 10 } } }
        },
        scales: {
          y: { grid: { color: "#F8FAFC" } },
          x: { grid: { display: false } }
        }
      }
    });
  }

  $("addPingForm").onsubmit = (e) => {
    e.preventDefault();
    const s = shipments.find(item => item.id === currentShipmentId);
    if (!s) return;
    const val = parseFloat($("manualTempInput").value);
    if (isNaN(val)) return;
    s.readings.push({ temp: val, time: nowTime(), alertDeleted: false });
    $("manualTempInput").value = "";
    saveState();
    window.showDetails(currentShipmentId);
    renderAll();
  };

  /* ---------- IoT Simulation Trigger ---------- */
  $("btnSimulatePing").onclick = () => {
    const list = activeShipments();
    if (!list.length) return;
    list.forEach(s => s.readings.push({ temp: randomReading(s), time: nowTime(), alertDeleted: false }));
    renderAll();
  };

  if ($("searchInput")) $("searchInput").oninput = renderShipmentsTable;
  if ($("statusFilter")) $("statusFilter").onchange = renderShipmentsTable;
  if ($("cargoFilter")) $("cargoFilter").onchange = renderShipmentsTable;

  // Initialize Auth
  setAuth(currentUser);
});

/**
 * ===================================================================
 * COLDCHAIN MONITOR - APPLICATION CONTROLLER (script.js)
 * Course: Applied AI - Frontend Development Basics
 * Stack: HTML5, CSS3, Bootstrap 5, Vanilla JS DOM & LocalStorage
 * ===================================================================
 */

// 1. Authorized User Accounts
const USERS = [
  { username: "Arnav", pass: "123", name: "Arnav", role: "Logistics Manager" },
  { username: "Sourabh", pass: "123", name: "Sourabh", role: "Warehouse Operator" }
];

// 2. Individual Profiles
const PROFILES = {
  Arnav: {
    username: "Arnav",
    name: "Arnav",
    role: "Logistics Manager",
    badgeClass: "bg-primary",
    duty: "OJT project under Kshitij sir",
    details: {
      "Email": "arnavpratap60@gmail.com",
      "Phone": "852 8600 376",
      "Station / Hub": "Polaris School of Technology Bangalore",
      "Shift Hours": "08:00 - 17:00 IST"
    }
  },
  Sourabh: {
    username: "Sourabh",
    name: "Sourabh",
    role: "Warehouse Operator",
    badgeClass: "bg-teal text-white",
    duty: "OJT project under Kshitij sir",
    details: {
      "Email": "sourabh@coldchain.io",
      "Phone": "70195 885 90",
      "Station / Hub": "Polaris School of Technology Bangalore",
      "Shift Hours": "14:00 - 23:00 IST"
    }
  }
};

// 3. Baseline Shipments Sample (8 Active, 3 Delivered, 4 Cancelled)
const INITIAL_SHIPMENTS = [
  // --- 8 ACTIVE PACKAGES ---
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

const VIEWS = ["Dashboard", "Alerts", "Cancellations", "Delivered", "Cancelled"];
const STORAGE_VER = "v5_cancellation_alerts";

/* ---------- Helper Utilities ---------- */
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
    // ignore
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
let seq = Date.now();

alerts.forEach(a => { if (!a.aid) a.aid = "ALT-" + (seq++); });

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

/* ---------- Temperature Evaluator (Normal, Warning <2.0°C, Critical >=2.0°C) ---------- */
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

function statusBadge(status) {
  const icons = {
    Normal: "bi-check-circle-fill",
    Warning: "bi-exclamation-triangle-fill",
    Critical: "bi-x-octagon-fill"
  };
  return `<span class="badge-status badge-${status}"><i class="bi ${icons[status] || 'bi-info-circle'} me-1"></i>${status}</span>`;
}

function randomReading(s) {
  const roll = Math.random();
  if (roll < 0.34) {
    return +(s.min + Math.random() * (s.max - s.min)).toFixed(1);
  }
  const isHigh = Math.random() < 0.5;
  if (roll < 0.67) {
    const diff = 0.2 + Math.random() * 1.6;
    return +(isHigh ? s.max + diff : s.min - diff).toFixed(1);
  }
  const diff = 2.0 + Math.random() * 3.0;
  return +(isHigh ? s.max + diff : s.min - diff).toFixed(1);
}

/* ---------- Main DOM Application ---------- */
document.addEventListener("DOMContentLoaded", () => {

  // Auto-close handler for modals
  document.addEventListener("click", e => {
    const dismissBtn = e.target.closest("[data-bs-dismiss='modal']");
    if (dismissBtn) {
      const modalEl = dismissBtn.closest(".modal");
      if (modalEl) closeModal(modalEl.id);
    }
  });

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

  /* ---------- Authentication State & Access Rules ---------- */
  function setAuth(user) {
    currentUser = user;
    saveState();
    if (user) {
      $("loginSection").classList.add("d-none");
      $("appSection").classList.remove("d-none");
      $("navUserName").textContent = user.name;
      $("userRoleBadge").textContent = user.role;

      // Cancel requests tab ONLY for Warehouse Operator
      const isOperator = user.role === "Warehouse Operator";
      const navCancelItem = $("navCancelItem");
      if (navCancelItem) {
        navCancelItem.classList.toggle("d-none", !isOperator);
      }

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

  $("loginForm").onsubmit = (e) => {
    e.preventDefault();
    tryLogin($("loginUsername").value, $("loginPassword").value);
  };

  $("btnLogout").onclick = () => setAuth(null);

  /* ---------- Single Profile Modal on Name/Avatar Click ---------- */
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
        <dt class="col-5 text-secondary fw-semibold">${esc(label)}</dt>
        <dd class="col-7 mb-2 text-dark font-monospace">${esc(profile.details[label] || "—")}</dd>
      `).join("");
    }

    openModal("userProfileModal");
  }

  const userProfileChip = $("userProfileChip");
  if (userProfileChip) {
    userProfileChip.onclick = openUserProfileModal;
    userProfileChip.onkeydown = (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openUserProfileModal();
      }
    };
  }

  /* ---------- Tab Navigation ---------- */
  function switchView(name) {
    currentActiveView = name;
    VIEWS.forEach(v => {
      const viewEl = $("view" + v);
      const navBtn = $("nav" + v);
      if (viewEl) viewEl.classList.toggle("d-none", v !== name);
      if (navBtn) navBtn.classList.toggle("active", v === name);
    });
    renderAll();
  }

  VIEWS.forEach(v => {
    const btn = $("nav" + v);
    if (btn) btn.onclick = () => switchView(v);
  });

  if ($("kpiCriticalCard")) {
    $("kpiCriticalCard").onclick = () => switchView("Alerts");
    $("kpiCriticalCard").onkeydown = (e) => { if (e.key === "Enter") switchView("Alerts"); };
  }

  /* ---------- Master Render Pipeline ---------- */
  function renderAll() {
    runEvaluation();
    renderDashboard();
    renderAlerts();
    renderRequests();
    renderDelivered();
    renderCancelled();
  }

  /* ---------- Logistics Manager Notifications (Operator Decisions Banner) ---------- */
  function renderManagerNotifications() {
    const container = $("managerNotificationsContainer");
    if (!container) return;

    const isManager = currentUser && currentUser.role === "Logistics Manager";
    if (!isManager || !managerNotifications || managerNotifications.length === 0) {
      container.innerHTML = "";
      return;
    }

    container.innerHTML = `
      <div class="card border-0 shadow-sm mb-3" style="background: #f8fafc; border: 1px solid #e2e8f0 !important; border-radius: 10px;">
        <div class="card-header bg-white py-2 px-3 d-flex justify-content-between align-items-center" style="border-bottom: 1px solid #e2e8f0;">
          <div class="fw-bold text-dark d-flex align-items-center gap-2 small">
            <i class="bi bi-bell-fill text-primary fs-6"></i>
            <span>Warehouse Operator Cancellation Decisions</span>
            <span class="badge bg-primary rounded-pill">${managerNotifications.length}</span>
          </div>
          <button class="btn btn-sm btn-link text-decoration-none text-muted py-0 small" onclick="clearAllManagerNotifications()">
            <i class="bi bi-check2-all me-1"></i>Dismiss All
          </button>
        </div>
        <div class="card-body p-2">
          ${managerNotifications.map(n => {
            const isApproved = n.type === "Approved";
            return `
              <div class="alert ${isApproved ? "alert-success border-success" : "alert-danger border-danger"} d-flex justify-content-between align-items-start py-2 px-3 mb-2 shadow-sm" style="border-radius: 8px;">
                <div class="d-flex align-items-start gap-2">
                  <i class="bi ${isApproved ? "bi-check-circle-fill text-success" : "bi-x-circle-fill text-danger"} fs-5 mt-1"></i>
                  <div>
                    <div class="fw-bold ${isApproved ? "text-success" : "text-danger"}">${esc(n.title)}</div>
                    <div class="text-dark small">${esc(n.message)}</div>
                    <div class="text-muted" style="font-size: 0.75rem;">${esc(n.time)}</div>
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

  /* ---------- Dashboard Table with Role-Based Action Buttons ---------- */
  function renderDashboard() {
    renderManagerNotifications();

    const q = $("searchInput").value.trim().toLowerCase();
    const filter = $("statusFilter").value;
    let normal = 0, warn = 0, crit = 0;
    const rows = [];

    const isOperator = currentUser && currentUser.role === "Warehouse Operator";
    const isManager = currentUser && currentUser.role === "Logistics Manager";

    activeShipments().forEach(s => {
      const latest = latestOf(s);
      const cond = evaluateTemp(latest.temp, s.min, s.max);
      if (cond.status === "Normal") normal++;
      if (cond.status === "Warning") warn++;
      if (cond.status === "Critical") crit++;

      const match = (s.id + " " + s.cargo + " " + s.origin + " " + s.dest).toLowerCase().includes(q);
      if (!match || (filter !== "ALL" && cond.status !== filter)) return;

      const hasPendingCancel = cancellations.some(c => c.shipmentId === s.id && c.state === "Pending");

      // Base Action: View History for everyone
      let actionButtons = `
        <button class="btn btn-sm btn-outline-primary py-0" onclick="showDetails('${s.id}')" title="View Diagnostics & History">
          History
        </button>
      `;

      // Tick button (Mark Delivered) ONLY for Warehouse Operator
      if (isOperator) {
        actionButtons += `
          <button class="btn btn-sm btn-outline-success py-0 ms-1" onclick="markDelivered('${s.id}')" title="Mark as Delivered">
            <i class="bi bi-check-lg"></i>
          </button>
        `;
      }

      // Cancel and Delete buttons ONLY for Logistics Manager
      if (isManager) {
        if (hasPendingCancel) {
          actionButtons += `
            <button class="btn btn-sm btn-outline-secondary py-0 ms-1 disabled" disabled title="Cancellation request pending Warehouse Operator approval">
              <i class="bi bi-hourglass-split"></i>
            </button>
            <button class="btn btn-sm btn-outline-danger py-0 ms-1" onclick="promptDeleteShipment('${s.id}')" title="Delete Shipment">
              <i class="bi bi-trash"></i>
            </button>
          `;
        } else {
          actionButtons += `
            <button class="btn btn-sm btn-outline-warning py-0 ms-1 text-dark" onclick="openCancelModal('${s.id}')" title="Request Cancellation">
              <i class="bi bi-x-circle"></i>
            </button>
            <button class="btn btn-sm btn-outline-danger py-0 ms-1" onclick="promptDeleteShipment('${s.id}')" title="Delete Shipment">
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

      rows.push(`
        <tr>
          <td class="fw-bold">${esc(s.id)}</td>
          <td>${esc(s.cargo)}</td>
          <td class="small text-muted">${esc(s.origin)} → ${esc(s.dest)}</td>
          <td class="font-monospace small">${s.min}°C to ${s.max}°C</td>
          <td class="fw-bold ${cond.text}">${latest.temp > 0 ? "+" : ""}${latest.temp}°C</td>
          <td>${statusBadge(cond.status)}${cancelPendingBadge}</td>
          <td class="text-end text-nowrap">${actionButtons}</td>
        </tr>`);
    });

    $("statTotal").textContent = activeShipments().length;
    $("statNormal").textContent = normal;
    $("statWarning").textContent = warn;
    $("statCritical").textContent = crit;
    $("shipmentTableBody").innerHTML = rows.join("") ||
      `<tr><td colspan="7" class="text-center text-muted py-3">No active shipments match your search.</td></tr>`;
  }

  /* ---------- Alerts View (Shows Temperature Alerts & Cancellation Decisions) ---------- */
  function renderAlerts() {
    const unresolved = alerts.filter(a => a.state !== "Resolved").length;
    $("navAlertsBadge").textContent = unresolved;
    $("unresolvedBadge").textContent = `${unresolved} Active`;

    const isOperator = currentUser && currentUser.role === "Warehouse Operator";
    const isManager = currentUser && currentUser.role === "Logistics Manager";

    $("alertsList").innerHTML = alerts.map(a => {
      // 1. Cancellation Decision Alert (Approved or Rejected by Warehouse Operator)
      if (a.type === "Cancellation") {
        const isApproved = a.decision === "Approved";
        const badgeClass = isApproved ? "bg-success" : "bg-danger";
        const borderClass = isApproved ? "border-success" : "border-danger";
        const iconClass = isApproved ? "bi-check-circle-fill text-success" : "bi-x-circle-fill text-danger";

        return `
          <div class="alert-item mb-3 p-3 border rounded shadow-sm bg-white ${borderClass}">
            <div class="d-flex flex-wrap justify-content-between align-items-start gap-2">
              <div class="d-flex align-items-start gap-2">
                <i class="bi ${iconClass} fs-4 mt-1"></i>
                <div>
                  <div class="d-flex align-items-center gap-2 mb-1">
                    <strong class="fs-6">${esc(a.id)}</strong>
                    ${a.cargo ? `<span class="badge bg-light text-dark border">${esc(a.cargo)}</span>` : ""}
                    <span class="badge ${badgeClass}">${esc(a.decision)}</span>
                    <span class="badge ${a.state === 'Resolved' ? 'bg-secondary' : 'bg-primary'}">${a.state === 'Resolved' ? 'Acknowledged' : 'New Notice'}</span>
                  </div>
                  <div class="fw-semibold ${isApproved ? 'text-success' : 'text-danger'} mb-1">
                    ${esc(a.title)}
                  </div>
                  <div class="text-dark small mb-1">
                    ${esc(a.message)}
                  </div>
                  <div class="small text-muted">
                    <i class="bi bi-person-check me-1"></i>Decision by: <strong>${esc(a.resolvedBy || "Warehouse Operator")}</strong> | <i class="bi bi-clock me-1"></i>${esc(a.time)}
                  </div>
                </div>
              </div>
              <div class="d-flex align-items-center gap-1">
                ${a.state !== "Resolved" ? `
                  <button class="btn btn-sm btn-outline-secondary py-0" onclick="acknowledgeAlert('${a.aid}')" title="Acknowledge & Mark Read">
                    <i class="bi bi-check2 me-1"></i>Acknowledge
                  </button>
                ` : '<span class="badge bg-secondary">Read</span>'}
                <button class="btn btn-sm btn-outline-danger py-0 ms-1" onclick="deleteAlert('${a.aid}')" title="Delete Alert">
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </div>
          </div>
        `;
      }

      // 2. Standard Telemetry Temperature Excursion Alert
      const isResolved = a.state === "Resolved";

      const managerNotificationHtml = (isManager && a.requested && !isResolved) ? `
        <div class="alert alert-warning py-1 px-2 my-2 small d-flex align-items-center gap-2 border-warning">
          <i class="bi bi-envelope-exclamation-fill text-danger fs-6"></i>
          <div>
            <strong>Warehouse Operator Request:</strong> Package is in <span class="text-danger fw-bold">${esc(a.status)}</span> condition, please resolve it.
          </div>
        </div>
      ` : "";

      let actionControlHtml = "";
      if (!isResolved) {
        if (isOperator) {
          if (!a.requested) {
            actionControlHtml = `
              <button class="btn btn-sm btn-warning py-0" onclick="sendAlertRequest('${a.aid}')" title="Send alert notice to Logistics Manager">
                <i class="bi bi-send me-1"></i>Send Request
              </button>
            `;
          } else {
            actionControlHtml = `
              <span class="badge bg-warning text-dark border">
                <i class="bi bi-check2-circle me-1"></i>Request Sent to Logistics Manager
              </span>
            `;
          }
        } else if (isManager) {
          actionControlHtml = `
            <button class="btn btn-sm btn-success py-0" onclick="openResolveModal('${a.aid}')">
              <i class="bi bi-sliders me-1"></i>Resolve
            </button>
          `;
        }
      } else {
        actionControlHtml = '<span class="badge bg-secondary">Closed</span>';
      }

      return `
        <div class="alert-item ${a.status} ${a.state} mb-2">
          <div class="d-flex flex-wrap justify-content-between align-items-center gap-2">
            <div>
              <strong>${esc(a.id)}</strong> (${esc(a.cargo)}) — Recorded: <span class="text-danger fw-bold">${a.temp}°C</span> ${statusBadge(a.status)}
              <div class="small text-muted">Status: <strong>${esc(a.state)}</strong> | Violation Time: ${esc(a.time)}</div>
            </div>
            <div>
              ${actionControlHtml}
              <button class="btn btn-sm btn-outline-danger py-0 ms-1" onclick="deleteAlert('${a.aid}')" title="Delete Alert">
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </div>
          ${managerNotificationHtml}
        </div>
      `;
    }).join("") || '<p class="text-muted small text-center my-3">No active temperature alerts. All shipments are within safe bounds.</p>';
  }

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
    alert(`Request sent to Logistics Manager: Package ${a.id} is in ${a.status} condition, please resolve it.`);
  };

  // Delete All Alerts feature
  const btnDeleteAllAlerts = $("btnDeleteAllAlerts");
  if (btnDeleteAllAlerts) {
    btnDeleteAllAlerts.onclick = () => {
      if (!alerts.length) {
        alert("No incident alerts to delete.");
        return;
      }
      if (confirm(`Are you sure you want to delete all ${alerts.length} incident alerts?`)) {
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
  }

  window.deleteAlert = (aid) => {
    const a = alerts.find(item => item.aid === aid);
    if (!a || !confirm(`Delete alert ${a.aid} for ${a.id}?`)) return;
    const shipment = shipments.find(s => s.id === a.id);
    const reading = shipment && shipment.readings && shipment.readings.find(r => r.time === a.time && r.temp === a.temp);
    if (reading) reading.alertDeleted = true;
    alerts = alerts.filter(item => item.aid !== aid);
    saveState();
    renderAll();
  };

  /* ---------- Cancellation Requests Queue (Warehouse Operator Reviews & Approves/Rejects) ---------- */
  function renderRequests() {
    const pending = cancellations.filter(c => c.state === "Pending").length;
    $("navCancelBadge").textContent = pending;
    $("pendingCancelBadge").textContent = `${pending} Pending`;

    const isOperator = currentUser && currentUser.role === "Warehouse Operator";

    $("cancellationsList").innerHTML = cancellations.map(c => `
      <div class="request-item ${c.state} mb-3 p-3 border rounded shadow-sm bg-white">
        <div class="d-flex flex-wrap justify-content-between align-items-start gap-2">
          <div>
            <div class="d-flex align-items-center gap-2 mb-1">
              <span class="fs-6 fw-bold text-dark">${esc(c.shipmentId)}</span>
              ${c.cargo ? `<span class="badge bg-light text-dark border">${esc(c.cargo)}</span>` : ""}
              <span class="badge ${c.state === "Pending" ? "bg-warning text-dark" : (c.state === "Approved" ? "bg-success" : "bg-danger")}">${c.state}</span>
            </div>
            <div class="small mb-1">
              <strong>Reason:</strong> <span class="fw-semibold text-danger">${esc(c.reason)}</span>
            </div>
            <div class="small text-muted mb-1">
              <i class="bi bi-person me-1"></i>Requested by: <strong>${esc(c.requestedBy)}</strong> | <i class="bi bi-clock me-1"></i>${esc(c.time)}
            </div>
            ${c.notes ? `<div class="small text-secondary fst-italic mb-1 bg-light p-2 rounded">"${esc(c.notes)}"</div>` : ""}
            ${c.resolvedBy ? `<div class="small text-dark mt-1"><strong>Decision by:</strong> ${esc(c.resolvedBy)} at ${esc(c.resolvedAt || "")}</div>` : ""}
          </div>
          <div>
            ${c.state === "Pending" && isOperator ? `
              <div class="btn-group">
                <button class="btn btn-sm btn-success px-3" onclick="handleCancelRequest('${c.id}', true)">
                  <i class="bi bi-check-circle me-1"></i>Approve
                </button>
                <button class="btn btn-sm btn-outline-danger px-3 ms-1" onclick="handleCancelRequest('${c.id}', false)">
                  <i class="bi bi-x-circle me-1"></i>Reject
                </button>
              </div>
            ` : `<span class="badge ${c.state === "Approved" ? "bg-success" : (c.state === "Rejected" ? "bg-danger" : "bg-secondary")} p-2">${c.state}</span>`}
          </div>
        </div>
      </div>`).join("") || '<p class="text-muted small text-center my-3">No cancellation requests in queue.</p>';
  }

  /* ---------- Cancellation Decision Handler (Approved / Rejected) ---------- */
  window.handleCancelRequest = (reqId, approved) => {
    const req = cancellations.find(c => c.id === reqId);
    if (!req) return;

    const opName = currentUser ? currentUser.name : "Sourabh";
    const s = shipments.find(item => item.id === req.shipmentId);

    if (approved) {
      // 1. Mark cancellation request as Approved
      req.state = "Approved";
      req.resolvedBy = `${opName} (Warehouse Operator)`;
      req.resolvedAt = stamp();

      // 2. Set shipment status to Cancelled (moves package to Cancelled Orders tab)
      if (s) {
        s.status = "Cancelled";
        s.cancelReason = req.reason;
        s.cancelNotes = req.notes;
        s.cancelRequestedBy = req.requestedBy;
        s.cancelApprovedBy = `${opName} (Warehouse Operator)`;
        s.cancelledAt = stamp();
      }

      // Close active temperature alerts for this cancelled shipment
      alerts = alerts.filter(a => !(a.id === req.shipmentId && a.type !== "Cancellation" && a.state !== "Resolved"));

      // 3. Post Approved Message directly to the Alerts Section
      alerts.unshift({
        aid: "ALT-CAN-" + (seq++),
        id: req.shipmentId,
        cargo: s ? s.cargo : (req.cargo || ""),
        type: "Cancellation",
        decision: "Approved",
        status: "Approved",
        state: "Active",
        title: `Cancellation Request Approved: ${req.shipmentId}`,
        message: `Your cancellation request for package ${req.shipmentId}${s ? ` (${s.cargo})` : ""} was APPROVED by Warehouse Operator (${opName}). The package has been moved to Cancelled Orders.`,
        time: stamp(),
        resolvedBy: `${opName} (Warehouse Operator)`
      });

      // Also record in Manager Notifications banner
      managerNotifications.unshift({
        id: "NOTIF-" + (seq++),
        shipmentId: req.shipmentId,
        type: "Approved",
        title: `Cancellation Approved: ${req.shipmentId}`,
        message: `Cancellation for package ${req.shipmentId}${s ? ` (${s.cargo})` : ""} was APPROVED by Warehouse Operator (${opName}). Package has been moved to Cancelled tab.`,
        time: stamp()
      });

      alert(`Cancellation request for ${req.shipmentId} APPROVED.\nA notification message has been sent to the Alerts section and Logistics Manager.`);
    } else {
      // 1. Mark cancellation request as Rejected
      req.state = "Rejected";
      req.resolvedBy = `${opName} (Warehouse Operator)`;
      req.resolvedAt = stamp();

      // Package remains ACTIVE (NOT moved to Cancelled)

      // 2. Post Rejected Message directly to the Alerts Section
      alerts.unshift({
        aid: "ALT-CAN-" + (seq++),
        id: req.shipmentId,
        cargo: s ? s.cargo : (req.cargo || ""),
        type: "Cancellation",
        decision: "Rejected",
        status: "Rejected",
        state: "Active",
        title: `Cancellation Request Rejected: ${req.shipmentId}`,
        message: `Your cancellation request for package ${req.shipmentId}${s ? ` (${s.cargo})` : ""} was REJECTED by Warehouse Operator (${opName}). Package remains Active in transit.`,
        time: stamp(),
        resolvedBy: `${opName} (Warehouse Operator)`
      });

      // Also record in Manager Notifications banner
      managerNotifications.unshift({
        id: "NOTIF-" + (seq++),
        shipmentId: req.shipmentId,
        type: "Rejected",
        title: `Cancellation Rejected: ${req.shipmentId}`,
        message: `Cancellation request for package ${req.shipmentId} was REJECTED by Warehouse Operator (${opName}). Package remains Active.`,
        time: stamp()
      });

      alert(`Cancellation request for ${req.shipmentId} REJECTED.\nA notification message has been sent to the Alerts section and Logistics Manager.`);
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
        <td class="fw-bold">${esc(s.id)}</td>
        <td>${esc(s.cargo)}</td>
        <td class="small text-muted">${esc(s.origin)} → ${esc(s.dest)}</td>
        <td class="font-monospace small">${s.min}°C to ${s.max}°C</td>
        <td>${latestOf(s).temp}°C</td>
        <td class="small">${esc(s.deliveredAt || "—")}</td>
        <td class="text-end">
          <button class="btn btn-sm btn-outline-primary py-0" onclick="showDetails('${s.id}')">History</button>
          ${currentUser && currentUser.role === "Logistics Manager" ? `
            <button class="btn btn-sm btn-outline-danger py-0 ms-1" onclick="promptDeleteShipment('${s.id}')" title="Delete">
              <i class="bi bi-trash"></i>
            </button>
          ` : ""}
        </td>
      </tr>`).join("") || `<tr><td colspan="7" class="text-center text-muted py-3">No delivered shipments recorded yet.</td></tr>`;
  }

  /* ---------- Cancelled Section with Reason & Approved By ---------- */
  function renderCancelled() {
    const list = shipments.filter(s => s.status === "Cancelled");
    $("navCancelledBadge").textContent = list.length;
    $("cancelledBody").innerHTML = list.map(s => `
      <tr>
        <td class="fw-bold text-decoration-line-through">${esc(s.id)}</td>
        <td>${esc(s.cargo)}</td>
        <td class="small text-muted">${esc(s.origin)} → ${esc(s.dest)}</td>
        <td class="fw-semibold text-danger">${esc(s.cancelReason || "—")}</td>
        <td class="small fst-italic">${esc(s.cancelNotes || "—")}</td>
        <td class="small">${esc(s.cancelRequestedBy || "—")}</td>
        <td class="small text-success fw-semibold">${esc(s.cancelApprovedBy || "Sourabh (Warehouse Operator)")}</td>
        <td class="small">${esc(s.cancelledAt || "—")}</td>
        <td class="text-end">
          <button class="btn btn-sm btn-outline-primary py-0" onclick="showDetails('${s.id}')">History</button>
          ${currentUser && currentUser.role === "Logistics Manager" ? `
            <button class="btn btn-sm btn-outline-danger py-0 ms-1" onclick="promptDeleteShipment('${s.id}')" title="Delete">
              <i class="bi bi-trash"></i>
            </button>
          ` : ""}
        </td>
      </tr>`).join("") || `<tr><td colspan="9" class="text-center text-muted py-3">No cancelled shipments.</td></tr>`;
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

  /* ---------- Cancel Shipment Modal (Logistics Manager Initiates Request to Warehouse Operator) ---------- */
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

    // Creates cancellation request for Warehouse Operator review
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
    alert(`Cancellation request for package ${shipmentId} has been sent to Warehouse Operator (Sourabh) for review.`);
  };

  /* ---------- Register New Shipment ---------- */
  $("btnOpenAddShipment").onclick = () => {
    $("addShipmentForm").reset();
    $("addShipmentError").classList.add("d-none");
    openModal("addShipmentModal");
  };

  $("addShipmentForm").onsubmit = (e) => {
    e.preventDefault();
    const id = $("newShipmentId").value.trim().toUpperCase();
    const min = parseFloat($("newMinTemp").value);
    const max = parseFloat($("newMaxTemp").value);
    const initialTemp = parseFloat($("newInitialTemp").value);
    let msg = "";

    if (!/^[A-Z0-9-]{3,12}$/.test(id)) msg = "Shipment ID must be 3 to 12 alphanumeric characters or dashes.";
    else if (shipments.some(s => s.id === id)) msg = "Shipment ID already exists in system.";
    else if (min >= max) msg = "Minimum temperature must be strictly below maximum.";
    else if (isNaN(initialTemp)) msg = "Please enter a valid initial temperature.";

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

  /* ---------- Mark Delivered ---------- */
  window.markDelivered = (id) => {
    const s = shipments.find(item => item.id === id);
    if (s && confirm(`Mark shipment ${id} as delivered? It will move to the Delivered tab.`)) {
      s.status = "Delivered";
      s.deliveredAt = stamp();
      saveState();
      renderAll();
    }
  };

  /* ---------- Delete Authorization with User ID and Password ---------- */
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

    // Verify User ID and Password
    const matchedUser = USERS.find(u => u.username.toLowerCase() === inputUser && u.pass === inputPass);

    if (!matchedUser) {
      $("deleteAuthError").textContent = "Invalid User ID or Password. Deletion unauthorized.";
      $("deleteAuthError").classList.remove("d-none");
      return;
    }

    if (matchedUser.role !== "Logistics Manager") {
      $("deleteAuthError").textContent = "Access denied: Only Logistics Managers are authorized to delete packages.";
      $("deleteAuthError").classList.remove("d-none");
      return;
    }

    // Execute deletion
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
    if (!count) return alert("No delivered shipments to clear.");
    if (confirm(`Remove all ${count} delivered shipments from history?`)) {
      shipments = shipments.filter(s => s.status !== "Delivered");
      saveState();
      renderAll();
    }
  };

  /* ---------- Telemetry History Modal ---------- */
  window.showDetails = (id) => {
    currentShipmentId = id;
    const s = shipments.find(item => item.id === id);
    if (!s) return;
    $("modalTitle").textContent = `${s.id} (${s.cargo})`;
    $("modalLimits").textContent = `${s.min}°C to ${s.max}°C`;
    $("modalCurrent").textContent = `${latestOf(s).temp}°C`;
    $("addPingForm").classList.toggle("d-none", s.status !== "Active");

    $("modalHistoryList").innerHTML = s.readings.slice().reverse().map(r => `
      <li class="list-group-item d-flex justify-content-between py-1">
        <span>${esc(r.time)}</span>
        <strong>${r.temp}°C</strong>
      </li>`).join("");
    openModal("detailsModal");
  };

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

  /* ---------- IoT Simulation ---------- */
  $("btnSimulatePing").onclick = () => {
    const list = activeShipments();
    if (!list.length) return;
    list.forEach(s => s.readings.push({ temp: randomReading(s), time: nowTime(), alertDeleted: false }));
    renderAll();
  };

  $("searchInput").oninput = renderAll;
  $("statusFilter").onchange = renderAll;

  // Initialize Auth
  setAuth(currentUser);
});

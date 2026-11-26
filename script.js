/**
 * ColdChain Monitor - Application Controller (script.js)
 * Built with Vanilla ES6+ JavaScript, DOM APIs, and Firebase Realtime Database REST API.
 */

// 1. Cloud Database Endpoints (Same-origin Vercel proxy first, direct Firebase REST fallback)
const FIREBASE_DB_URL = "https://coldchain-monitor-eb213-default-rtdb.firebaseio.com/coldchain.json";
const CLOUD_API_URL = (typeof location !== "undefined" && (location.protocol === "http:" || location.protocol === "https:") && !/^(localhost|127\.0\.0\.1)$/i.test(location.hostname))
  ? "/api/cloud"
  : FIREBASE_DB_URL;

// 2. Authorized User Accounts & Default Profile Metadata
const USERS = [
  { username: "Arnav", pass: "123", name: "Arnav", role: "Logistics Manager" },
  { username: "Sourabh", pass: "123", name: "Sourabh", role: "Warehouse Operator" }
];

const DEFAULT_PROFILES = {
  Arnav: {
    name: "Arnav",
    role: "Logistics Manager",
    duty: "Fleet oversight, route creation, and cancellation requests",
    photo: "",
    details: {
      Email: "arnavpratap60@gmail.com",
      Phone: "852 8600 376",
      "Station / Hub": "Polaris School of Technology Bangalore",
      "Shift Hours": "08:00 - 17:00 IST"
    }
  },
  Sourabh: {
    name: "Sourabh",
    role: "Warehouse Operator",
    duty: "Hub receiving, temperature inspection, and alert handling",
    photo: "",
    details: {
      Email: "sourabh@coldchain.io",
      Phone: "70195 885 90",
      "Station / Hub": "Polaris School of Technology Bangalore",
      "Shift Hours": "14:00 - 23:00 IST"
    }
  }
};

// 2. Constants & Small Helper Functions
const VIEWS = ["Dashboard", "Alerts", "Cancellations", "Delivered", "Cancelled", "Spoiled", "Reports"];

function getEl(id) {
  return document.getElementById(id);
}

function getCurrentTime() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function getTimestamp() {
  return new Date().toLocaleDateString("en-GB") + " " + getCurrentTime();
}

// Escape special HTML characters to prevent broken markup or XSS
function escapeHtml(text) {
  const map = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
  return String(text ?? "").replace(/[&<>"']/g, ch => map[ch]);
}

function openModal(id) {
  const el = getEl(id);
  if (!el) return;
  if (window.bootstrap && bootstrap.Modal) {
    bootstrap.Modal.getOrCreateInstance(el).show();
  } else {
    el.classList.add("show");
    el.style.display = "block";
  }
}

function closeModal(id) {
  const el = getEl(id);
  if (!el) return;
  if (window.bootstrap && bootstrap.Modal) {
    const instance = bootstrap.Modal.getOrCreateInstance(el);
    instance.hide();
    return;
  }
  el.classList.remove("show");
  el.style.display = "none";
  const backdrop = document.querySelector(".modal-backdrop");
  if (backdrop) backdrop.remove();
}

// 3. Cloud Database Persistence & Tab Session Helpers
function loadSession(key, fallback) {
  try {
    const raw = sessionStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (err) {
    return fallback;
  }
}

function saveSessionUser(user) {
  try {
    sessionStorage.setItem("cc_session_user", JSON.stringify(user));
  } catch (err) {
    // Ignore session storage errors in restricted environments
  }
}

function normalizeArray(value) {
  if (Array.isArray(value)) {
    return value.filter(item => item !== null && item !== undefined);
  }
  if (value && typeof value === "object") {
    return Object.values(value).filter(item => item !== null && item !== undefined);
  }
  return [];
}

function updateCloudStatus(label, subText, isError) {
  if (getEl("cloudStatusText")) getEl("cloudStatusText").textContent = label;
  if (getEl("cloudStatusSub")) getEl("cloudStatusSub").textContent = subText;
  if (getEl("cloudStatusDot")) {
    getEl("cloudStatusDot").style.backgroundColor = isError ? "#ef4444" : "#22c55e";
  }
}

function applyCloudSnapshot(rawData) {
  const data = rawData && typeof rawData === "object" ? rawData : {};

  shipments = normalizeArray(data.shipments).map(s => ({
    ...s,
    readings: normalizeArray(s.readings)
  }));

  alerts = normalizeArray(data.alerts);
  alerts.forEach(alertItem => {
    if (!alertItem.aid) alertItem.aid = "ALT-" + (idCounter++);
    if (typeof alertItem.isRead !== "boolean") {
      alertItem.isRead = alertItem.state === "Resolved";
    }
  });

  cancellations = normalizeArray(data.cancellations);
  managerNotifications = normalizeArray(data.managerNotifications);
  reports = normalizeArray(data.reports).map(r => ({
    ...r,
    questions: normalizeArray(r.questions)
  }));
  reportNotices = normalizeArray(data.reportNotices);

  const cloudProfiles = data.profiles && typeof data.profiles === "object" ? data.profiles : {};
  profiles = JSON.parse(JSON.stringify(DEFAULT_PROFILES));
  Object.keys(cloudProfiles).forEach(key => {
    profiles[key] = {
      ...(profiles[key] || {}),
      ...cloudProfiles[key],
      details: {
        ...((profiles[key] && profiles[key].details) || {}),
        ...((cloudProfiles[key] && cloudProfiles[key].details) || {})
      }
    };
  });
}

let isSavingToCloud = false;
let hasQueuedSave = false;
let lastCloudSignature = "";
let stateMutationSeq = 0;

function normalizeSnapshotForCompare(rawData) {
  const data = rawData && typeof rawData === "object" ? rawData : {};
  const cloudProfiles = data.profiles && typeof data.profiles === "object" ? data.profiles : {};
  const mergedProfiles = JSON.parse(JSON.stringify(DEFAULT_PROFILES));
  Object.keys(cloudProfiles).forEach(key => {
    mergedProfiles[key] = {
      ...(mergedProfiles[key] || {}),
      ...cloudProfiles[key],
      details: {
        ...((mergedProfiles[key] && mergedProfiles[key].details) || {}),
        ...((cloudProfiles[key] && cloudProfiles[key].details) || {})
      }
    };
  });

  return {
    shipments: normalizeArray(data.shipments).map(s => ({ ...s, readings: normalizeArray(s.readings) })),
    alerts: normalizeArray(data.alerts),
    cancellations: normalizeArray(data.cancellations),
    managerNotifications: normalizeArray(data.managerNotifications),
    reports: normalizeArray(data.reports).map(r => ({ ...r, questions: normalizeArray(r.questions) })),
    reportNotices: normalizeArray(data.reportNotices),
    profiles: mergedProfiles
  };
}

function buildCloudPayload() {
  return {
    shipments,
    alerts,
    cancellations,
    managerNotifications,
    reports,
    reportNotices,
    profiles
  };
}

function cloudFetch(options) {
  return fetch(CLOUD_API_URL, options).then(res => {
    if (!res.ok && CLOUD_API_URL !== FIREBASE_DB_URL) {
      return fetch(FIREBASE_DB_URL, options);
    }
    return res;
  }).catch(err => {
    if (CLOUD_API_URL !== FIREBASE_DB_URL) {
      return fetch(FIREBASE_DB_URL, options);
    }
    throw err;
  });
}

function saveState() {
  if (typeof fetch !== "function") return;
  stateMutationSeq++;

  if (isSavingToCloud) {
    hasQueuedSave = true;
    return;
  }

  isSavingToCloud = true;
  updateCloudStatus("Syncing...", "Saving to cloud", false);

  const payload = buildCloudPayload();
  const payloadJson = JSON.stringify(payload);
  lastCloudSignature = JSON.stringify(normalizeSnapshotForCompare(payload));

  cloudFetch({
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: payloadJson,
    keepalive: payloadJson.length < 60000
  })
    .then(res => {
      if (!res.ok) throw new Error("HTTP " + res.status);
      updateCloudStatus("System Online", "Cloud Synced " + getCurrentTime(), false);
    })
    .catch(err => {
      updateCloudStatus("Sync Error", (err && err.message) || "Save failed", true);
    })
    .finally(() => {
      isSavingToCloud = false;
      if (hasQueuedSave) {
        hasQueuedSave = false;
        saveState();
      }
    });
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-bs-theme", theme);
  try {
    sessionStorage.setItem("cc_theme", theme);
  } catch (err) {
    // Ignore storage errors
  }
  const icon = getEl("themeIcon");
  if (icon) {
    icon.className = theme === "dark" ? "bi bi-sun" : "bi bi-moon-stars";
  }
}

// Initialize in-memory live state (populated & synced by Firebase Realtime Database)
let shipments = [];
let alerts = [];
let cancellations = [];
let managerNotifications = [];
let reports = [];
let reportNotices = [];
let profiles = JSON.parse(JSON.stringify(DEFAULT_PROFILES));
let cloudReady = false;

let currentUser = loadSession("cc_session_user", null);
let currentShipmentId = null;
let currentActiveView = "Dashboard";
let pendingDeleteShipmentId = null;
let activeConditionFilter = "ALL";
let draftProfilePhoto = "";
let idCounter = Date.now();

let initialTheme = "light";
try {
  initialTheme = sessionStorage.getItem("cc_theme") || "light";
} catch (err) {
  initialTheme = "light";
}
applyTheme(initialTheme);

// 4. Telemetry & Status Helpers
function getLatestReading(shipment) {
  if (shipment && Array.isArray(shipment.readings) && shipment.readings.length > 0) {
    return shipment.readings[shipment.readings.length - 1];
  }
  return { temp: 0, time: "00:00" };
}

function getActiveShipments() {
  return shipments.filter(item => item && item.status === "Active");
}

function evaluateTemp(temp, min, max) {
  if (typeof temp !== "number" || isNaN(temp)) {
    return { status: "Normal", textClass: "text-secondary" };
  }
  if (temp >= min && temp <= max) {
    return { status: "Normal", textClass: "text-success" };
  }
  const deviation = temp > max ? temp - max : min - temp;
  if (deviation >= 2.0) {
    return { status: "Critical", textClass: "text-danger" };
  }
  return { status: "Warning", textClass: "text-warning" };
}

function buildStatusBadge(status) {
  let iconClass = "bi-x-octagon-fill";
  if (status === "Normal") iconClass = "bi-check-circle-fill";
  else if (status === "Warning") iconClass = "bi-exclamation-triangle-fill";
  return `<span class="badge-status badge-${status}"><i class="bi ${iconClass} me-1"></i>${status}</span>`;
}

function generateSimulatedTemp(shipment) {
  // 40% chance inside safe range, 60% chance outside safe range for realistic testing
  if (Math.random() < 0.4) {
    return +(shipment.min + Math.random() * (shipment.max - shipment.min)).toFixed(1);
  }
  const offset = Math.random() < 0.7
    ? 0.2 + Math.random() * 1.6
    : 2.0 + Math.random() * 3.0;
  const raw = Math.random() < 0.5 ? shipment.max + offset : shipment.min - offset;
  return +raw.toFixed(1);
}

// 5. Main App Initialization & Event Wiring
document.addEventListener("DOMContentLoaded", () => {
  // Close any open modal when clicking a [data-bs-dismiss="modal"] button
  document.addEventListener("click", event => {
    const closeBtn = event.target.closest("[data-bs-dismiss='modal']");
    if (closeBtn) {
      const modalEl = closeBtn.closest(".modal");
      if (modalEl) closeModal(modalEl.id);
    }
  });

  // Check active shipments and create unread alerts for any new Warning/Critical readings
  function evaluateAllShipments() {
    if (!cloudReady) return;
    let addedNewAlert = false;

    getActiveShipments().forEach(shipment => {
      const latest = getLatestReading(shipment);
      const result = evaluateTemp(latest.temp, shipment.min, shipment.max);

      const alreadyLogged = alerts.some(
        a => a.id === shipment.id && a.temp === latest.temp && a.time === latest.time
      );

      if (result.status !== "Normal" && !latest.alertDeleted && !alreadyLogged) {
        alerts.unshift({
          aid: "ALT-" + (idCounter++),
          id: shipment.id,
          cargo: shipment.cargo,
          temp: latest.temp,
          status: result.status,
          time: latest.time,
          state: "Active",
          requested: false,
          isRead: false
        });
        addedNewAlert = true;
      }
    });

    if (addedNewAlert) {
      saveState();
    }
  }

  // Mark relevant alerts as read when the user opens and views the Alerts section
  function markCurrentAlertsAsRead() {
    let updated = false;
    alerts.forEach(alertItem => {
      if (alertItem.targetRole && currentUser && currentUser.role !== alertItem.targetRole) {
        return;
      }
      if (!alertItem.isRead) {
        alertItem.isRead = true;
        updated = true;
      }
    });
    if (updated) saveState();
  }

  // --- Authentication & Profile Helpers ---
  function getActiveProfile() {
    if (!currentUser) return null;
    if (!profiles[currentUser.username]) {
      profiles[currentUser.username] = {
        name: currentUser.name,
        role: currentUser.role,
        duty: "Cold-chain operations",
        photo: "",
        details: { Email: "", Phone: "", "Station / Hub": "", "Shift Hours": "" }
      };
    }
    return profiles[currentUser.username];
  }

  function syncHeaderProfile() {
    const profile = getActiveProfile();
    if (!currentUser || !profile) return;

    currentUser.name = profile.name;
    getEl("navUserName").textContent = profile.name;
    getEl("userRoleBadge").textContent = profile.role;
    if (getEl("headerUserName")) getEl("headerUserName").textContent = profile.name;

    const photoEl = getEl("headerUserPhoto");
    const initialEl = getEl("headerUserInitial");
    if (profile.photo && photoEl && initialEl) {
      photoEl.src = profile.photo;
      photoEl.classList.remove("d-none");
      initialEl.classList.add("d-none");
    } else if (photoEl && initialEl) {
      photoEl.src = "";
      photoEl.classList.add("d-none");
      initialEl.classList.remove("d-none");
      initialEl.textContent = profile.name.charAt(0).toUpperCase();
    }
  }

  function setAuth(user) {
    currentUser = user;
    saveSessionUser(user);

    if (user) {
      getEl("loginSection").classList.add("d-none");
      getEl("appSection").classList.remove("d-none");
      syncHeaderProfile();

      const isOperator = user.role === "Warehouse Operator";
      getEl("navCancelItem").classList.toggle("d-none", !isOperator);
      if (!isOperator && currentActiveView === "Cancellations") {
        currentActiveView = "Dashboard";
      }
      switchView(currentActiveView);
    } else {
      getEl("loginSection").classList.remove("d-none");
      getEl("appSection").classList.add("d-none");
      getEl("loginUsername").value = "";
      getEl("loginPassword").value = "";
      getEl("loginPassword").type = "password";
      if (getEl("togglePasswordIcon")) getEl("togglePasswordIcon").className = "bi bi-eye";
      getEl("loginError").classList.add("d-none");
    }
  }

  getEl("loginForm").onsubmit = event => {
    event.preventDefault();
    const enteredUser = getEl("loginUsername").value.trim().toLowerCase();
    const enteredPass = getEl("loginPassword").value.trim();
    const matched = USERS.find(
      u => u.username.toLowerCase() === enteredUser && u.pass === enteredPass
    );

    if (matched) {
      getEl("loginError").classList.add("d-none");
      setAuth(matched);
    } else {
      getEl("loginError").classList.remove("d-none");
    }
  };

  getEl("btnLogout").onclick = () => setAuth(null);

  function renderProfileModal(editMode) {
    const profile = getActiveProfile();
    if (!profile) return;

    getEl("profModalName").textContent = profile.name;
    getEl("profModalRole").textContent = profile.role;
    getEl("profModalDuty").textContent = profile.duty;

    const previewPhoto = editMode ? draftProfilePhoto : profile.photo;
    const modalImg = getEl("profModalPhoto");
    const fallbackIcon = getEl("profModalFallbackIcon");
    if (previewPhoto) {
      modalImg.src = previewPhoto;
      modalImg.classList.remove("d-none");
      fallbackIcon.classList.add("d-none");
    } else {
      modalImg.src = "";
      modalImg.classList.add("d-none");
      fallbackIcon.classList.remove("d-none");
    }

    getEl("profModalDetailsList").innerHTML = Object.entries(profile.details || {})
      .map(([k, v]) => `<dt class="col-4 text-secondary">${escapeHtml(k)}</dt><dd class="col-8 mb-2 font-monospace">${escapeHtml(v || "—")}</dd>`)
      .join("");

    getEl("profileViewMode").classList.toggle("d-none", editMode);
    getEl("profileEditForm").classList.toggle("d-none", !editMode);
    getEl("btnToggleEditProfile").classList.toggle("d-none", editMode);
  }

  getEl("userProfileChip").onclick = () => {
    const profile = getActiveProfile();
    if (!profile) return;
    draftProfilePhoto = profile.photo || "";
    getEl("profileSaveMsg").classList.add("d-none");
    getEl("profilePhotoInput").value = "";
    renderProfileModal(false);
    openModal("userProfileModal");
  };

  getEl("btnToggleEditProfile").onclick = () => {
    const profile = getActiveProfile();
    if (!profile) return;
    draftProfilePhoto = profile.photo || "";
    getEl("profileSaveMsg").classList.add("d-none");
    getEl("profilePhotoInput").value = "";
    getEl("editProfName").value = profile.name || "";
    getEl("editProfDuty").value = profile.duty || "";
    getEl("editProfEmail").value = (profile.details && profile.details.Email) || "";
    getEl("editProfPhone").value = (profile.details && profile.details.Phone) || "";
    getEl("editProfHub").value = (profile.details && profile.details["Station / Hub"]) || "";
    getEl("editProfShift").value = (profile.details && profile.details["Shift Hours"]) || "";
    renderProfileModal(true);
  };

  getEl("btnCancelEditProfile").onclick = () => {
    const profile = getActiveProfile();
    draftProfilePhoto = profile ? (profile.photo || "") : "";
    renderProfileModal(false);
  };

  getEl("profilePhotoInput").onchange = event => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    if (file.size > 1500000) {
      alert("Please choose an image smaller than 1.5 MB.");
      event.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = e => {
      draftProfilePhoto = e.target.result || "";
      renderProfileModal(true);
    };
    reader.readAsDataURL(file);
  };

  getEl("btnRemoveProfilePhoto").onclick = () => {
    draftProfilePhoto = "";
    getEl("profilePhotoInput").value = "";
    renderProfileModal(true);
  };

  getEl("profileEditForm").onsubmit = event => {
    event.preventDefault();
    const profile = getActiveProfile();
    if (!profile) return;

    const newName = getEl("editProfName").value.trim();
    if (!newName) return;

    profile.name = newName;
    profile.duty = getEl("editProfDuty").value.trim() || "Cold-chain operations";
    profile.photo = draftProfilePhoto;
    profile.details = {
      Email: getEl("editProfEmail").value.trim(),
      Phone: getEl("editProfPhone").value.trim(),
      "Station / Hub": getEl("editProfHub").value.trim(),
      "Shift Hours": getEl("editProfShift").value.trim()
    };

    const userRecord = USERS.find(u => u.username === currentUser.username);
    if (userRecord) userRecord.name = newName;

    saveState();
    syncHeaderProfile();
    renderProfileModal(false);

    const msgBox = getEl("profileSaveMsg");
    msgBox.textContent = "Profile updated successfully.";
    msgBox.classList.remove("d-none");
  };

  // Toggle password visibility on login form
  if (getEl("togglePasswordBtn")) {
    getEl("togglePasswordBtn").onclick = () => {
      const passwordInput = getEl("loginPassword");
      const icon = getEl("togglePasswordIcon");
      const show = passwordInput.type === "password";
      passwordInput.type = show ? "text" : "password";
      if (icon) icon.className = show ? "bi bi-eye-slash" : "bi bi-eye";
    };
  }

  // Mobile sidebar drawer helpers
  function closeMobileSidebar() {
    if (getEl("appSidebar")) getEl("appSidebar").classList.remove("sidebar-open");
    if (getEl("sidebarBackdrop")) getEl("sidebarBackdrop").classList.add("d-none");
  }

  if (getEl("sidebarToggleBtn")) {
    getEl("sidebarToggleBtn").onclick = () => {
      const sidebar = getEl("appSidebar");
      const backdrop = getEl("sidebarBackdrop");
      if (!sidebar || !backdrop) return;
      const isOpen = sidebar.classList.toggle("sidebar-open");
      backdrop.classList.toggle("d-none", !isOpen);
    };
  }

  if (getEl("sidebarBackdrop")) {
    getEl("sidebarBackdrop").onclick = closeMobileSidebar;
  }

  // --- View Navigation ---
  function switchView(viewName) {
    currentActiveView = viewName;
    VIEWS.forEach(name => {
      const section = getEl("view" + name);
      const navBtn = getEl("nav" + name);
      if (section) section.classList.toggle("d-none", name !== viewName);
      if (navBtn) navBtn.classList.toggle("active", name === viewName);
    });

    closeMobileSidebar();
    evaluateAllShipments();
    if (viewName === "Alerts") {
      markCurrentAlertsAsRead();
    }
    if (viewName === "Reports") {
      markReportsViewedByWarehouse();
    }
    renderAllViews();
  }

  VIEWS.forEach(name => {
    const navBtn = getEl("nav" + name);
    if (navBtn) {
      navBtn.onclick = () => switchView(name);
    }
  });

  function refreshAll() {
    evaluateAllShipments();
    renderAllViews();
  }

  function renderAllViews() {
    renderDashboard();
    renderAlerts();
    renderRequests();
    renderDelivered();
    renderCancelled();
    renderSpoiled();
    renderReports();
  }

  // --- Interactive KPI Card Filtering ---
  function updateKpiFilterUI() {
    const cards = [
      { id: "kpiTotalCard", filter: "ALL", label: "All Active Shipments" },
      { id: "kpiNormalCard", filter: "Normal", label: "Filter: Normal Range" },
      { id: "kpiWarningCard", filter: "Warning", label: "Filter: Warning Alerts" },
      { id: "kpiCriticalCard", filter: "Critical", label: "Filter: Critical Excursions" }
    ];

    cards.forEach(card => {
      const el = getEl(card.id);
      if (!el) return;
      const isSelected = activeConditionFilter === card.filter;
      el.classList.toggle("kpi-active", isSelected);
      el.setAttribute("aria-pressed", String(isSelected));
    });

    getEl("statusFilter").value = activeConditionFilter;

    const hasSearch = getEl("searchInput").value.trim().length > 0;
    const isFiltered = activeConditionFilter !== "ALL" || hasSearch;
    getEl("btnResetFilter").classList.toggle("d-none", !isFiltered);

    const badge = getEl("activeFilterLabel");
    if (activeConditionFilter !== "ALL") {
      badge.textContent = `Showing: ${activeConditionFilter}`;
      badge.classList.remove("d-none");
    } else {
      badge.classList.add("d-none");
    }
  }

  function setConditionFilter(filterValue) {
    activeConditionFilter = filterValue;
    updateKpiFilterUI();
    renderDashboard();
  }

  ["kpiTotalCard", "kpiNormalCard", "kpiWarningCard", "kpiCriticalCard"].forEach(cardId => {
    const cardEl = getEl(cardId);
    if (!cardEl) return;

    function handleCardSelect() {
      const targetFilter = cardEl.dataset.filter || "ALL";
      // Clicking an already-selected condition card toggles back to ALL
      if (targetFilter !== "ALL" && activeConditionFilter === targetFilter) {
        setConditionFilter("ALL");
      } else {
        setConditionFilter(targetFilter);
      }
    }

    cardEl.onclick = handleCardSelect;
    cardEl.onkeydown = event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        handleCardSelect();
      }
    };
  });

  getEl("statusFilter").onchange = () => {
    setConditionFilter(getEl("statusFilter").value);
  };

  getEl("searchInput").oninput = () => {
    updateKpiFilterUI();
    renderDashboard();
  };

  getEl("btnResetFilter").onclick = () => {
    getEl("searchInput").value = "";
    setConditionFilter("ALL");
  };

  // --- Manager Notifications ---
  function renderManagerNotifications() {
    const container = getEl("managerNotificationsContainer");
    if (!container) return;

    if (!currentUser || currentUser.role !== "Logistics Manager" || managerNotifications.length === 0) {
      container.innerHTML = "";
      return;
    }

    const itemsHtml = managerNotifications.map(notif => {
      const alertClass = notif.type === "Approved" ? "alert-success border-success" : "alert-danger border-danger";
      const titleClass = notif.type === "Approved" ? "text-success" : "text-danger";
      return `
        <div class="alert ${alertClass} d-flex justify-content-between align-items-start py-2 px-3 mb-2 shadow-sm rounded">
          <div>
            <strong class="${titleClass}">${escapeHtml(notif.title)}</strong>
            <div class="small">${escapeHtml(notif.message)}</div>
            <small class="text-muted">${escapeHtml(notif.time)}</small>
          </div>
          <button class="btn btn-sm btn-link text-secondary p-0 ms-2" onclick="dismissManagerNotification('${notif.id}')" aria-label="Dismiss notification">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>`;
    }).join("");

    container.innerHTML = `
      <div class="card border-0 shadow-sm mb-3 bg-light">
        <div class="card-header bg-white py-2 px-3 d-flex justify-content-between align-items-center">
          <div class="fw-bold small">
            <i class="bi bi-bell-fill text-primary me-2"></i>Operator Cancellation Decisions (${managerNotifications.length})
          </div>
          <button class="btn btn-sm btn-link text-muted p-0 small text-decoration-none" onclick="clearAllManagerNotifications()">Dismiss All</button>
        </div>
        <div class="card-body p-2">${itemsHtml}</div>
      </div>`;
  }

  window.dismissManagerNotification = id => {
    managerNotifications = managerNotifications.filter(n => n.id !== id);
    saveState();
    refreshAll();
  };

  window.clearAllManagerNotifications = () => {
    managerNotifications = [];
    saveState();
    refreshAll();
  };

  // --- Dashboard Rendering ---
  function renderDashboard() {
    renderManagerNotifications();
    updateKpiFilterUI();

    const searchQuery = getEl("searchInput").value.trim().toLowerCase();
    const isOperator = currentUser && currentUser.role === "Warehouse Operator";
    const isManager = currentUser && currentUser.role === "Logistics Manager";
    const activeList = getActiveShipments();

    let normalCount = 0;
    let warningCount = 0;
    let criticalCount = 0;

    const tableRows = [];

    activeList.forEach(shipment => {
      const latest = getLatestReading(shipment);
      const condition = evaluateTemp(latest.temp, shipment.min, shipment.max);

      if (condition.status === "Normal") normalCount++;
      else if (condition.status === "Warning") warningCount++;
      else criticalCount++;

      const searchableText = `${shipment.id} ${shipment.cargo} ${shipment.origin} ${shipment.dest}`.toLowerCase();
      const matchesSearch = searchableText.includes(searchQuery);
      const matchesFilter = activeConditionFilter === "ALL" || condition.status === activeConditionFilter;

      if (!matchesSearch || !matchesFilter) return;

      const hasPendingCancel = cancellations.some(
        c => c.shipmentId === shipment.id && c.state === "Pending"
      );

      let actionButtons = `<button class="btn btn-sm btn-outline-primary py-0" onclick="showDetails('${shipment.id}')">History</button>`;
      if (condition.status === "Critical") {
        actionButtons += `<button class="btn btn-sm btn-outline-danger py-0 ms-1" onclick="openSpoiledModal('${shipment.id}')" title="Declare Spoiled"><i class="bi bi-exclamation-octagon"></i> Spoil</button>`;
      }
      if (isOperator) {
        actionButtons += `<button class="btn btn-sm btn-outline-success py-0 ms-1" onclick="markDelivered('${shipment.id}')" title="Deliver"><i class="bi bi-check-lg"></i></button>`;
      }
      if (isManager) {
        if (hasPendingCancel) {
          actionButtons += `<button class="btn btn-sm btn-outline-secondary py-0 ms-1 disabled" disabled title="Pending Approval"><i class="bi bi-hourglass-split"></i></button>`;
        } else {
          actionButtons += `<button class="btn btn-sm btn-outline-warning text-dark py-0 ms-1" onclick="openCancelModal('${shipment.id}')" title="Cancel"><i class="bi bi-x-circle"></i></button>`;
        }
        actionButtons += `<button class="btn btn-sm btn-outline-danger py-0 ms-1" onclick="promptDeleteShipment('${shipment.id}')" title="Delete"><i class="bi bi-trash"></i></button>`;
      }

      const tempPrefix = latest.temp > 0 ? "+" : "";
      const pendingBadge = hasPendingCancel
        ? '<span class="badge bg-warning text-dark ms-1"><i class="bi bi-hourglass-split me-1"></i>Cancel Pending</span>'
        : "";

      tableRows.push(`
        <tr>
          <td class="fw-bold">${escapeHtml(shipment.id)}</td>
          <td>${escapeHtml(shipment.cargo)}</td>
          <td class="small text-muted">${escapeHtml(shipment.origin)} &rarr; ${escapeHtml(shipment.dest)}</td>
          <td class="font-monospace small">${shipment.min}°C to ${shipment.max}°C</td>
          <td class="fw-bold ${condition.textClass}">${tempPrefix}${latest.temp}°C</td>
          <td>${buildStatusBadge(condition.status)}${pendingBadge}</td>
          <td class="text-end text-nowrap">${actionButtons}</td>
        </tr>`);
    });

    getEl("statTotal").textContent = activeList.length;
    getEl("statNormal").textContent = normalCount;
    getEl("statWarning").textContent = warningCount;
    getEl("statCritical").textContent = criticalCount;

    let emptyMessage = 'No shipments found. Click "+ Register Shipment" to add one.';
    if (activeList.length > 0) {
      emptyMessage = activeConditionFilter !== "ALL"
        ? `No shipments found in "${activeConditionFilter}" state.`
        : "No matching shipments found.";
    }

    getEl("shipmentTableBody").innerHTML = tableRows.join("") ||
      `<tr><td colspan="7" class="text-center text-muted py-3">${emptyMessage}</td></tr>`;
  }

  // --- Alerts Rendering & Read-State Badge ---
  function renderAlerts() {
    const unreadCount = alerts.filter(a => {
      if (a.isRead) return false;
      if (a.targetRole && currentUser && currentUser.role !== a.targetRole) return false;
      return true;
    }).length;
    const unresolvedCount = alerts.filter(a => a.state !== "Resolved").length;
    const isOperator = currentUser && currentUser.role === "Warehouse Operator";
    const isManager = currentUser && currentUser.role === "Logistics Manager";

    const navBadge = getEl("navAlertsBadge");
    navBadge.textContent = unreadCount;
    navBadge.className = unreadCount > 0
      ? "badge bg-danger rounded-pill ms-1"
      : "badge bg-secondary rounded-pill ms-1";

    getEl("unresolvedBadge").textContent = `${unresolvedCount} Active`;

    getEl("alertsList").innerHTML = alerts.map(alertItem => {
      if (alertItem.type === "ReportDeleteRequest") {
        const canRespond = alertItem.state !== "Resolved" && currentUser && currentUser.role === alertItem.targetRole;
        let consentActions = "";
        if (alertItem.state === "Resolved") {
          consentActions = `<span class="badge ${alertItem.decision === "Agreed" ? "bg-success" : "bg-danger"}">${escapeHtml(alertItem.decision || "Resolved")}</span>`;
        } else if (canRespond) {
          consentActions = `
            <div class="btn-group btn-group-sm">
              <button class="btn btn-success py-0" onclick="handleReportDeleteConsent('${alertItem.aid}', true)"><i class="bi bi-check-lg me-1"></i>Agree &amp; Delete</button>
              <button class="btn btn-outline-danger py-0 ms-1" onclick="handleReportDeleteConsent('${alertItem.aid}', false)"><i class="bi bi-x-lg me-1"></i>Do Not Agree</button>
            </div>`;
        } else {
          consentActions = `<span class="badge bg-warning text-dark">Awaiting ${escapeHtml(alertItem.targetRole)} Consent</span>`;
        }

        return `
          <div class="alert-item mb-3 p-3 border rounded shadow-sm bg-white border-warning">
            <div class="d-flex justify-content-between align-items-start gap-2">
              <div class="d-flex align-items-start gap-2">
                <i class="bi bi-file-earmark-x-fill text-warning fs-4 mt-1"></i>
                <div>
                  <div class="d-flex align-items-center gap-2 mb-1">
                    <strong>${escapeHtml(alertItem.id)}</strong>
                    ${alertItem.cargo ? `<span class="badge bg-light text-dark border">${escapeHtml(alertItem.cargo)}</span>` : ""}
                    <span class="badge bg-warning text-dark">Report Delete Consent</span>
                  </div>
                  <div class="fw-semibold mb-1">${escapeHtml(alertItem.title)}</div>
                  <div class="small text-dark mb-1">${escapeHtml(alertItem.message)}</div>
                  <small class="text-muted">Requested by: <strong>${escapeHtml(alertItem.requestedByName)} (${escapeHtml(alertItem.requestedByRole)})</strong> | ${escapeHtml(alertItem.time)}</small>
                  ${alertItem.resolvedBy ? `<div class="small mt-1 text-muted">Decision by: <strong>${escapeHtml(alertItem.resolvedBy)}</strong></div>` : ""}
                </div>
              </div>
              <div class="d-flex align-items-center gap-1">
                ${consentActions}
                <button class="btn btn-sm btn-outline-danger py-0 ms-1" onclick="deleteAlert('${alertItem.aid}')" aria-label="Delete alert"><i class="bi bi-trash"></i></button>
              </div>
            </div>
          </div>`;
      }

      if (alertItem.type === "ReportDeleteNotice") {
        const isDeleted = alertItem.decision === "Agreed";
        const ackBtn = alertItem.state !== "Resolved"
          ? `<button class="btn btn-sm btn-outline-secondary py-0" onclick="acknowledgeAlert('${alertItem.aid}')">Acknowledge</button>`
          : '<span class="badge bg-secondary">Read</span>';

        return `
          <div class="alert-item mb-3 p-3 border rounded shadow-sm bg-white ${isDeleted ? "border-success" : "border-danger"}">
            <div class="d-flex justify-content-between align-items-start gap-2">
              <div class="d-flex align-items-start gap-2">
                <i class="bi ${isDeleted ? "bi-check-circle-fill text-success" : "bi-slash-circle-fill text-danger"} fs-4 mt-1"></i>
                <div>
                  <div class="d-flex align-items-center gap-2 mb-1">
                    <strong>${escapeHtml(alertItem.id)}</strong>
                    <span class="badge ${isDeleted ? "bg-success" : "bg-danger"}">${isDeleted ? "Report Deleted" : "Consent Denied"}</span>
                  </div>
                  <div class="fw-semibold ${isDeleted ? "text-success" : "text-danger"} mb-1">${escapeHtml(alertItem.title)}</div>
                  <div class="small text-dark mb-1">${escapeHtml(alertItem.message)}</div>
                  <small class="text-muted">Response from: <strong>${escapeHtml(alertItem.resolvedBy)}</strong> | ${escapeHtml(alertItem.time)}</small>
                </div>
              </div>
              <div class="d-flex align-items-center gap-1">
                ${ackBtn}
                <button class="btn btn-sm btn-outline-danger py-0 ms-1" onclick="deleteAlert('${alertItem.aid}')" aria-label="Delete alert"><i class="bi bi-trash"></i></button>
              </div>
            </div>
          </div>`;
      }

      if (alertItem.type === "Cancellation") {
        const isApproved = alertItem.decision === "Approved";
        const borderClass = isApproved ? "border-success" : "border-danger";
        const iconClass = isApproved ? "bi-check-circle-fill text-success" : "bi-x-circle-fill text-danger";
        const ackBtn = alertItem.state !== "Resolved"
          ? `<button class="btn btn-sm btn-outline-secondary py-0" onclick="acknowledgeAlert('${alertItem.aid}')">Acknowledge</button>`
          : '<span class="badge bg-secondary">Read</span>';

        return `
          <div class="alert-item mb-3 p-3 border rounded shadow-sm bg-white ${borderClass}">
            <div class="d-flex justify-content-between align-items-start gap-2">
              <div class="d-flex align-items-start gap-2">
                <i class="bi ${iconClass} fs-4 mt-1"></i>
                <div>
                  <div class="d-flex align-items-center gap-2 mb-1">
                    <strong>${escapeHtml(alertItem.id)}</strong>
                    ${alertItem.cargo ? `<span class="badge bg-light text-dark border">${escapeHtml(alertItem.cargo)}</span>` : ""}
                    <span class="badge ${isApproved ? "bg-success" : "bg-danger"}">${escapeHtml(alertItem.decision)}</span>
                    <span class="badge ${alertItem.state === "Resolved" ? "bg-secondary" : "bg-primary"}">
                      ${alertItem.state === "Resolved" ? "Acknowledged" : "New Notice"}
                    </span>
                  </div>
                  <div class="fw-semibold ${isApproved ? "text-success" : "text-danger"} mb-1">${escapeHtml(alertItem.title)}</div>
                  <div class="small text-dark mb-1">${escapeHtml(alertItem.message)}</div>
                  <small class="text-muted"><i class="bi bi-person-check me-1"></i>Decided by: <strong>${escapeHtml(alertItem.resolvedBy)}</strong> | ${escapeHtml(alertItem.time)}</small>
                </div>
              </div>
              <div class="d-flex align-items-center gap-1">
                ${ackBtn}
                <button class="btn btn-sm btn-outline-danger py-0 ms-1" onclick="deleteAlert('${alertItem.aid}')" aria-label="Delete alert"><i class="bi bi-trash"></i></button>
              </div>
            </div>
          </div>`;
      }

      let actionArea = '<span class="badge bg-secondary">Closed</span>';
      if (alertItem.state !== "Resolved") {
        if (isOperator) {
          actionArea = alertItem.requested
            ? '<span class="badge bg-warning text-dark border">Request Sent</span>'
            : `<button class="btn btn-sm btn-warning py-0" onclick="sendAlertRequest('${alertItem.aid}')"><i class="bi bi-send me-1"></i>Send Request</button>`;
        } else if (isManager) {
          actionArea = `<button class="btn btn-sm btn-success py-0" onclick="openResolveModal('${alertItem.aid}')"><i class="bi bi-sliders me-1"></i>Resolve</button>`;
        } else {
          actionArea = "";
        }
      }

      const managerNotice = isManager && alertItem.requested && alertItem.state !== "Resolved"
        ? `<div class="alert alert-warning py-1 px-2 my-2 small border-warning d-flex align-items-center gap-2">
             <i class="bi bi-envelope-exclamation-fill text-danger"></i>
             <div><strong>Operator Notice:</strong> Package in <span class="text-danger fw-bold">${escapeHtml(alertItem.status)}</span> condition, please resolve.</div>
           </div>`
        : "";

      return `
        <div class="alert-item ${alertItem.status} ${alertItem.state} mb-2">
          <div class="d-flex justify-content-between align-items-center gap-2">
            <div>
              <strong>${escapeHtml(alertItem.id)}</strong> (${escapeHtml(alertItem.cargo)}) — Recorded:
              <span class="text-danger fw-bold">${alertItem.temp}°C</span> ${buildStatusBadge(alertItem.status)}
              <div class="small text-muted">Status: <strong>${escapeHtml(alertItem.state)}</strong> | Violation: ${escapeHtml(alertItem.time)}</div>
            </div>
            <div>
              ${actionArea}
              <button class="btn btn-sm btn-outline-danger py-0 ms-1" onclick="deleteAlert('${alertItem.aid}')" aria-label="Delete alert"><i class="bi bi-trash"></i></button>
            </div>
          </div>
          ${managerNotice}
        </div>`;
    }).join("") || '<p class="text-muted small text-center my-3">No active temperature alerts.</p>';
  }

  window.acknowledgeAlert = aid => {
    const target = alerts.find(a => a.aid === aid);
    if (target) {
      target.state = "Resolved";
      target.isRead = true;
      saveState();
      refreshAll();
    }
  };

  window.sendAlertRequest = aid => {
    const target = alerts.find(a => a.aid === aid);
    if (target) {
      target.requested = true;
      saveState();
      refreshAll();
      alert(`Notice sent to Logistics Manager for package ${target.id}`);
    }
  };

  window.deleteAlert = aid => {
    const target = alerts.find(a => a.aid === aid);
    if (!target || !confirm(`Delete alert for ${target.id}?`)) return;

    const shipment = shipments.find(s => s.id === target.id);
    if (shipment && shipment.readings) {
      const reading = shipment.readings.find(r => r.time === target.time && r.temp === target.temp);
      if (reading) reading.alertDeleted = true;
    }
    if (target.type === "ReportDeleteRequest" && target.reportId) {
      const rep = reports.find(r => r.id === target.reportId);
      if (rep) rep.deletePending = false;
    }

    alerts = alerts.filter(a => a.aid !== aid);
    saveState();
    refreshAll();
  };

  getEl("btnDeleteAllAlerts").onclick = () => {
    if (alerts.length === 0) return alert("No alerts to delete.");
    if (!confirm(`Delete all ${alerts.length} alerts?`)) return;

    alerts.forEach(alertItem => {
      const shipment = shipments.find(s => s.id === alertItem.id);
      if (shipment && shipment.readings) {
        const reading = shipment.readings.find(r => r.time === alertItem.time && r.temp === alertItem.temp);
        if (reading) reading.alertDeleted = true;
      }
      if (alertItem.type === "ReportDeleteRequest" && alertItem.reportId) {
        const rep = reports.find(r => r.id === alertItem.reportId);
        if (rep) rep.deletePending = false;
      }
    });

    alerts = [];
    saveState();
    refreshAll();
  };

  // --- Cancellation Requests Queue ---
  function renderRequests() {
    const pendingCount = cancellations.filter(c => c.state === "Pending").length;
    getEl("navCancelBadge").textContent = pendingCount;
    getEl("pendingCancelBadge").textContent = `${pendingCount} Pending`;

    const isOperator = currentUser && currentUser.role === "Warehouse Operator";

    getEl("cancellationsList").innerHTML = cancellations.map(req => {
      let stateBadgeClass = "bg-danger";
      if (req.state === "Pending") stateBadgeClass = "bg-warning text-dark";
      else if (req.state === "Approved") stateBadgeClass = "bg-success";

      const actionHtml = req.state === "Pending" && isOperator
        ? `<div class="btn-group">
             <button class="btn btn-sm btn-success px-3" onclick="handleCancelRequest('${req.id}', true)"><i class="bi bi-check-circle me-1"></i>Approve</button>
             <button class="btn btn-sm btn-outline-danger px-3 ms-1" onclick="handleCancelRequest('${req.id}', false)"><i class="bi bi-x-circle me-1"></i>Reject</button>
           </div>`
        : `<span class="badge ${stateBadgeClass} p-2">${req.state}</span>`;

      return `
        <div class="request-item ${req.state} mb-3 p-3 border rounded shadow-sm bg-white">
          <div class="d-flex justify-content-between align-items-start gap-2">
            <div>
              <div class="d-flex align-items-center gap-2 mb-1">
                <span class="fs-6 fw-bold">${escapeHtml(req.shipmentId)}</span>
                ${req.cargo ? `<span class="badge bg-light text-dark border">${escapeHtml(req.cargo)}</span>` : ""}
                <span class="badge ${stateBadgeClass}">${req.state}</span>
              </div>
              <div class="small mb-1"><strong>Reason:</strong> <span class="text-danger fw-semibold">${escapeHtml(req.reason)}</span></div>
              <div class="small text-muted"><i class="bi bi-person me-1"></i>Requested by: <strong>${escapeHtml(req.requestedBy)}</strong> | ${escapeHtml(req.time)}</div>
              ${req.notes ? `<div class="small text-secondary fst-italic mt-1 bg-light p-1 rounded">"${escapeHtml(req.notes)}"</div>` : ""}
              ${req.resolvedBy ? `<div class="small mt-1"><strong>Decision by:</strong> ${escapeHtml(req.resolvedBy)} at ${escapeHtml(req.resolvedAt)}</div>` : ""}
            </div>
            <div>${actionHtml}</div>
          </div>
        </div>`;
    }).join("") || '<p class="text-muted small text-center my-3">No cancellation requests in queue.</p>';
  }

  window.handleCancelRequest = (reqId, approved) => {
    const req = cancellations.find(c => c.id === reqId);
    if (!req) return;

    const operatorName = currentUser ? currentUser.name : "Warehouse Operator";
    const shipment = shipments.find(item => item.id === req.shipmentId);
    const decision = approved ? "Approved" : "Rejected";
    const decidedAt = getTimestamp();

    req.state = decision;
    req.resolvedBy = `${operatorName} (Warehouse Operator)`;
    req.resolvedAt = decidedAt;

    if (approved && shipment) {
      shipment.status = "Cancelled";
      shipment.cancelReason = req.reason;
      shipment.cancelNotes = req.notes;
      shipment.cancelRequestedBy = req.requestedBy;
      shipment.cancelApprovedBy = req.resolvedBy;
      shipment.cancelledAt = decidedAt;
      alerts = alerts.filter(
        a => !(a.id === req.shipmentId && a.type !== "Cancellation" && a.state !== "Resolved")
      );
    }

    const message = approved
      ? `Cancellation for package ${req.shipmentId} was APPROVED by Warehouse Operator (${operatorName}). Moved to Cancelled Orders.`
      : `Cancellation for package ${req.shipmentId} was REJECTED by Warehouse Operator (${operatorName}). Package remains Active.`;

    alerts.unshift({
      aid: "ALT-CAN-" + (idCounter++),
      id: req.shipmentId,
      cargo: (shipment && shipment.cargo) || req.cargo || "",
      type: "Cancellation",
      decision: decision,
      status: decision,
      state: "Active",
      isRead: false,
      title: `Cancellation ${decision}: ${req.shipmentId}`,
      message: message,
      time: decidedAt,
      resolvedBy: req.resolvedBy
    });

    managerNotifications.unshift({
      id: "NOTIF-" + (idCounter++),
      shipmentId: req.shipmentId,
      type: decision,
      title: `Cancellation ${decision}: ${req.shipmentId}`,
      message: message,
      time: decidedAt
    });

    alert(`Cancellation request for ${req.shipmentId} ${decision.toUpperCase()}.\nNotice recorded in Alerts section.`);
    saveState();
    refreshAll();
  };

  // --- Delivered & Cancelled Views ---
  function renderDelivered() {
    const deliveredList = shipments.filter(s => s.status === "Delivered");
    getEl("navDeliveredBadge").textContent = deliveredList.length;

    const isManager = currentUser && currentUser.role === "Logistics Manager";
    getEl("deliveredBody").innerHTML = deliveredList.map(s => `
      <tr>
        <td class="fw-bold">${escapeHtml(s.id)}</td>
        <td>${escapeHtml(s.cargo)}</td>
        <td class="small text-muted">${escapeHtml(s.origin)} &rarr; ${escapeHtml(s.dest)}</td>
        <td class="font-monospace small">${s.min}°C to ${s.max}°C</td>
        <td>${getLatestReading(s).temp}°C</td>
        <td class="small">${escapeHtml(s.deliveredAt || "—")}</td>
        <td class="text-end">
          <button class="btn btn-sm btn-outline-primary py-0" onclick="showDetails('${s.id}')">History</button>
          ${isManager ? `<button class="btn btn-sm btn-outline-danger py-0 ms-1" onclick="promptDeleteShipment('${s.id}')" aria-label="Delete shipment"><i class="bi bi-trash"></i></button>` : ""}
        </td>
      </tr>`).join("") || '<tr><td colspan="7" class="text-center text-muted py-3">No delivered shipments recorded yet.</td></tr>';
  }

  function renderCancelled() {
    const cancelledList = shipments.filter(s => s.status === "Cancelled");
    getEl("navCancelledBadge").textContent = cancelledList.length;

    const isManager = currentUser && currentUser.role === "Logistics Manager";
    getEl("cancelledBody").innerHTML = cancelledList.map(s => `
      <tr>
        <td class="fw-bold text-decoration-line-through">${escapeHtml(s.id)}</td>
        <td>${escapeHtml(s.cargo)}</td>
        <td class="small text-muted">${escapeHtml(s.origin)} &rarr; ${escapeHtml(s.dest)}</td>
        <td class="fw-semibold text-danger">${escapeHtml(s.cancelReason || "—")}</td>
        <td class="small fst-italic">${escapeHtml(s.cancelNotes || "—")}</td>
        <td class="small">${escapeHtml(s.cancelRequestedBy || "—")}</td>
        <td class="small text-success fw-semibold">${escapeHtml(s.cancelApprovedBy || "—")}</td>
        <td class="small">${escapeHtml(s.cancelledAt || "—")}</td>
        <td class="text-end">
          <button class="btn btn-sm btn-outline-primary py-0" onclick="showDetails('${s.id}')">History</button>
          ${isManager ? `<button class="btn btn-sm btn-outline-danger py-0 ms-1" onclick="promptDeleteShipment('${s.id}')" aria-label="Delete shipment"><i class="bi bi-trash"></i></button>` : ""}
        </td>
      </tr>`).join("") || '<tr><td colspan="9" class="text-center text-muted py-3">No cancelled shipments.</td></tr>';
  }

  // --- Spoiled Packages View & Actions ---
  function renderSpoiled() {
    const spoiledList = shipments.filter(s => s.status === "Spoiled");
    getEl("navSpoiledBadge").textContent = spoiledList.length;

    const isManager = currentUser && currentUser.role === "Logistics Manager";
    getEl("spoiledBody").innerHTML = spoiledList.map(s => `
      <tr>
        <td class="fw-bold text-danger">${escapeHtml(s.id)}</td>
        <td>${escapeHtml(s.cargo)}</td>
        <td class="small text-muted">${escapeHtml(s.origin)} &rarr; ${escapeHtml(s.dest)}</td>
        <td class="font-monospace small">${s.min}°C to ${s.max}°C</td>
        <td class="fw-bold text-danger">${s.spoiledTemp !== undefined ? s.spoiledTemp : getLatestReading(s).temp}°C</td>
        <td class="small">${escapeHtml(s.spoiledBy || "—")}</td>
        <td class="small fst-italic">${escapeHtml(s.spoilageNotes || "—")}</td>
        <td class="small">${escapeHtml(s.spoiledAt || "—")}</td>
        <td class="text-end text-nowrap">
          <button class="btn btn-sm btn-outline-primary py-0" onclick="showDetails('${s.id}')">History</button>
          ${isManager ? `<button class="btn btn-sm btn-outline-danger py-0 ms-1" onclick="promptDeleteShipment('${s.id}')" aria-label="Delete shipment"><i class="bi bi-trash"></i></button>` : ""}
        </td>
      </tr>`).join("") || '<tr><td colspan="9" class="text-center text-muted py-3">No spoiled packages recorded.</td></tr>';
  }

  window.openSpoiledModal = id => {
    const shipment = shipments.find(item => item.id === id && item.status === "Active");
    if (!shipment) return;
    const latest = getLatestReading(shipment);

    getEl("spoiledShipmentId").value = shipment.id;
    getEl("spoiledShipmentLabel").textContent = shipment.id;
    getEl("spoiledCargoLabel").textContent = shipment.cargo;
    getEl("spoiledTempLabel").textContent = `${latest.temp}°C`;
    getEl("spoiledNotesInput").value = "";
    openModal("spoiledModal");
  };

  getEl("spoiledForm").onsubmit = event => {
    event.preventDefault();
    const id = getEl("spoiledShipmentId").value;
    const shipment = shipments.find(item => item.id === id && item.status === "Active");
    if (!shipment) return;

    const latest = getLatestReading(shipment);
    const notes = getEl("spoiledNotesInput").value.trim();

    shipment.status = "Spoiled";
    shipment.spoiledAt = getTimestamp();
    shipment.spoiledTemp = latest.temp;
    shipment.spoiledBy = currentUser ? `${currentUser.name} (${currentUser.role})` : "Operator";
    shipment.spoilageNotes = notes || "Declared spoiled due to critical temperature excursion";

    alerts.forEach(a => {
      if (a.id === shipment.id && a.type !== "Cancellation") {
        a.state = "Resolved";
        a.isRead = true;
      }
    });

    saveState();
    closeModal("spoiledModal");
    refreshAll();
  };

  getEl("btnClearSpoiled").onclick = () => {
    const spoiledList = shipments.filter(s => s.status === "Spoiled");
    if (spoiledList.length === 0) return alert("No spoiled records to clear.");
    if (confirm(`Remove all ${spoiledList.length} spoiled package records?`)) {
      shipments = shipments.filter(s => s.status !== "Spoiled");
      saveState();
      refreshAll();
    }
  };

  // --- Reports & Warehouse Q&A ---
  function markReportsViewedByWarehouse() {
    if (!currentUser || currentUser.role !== "Warehouse Operator") return;
    let changed = false;
    reports.forEach(r => {
      if (!r.viewedByWarehouse) {
        r.viewedByWarehouse = true;
        changed = true;
      }
      (r.questions || []).forEach(q => {
        if (q.replyText && !q.replyViewedByWarehouse) {
          q.replyViewedByWarehouse = true;
          changed = true;
        }
      });
    });
    if (changed) saveState();
  }

  function getReportsBadgeCount() {
    if (!currentUser) return 0;
    if (currentUser.role === "Logistics Manager") {
      // Unanswered questions from Warehouse waiting for Manager details
      let pendingReplies = 0;
      reports.forEach(r => {
        (r.questions || []).forEach(q => {
          if (!q.replyText) pendingReplies++;
        });
      });
      return pendingReplies;
    }
    // Unread reports or unread Manager replies for Warehouse
    let unreadItems = 0;
    reports.forEach(r => {
      if (!r.viewedByWarehouse) unreadItems++;
      (r.questions || []).forEach(q => {
        if (q.replyText && !q.replyViewedByWarehouse) unreadItems++;
      });
    });
    return unreadItems;
  }

  function getReportColorTheme(packageStatus) {
    const status = String(packageStatus || "");
    if (status.includes("Critical")) {
      return { cardClass: "report-critical", badgeClass: "report-badge-critical" };
    }
    if (status.includes("Warning")) {
      return { cardClass: "report-warning", badgeClass: "report-badge-warning" };
    }
    if (status === "Spoiled") {
      return { cardClass: "report-spoiled", badgeClass: "report-badge-spoiled" };
    }
    if (status === "Cancelled") {
      return { cardClass: "report-cancelled", badgeClass: "report-badge-cancelled" };
    }
    if (status === "Delivered") {
      return { cardClass: "report-delivered", badgeClass: "report-badge-delivered" };
    }
    return { cardClass: "report-normal", badgeClass: "report-badge-normal" };
  }

  function renderReportDeleteNotices() {
    const container = getEl("reportDeleteNoticeContainer");
    if (!container || !currentUser) return;

    const myNotices = reportNotices.filter(n => n.targetRole === currentUser.role);
    if (myNotices.length === 0) {
      container.innerHTML = "";
      return;
    }

    container.innerHTML = myNotices.map(n => `
      <div class="alert ${n.agreed ? "alert-success border-success" : "alert-danger border-danger"} d-flex justify-content-between align-items-start py-2 px-3 mb-3 shadow-sm">
        <div>
          <strong>${escapeHtml(n.title)}</strong>
          <div class="small">${escapeHtml(n.message)}</div>
          <small class="text-muted">${escapeHtml(n.time)}</small>
        </div>
        <button type="button" class="btn-close btn-sm" onclick="dismissReportNotice('${n.id}')" aria-label="Dismiss"></button>
      </div>`).join("");
  }

  window.dismissReportNotice = id => {
    reportNotices = reportNotices.filter(n => n.id !== id);
    saveState();
    refreshAll();
  };

  function renderReports() {
    const isManager = currentUser && currentUser.role === "Logistics Manager";
    const isOperator = currentUser && currentUser.role === "Warehouse Operator";

    renderReportDeleteNotices();
    getEl("managerReportFormCard").classList.toggle("d-none", !isManager);
    getEl("reportsCountBadge").textContent = `${reports.length} Report${reports.length === 1 ? "" : "s"}`;
    getEl("navReportsBadge").textContent = getReportsBadgeCount();

    if (isManager) {
      const selectEl = getEl("reportShipmentSelect");
      const previousVal = selectEl.value;
      if (shipments.length === 0) {
        selectEl.innerHTML = '<option value="">No shipments registered yet</option>';
      } else {
        selectEl.innerHTML = shipments.map(s => {
          const latest = getLatestReading(s);
          return `<option value="${escapeHtml(s.id)}">${escapeHtml(s.id)} — ${escapeHtml(s.cargo)} (${escapeHtml(s.status)}, ${latest.temp}°C)</option>`;
        }).join("");
        if (previousVal && shipments.some(s => s.id === previousVal)) {
          selectEl.value = previousVal;
        }
      }
    }

    getEl("reportsList").innerHTML = reports.map(report => {
      const colorTheme = getReportColorTheme(report.packageStatus);
      const questionsHtml = (report.questions || []).map(q => {
        let answerSection = "";
        if (q.replyText) {
          answerSection = `
            <div class="mt-2 ps-3 border-start border-2 border-primary">
              <div class="small fw-semibold text-primary">
                <i class="bi bi-reply-fill me-1"></i>${escapeHtml(q.repliedBy)} (${escapeHtml(q.repliedAt)})
              </div>
              <div class="small">${escapeHtml(q.replyText)}</div>
            </div>`;
        } else if (isManager) {
          answerSection = `
            <form class="input-group input-group-sm mt-2" onsubmit="replyReportQuestion(event, '${report.id}', '${q.id}')">
              <input type="text" id="replyInput_${q.id}" class="form-control" placeholder="Provide required details..." required>
              <button class="btn btn-primary" type="submit">Send Details</button>
            </form>`;
        } else {
          answerSection = '<div class="small text-warning fw-semibold mt-1"><i class="bi bi-hourglass-split me-1"></i>Waiting for Logistics Manager reply</div>';
        }

        return `
          <div class="report-qa-item mb-2">
            <div class="small fw-semibold">
              <i class="bi bi-question-circle text-primary me-1"></i>${escapeHtml(q.askedBy)}
              <span class="text-muted fw-normal">(${escapeHtml(q.askedAt)})</span>
            </div>
            <div class="small mt-1">${escapeHtml(q.questionText)}</div>
            ${answerSection}
          </div>`;
      }).join("");

      const askFormHtml = isOperator
        ? `<form class="input-group input-group-sm mt-3" onsubmit="askReportQuestion(event, '${report.id}')">
             <input type="text" id="askInput_${report.id}" class="form-control" placeholder="Ask a question about this report..." required>
             <button class="btn btn-outline-primary" type="submit"><i class="bi bi-chat-dots me-1"></i>Ask Question</button>
           </form>`
        : "";

      const deleteBtnHtml = report.deletePending
        ? '<span class="badge bg-warning text-dark">Delete Consent Pending</span>'
        : `<button class="btn btn-sm btn-outline-danger py-0" onclick="promptDeleteReport('${report.id}')" title="Delete Report"><i class="bi bi-trash"></i></button>`;

      return `
        <div class="report-card ${colorTheme.cardClass} mb-3">
          <div class="d-flex flex-wrap justify-content-between align-items-start gap-2 mb-2">
            <div>
              <span class="fw-bold">${escapeHtml(report.shipmentId)}</span>
              <span class="badge bg-light text-dark border ms-1">${escapeHtml(report.cargo)}</span>
              <span class="badge ${colorTheme.badgeClass} ms-1">${escapeHtml(report.packageStatus)}</span>
            </div>
            <div class="d-flex align-items-center gap-2">
              <small class="text-muted">Sent by <strong>${escapeHtml(report.createdBy)}</strong> | ${escapeHtml(report.createdAt)}</small>
              ${deleteBtnHtml}
            </div>
          </div>
          <p class="small mb-2">${escapeHtml(report.summary)}</p>
          ${questionsHtml ? `<div class="mt-2">${questionsHtml}</div>` : ""}
          ${askFormHtml}
        </div>`;
    }).join("") || '<p class="text-muted small text-center my-3">No package status reports sent yet.</p>';
  }

  window.promptDeleteReport = reportId => {
    const report = reports.find(r => r.id === reportId);
    if (!report || report.deletePending) return;

    getEl("deleteReportIdInput").value = report.id;
    getEl("deleteReportTargetLabel").textContent = `${report.shipmentId} (${report.packageStatus})`;
    getEl("deleteReportPassword").value = "";
    getEl("deleteReportAuthError").classList.add("d-none");
    openModal("deleteReportAuthModal");
  };

  getEl("deleteReportAuthForm").onsubmit = event => {
    event.preventDefault();
    if (!currentUser) return;

    const enteredPass = getEl("deleteReportPassword").value.trim();
    const matchedUser = USERS.find(
      u => u.username === currentUser.username && u.pass === enteredPass
    );

    if (!matchedUser) {
      getEl("deleteReportAuthError").classList.remove("d-none");
      return;
    }
    getEl("deleteReportAuthError").classList.add("d-none");

    const reportId = getEl("deleteReportIdInput").value;
    const report = reports.find(r => r.id === reportId);
    if (!report) {
      closeModal("deleteReportAuthModal");
      return;
    }

    const targetRole = currentUser.role === "Logistics Manager"
      ? "Warehouse Operator"
      : "Logistics Manager";

    report.deletePending = true;
    alerts.unshift({
      aid: "ALT-RPT-DEL-" + (idCounter++),
      id: report.shipmentId,
      reportId: report.id,
      cargo: report.cargo,
      type: "ReportDeleteRequest",
      state: "Active",
      isRead: false,
      requestedByName: currentUser.name,
      requestedByRole: currentUser.role,
      targetRole: targetRole,
      title: `Report Deletion Request: ${report.shipmentId}`,
      message: `${currentUser.name} (${currentUser.role}) wants to delete the report for ${report.shipmentId} (${report.packageStatus}). Agree or not?`,
      time: getTimestamp()
    });

    closeModal("deleteReportAuthModal");
    saveState();
    refreshAll();
    alert(`Consent request sent to Alerts for ${targetRole} approval.`);
  };

  window.handleReportDeleteConsent = (aid, agreed) => {
    const reqAlert = alerts.find(a => a.aid === aid && a.type === "ReportDeleteRequest");
    if (!reqAlert || !currentUser || currentUser.role !== reqAlert.targetRole) return;

    const responderLabel = `${currentUser.name} (${currentUser.role})`;
    const decidedAt = getTimestamp();

    reqAlert.state = "Resolved";
    reqAlert.decision = agreed ? "Agreed" : "Disagreed";
    reqAlert.isRead = true;
    reqAlert.resolvedBy = responderLabel;

    const report = reports.find(r => r.id === reqAlert.reportId);

    if (agreed) {
      reports = reports.filter(r => r.id !== reqAlert.reportId);
      const noticeMsg = `Both managers agreed. The report for ${reqAlert.id} has been deleted.`;
      alerts.unshift({
        aid: "ALT-RPT-RES-" + (idCounter++),
        id: reqAlert.id,
        cargo: reqAlert.cargo,
        type: "ReportDeleteNotice",
        decision: "Agreed",
        state: "Active",
        isRead: false,
        targetRole: reqAlert.requestedByRole,
        resolvedBy: responderLabel,
        title: `Report Deleted: ${reqAlert.id}`,
        message: noticeMsg,
        time: decidedAt
      });
      reportNotices.unshift({
        id: "RN-" + (idCounter++),
        targetRole: reqAlert.requestedByRole,
        agreed: true,
        title: `Report Deleted: ${reqAlert.id}`,
        message: noticeMsg,
        time: decidedAt
      });
    } else {
      if (report) report.deletePending = false;
      const refusalMsg = `Without the consent of both, this report cannot be deleted. (${responderLabel} did not agree to delete report for ${reqAlert.id}.)`;
      alerts.unshift({
        aid: "ALT-RPT-RES-" + (idCounter++),
        id: reqAlert.id,
        cargo: reqAlert.cargo,
        type: "ReportDeleteNotice",
        decision: "Disagreed",
        state: "Active",
        isRead: false,
        targetRole: reqAlert.requestedByRole,
        resolvedBy: responderLabel,
        title: `Report Deletion Declined: ${reqAlert.id}`,
        message: refusalMsg,
        time: decidedAt
      });
      reportNotices.unshift({
        id: "RN-" + (idCounter++),
        targetRole: reqAlert.requestedByRole,
        agreed: false,
        title: `Report Deletion Declined: ${reqAlert.id}`,
        message: refusalMsg,
        time: decidedAt
      });
    }

    saveState();
    refreshAll();
  };

  getEl("createReportForm").onsubmit = event => {
    event.preventDefault();
    const errorEl = getEl("reportFormError");
    const shipmentId = getEl("reportShipmentSelect").value;
    const packageStatus = getEl("reportPackageStatus").value;
    const summary = getEl("reportDetailsInput").value.trim();

    if (!shipmentId) {
      errorEl.textContent = "Please register a shipment before creating a report.";
      errorEl.classList.remove("d-none");
      return;
    }
    if (!summary) {
      errorEl.textContent = "Please enter package status details.";
      errorEl.classList.remove("d-none");
      return;
    }
    errorEl.classList.add("d-none");

    const shipment = shipments.find(s => s.id === shipmentId);
    reports.unshift({
      id: "RPT-" + (idCounter++),
      shipmentId: shipmentId,
      cargo: shipment ? shipment.cargo : "",
      packageStatus: packageStatus,
      summary: summary,
      createdBy: currentUser ? `${currentUser.name} (${currentUser.role})` : "Logistics Manager",
      createdAt: getTimestamp(),
      viewedByWarehouse: false,
      questions: []
    });

    getEl("reportDetailsInput").value = "";
    saveState();
    refreshAll();
    alert(`Report for ${shipmentId} sent to Warehouse.`);
  };

  window.askReportQuestion = (event, reportId) => {
    event.preventDefault();
    const inputEl = getEl("askInput_" + reportId);
    const questionText = inputEl ? inputEl.value.trim() : "";
    const report = reports.find(r => r.id === reportId);
    if (!report || !questionText) return;

    if (!Array.isArray(report.questions)) report.questions = [];
    report.questions.push({
      id: "Q-" + (idCounter++),
      questionText: questionText,
      askedBy: currentUser ? `${currentUser.name} (${currentUser.role})` : "Warehouse Operator",
      askedAt: getTimestamp(),
      replyText: "",
      repliedBy: "",
      repliedAt: "",
      replyViewedByWarehouse: false
    });

    saveState();
    refreshAll();
  };

  window.replyReportQuestion = (event, reportId, questionId) => {
    event.preventDefault();
    const inputEl = getEl("replyInput_" + questionId);
    const replyText = inputEl ? inputEl.value.trim() : "";
    const report = reports.find(r => r.id === reportId);
    const question = report && (report.questions || []).find(q => q.id === questionId);
    if (!question || !replyText) return;

    question.replyText = replyText;
    question.repliedBy = currentUser ? `${currentUser.name} (${currentUser.role})` : "Logistics Manager";
    question.repliedAt = getTimestamp();
    question.replyViewedByWarehouse = false;

    saveState();
    refreshAll();
  };

  // --- Modals & Shipment Actions ---
  window.openResolveModal = aid => {
    const alertItem = alerts.find(x => x.aid === aid && x.state !== "Resolved");
    const shipment = alertItem && shipments.find(item => item.id === alertItem.id);
    if (!shipment) return;

    getEl("resolveAlertId").value = aid;
    getEl("resolveShipmentId").value = shipment.id;
    getEl("resShipmentRef").textContent = shipment.id;
    getEl("resCargo").textContent = shipment.cargo;
    getEl("resSafeRange").textContent = `${shipment.min}°C to ${shipment.max}°C`;
    getEl("resCurrentTemp").textContent = `${alertItem.temp}°C`;
    getEl("regulatedTempInput").value = "";
    getEl("resolveWarningBox").classList.add("d-none");
    openModal("resolveModal");
  };

  getEl("resolveForm").onsubmit = event => {
    event.preventDefault();
    const shipment = shipments.find(item => item.id === getEl("resolveShipmentId").value);
    const alertItem = alerts.find(item => item.aid === getEl("resolveAlertId").value);
    const regulatedTemp = parseFloat(getEl("regulatedTempInput").value);

    if (!shipment || isNaN(regulatedTemp) || regulatedTemp < shipment.min || regulatedTemp > shipment.max) {
      const rangeText = shipment ? `${shipment.min}°C to ${shipment.max}°C` : "safe range";
      getEl("resolveWarningMsg").textContent = `Must be within safe range (${rangeText}).`;
      getEl("resolveWarningBox").classList.remove("d-none");
      return;
    }

    shipment.readings.push({ temp: regulatedTemp, time: getCurrentTime(), alertDeleted: false });
    if (alertItem) {
      alertItem.state = "Resolved";
      alertItem.isRead = true;
    }
    saveState();
    closeModal("resolveModal");
    refreshAll();
  };

  window.openCancelModal = id => {
    const shipment = shipments.find(item => item.id === id);
    if (!shipment) return;

    getEl("cancelShipmentId").value = shipment.id;
    getEl("cancelShipmentLabel").textContent = `${shipment.id} (${shipment.cargo})`;
    getEl("cancelReasonSelect").selectedIndex = 0;
    getEl("customReasonBox").classList.add("d-none");
    getEl("customReasonError").classList.add("d-none");
    getEl("customReasonInput").value = "";
    getEl("cancelReasonNotes").value = "";
    openModal("cancelRequestModal");
  };

  getEl("cancelReasonSelect").onchange = () => {
    const isCustom = getEl("cancelReasonSelect").value === "NONE";
    getEl("customReasonBox").classList.toggle("d-none", !isCustom);
    if (isCustom) getEl("customReasonInput").focus();
  };

  getEl("cancelRequestForm").onsubmit = event => {
    event.preventDefault();
    const shipmentId = getEl("cancelShipmentId").value;
    const isCustom = getEl("cancelReasonSelect").value === "NONE";
    const reason = isCustom
      ? getEl("customReasonInput").value.trim()
      : getEl("cancelReasonSelect").value;

    if (isCustom && !reason) {
      getEl("customReasonError").classList.remove("d-none");
      return;
    }

    const shipment = shipments.find(item => item.id === shipmentId);
    cancellations.unshift({
      id: "REQ-" + (idCounter++),
      shipmentId: shipmentId,
      cargo: shipment ? shipment.cargo : "",
      reason: reason,
      notes: getEl("cancelReasonNotes").value.trim(),
      requestedBy: currentUser ? `${currentUser.name} (Logistics Manager)` : "Logistics Manager",
      time: getTimestamp(),
      state: "Pending"
    });

    closeModal("cancelRequestModal");
    saveState();
    refreshAll();
    alert(`Cancellation request for ${shipmentId} sent to Warehouse Operator.`);
  };

  getEl("btnOpenAddShipment").onclick = () => {
    getEl("addShipmentForm").reset();
    getEl("addShipmentError").classList.add("d-none");
    openModal("addShipmentModal");
  };

  getEl("addShipmentForm").onsubmit = event => {
    event.preventDefault();
    const id = getEl("newShipmentId").value.trim().toUpperCase();
    const min = parseFloat(getEl("newMinTemp").value);
    const max = parseFloat(getEl("newMaxTemp").value);
    const initTemp = parseFloat(getEl("newInitialTemp").value);

    let errorMsg = "";
    if (!/^[A-Z0-9-]{3,12}$/.test(id)) {
      errorMsg = "ID must be 3-12 alphanumeric characters or dashes.";
    } else if (shipments.some(s => s.id === id)) {
      errorMsg = "Shipment ID already exists.";
    } else if (isNaN(min) || isNaN(max) || min >= max) {
      errorMsg = "Min temp must be strictly below max temp.";
    } else if (isNaN(initTemp)) {
      errorMsg = "Please enter a valid initial temperature.";
    }

    if (errorMsg) {
      getEl("addShipmentError").textContent = errorMsg;
      getEl("addShipmentError").classList.remove("d-none");
      return;
    }

    shipments.unshift({
      id: id,
      cargo: getEl("newCargo").value.trim(),
      origin: getEl("newOrigin").value.trim(),
      dest: getEl("newDest").value.trim(),
      min: min,
      max: max,
      status: "Active",
      readings: [{ temp: initTemp, time: getCurrentTime(), alertDeleted: false }]
    });

    saveState();
    closeModal("addShipmentModal");
    refreshAll();
  };

  window.markDelivered = id => {
    const shipment = shipments.find(item => item.id === id);
    if (shipment && confirm(`Mark ${id} as delivered?`)) {
      shipment.status = "Delivered";
      shipment.deliveredAt = getTimestamp();
      saveState();
      refreshAll();
    }
  };

  window.promptDeleteShipment = id => {
    pendingDeleteShipmentId = id;
    getEl("deleteTargetShipmentId").textContent = id;
    getEl("deleteAuthUserId").value = currentUser ? currentUser.username : "";
    getEl("deleteAuthPassword").value = "";
    getEl("deleteAuthError").classList.add("d-none");
    openModal("deleteAuthModal");
  };

  getEl("deleteAuthForm").onsubmit = event => {
    event.preventDefault();
    const authUser = getEl("deleteAuthUserId").value.trim().toLowerCase();
    const authPass = getEl("deleteAuthPassword").value.trim();
    const matched = USERS.find(u => u.username.toLowerCase() === authUser && u.pass === authPass);

    if (!matched || matched.role !== "Logistics Manager") {
      getEl("deleteAuthError").textContent = "Unauthorized: Only Logistics Managers can delete packages.";
      getEl("deleteAuthError").classList.remove("d-none");
      return;
    }

    const targetId = pendingDeleteShipmentId;
    shipments = shipments.filter(s => s.id !== targetId);
    alerts = alerts.filter(a => a.id !== targetId);
    cancellations = cancellations.filter(c => c.shipmentId !== targetId);
    managerNotifications = managerNotifications.filter(n => n.shipmentId !== targetId);
    reports = reports.filter(r => r.shipmentId !== targetId);

    saveState();
    closeModal("deleteAuthModal");
    pendingDeleteShipmentId = null;
    refreshAll();
  };

  getEl("btnDeleteDelivered").onclick = () => {
    const deliveredList = shipments.filter(s => s.status === "Delivered");
    if (deliveredList.length === 0) return alert("No delivered shipments.");
    if (confirm(`Remove all ${deliveredList.length} delivered shipments from history?`)) {
      shipments = shipments.filter(s => s.status !== "Delivered");
      saveState();
      refreshAll();
    }
  };

  window.showDetails = id => {
    currentShipmentId = id;
    const shipment = shipments.find(item => item.id === id);
    if (!shipment) return;

    getEl("modalTitle").textContent = `${shipment.id} (${shipment.cargo})`;
    getEl("modalLimits").textContent = `${shipment.min}°C to ${shipment.max}°C`;
    getEl("modalCurrent").textContent = `${getLatestReading(shipment).temp}°C`;
    getEl("addPingForm").classList.toggle("d-none", shipment.status !== "Active");
    getEl("modalHistoryList").innerHTML = shipment.readings
      .slice()
      .reverse()
      .map(r => `<li class="list-group-item d-flex justify-content-between py-1"><span>${escapeHtml(r.time)}</span><strong>${r.temp}°C</strong></li>`)
      .join("");
    openModal("detailsModal");
  };

  getEl("addPingForm").onsubmit = event => {
    event.preventDefault();
    const shipment = shipments.find(item => item.id === currentShipmentId);
    const tempVal = parseFloat(getEl("manualTempInput").value);
    if (!shipment || isNaN(tempVal)) return;

    shipment.readings.push({ temp: tempVal, time: getCurrentTime(), alertDeleted: false });
    getEl("manualTempInput").value = "";
    saveState();
    window.showDetails(currentShipmentId);
    refreshAll();
  };

  getEl("btnSimulatePing").onclick = () => {
    const activeList = getActiveShipments();
    if (activeList.length === 0) {
      alert("No active shipments to check. Register a shipment first.");
      return;
    }
    activeList.forEach(shipment => {
      shipment.readings.push({
        temp: generateSimulatedTemp(shipment),
        time: getCurrentTime(),
        alertDeleted: false
      });
    });
    saveState();
    refreshAll();
  };

  // --- Theme & Initial Render ---
  if (getEl("btnTheme")) {
    getEl("btnTheme").onclick = () => {
      const currentTheme = document.documentElement.getAttribute("data-bs-theme");
      applyTheme(currentTheme === "dark" ? "light" : "dark");
    };
  }

  // Load shared state from cloud and poll every 4s for live multi-user sync
  function syncFromCloud() {
    if (typeof fetch !== "function" || isSavingToCloud || hasQueuedSave) return Promise.resolve();
    const seqAtStart = stateMutationSeq;

    return cloudFetch({ cache: "no-store" })
      .then(res => {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .then(data => {
        // Ignore stale GET responses if user made changes while this GET was in flight
        if (isSavingToCloud || hasQueuedSave || stateMutationSeq !== seqAtStart) return;

        const normalized = normalizeSnapshotForCompare(data);
        const incomingSignature = JSON.stringify(normalized);
        const firstLoad = !cloudReady;
        cloudReady = true;

        if (firstLoad || incomingSignature !== lastCloudSignature) {
          lastCloudSignature = incomingSignature;
          applyCloudSnapshot(data);
          if (currentUser) {
            syncHeaderProfile();
            if (currentActiveView === "Alerts") markCurrentAlertsAsRead();
            if (currentActiveView === "Reports") markReportsViewedByWarehouse();
            refreshAll();
          }
        }
        updateCloudStatus("System Online", "Cloud Synced", false);
      })
      .catch(err => {
        updateCloudStatus("Sync Error", (err && err.message) || "Connection issue", true);
      });
  }

  setAuth(currentUser);
  syncFromCloud();
  setInterval(syncFromCloud, 4000);
});

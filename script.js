// ColdChain Monitor - Ultra-Shrunk Application Controller (script.js)
const USERS = [{ username: "Arnav", pass: "123", name: "Arnav", role: "Logistics Manager" }, { username: "Sourabh", pass: "123", name: "Sourabh", role: "Warehouse Operator" }];
const PROFILES = {
  Arnav: { name: "Arnav", role: "Logistics Manager", duty: "OJT project under Kshitij sir", details: { Email: "arnavpratap60@gmail.com", Phone: "852 8600 376", "Station / Hub": "Polaris School of Technology Bangalore", "Shift Hours": "08:00 - 17:00 IST" } },
  Sourabh: { name: "Sourabh", role: "Warehouse Operator", duty: "OJT project under Kshitij sir", details: { Email: "sourabh@coldchain.io", Phone: "70195 885 90", "Station / Hub": "Polaris School of Technology Bangalore", "Shift Hours": "14:00 - 23:00 IST" } }
};
const INITIAL_SHIPMENTS = [
  { id: "SHP-101", cargo: "Fresh Produce", origin: "Mumbai", dest: "Pune", min: 2, max: 8, status: "Active", readings: [{ temp: 5.2, time: "10:00" }, { temp: 6.1, time: "10:30" }] },
  { id: "SHP-102", cargo: "mRNA Vaccines", origin: "Hyderabad", dest: "Bengaluru", min: -25, max: -15, status: "Active", readings: [{ temp: -21.4, time: "09:00" }, { temp: -20.5, time: "09:45" }] },
  { id: "SHP-103", cargo: "Dairy Products", origin: "Anand", dest: "Delhi", min: 1, max: 4, status: "Active", readings: [{ temp: 2.5, time: "08:00" }, { temp: 7.2, time: "08:30" }] },
  { id: "SHP-104", cargo: "Frozen Seafood", origin: "Kochi", dest: "Chennai", min: -18, max: -12, status: "Active", readings: [{ temp: -15.1, time: "11:00" }, { temp: -14.8, time: "11:30" }] },
  { id: "SHP-105", cargo: "Blood Plasma & Biologics", origin: "Jaipur", dest: "Delhi", min: 2, max: 6, status: "Active", readings: [{ temp: 4.2, time: "07:30" }, { temp: 7.1, time: "08:15" }] },
  { id: "SHP-106", cargo: "Insulin Vials", origin: "Ahmedabad", dest: "Kolkata", min: 2, max: 8, status: "Active", readings: [{ temp: 5.0, time: "06:00" }, { temp: 11.4, time: "07:00" }] },
  { id: "SHP-107", cargo: "Chilled Poultry", origin: "Chandigarh", dest: "Lucknow", min: 0, max: 4, status: "Active", readings: [{ temp: 1.8, time: "09:15" }, { temp: 2.1, time: "10:00" }] },
  { id: "SHP-108", cargo: "Premium Chocolates", origin: "Indore", dest: "Bhopal", min: 12, max: 18, status: "Active", readings: [{ temp: 14.2, time: "10:45" }, { temp: 15.5, time: "11:15" }] },
  { id: "SHP-201", cargo: "Ice Cream & Desserts", origin: "Nagpur", dest: "Raipur", min: -22, max: -16, status: "Delivered", deliveredAt: "15/11/2026 14:30", readings: [{ temp: -18.2, time: "14:15" }] },
  { id: "SHP-202", cargo: "Diagnostic Test Kits", origin: "Bengaluru", dest: "Chennai", min: 2, max: 8, status: "Delivered", deliveredAt: "15/11/2026 16:15", readings: [{ temp: 4.8, time: "16:00" }] },
  { id: "SHP-203", cargo: "Frozen Organic Berries", origin: "Shimla", dest: "Delhi", min: -20, max: -14, status: "Delivered", deliveredAt: "15/11/2026 18:00", readings: [{ temp: -16.5, time: "17:45" }] },
  { id: "SHP-301", cargo: "Seasonal Cut Fruits", origin: "Nashik", dest: "Mumbai", min: 2, max: 6, status: "Cancelled", cancelReason: "Severe Spoilage / Thermal Shock", cancelNotes: "Cooling system failed near Igatpuri ghats. Ambient reached 18°C.", cancelRequestedBy: "Arnav (Logistics Manager)", cancelApprovedBy: "Sourabh (Warehouse Operator)", cancelledAt: "15/11/2026 11:20", readings: [{ temp: 18.2, time: "11:00" }] },
  { id: "SHP-302", cargo: "Live Bacterial Cultures", origin: "Vadodara", dest: "Surat", min: -20, max: -15, status: "Cancelled", cancelReason: "Refrigeration Unit Mechanical Failure", cancelNotes: "Compressor drive belt snapped; vehicle diverted safely to depot.", cancelRequestedBy: "Arnav (Logistics Manager)", cancelApprovedBy: "Sourabh (Warehouse Operator)", cancelledAt: "15/11/2026 13:45", readings: [{ temp: -8.4, time: "13:30" }] },
  { id: "SHP-303", cargo: "Imported Gourmet Butter", origin: "Goa", dest: "Pune", min: 1, max: 4, status: "Cancelled", cancelReason: "Damaged Cargo Seals", cancelNotes: "Container security seal compromised at toll plaza inspection.", cancelRequestedBy: "Arnav (Logistics Manager)", cancelApprovedBy: "Sourabh (Warehouse Operator)", cancelledAt: "15/11/2026 15:10", readings: [{ temp: 3.2, time: "14:50" }] },
  { id: "SHP-304", cargo: "Veterinary Vaccines", origin: "Mysuru", dest: "Hubballi", min: 2, max: 8, status: "Cancelled", cancelReason: "Route Diverted / Client Cancelled", cancelNotes: "Consignee cold warehouse flooded; order cancelled by client.", cancelRequestedBy: "Arnav (Logistics Manager)", cancelApprovedBy: "Sourabh (Warehouse Operator)", cancelledAt: "15/11/2026 17:30", readings: [{ temp: 5.5, time: "17:15" }] }
];
const INITIAL_CANCELLATIONS = [
  { id: "REQ-301", shipmentId: "SHP-301", cargo: "Seasonal Cut Fruits", reason: "Severe Spoilage / Thermal Shock", notes: "Cooling system failed near Igatpuri ghats. Ambient reached 18°C.", requestedBy: "Arnav (Logistics Manager)", resolvedBy: "Sourabh (Warehouse Operator)", resolvedAt: "15/11/2026 11:20", time: "15/11/2026 11:05", state: "Approved" },
  { id: "REQ-302", shipmentId: "SHP-302", cargo: "Live Bacterial Cultures", reason: "Refrigeration Unit Mechanical Failure", notes: "Compressor drive belt snapped; vehicle diverted safely to depot.", requestedBy: "Arnav (Logistics Manager)", resolvedBy: "Sourabh (Warehouse Operator)", resolvedAt: "15/11/2026 13:45", time: "15/11/2026 13:20", state: "Approved" },
  { id: "REQ-303", shipmentId: "SHP-303", cargo: "Imported Gourmet Butter", reason: "Damaged Cargo Seals", notes: "Container security seal compromised at toll plaza inspection.", requestedBy: "Arnav (Logistics Manager)", resolvedBy: "Sourabh (Warehouse Operator)", resolvedAt: "15/11/2026 15:10", time: "15/11/2026 14:50", state: "Approved" },
  { id: "REQ-304", shipmentId: "SHP-304", cargo: "Veterinary Vaccines", reason: "Route Diverted / Client Cancelled", notes: "Consignee cold warehouse flooded; order cancelled by client.", requestedBy: "Arnav (Logistics Manager)", resolvedBy: "Sourabh (Warehouse Operator)", resolvedAt: "15/11/2026 17:30", time: "15/11/2026 17:15", state: "Approved" }
];
const VIEWS = ["Dashboard", "Alerts", "Cancellations", "Delivered", "Cancelled"], $ = id => document.getElementById(id);
const nowTime = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), stamp = () => new Date().toLocaleDateString("en-GB") + " " + nowTime();
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const openModal = id => { const el = $(id); if (el) window.bootstrap?.Modal ? bootstrap.Modal.getOrCreateInstance(el).show() : (el.classList.add("show"), el.style.display = "block"); };
const closeModal = id => { const el = $(id); if (el) { window.bootstrap?.Modal && bootstrap.Modal.getInstance(el)?.hide(); el.classList.remove("show"); el.style.display = "none"; document.querySelector(".modal-backdrop")?.remove(); } };
const loadState = (k, fb) => { try { const r = localStorage.getItem(k); return r ? JSON.parse(r) : fb; } catch { return fb; } };
const applyTheme = t => { document.documentElement.setAttribute("data-bs-theme", t); localStorage.setItem("cc_theme", t); if ($("themeIcon")) $("themeIcon").className = t === "dark" ? "bi bi-sun" : "bi bi-moon-stars"; }; applyTheme(localStorage.getItem("cc_theme") || "light");

let shipments = loadState("cc_shipments", INITIAL_SHIPMENTS); if (!Array.isArray(shipments) || shipments.length < 10) shipments = INITIAL_SHIPMENTS.map(s => ({ ...s }));
let alerts = loadState("cc_alerts", []), cancellations = loadState("cc_cancellations", INITIAL_CANCELLATIONS), managerNotifications = loadState("cc_manager_notifications", []);
let currentUser = loadState("cc_user", null), currentShipmentId = null, currentActiveView = "Dashboard", pendingDeleteShipmentId = null, seq = Date.now();
alerts.forEach(a => { if (!a.aid) a.aid = "ALT-" + (seq++); });
const latestOf = s => s?.readings?.length ? s.readings[s.readings.length - 1] : { temp: 0, time: "00:00" }, activeShipments = () => shipments.filter(s => s?.status === "Active");
const saveState = () => ["shipments", "alerts", "cancellations", "manager_notifications", "user"].forEach(k => localStorage.setItem("cc_" + k, JSON.stringify(k === "shipments" ? shipments : k === "alerts" ? alerts : k === "cancellations" ? cancellations : k === "manager_notifications" ? managerNotifications : currentUser)));
const evaluateTemp = (t, min, max) => (typeof t !== "number" || isNaN(t)) ? { status: "Normal", text: "text-secondary" } : (t >= min && t <= max) ? { status: "Normal", text: "text-success" } : { status: Math.abs(t > max ? t - max : min - t) >= 2.0 ? "Critical" : "Warning", text: Math.abs(t > max ? t - max : min - t) >= 2.0 ? "text-danger" : "text-warning" };
const statusBadge = s => `<span class="badge-status badge-${s}"><i class="bi ${s === 'Normal' ? 'bi-check-circle-fill' : s === 'Warning' ? 'bi-exclamation-triangle-fill' : 'bi-x-octagon-fill'} me-1"></i>${s}</span>`;
const randomReading = s => +(Math.random() < 0.4 ? s.min + Math.random() * (s.max - s.min) : (Math.random() < 0.5 ? s.max + (Math.random() < 0.7 ? 0.2 + Math.random() * 1.6 : 2.0 + Math.random() * 3.0) : s.min - (Math.random() < 0.7 ? 0.2 + Math.random() * 1.6 : 2.0 + Math.random() * 3.0))).toFixed(1);

document.addEventListener("DOMContentLoaded", () => {
  document.addEventListener("click", e => { const btn = e.target.closest("[data-bs-dismiss='modal']"); if (btn) closeModal(btn.closest(".modal").id); });

  function runEvaluation() {
    activeShipments().forEach(s => {
      const latest = latestOf(s), res = evaluateTemp(latest.temp, s.min, s.max);
      if (res.status !== "Normal" && !latest.alertDeleted && !alerts.some(a => a.id === s.id && a.temp === latest.temp && a.time === latest.time)) {
        alerts.unshift({ aid: "ALT-" + (seq++), id: s.id, cargo: s.cargo, temp: latest.temp, status: res.status, time: latest.time, state: "Active", requested: false });
      }
    });
    saveState();
  }

  function setAuth(user) {
    currentUser = user; saveState();
    if (user) {
      $("loginSection").classList.add("d-none"); $("appSection").classList.remove("d-none");
      $("navUserName").textContent = user.name; $("userRoleBadge").textContent = user.role;
      $("navCancelItem")?.classList.toggle("d-none", user.role !== "Warehouse Operator");
      if (user.role !== "Warehouse Operator" && currentActiveView === "Cancellations") currentActiveView = "Dashboard";
      switchView(currentActiveView);
    } else {
      $("loginSection").classList.remove("d-none"); $("appSection").classList.add("d-none");
      $("loginUsername").value = $("loginPassword").value = ""; $("loginError").classList.add("d-none");
    }
  }

  $("loginForm").onsubmit = e => {
    e.preventDefault();
    const found = USERS.find(x => x.username.toLowerCase() === $("loginUsername").value.trim().toLowerCase() && x.pass === $("loginPassword").value.trim());
    found ? ($("loginError").classList.add("d-none"), setAuth(found)) : $("loginError").classList.remove("d-none");
  };
  $("btnLogout").onclick = () => setAuth(null);

  $("userProfileChip").onclick = () => {
    if (!currentUser) return;
    const p = PROFILES[currentUser.username] || { name: currentUser.name, role: currentUser.role, duty: "OJT project under Kshitij sir", details: {} };
    $("profModalName").textContent = p.name; $("profModalRole").textContent = p.role; $("profModalDuty").textContent = p.duty;
    $("profModalDetailsList").innerHTML = Object.entries(p.details).map(([k, v]) => `<dt class="col-4 text-secondary">${esc(k)}</dt><dd class="col-8 mb-2 font-monospace">${esc(v)}</dd>`).join("");
    openModal("userProfileModal");
  };

  function switchView(name) {
    currentActiveView = name;
    VIEWS.forEach(v => { $("view" + v)?.classList.toggle("d-none", v !== name); $("nav" + v)?.classList.toggle("active", v === name); });
    renderAll();
  }
  VIEWS.forEach(v => $("nav" + v) && ($("nav" + v).onclick = () => switchView(v)));
  $("kpiCriticalCard").onclick = () => switchView("Alerts");

  function renderAll() {
    runEvaluation(); renderDashboard(); renderAlerts(); renderRequests(); renderDelivered(); renderCancelled();
  }

  function renderManagerNotifications() {
    const c = $("managerNotificationsContainer"); if (!c) return;
    if (currentUser?.role !== "Logistics Manager" || !managerNotifications.length) { c.innerHTML = ""; return; }
    c.innerHTML = `<div class="card border-0 shadow-sm mb-3 bg-light"><div class="card-header bg-white py-2 px-3 d-flex justify-content-between align-items-center"><div class="fw-bold small"><i class="bi bi-bell-fill text-primary me-2"></i>Operator Cancellation Decisions (${managerNotifications.length})</div><button class="btn btn-sm btn-link text-muted p-0 small text-decoration-none" onclick="clearAllManagerNotifications()">Dismiss All</button></div><div class="card-body p-2">${managerNotifications.map(n => `<div class="alert ${n.type === "Approved" ? "alert-success border-success" : "alert-danger border-danger"} d-flex justify-content-between align-items-start py-2 px-3 mb-2 shadow-sm rounded"><div><strong class="${n.type === "Approved" ? "text-success" : "text-danger"}">${esc(n.title)}</strong><div class="small">${esc(n.message)}</div><small class="text-muted">${esc(n.time)}</small></div><button class="btn btn-sm btn-link text-secondary p-0 ms-2" onclick="dismissManagerNotification('${n.id}')"><i class="bi bi-x-lg"></i></button></div>`).join("")}</div></div>`;
  }
  window.dismissManagerNotification = id => { managerNotifications = managerNotifications.filter(n => n.id !== id); saveState(); renderAll(); };
  window.clearAllManagerNotifications = () => { managerNotifications = []; saveState(); renderAll(); };

  function renderDashboard() {
    renderManagerNotifications();
    const q = $("searchInput").value.trim().toLowerCase(), filter = $("statusFilter").value;
    let normal = 0, warn = 0, crit = 0, isOp = currentUser?.role === "Warehouse Operator", isMgr = currentUser?.role === "Logistics Manager";
    const rows = activeShipments().map(s => {
      const latest = latestOf(s), cond = evaluateTemp(latest.temp, s.min, s.max);
      cond.status === "Normal" ? normal++ : (cond.status === "Warning" ? warn++ : crit++);
      if (!`${s.id} ${s.cargo} ${s.origin} ${s.dest}`.toLowerCase().includes(q) || (filter !== "ALL" && cond.status !== filter)) return "";
      const hasPending = cancellations.some(c => c.shipmentId === s.id && c.state === "Pending");
      let actions = `<button class="btn btn-sm btn-outline-primary py-0" onclick="showDetails('${s.id}')">History</button>`;
      if (isOp) actions += `<button class="btn btn-sm btn-outline-success py-0 ms-1" onclick="markDelivered('${s.id}')" title="Deliver"><i class="bi bi-check-lg"></i></button>`;
      if (isMgr) {
        actions += hasPending ? `<button class="btn btn-sm btn-outline-secondary py-0 ms-1 disabled" disabled title="Pending Approval"><i class="bi bi-hourglass-split"></i></button>` : `<button class="btn btn-sm btn-outline-warning text-dark py-0 ms-1" onclick="openCancelModal('${s.id}')" title="Cancel"><i class="bi bi-x-circle"></i></button>`;
        actions += `<button class="btn btn-sm btn-outline-danger py-0 ms-1" onclick="promptDeleteShipment('${s.id}')" title="Delete"><i class="bi bi-trash"></i></button>`;
      }
      return `<tr><td class="fw-bold">${esc(s.id)}</td><td>${esc(s.cargo)}</td><td class="small text-muted">${esc(s.origin)} → ${esc(s.dest)}</td><td class="font-monospace small">${s.min}°C to ${s.max}°C</td><td class="fw-bold ${cond.text}">${latest.temp > 0 ? "+" : ""}${latest.temp}°C</td><td>${statusBadge(cond.status)}${hasPending ? '<span class="badge bg-warning text-dark ms-1"><i class="bi bi-hourglass-split me-1"></i>Cancel Pending</span>' : ''}</td><td class="text-end text-nowrap">${actions}</td></tr>`;
    }).filter(Boolean);
    $("statTotal").textContent = activeShipments().length; $("statNormal").textContent = normal; $("statWarning").textContent = warn; $("statCritical").textContent = crit;
    $("shipmentTableBody").innerHTML = rows.join("") || `<tr><td colspan="7" class="text-center text-muted py-3">No matching shipments found.</td></tr>`;
  }

  function renderAlerts() {
    const unresolved = alerts.filter(a => a.state !== "Resolved").length, isOp = currentUser?.role === "Warehouse Operator", isMgr = currentUser?.role === "Logistics Manager";
    $("navAlertsBadge").textContent = unresolved; $("unresolvedBadge").textContent = `${unresolved} Active`;
    $("alertsList").innerHTML = alerts.map(a => a.type === "Cancellation" ? `
      <div class="alert-item mb-3 p-3 border rounded shadow-sm bg-white ${a.decision === "Approved" ? "border-success" : "border-danger"}">
        <div class="d-flex justify-content-between align-items-start gap-2">
          <div class="d-flex align-items-start gap-2"><i class="bi ${a.decision === "Approved" ? "bi-check-circle-fill text-success" : "bi-x-circle-fill text-danger"} fs-4 mt-1"></i><div>
            <div class="d-flex align-items-center gap-2 mb-1"><strong>${esc(a.id)}</strong>${a.cargo ? `<span class="badge bg-light text-dark border">${esc(a.cargo)}</span>` : ""}<span class="badge ${a.decision === "Approved" ? "bg-success" : "bg-danger"}">${esc(a.decision)}</span><span class="badge ${a.state === 'Resolved' ? 'bg-secondary' : 'bg-primary'}">${a.state === 'Resolved' ? 'Acknowledged' : 'New Notice'}</span></div>
            <div class="fw-semibold ${a.decision === "Approved" ? 'text-success' : 'text-danger'} mb-1">${esc(a.title)}</div><div class="small text-dark mb-1">${esc(a.message)}</div><small class="text-muted"><i class="bi bi-person-check me-1"></i>Decided by: <strong>${esc(a.resolvedBy)}</strong> | ${esc(a.time)}</small>
          </div></div>
          <div class="d-flex align-items-center gap-1">${a.state !== "Resolved" ? `<button class="btn btn-sm btn-outline-secondary py-0" onclick="acknowledgeAlert('${a.aid}')">Acknowledge</button>` : '<span class="badge bg-secondary">Read</span>'}<button class="btn btn-sm btn-outline-danger py-0 ms-1" onclick="deleteAlert('${a.aid}')"><i class="bi bi-trash"></i></button></div>
        </div>
      </div>` : `
      <div class="alert-item ${a.status} ${a.state} mb-2">
        <div class="d-flex justify-content-between align-items-center gap-2">
          <div><strong>${esc(a.id)}</strong> (${esc(a.cargo)}) — Recorded: <span class="text-danger fw-bold">${a.temp}°C</span> ${statusBadge(a.status)}<div class="small text-muted">Status: <strong>${esc(a.state)}</strong> | Violation: ${esc(a.time)}</div></div>
          <div>${a.state === "Resolved" ? '<span class="badge bg-secondary">Closed</span>' : (isOp ? (a.requested ? '<span class="badge bg-warning text-dark border">Request Sent</span>' : `<button class="btn btn-sm btn-warning py-0" onclick="sendAlertRequest('${a.aid}')"><i class="bi bi-send me-1"></i>Send Request</button>`) : (isMgr ? `<button class="btn btn-sm btn-success py-0" onclick="openResolveModal('${a.aid}')"><i class="bi bi-sliders me-1"></i>Resolve</button>` : ""))}<button class="btn btn-sm btn-outline-danger py-0 ms-1" onclick="deleteAlert('${a.aid}')"><i class="bi bi-trash"></i></button></div>
        </div>
        ${(isMgr && a.requested && a.state !== "Resolved") ? `<div class="alert alert-warning py-1 px-2 my-2 small border-warning d-flex align-items-center gap-2"><i class="bi bi-envelope-exclamation-fill text-danger"></i><div><strong>Operator Notice:</strong> Package in <span class="text-danger fw-bold">${esc(a.status)}</span> condition, please resolve.</div></div>` : ""}
      </div>`).join("") || '<p class="text-muted small text-center my-3">No active temperature alerts.</p>';
  }

  window.acknowledgeAlert = aid => { const a = alerts.find(x => x.aid === aid); if (a) { a.state = "Resolved"; saveState(); renderAll(); } };
  window.sendAlertRequest = aid => { const a = alerts.find(x => x.aid === aid); if (a) { a.requested = true; saveState(); renderAll(); alert(`Notice sent to Logistics Manager for package ${a.id}`); } };
  window.deleteAlert = aid => {
    const a = alerts.find(x => x.aid === aid); if (!a || !confirm(`Delete alert for ${a.id}?`)) return;
    const s = shipments.find(item => item.id === a.id), r = s?.readings?.find(rd => rd.time === a.time && rd.temp === a.temp);
    if (r) r.alertDeleted = true;
    alerts = alerts.filter(x => x.aid !== aid); saveState(); renderAll();
  };
  $("btnDeleteAllAlerts").onclick = () => {
    if (!alerts.length) return alert("No alerts to delete.");
    if (confirm(`Delete all ${alerts.length} alerts?`)) {
      alerts.forEach(a => { const s = shipments.find(item => item.id === a.id), r = s?.readings?.find(rd => rd.time === a.time && rd.temp === a.temp); if (r) r.alertDeleted = true; });
      alerts = []; saveState(); renderAll();
    }
  };

  function renderRequests() {
    const pending = cancellations.filter(c => c.state === "Pending").length;
    $("navCancelBadge").textContent = pending; $("pendingCancelBadge").textContent = `${pending} Pending`;
    $("cancellationsList").innerHTML = cancellations.map(c => `
      <div class="request-item ${c.state} mb-3 p-3 border rounded shadow-sm bg-white">
        <div class="d-flex justify-content-between align-items-start gap-2">
          <div>
            <div class="d-flex align-items-center gap-2 mb-1"><span class="fs-6 fw-bold">${esc(c.shipmentId)}</span>${c.cargo ? `<span class="badge bg-light text-dark border">${esc(c.cargo)}</span>` : ""}<span class="badge ${c.state === "Pending" ? "bg-warning text-dark" : (c.state === "Approved" ? "bg-success" : "bg-danger")}">${c.state}</span></div>
            <div class="small mb-1"><strong>Reason:</strong> <span class="text-danger fw-semibold">${esc(c.reason)}</span></div>
            <div class="small text-muted"><i class="bi bi-person me-1"></i>Requested by: <strong>${esc(c.requestedBy)}</strong> | ${esc(c.time)}</div>
            ${c.notes ? `<div class="small text-secondary fst-italic mt-1 bg-light p-1 rounded">"${esc(c.notes)}"</div>` : ""}${c.resolvedBy ? `<div class="small mt-1"><strong>Decision by:</strong> ${esc(c.resolvedBy)} at ${esc(c.resolvedAt)}</div>` : ""}
          </div>
          <div>${c.state === "Pending" && currentUser?.role === "Warehouse Operator" ? `<div class="btn-group"><button class="btn btn-sm btn-success px-3" onclick="handleCancelRequest('${c.id}', true)"><i class="bi bi-check-circle me-1"></i>Approve</button><button class="btn btn-sm btn-outline-danger px-3 ms-1" onclick="handleCancelRequest('${c.id}', false)"><i class="bi bi-x-circle me-1"></i>Reject</button></div>` : `<span class="badge ${c.state === "Approved" ? "bg-success" : (c.state === "Rejected" ? "bg-danger" : "bg-secondary")} p-2">${c.state}</span>`}</div>
        </div>
      </div>`).join("") || '<p class="text-muted small text-center my-3">No cancellation requests in queue.</p>';
  }

  window.handleCancelRequest = (reqId, approved) => {
    const req = cancellations.find(c => c.id === reqId); if (!req) return;
    const op = currentUser?.name || "Sourabh", s = shipments.find(item => item.id === req.shipmentId), dec = approved ? "Approved" : "Rejected";
    req.state = dec; req.resolvedBy = `${op} (Warehouse Operator)`; req.resolvedAt = stamp();
    if (approved && s) {
      s.status = "Cancelled"; s.cancelReason = req.reason; s.cancelNotes = req.notes; s.cancelRequestedBy = req.requestedBy; s.cancelApprovedBy = req.resolvedBy; s.cancelledAt = stamp();
      alerts = alerts.filter(a => !(a.id === req.shipmentId && a.type !== "Cancellation" && a.state !== "Resolved"));
    }
    const msg = approved ? `Cancellation for package ${req.shipmentId} was APPROVED by Warehouse Operator (${op}). Moved to Cancelled Orders.` : `Cancellation for package ${req.shipmentId} was REJECTED by Warehouse Operator (${op}). Package remains Active.`;
    alerts.unshift({ aid: "ALT-CAN-" + (seq++), id: req.shipmentId, cargo: s?.cargo || req.cargo || "", type: "Cancellation", decision: dec, status: dec, state: "Active", title: `Cancellation ${dec}: ${req.shipmentId}`, message: msg, time: stamp(), resolvedBy: req.resolvedBy });
    managerNotifications.unshift({ id: "NOTIF-" + (seq++), shipmentId: req.shipmentId, type: dec, title: `Cancellation ${dec}: ${req.shipmentId}`, message: msg, time: stamp() });
    alert(`Cancellation request for ${req.shipmentId} ${dec.toUpperCase()}.\nNotice recorded in Alerts section.`);
    saveState(); renderAll();
  };

  function renderDelivered() {
    const list = shipments.filter(s => s.status === "Delivered"); $("navDeliveredBadge").textContent = list.length;
    $("deliveredBody").innerHTML = list.map(s => `<tr><td class="fw-bold">${esc(s.id)}</td><td>${esc(s.cargo)}</td><td class="small text-muted">${esc(s.origin)} → ${esc(s.dest)}</td><td class="font-monospace small">${s.min}°C to ${s.max}°C</td><td>${latestOf(s).temp}°C</td><td class="small">${esc(s.deliveredAt || "—")}</td><td class="text-end"><button class="btn btn-sm btn-outline-primary py-0" onclick="showDetails('${s.id}')">History</button>${currentUser?.role === "Logistics Manager" ? `<button class="btn btn-sm btn-outline-danger py-0 ms-1" onclick="promptDeleteShipment('${s.id}')"><i class="bi bi-trash"></i></button>` : ""}</td></tr>`).join("") || `<tr><td colspan="7" class="text-center text-muted py-3">No delivered shipments recorded yet.</td></tr>`;
  }

  function renderCancelled() {
    const list = shipments.filter(s => s.status === "Cancelled"); $("navCancelledBadge").textContent = list.length;
    $("cancelledBody").innerHTML = list.map(s => `<tr><td class="fw-bold text-decoration-line-through">${esc(s.id)}</td><td>${esc(s.cargo)}</td><td class="small text-muted">${esc(s.origin)} → ${esc(s.dest)}</td><td class="fw-semibold text-danger">${esc(s.cancelReason || "—")}</td><td class="small fst-italic">${esc(s.cancelNotes || "—")}</td><td class="small">${esc(s.cancelRequestedBy || "—")}</td><td class="small text-success fw-semibold">${esc(s.cancelApprovedBy || "Sourabh (Warehouse Operator)")}</td><td class="small">${esc(s.cancelledAt || "—")}</td><td class="text-end"><button class="btn btn-sm btn-outline-primary py-0" onclick="showDetails('${s.id}')">History</button>${currentUser?.role === "Logistics Manager" ? `<button class="btn btn-sm btn-outline-danger py-0 ms-1" onclick="promptDeleteShipment('${s.id}')"><i class="bi bi-trash"></i></button>` : ""}</td></tr>`).join("") || `<tr><td colspan="9" class="text-center text-muted py-3">No cancelled shipments.</td></tr>`;
  }

  window.openResolveModal = aid => {
    const a = alerts.find(x => x.aid === aid && x.state !== "Resolved"), s = a && shipments.find(item => item.id === a.id); if (!s) return;
    $("resolveAlertId").value = aid; $("resolveShipmentId").value = s.id; $("resShipmentRef").textContent = s.id; $("resCargo").textContent = s.cargo;
    $("resSafeRange").textContent = `${s.min}°C to ${s.max}°C`; $("resCurrentTemp").textContent = `${a.temp}°C`; $("regulatedTempInput").value = ""; $("resolveWarningBox").classList.add("d-none"); openModal("resolveModal");
  };

  $("resolveForm").onsubmit = e => {
    e.preventDefault(); const s = shipments.find(item => item.id === $("resolveShipmentId").value), a = alerts.find(item => item.aid === $("resolveAlertId").value), val = parseFloat($("regulatedTempInput").value);
    if (isNaN(val) || val < s.min || val > s.max) { $("resolveWarningMsg").textContent = `Must be within safe range (${s.min}°C to ${s.max}°C).`; $("resolveWarningBox").classList.remove("d-none"); return; }
    s.readings.push({ temp: val, time: nowTime(), alertDeleted: false }); if (a) a.state = "Resolved"; saveState(); closeModal("resolveModal"); renderAll();
  };

  window.openCancelModal = id => {
    const s = shipments.find(item => item.id === id); if (!s) return;
    $("cancelShipmentId").value = s.id; $("cancelShipmentLabel").textContent = `${s.id} (${s.cargo})`;
    $("cancelReasonSelect").selectedIndex = 0; $("customReasonBox").classList.add("d-none"); $("customReasonError").classList.add("d-none");
    $("customReasonInput").value = $("cancelReasonNotes").value = ""; openModal("cancelRequestModal");
  };

  $("cancelReasonSelect").onchange = () => { const isNone = $("cancelReasonSelect").value === "NONE"; $("customReasonBox").classList.toggle("d-none", !isNone); if (isNone) $("customReasonInput").focus(); };

  $("cancelRequestForm").onsubmit = e => {
    e.preventDefault(); const shipmentId = $("cancelShipmentId").value, isCustom = $("cancelReasonSelect").value === "NONE", reason = isCustom ? $("customReasonInput").value.trim() : $("cancelReasonSelect").value;
    if (isCustom && !reason) { $("customReasonError").classList.remove("d-none"); return; }
    const s = shipments.find(item => item.id === shipmentId);
    cancellations.unshift({ id: "REQ-" + (seq++), shipmentId, cargo: s?.cargo || "", reason, notes: $("cancelReasonNotes").value.trim(), requestedBy: currentUser ? `${currentUser.name} (Logistics Manager)` : "Logistics Manager", time: stamp(), state: "Pending" });
    closeModal("cancelRequestModal"); saveState(); renderAll(); alert(`Cancellation request for ${shipmentId} sent to Warehouse Operator.`);
  };

  $("btnOpenAddShipment").onclick = () => { $("addShipmentForm").reset(); $("addShipmentError").classList.add("d-none"); openModal("addShipmentModal"); };
  $("addShipmentForm").onsubmit = e => {
    e.preventDefault(); const id = $("newShipmentId").value.trim().toUpperCase(), min = parseFloat($("newMinTemp").value), max = parseFloat($("newMaxTemp").value), initTemp = parseFloat($("newInitialTemp").value);
    let msg = !/^[A-Z0-9-]{3,12}$/.test(id) ? "ID must be 3-12 alphanumeric characters or dashes." : (shipments.some(s => s.id === id) ? "Shipment ID already exists." : (min >= max ? "Min temp must be strictly below max temp." : (isNaN(initTemp) ? "Please enter valid initial temperature." : "")));
    if (msg) { $("addShipmentError").textContent = msg; $("addShipmentError").classList.remove("d-none"); return; }
    shipments.unshift({ id, cargo: $("newCargo").value.trim(), origin: $("newOrigin").value.trim(), dest: $("newDest").value.trim(), min, max, status: "Active", readings: [{ temp: initTemp, time: nowTime(), alertDeleted: false }] });
    saveState(); closeModal("addShipmentModal"); renderAll();
  };

  window.markDelivered = id => { const s = shipments.find(item => item.id === id); if (s && confirm(`Mark ${id} as delivered?`)) { s.status = "Delivered"; s.deliveredAt = stamp(); saveState(); renderAll(); } };

  window.promptDeleteShipment = id => { pendingDeleteShipmentId = id; $("deleteTargetShipmentId").textContent = id; $("deleteAuthUserId").value = currentUser?.username || ""; $("deleteAuthPassword").value = ""; $("deleteAuthError").classList.add("d-none"); openModal("deleteAuthModal"); };

  $("deleteAuthForm").onsubmit = e => {
    e.preventDefault(); const matched = USERS.find(x => x.username.toLowerCase() === $("deleteAuthUserId").value.trim().toLowerCase() && x.pass === $("deleteAuthPassword").value.trim());
    if (!matched || matched.role !== "Logistics Manager") { $("deleteAuthError").textContent = "Unauthorized: Only Logistics Managers can delete packages."; $("deleteAuthError").classList.remove("d-none"); return; }
    const tid = pendingDeleteShipmentId; shipments = shipments.filter(s => s.id !== tid); alerts = alerts.filter(a => a.id !== tid); cancellations = cancellations.filter(c => c.shipmentId !== tid); managerNotifications = managerNotifications.filter(n => n.shipmentId !== tid);
    saveState(); closeModal("deleteAuthModal"); pendingDeleteShipmentId = null; renderAll();
  };

  $("btnDeleteDelivered").onclick = () => { const list = shipments.filter(s => s.status === "Delivered"); if (!list.length) return alert("No delivered shipments."); if (confirm(`Remove all ${list.length} delivered shipments from history?`)) { shipments = shipments.filter(s => s.status !== "Delivered"); saveState(); renderAll(); } };

  window.showDetails = id => {
    currentShipmentId = id; const s = shipments.find(item => item.id === id); if (!s) return;
    $("modalTitle").textContent = `${s.id} (${s.cargo})`; $("modalLimits").textContent = `${s.min}°C to ${s.max}°C`; $("modalCurrent").textContent = `${latestOf(s).temp}°C`;
    $("addPingForm").classList.toggle("d-none", s.status !== "Active");
    $("modalHistoryList").innerHTML = s.readings.slice().reverse().map(r => `<li class="list-group-item d-flex justify-content-between py-1"><span>${esc(r.time)}</span><strong>${r.temp}°C</strong></li>`).join(""); openModal("detailsModal");
  };

  $("addPingForm").onsubmit = e => {
    e.preventDefault(); const s = shipments.find(item => item.id === currentShipmentId), val = parseFloat($("manualTempInput").value); if (!s || isNaN(val)) return;
    s.readings.push({ temp: val, time: nowTime(), alertDeleted: false }); $("manualTempInput").value = ""; saveState(); window.showDetails(currentShipmentId); renderAll();
  };

  $("btnSimulatePing").onclick = () => { const list = activeShipments(); if (list.length) { list.forEach(s => s.readings.push({ temp: randomReading(s), time: nowTime(), alertDeleted: false })); renderAll(); } };

  $("searchInput").oninput = renderAll; $("statusFilter").onchange = renderAll; setAuth(currentUser); if ($("btnTheme")) { $("btnTheme").onclick = () => applyTheme(document.documentElement.getAttribute("data-bs-theme") === "dark" ? "light" : "dark"); applyTheme(localStorage.getItem("cc_theme") || "light"); }
});

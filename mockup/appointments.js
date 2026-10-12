// =============================================================================
// BarberFlow — Stage 2: Data Logic & Interactive UI
// Prepared for seamless future migration to React (Stage 3)
// =============================================================================

// --- 1. Service Catalog & Domain Constants ---
const SERVICES_CATALOG = [
    { id: "s1", name: "Signature Haircut", durationMinutes: 40, price: "60 - 70 RON", desc: "Includes wash and styling" },
    { id: "s2", name: "Haircut & Beard Trim", durationMinutes: 60, price: "85 - 95 RON", desc: "Includes wash and styling" },
    { id: "s3", name: "Medium Haircut (Fade)", durationMinutes: 60, price: "75 - 85 RON", desc: "Scissors and fade, includes wash and styling" },
    { id: "s4", name: "Kid's Haircut", durationMinutes: 40, price: "50 - 60 RON", desc: "For ages 3-10 years" },
    { id: "s5", name: "Buzz Cut", durationMinutes: 30, price: "45 - 55 RON", desc: "Haircut performed exclusively with clippers" },
    { id: "s6", name: "Beard Trim with Razor", durationMinutes: 30, price: "30 RON", desc: "Classic contouring with straight razor" },
    { id: "s7", name: "Beard Trim", durationMinutes: 20, price: "25 RON", desc: "Maintenance and sharp contouring" },
    { id: "s8", name: "Hair Wash", durationMinutes: 5, price: "10 RON", desc: "Quick refreshing wash" },
    { id: "s9", name: "Styling", durationMinutes: 15, price: "20 RON", desc: "Wash, blow-dry, and styling product" },
    { id: "s10", name: "Double Haircut (x2)", durationMinutes: 90, price: "120 - 140 RON", desc: "Double package, includes wash and styling" }
];

// Seed dataset satisfying Stage 2 requirement (3+ items with id, name, state, tag)
const INITIAL_APPOINTMENTS = [
    { id: 1, clientName: "Andrew Smith", serviceName: "Haircut & Beard Trim", duration: 60, barber: "Nicholas Andrei", date: "2026-06-10", time: "10:00", done: false, tag: "Combo" },
    { id: 2, clientName: "Michael Johnson", serviceName: "Signature Haircut", duration: 40, barber: "Madalin Plesa", date: "2026-06-10", time: "11:00", done: true, tag: "Haircut" },
    { id: 3, clientName: "Christian Davis", serviceName: "Beard Trim with Razor", duration: 30, barber: "Nicholas Andrei", date: "2026-06-10", time: "12:00", done: false, tag: "Beard" }
];

const STORAGE_KEY = "barberflow_appointments_v2";

// --- 2. State & Storage Persistence ---
function loadAppointments() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length > 0) {
                return parsed;
            }
        }
    } catch (err) {
        console.warn("Storage access failed, using default dataset.", err);
    }
    return INITIAL_APPOINTMENTS;
}

function saveAppointments(list) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (err) {
        console.warn("Could not save to localStorage.", err);
    }
}

let appointments = loadAppointments();

// --- 3. Pure Immutable Logic Functions (Will be reused in React Hooks/Reducers) ---

/** Return a shallow copy of the appointments list */
function listAppointments(list) {
    return [...list];
}

/** Count non-completed appointments */
function countActive(list) {
    return list.filter(a => !a.done).length;
}

/** Generate incremental unique identifier */
function nextId(list) {
    return list.reduce((max, a) => Math.max(max, a.id), 0) + 1;
}

/** Pure search by client, service, barber, or tag */
function searchAppointments(list, query) {
    if (!query) return list;
    const cleanQuery = query.trim().toLowerCase();
    return list.filter(a =>
        a.clientName.toLowerCase().includes(cleanQuery) ||
        a.serviceName.toLowerCase().includes(cleanQuery) ||
        a.barber.toLowerCase().includes(cleanQuery) ||
        (a.tag && a.tag.toLowerCase().includes(cleanQuery))
    );
}

/** Algorithmic overlap check: [start, end) intersects with existing [start, end) */
function isSlotTaken(list, barber, date, newStartMinutes, newDuration) {
    const newEndMinutes = newStartMinutes + newDuration;
    
    return list.some(app => {
        if (app.barber !== barber || app.date !== date || app.done) return false;
        
        const [h, m] = app.time.split(":").map(Number);
        const existingStart = h * 60 + m;
        const existingEnd = existingStart + app.duration;
        
        return (newStartMinutes < existingEnd && newEndMinutes > existingStart);
    });
}

/**
 * Pure appointment adder.
 * Returns new array if valid, or original array if validation fails (immutability preserved).
 */
function addAppointment(list, clientName, serviceObj, barber, date, time) {
    const cleanName = (clientName || "").trim();
    if (!cleanName) {
        console.warn("[Validation] Add rejected: client name is empty.");
        return list;
    }
    
    if (!serviceObj || !time || !date || !barber) {
        console.warn("[Validation] Add rejected: missing required appointment fields.");
        return list;
    }

    const [h, m] = time.split(":").map(Number);
    const startMinutes = h * 60 + m;
    
    if (isSlotTaken(list, barber, date, startMinutes, serviceObj.durationMinutes)) {
        console.warn(`[Validation] Add rejected: Time slot ${time} on ${date} overlaps for ${barber}.`);
        return list;
    }

    // Automatically derive category tag from service name to comply with data schema
    const tag = serviceObj.name.includes("Beard") && serviceObj.name.includes("Haircut") 
        ? "Combo" 
        : serviceObj.name.includes("Beard") 
            ? "Beard" 
            : "Haircut";

    const newItem = {
        id: nextId(list),
        clientName: cleanName,
        serviceName: serviceObj.name,
        duration: serviceObj.durationMinutes,
        barber: barber,
        date: date,
        time: time,
        done: false,
        tag: tag
    };

    return [...list, newItem];
}

/** Pure toggle status function */
function toggleDone(list, id) {
    return list.map(a => a.id === id ? { ...a, done: !a.done } : a);
}

/** Pure delete function */
function deleteApp(list, id) {
    return list.filter(a => a.id !== id);
}

// --- 4. UI Toast Notification Helper (Non-blocking replacement for alert) ---
let toastTimer = null;
function showToast(message, type = "success") {
    const toast = document.getElementById("toastNotification");
    if (!toast) return;

    clearTimeout(toastTimer);
    toast.textContent = message;
    toast.className = `toast-notification ${type}`;

    toastTimer = setTimeout(() => {
        toast.className = "toast-notification hidden";
    }, 3200);
}

// --- 5. DOM Elements & State Bindings ---
const clientView = document.getElementById("clientView");
const barberView = document.getElementById("barberView");
const viewToggleBtn = document.getElementById("viewToggleBtn");
const portalTitle = document.getElementById("portalTitle");

const servicesListCatalog = document.getElementById("servicesListCatalog");
const clientServiceSelect = document.getElementById("clientServiceSelect");
const barberServiceSelect = document.getElementById("barberServiceSelect");
const clientBookingForm = document.getElementById("clientBookingForm");
const clientNameInput = document.getElementById("clientNameInput");
const barberSelect = document.getElementById("barberSelect");
const appointmentDate = document.getElementById("appointmentDate");
const timeSlotSelect = document.getElementById("timeSlotSelect");
const clientAppointmentsList = document.getElementById("clientAppointmentsList");

const barberAddForm = document.getElementById("barberAddForm");
const barberClientName = document.getElementById("barberClientName");
const barberAssignSelect = document.getElementById("barberAssignSelect");
const barberDate = document.getElementById("barberDate");
const barberStartTime = document.getElementById("barberStartTime");
const queueSearchInput = document.getElementById("queueSearchInput");
const appointmentList = document.getElementById("appointmentList");
const queueCounter = document.getElementById("queueCounter");

let currentView = "client";

// Set default and minimum dates to today
const todayStr = new Date().toISOString().split("T")[0];
if (appointmentDate) {
    appointmentDate.value = todayStr;
    appointmentDate.min = todayStr;
}
if (barberDate) {
    barberDate.value = todayStr;
    barberDate.min = todayStr;
}

// --- 6. View Rendering Functions ---

function populateServices() {
    if (!servicesListCatalog || !clientServiceSelect || !barberServiceSelect) return;

    servicesListCatalog.innerHTML = "";
    clientServiceSelect.innerHTML = "";
    barberServiceSelect.innerHTML = "";

    SERVICES_CATALOG.forEach(s => {
        const div = document.createElement("div");
        div.className = "service-card-item";
        div.innerHTML = `
            <h4>${s.name}</h4>
            <span class="service-meta">${s.durationMinutes} min, ${s.price}</span>
            <p class="service-desc">${s.desc}</p>
        `;
        servicesListCatalog.appendChild(div);

        const opt1 = document.createElement("option");
        opt1.value = s.id;
        opt1.textContent = `${s.name} (${s.durationMinutes} min — ${s.price})`;
        clientServiceSelect.appendChild(opt1);

        const opt2 = document.createElement("option");
        opt2.value = s.id;
        opt2.textContent = `${s.name} (${s.durationMinutes} min)`;
        barberServiceSelect.appendChild(opt2);
    });
}

function updateAvailableSlots() {
    if (!clientServiceSelect || !appointmentDate || !barberSelect || !timeSlotSelect) return;

    const selectedServiceId = clientServiceSelect.value;
    const serviceObj = SERVICES_CATALOG.find(s => s.id === selectedServiceId);
    const chosenDate = appointmentDate.value;
    const chosenBarber = barberSelect.value;

    timeSlotSelect.innerHTML = "";
    if (!serviceObj || !chosenDate) return;

    const startHour = 9;
    const endHour = 18;
    let availableCount = 0;

    for (let h = startHour; h < endHour; h++) {
        for (let m = 0; m < 60; m += 30) {
            const timeStr = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
            const slotMinutes = h * 60 + m;

            // Don't propose slots that would finish after closing hours
            if (slotMinutes + serviceObj.durationMinutes > endHour * 60) {
                continue;
            }

            const isTaken = isSlotTaken(appointments, chosenBarber, chosenDate, slotMinutes, serviceObj.durationMinutes);

            const opt = document.createElement("option");
            opt.value = timeStr;
            opt.textContent = `${timeStr} ${isTaken ? "(Occupied)" : "(Available)"}`;
            if (isTaken) {
                opt.disabled = true;
            } else {
                availableCount++;
            }
            timeSlotSelect.appendChild(opt);
        }
    }

    if (availableCount === 0) {
        const opt = document.createElement("option");
        opt.value = "";
        opt.textContent = "-- No available slots for this date/barber --";
        opt.disabled = true;
        opt.selected = true;
        timeSlotSelect.appendChild(opt);
    }
}

function renderClientAppointments() {
    if (!clientAppointmentsList || !clientNameInput) return;

    clientAppointmentsList.innerHTML = "";
    const clientNameFilter = clientNameInput.value.trim().toLowerCase();

    // If client hasn't typed their name yet, show an inviting helper state
    if (!clientNameFilter) {
        clientAppointmentsList.innerHTML = `
            <li style="padding: 16px; text-align: center; color: var(--text-muted); font-size: 0.88rem;">
                Type your full name in the form above to track your personal reservations.
            </li>
        `;
        return;
    }

    const userApps = appointments.filter(a => a.clientName.toLowerCase().includes(clientNameFilter));

    if (userApps.length === 0) {
        clientAppointmentsList.innerHTML = `
            <li style="padding: 16px; text-align: center; color: var(--text-muted); font-size: 0.88rem;">
                No bookings found for <strong>"${clientNameInput.value.trim()}"</strong>. Choose a time slot above to book your visit!
            </li>
        `;
        return;
    }

    userApps.forEach(app => {
        const li = document.createElement("li");
        li.className = `item-card ${app.done ? "done" : ""}`;
        li.innerHTML = `
            <div>
                <h3>${app.serviceName}</h3>
                <p>Date: <strong>${app.date}</strong> at <strong>${app.time}</strong> (${app.duration} min) with <strong>${app.barber}</strong></p>
            </div>
            <span class="card-status" style="font-weight:700; font-size:0.85rem; color:${app.done ? 'gray':'var(--brand-blue)'}">
                ${app.done ? '✓ Completed' : '● Upcoming'}
            </span>
        `;
        clientAppointmentsList.appendChild(li);
    });
}

function renderBarberQueue() {
    if (!appointmentList || !queueCounter) return;

    appointmentList.innerHTML = "";
    const active = countActive(appointments);
    queueCounter.textContent = `Total: ${appointments.length} | Active Queue: ${active}`;

    const searchQuery = queueSearchInput ? queueSearchInput.value : "";
    const displayedAppointments = searchAppointments(appointments, searchQuery);

    if (displayedAppointments.length === 0) {
        appointmentList.innerHTML = `
            <p style="color:var(--text-muted); text-align:center; padding:24px;">
                ${searchQuery ? "No appointments match your search filter." : "No appointments in queue."}
            </p>
        `;
        return;
    }

    displayedAppointments.forEach(app => {
        const li = document.createElement("li");
        li.className = `item-card ${app.done ? "done" : ""}`;
        li.innerHTML = `
            <div>
                <h3>${app.clientName} — ${app.serviceName}</h3>
                <p>${app.date} @ <strong>${app.time}</strong> (${app.duration}m) | Specialist: <strong>${app.barber}</strong></p>
            </div>
            <div class="card-actions">
                <button class="btn-action btn-toggle" data-id="${app.id}" title="${app.done ? 'Mark pending' : 'Mark finished'}">
                    ${app.done ? "Reopen" : "Finish"}
                </button>
                <button class="btn-action btn-delete" data-id="${app.id}" title="Cancel appointment">
                    Cancel
                </button>
            </div>
        `;
        appointmentList.appendChild(li);
    });
}

// Single Event Delegation on Queue List (Cleaner, faster, memory-safe)
if (appointmentList) {
    appointmentList.addEventListener("click", (e) => {
        const toggleBtn = e.target.closest(".btn-toggle");
        const deleteBtn = e.target.closest(".btn-delete");

        if (toggleBtn) {
            const id = parseInt(toggleBtn.getAttribute("data-id"), 10);
            appointments = toggleDone(appointments, id);
            saveAppointments(appointments);
            renderBarberQueue();
            renderClientAppointments();
            updateAvailableSlots();
            showToast("Appointment status updated.", "success");
        } else if (deleteBtn) {
            const id = parseInt(deleteBtn.getAttribute("data-id"), 10);
            if (confirm("Are you sure you want to cancel this appointment?")) {
                appointments = deleteApp(appointments, id);
                saveAppointments(appointments);
                renderBarberQueue();
                renderClientAppointments();
                updateAvailableSlots();
                showToast("Appointment canceled.", "success");
            }
        }
    });
}

// --- 7. Event Listeners ---

// Switch view between Client and Receptionist
if (viewToggleBtn) {
    viewToggleBtn.addEventListener("click", () => {
        if (currentView === "client") {
            currentView = "barber";
            clientView.classList.add("hidden");
            barberView.classList.remove("hidden");
            viewToggleBtn.textContent = "Switch to Client Portal";
            portalTitle.textContent = "Barber Dashboard";
            renderBarberQueue();
        } else {
            currentView = "client";
            barberView.classList.add("hidden");
            clientView.classList.remove("hidden");
            viewToggleBtn.textContent = "Switch to Barber Dashboard";
            portalTitle.textContent = "Client Portal";
            renderClientAppointments();
            updateAvailableSlots();
        }
    });
}

// Client Booking submission
if (clientBookingForm) {
    clientBookingForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const clientName = clientNameInput.value.trim();
        if (!clientName) {
            showToast("Please enter your name!", "error");
            return;
        }

        const serviceObj = SERVICES_CATALOG.find(s => s.id === clientServiceSelect.value);
        if (!serviceObj) {
            showToast("Please select a service!", "error");
            return;
        }

        const chosenTime = timeSlotSelect.value;
        if (!chosenTime) {
            showToast("Please select an available time slot!", "error");
            return;
        }

        const chosenBarber = barberSelect.value;
        const chosenDate = appointmentDate.value;

        const updated = addAppointment(
            appointments,
            clientName,
            serviceObj,
            chosenBarber,
            chosenDate,
            chosenTime
        );

        if (updated.length > appointments.length) {
            appointments = updated;
            saveAppointments(appointments);
            showToast(`Appointment confirmed for ${chosenTime} with ${chosenBarber}!`, "success");
            renderClientAppointments();
            updateAvailableSlots();
        } else {
            showToast(`Time slot ${chosenTime} overlaps with an existing session for ${chosenBarber}!`, "error");
        }
    });
}

if (clientServiceSelect) clientServiceSelect.addEventListener("change", updateAvailableSlots);
if (appointmentDate) appointmentDate.addEventListener("change", updateAvailableSlots);
if (barberSelect) barberSelect.addEventListener("change", updateAvailableSlots);
if (clientNameInput) clientNameInput.addEventListener("input", renderClientAppointments);

// Receptionist Walk-in submission
if (barberAddForm) {
    barberAddForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = barberClientName.value.trim();
        if (!name) {
            showToast("Please enter client name!", "error");
            return;
        }

        const serviceId = barberServiceSelect.value;
        const sObj = SERVICES_CATALOG.find(s => s.id === serviceId);
        const assignedBarber = barberAssignSelect.value;
        const selectedDate = barberDate ? barberDate.value : todayStr;
        const startTime = barberStartTime.value;

        const updated = addAppointment(
            appointments,
            name,
            sObj,
            assignedBarber,
            selectedDate,
            startTime
        );

        if (updated.length > appointments.length) {
            appointments = updated;
            saveAppointments(appointments);
            showToast(`Walk-in appointment booked for ${name} at ${startTime}!`, "success");
            barberClientName.value = "";
            renderBarberQueue();
            updateAvailableSlots();
        } else {
            showToast(`Conflict: Time slot ${startTime} overlaps for ${assignedBarber}!`, "error");
        }
    });
}

// Queue search filter
if (queueSearchInput) {
    queueSearchInput.addEventListener("input", renderBarberQueue);
}

// --- 8. Console Verification Tests (Stage 2 Rubric Compliance) ---
// These execute silently on page load, logging required checks to F12 Console
console.group("=== BARBERFLOW STAGE 2 VERIFICATION TESTS ===");
console.log("S2-R1: Script loaded and executed successfully.");

console.log("S2-R2: Initial items with id, name, state, tag (3+ items):", listAppointments(appointments));
console.log("S2-R3 (countActive): Active appointments count:", countActive(appointments));

const searchResult = searchAppointments(appointments, "Andrew");
console.log("S2-R3 (search): Query 'Andrew' found:", searchResult);

console.log("--- Testing S2-R3 (add) & S2-R5 (immutability) ---");
const testInitialLength = appointments.length;
const testAddList = addAppointment(
    appointments,
    "David Clark",
    SERVICES_CATALOG[0],
    "Nicholas Andrei",
    todayStr,
    "15:00"
);
console.log("New list length after add:", testAddList.length);
console.log("Original list length unchanged (Immutability check):", appointments.length === testInitialLength);

console.log("--- Testing S2-R4: Rejection of Empty Name ---");
const emptyNameTest = addAppointment(
    appointments,
    "   ",
    SERVICES_CATALOG[0],
    "Nicholas Andrei",
    todayStr,
    "16:00"
);
console.log("Empty name rejected, length unchanged:", emptyNameTest.length === appointments.length);

console.log("--- Testing S2-R4: Rejection of Overlapping Slot ---");
// Slot 10:00 on 2026-06-10 is taken by Andrew Smith (duration 60 min, ends 11:00)
const overlapTest = addAppointment(
    appointments,
    "Conflict Tester",
    SERVICES_CATALOG[0], // 40 min
    "Nicholas Andrei",
    "2026-06-10",
    "10:20"
);
console.log("Overlapping slot rejected, length unchanged:", overlapTest.length === appointments.length);

console.log("--- Testing S2-R3: Toggle Done ---");
const firstId = appointments[0].id;
const toggledList = toggleDone(appointments, firstId);
console.log("Item status toggled immutably:", toggledList[0].done !== appointments[0].done);

console.log("--- Testing S2-R3: Delete Appointment ---");
const deletedList = deleteApp(appointments, firstId);
console.log("Item deleted immutably, length decreased:", deletedList.length === appointments.length - 1);
console.groupEnd();

// --- 9. Initialization ---
populateServices();
updateAvailableSlots();
renderClientAppointments();
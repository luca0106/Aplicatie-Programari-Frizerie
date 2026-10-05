// --- 1. Service Catalog (Translated to English, based on your pricing and durations) ---
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

// --- 2. Initial State ---
let appointments = [
    { id: 1, clientName: "Andrew Smith", serviceName: "Haircut & Beard Trim", duration: 60, barber: "Nicholas Andrei", date: "2026-06-10", time: "10:00", done: false },
    { id: 2, clientName: "Michael Johnson", serviceName: "Signature Haircut", duration: 40, barber: "Madalin Plesa", date: "2026-06-10", time: "11:00", done: true }
];

// --- 3. Immutable Functions ---
function countActive(list) {
    return list.filter(a => !a.done).length;
}

function nextId(list) {
    return list.reduce((max, a) => Math.max(max, a.id), 0) + 1;
}

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

function addAppointment(list, clientName, serviceObj, barber, date, time) {
    const cleanName = clientName.trim();
    if (!cleanName) {
        alert("Please enter your name!");
        return list;
    }
    
    const [h, m] = time.split(":").map(Number);
    const startMinutes = h * 60 + m;
    
    if (isSlotTaken(list, barber, date, startMinutes, serviceObj.durationMinutes)) {
        alert(`Sorry, the selected time slot overlaps with another appointment for ${barber}! Please choose a different time.`);
        return list;
    }

    const newItem = {
        id: nextId(list),
        clientName: cleanName,
        serviceName: serviceObj.name,
        duration: serviceObj.durationMinutes,
        barber: barber,
        date: date,
        time: time,
        done: false
    };

    alert("Appointment successfully booked!");
    return [...list, newItem];
}

function toggleDone(list, id) {
    return list.map(a => a.id === id ? { ...a, done: !a.done } : a);
}

function deleteApp(list, id) {
    return list.filter(a => a.id !== id);
}

// --- 4. DOM & Interface Bindings ---
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
const barberStartTime = document.getElementById("barberStartTime");
const appointmentList = document.getElementById("appointmentList");
const queueCounter = document.getElementById("queueCounter");

let currentView = "client";

const todayStr = new Date().toISOString().split("T")[0];
appointmentDate.value = todayStr;
appointmentDate.min = todayStr;

function populateServices() {
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
    const selectedServiceId = clientServiceSelect.value;
    const serviceObj = SERVICES_CATALOG.find(s => s.id === selectedServiceId);
    const chosenDate = appointmentDate.value;
    const chosenBarber = barberSelect.value;

    timeSlotSelect.innerHTML = "";
    if (!serviceObj || !chosenDate) return;

    const startHour = 9;
    const endHour = 18;

    for (let h = startHour; h < endHour; h++) {
        for (let m = 0; m < 60; m += 30) {
            const timeStr = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
            const slotMinutes = h * 60 + m;

            const isTaken = isSlotTaken(appointments, chosenBarber, chosenDate, slotMinutes, serviceObj.durationMinutes);

            const opt = document.createElement("option");
            opt.value = timeStr;
            opt.textContent = timeStr + (isTaken ? " (Occupied)" : " (Available)");
            if (isTaken) {
                opt.disabled = true;
                opt.style.color = "#aaa";
            }
            timeSlotSelect.appendChild(opt);
        }
    }
}

function renderClientAppointments() {
    clientAppointmentsList.innerHTML = "";
    const clientNameFilter = clientNameInput.value.trim().toLowerCase();

    const userApps = appointments.filter(a => !clientNameFilter || a.clientName.toLowerCase().includes(clientNameFilter));

    if (userApps.length === 0) {
        clientAppointmentsList.innerHTML = `<p style="color:var(--text-muted); font-size:0.85rem;">Type your name above to view your appointments or book a new one.</p>`;
        return;
    }

    userApps.forEach(app => {
        const li = document.createElement("li");
        li.className = `item-card ${app.done ? "done" : ""}`;
        li.innerHTML = `
            <div>
                <h3>${app.serviceName}</h3>
                <p>Date: <strong>${app.date}</strong> at <strong>${app.time}</strong> with ${app.barber}</p>
            </div>
            <span class="card-status" style="font-weight:700; color:${app.done ? 'gray':'var(--brand-blue)'}">
                ${app.done ? 'Completed' : 'Upcoming (Active)'}
            </span>
        `;
        clientAppointmentsList.appendChild(li);
    });
}

function renderBarberQueue() {
    appointmentList.innerHTML = "";
    const active = countActive(appointments);
    queueCounter.textContent = `Total: ${appointments.length} | Active: ${active}`;

    if (appointments.length === 0) {
        appointmentList.innerHTML = `<p style="color:var(--text-muted); text-align:center; padding:20px;">No appointments in queue.</p>`;
        return;
    }

    appointments.forEach(app => {
        const li = document.createElement("li");
        li.className = `item-card ${app.done ? "done" : ""}`;
        li.innerHTML = `
            <div>
                <h3>${app.clientName} — ${app.serviceName}</h3>
                <p>${app.date} @ ${app.time} | Specialist: <strong>${app.barber}</strong></p>
            </div>
            <div class="card-actions">
                <button class="btn-action btn-toggle" data-id="${app.id}">
                    ${app.done ? "Reopen" : "Finish"}
                </button>
                <button class="btn-action btn-delete" data-id="${app.id}">Cancel</button>
            </div>
        `;
        appointmentList.appendChild(li);
    });

    document.querySelectorAll(".btn-toggle").forEach(btn => {
        btn.addEventListener("click", (e) => {
            appointments = toggleDone(appointments, parseInt(e.target.getAttribute("data-id")));
            renderBarberQueue();
            renderClientAppointments();
        });
    });

    document.querySelectorAll(".btn-delete").forEach(btn => {
        btn.addEventListener("click", (e) => {
            appointments = deleteApp(appointments, parseInt(e.target.getAttribute("data-id")));
            renderBarberQueue();
            renderClientAppointments();
        });
    });
}

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
    }
});

clientBookingForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const serviceObj = SERVICES_CATALOG.find(s => s.id === clientServiceSelect.value);
    appointments = addAppointment(
        appointments,
        clientNameInput.value,
        serviceObj,
        barberSelect.value,
        appointmentDate.value,
        timeSlotSelect.value
    );
    renderClientAppointments();
    updateAvailableSlots();
});

clientServiceSelect.addEventListener("change", updateAvailableSlots);
appointmentDate.addEventListener("change", updateAvailableSlots);
barberSelect.addEventListener("change", updateAvailableSlots);
clientNameInput.addEventListener("input", renderClientAppointments);

barberAddForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const serviceId = barberServiceSelect.value;
    const sObj = SERVICES_CATALOG.find(s => s.id === serviceId);
    const assignedBarber = barberAssignSelect.value;
    const startTime = barberStartTime.value;
    
    appointments = addAppointment(
        appointments,
        barberClientName.value,
        sObj,
        assignedBarber,
        todayStr,
        startTime
    );
    
    barberClientName.value = "";
    renderBarberQueue();
});

// --- 5. Console Tests (Required by Lab Stage 2) ---
console.log("--- BARBERFLOW STAGE 2 CONSOLE TESTS ---");
console.log("Total initial appointments:", appointments.length);
console.log("Active appointments:", countActive(appointments));

console.log("--- Testing Immutable Add ---");
let testList = addAppointment(appointments, "David Clark", SERVICES_CATALOG[0], "Nicholas Andrei", todayStr, "14:00");
console.log("New list length after add:", testList.length);
console.log("Original list length (immutability check):", appointments.length);

console.log("--- Testing Validation (Empty Name) ---");
let invalidList = addAppointment(appointments, "   ", SERVICES_CATALOG[0], "Nicholas Andrei", todayStr, "15:00");

populateServices();
updateAvailableSlots();
renderClientAppointments();
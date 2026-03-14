// Calendar JavaScript - moved from inline script to separate file
let currentDate = new Date();
let events = JSON.parse(localStorage.getItem("churchEvents")) || [];
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// Admin functions
function openEventModalWithCheck() {
  if (localStorage.getItem("adminLoggedIn") !== "true") {
    openLoginModal();
    return;
  }
  openEventModal();
}

function logoutAdmin() {
  localStorage.removeItem("adminLoggedIn");
  alert("Logged out successfully");
}

function addEvent(e) {
  e.preventDefault();
  const eventData = {
    id: Date.now().toString(),
    title: document.getElementById("eventTitle").value,
    date: document.getElementById("eventDate").value,
    time: document.getElementById("eventTime").value,
    description: document.getElementById("eventDescription").value,
    category: document.getElementById("eventCategory").value,
  };
  events.push(eventData);
  localStorage.setItem("churchEvents", JSON.stringify(events));
  closeEventModal();
  renderCalendar();
  renderEventsList();
  alert("Event added successfully!");
}

function getCategoryColor(category) {
  const colors = {
    service: "bg-primary",
    fellowship: "bg-green-500",
    outreach: "bg-orange-500",
    prayer: "bg-purple-500",
    special: "bg-secondary",
  };
  return colors[category] || "bg-gray-500";
}

function renderCalendar() {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  document.getElementById("currentMonth").textContent =
    `${monthNames[month]} ${year}`;
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const grid = document.getElementById("calendarGrid");
  grid.innerHTML = "";
  for (let i = 0; i < firstDay; i++) {
    const div = document.createElement("div");
    div.className = "p-2";
    grid.appendChild(div);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const dayEvents = events.filter((e) => e.date === dateStr);
    const hasEvents = dayEvents.length > 0;
    const div = document.createElement("div");
    div.className = `calendar-day p-2 rounded-lg border cursor-pointer transition hover:shadow-md ${hasEvents ? "bg-blue-50 border-primary" : "border-gray-200 hover:border-primary"}`;
    let html = `<span class="font-semibold ${hasEvents ? "text-primary" : "text-gray-700"}">${day}</span>`;
    if (hasEvents) {
      html += `<div class="flex gap-1 mt-1 flex-wrap">`;
      dayEvents.forEach((event) => {
        const color = getCategoryColor(event.category);
        html += `<div class="w-2 h-2 rounded-full ${color}"></div>`;
      });
      html += `</div>`;
    }
    div.innerHTML = html;
    div.onclick = () => showDateEvents(dateStr);
    grid.appendChild(div);
  }
}

function renderEventsList() {
  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();
  const monthEvents = events
    .filter((e) => {
      const d = new Date(e.date);
      return d.getMonth() === month && d.getFullYear() === year;
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date));
  const list = document.getElementById("eventsList");
  if (monthEvents.length === 0) {
    list.innerHTML =
      '<p class="text-gray-500 text-center py-4">No events this month</p>';
    return;
  }
  list.innerHTML = monthEvents
    .map(
      (event) => `
        <div class="event-card p-3 border border-gray-200 rounded-lg hover:shadow-md transition bg-white">
            <div class="flex items-start justify-between">
                <div>
                    <h4 class="font-semibold text-gray-900 text-sm">${event.title}</h4>
                    <p class="text-xs text-gray-500">${formatDate(event.date)} ${event.time || ""}</p>
                    ${event.description ? `<p class="text-xs text-gray-600 mt-1">${event.description}</p>` : ""}
                </div>
                <button onclick="deleteEvent('${event.id}')" class="text-red-500 hover:text-red-700 p-1">
                    <i data-lucide="trash-2" class="h-4 w-4"></i>
                </button>
            </div>
            <span class="inline-block mt-2 text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600 capitalize">${event.category}</span>
        </div>
    `,
    )
    .join("");
  lucide.createIcons();
}

function showDateEvents(dateStr) {
  const dateEvents = events.filter((e) => e.date === dateStr);
  const section = document.getElementById("selectedDateSection");
  const container = document.getElementById("selectedDateEvents");
  const title = document.getElementById("selectedDateTitle");
  if (dateEvents.length === 0) {
    section.classList.add("hidden");
    return;
  }
  title.textContent = `Events on ${formatDate(dateStr)}`;
  section.classList.remove("hidden");
  container.innerHTML = dateEvents
    .map(
      (event) => `
        <div class="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 class="font-semibold text-primary">${event.title}</h4>
            <p class="text-sm text-gray-600 mt-1">${event.time || "All Day"}</p>
            ${event.description ? `<p class="text-sm text-gray-700 mt-2">${event.description}</p>` : ""}
            <span class="inline-block mt-3 text-xs px-2 py-1 rounded-full bg-white text-gray-600 capitalize">${event.category}</span>
        </div>
    `,
    )
    .join("");
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function openLoginModal() {
  document.getElementById("loginModal").classList.remove("hidden");
}

function closeLoginModal() {
  document.getElementById("loginModal").classList.add("hidden");
  document.getElementById("loginForm").reset();
}

function openEventModal() {
  document.getElementById("eventModal").classList.remove("hidden");
  document.getElementById("eventDate").valueAsDate = new Date();
}

function closeEventModal() {
  document.getElementById("eventModal").classList.add("hidden");
  document.getElementById("eventForm").reset();
}

function deleteEvent(id) {
  if (confirm("Are you sure you want to delete this event?")) {
    events = events.filter((e) => e.id !== id);
    localStorage.setItem("churchEvents", JSON.stringify(events));
    renderCalendar();
    renderEventsList();
    document.getElementById("selectedDateSection").classList.add("hidden");
  }
}

// DOM Ready
document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("addEventBtn")
    .addEventListener("click", openEventModalWithCheck);
  document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const username = document.getElementById("adminUsername").value;
    const password = document.getElementById("adminPassword").value;
    if (username === "pastorron" && password === "godisgood") {
      localStorage.setItem("adminLoggedIn", "true");
      closeLoginModal();
      openEventModal();
    } else {
      alert("Invalid credentials");
    }
  });
  document.getElementById("eventForm").addEventListener("submit", addEvent);
  document.getElementById("prevMonth").addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
    renderEventsList();
  });
  document.getElementById("nextMonth").addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
    renderEventsList();
  });
  renderCalendar();
  renderEventsList();
  lucide.createIcons();
});

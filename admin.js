// Admin Dashboard JavaScript
document.addEventListener("DOMContentLoaded", function () {
  if (localStorage.getItem("adminLoggedIn") !== "true") {
    window.location.href = "calendar.html";
    return;
  }

  // Check admin login on load
  const adminStatus = document.getElementById("adminStatus");
  if (adminStatus) adminStatus.textContent = "Logged in as Admin";

  // Calendar Events Management
  const events = JSON.parse(localStorage.getItem("churchEvents") || "[]");
  renderEventList();

  // Add Event Form
  document
    .getElementById("adminEventForm")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      const eventData = {
        id: Date.now().toString(),
        title: document.getElementById("adminEventTitle").value,
        date: document.getElementById("adminEventDate").value,
        time: document.getElementById("adminEventTime").value,
        description: document.getElementById("adminEventDesc").value,
        category: document.getElementById("adminEventCategory").value,
      };
      events.push(eventData);
      localStorage.setItem("churchEvents", JSON.stringify(events));
      renderEventList();
      this.reset();
      alert("Event added!");
    });

  // Video Embed Management
  const savedVideoUrl = localStorage.getItem("liveVideoUrl") || "";
  document.getElementById("liveVideoUrl").value = savedVideoUrl;

  document.getElementById("videoForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const url = document.getElementById("liveVideoUrl").value;
    localStorage.setItem("liveVideoUrl", url);
    alert("Live video URL updated! Changes will appear on watch.html");
  });

  // Logout
  document.getElementById("logoutBtn").addEventListener("click", function () {
    localStorage.removeItem("adminLoggedIn");
    window.location.href = "index.html";
  });
});

function renderEventList() {
  const container = document.getElementById("adminEventList");
  const events = JSON.parse(localStorage.getItem("churchEvents") || "[]");
  if (events.length === 0) {
    container.innerHTML =
      '<p class="text-gray-500">No events. Add one using the form above.</p>';
    return;
  }
  container.innerHTML = events
    .map(
      (event) => `
    <div class="p-4 bg-gray-50 rounded-lg mb-3">
      <h4 class="font-bold">${event.title}</h4>
      <p>${event.date} ${event.time || "All day"}</p>
      <p class="text-sm text-gray-600">${event.description || ""}</p>
      <button onclick="deleteEvent('${event.id}')" class="text-red-500 hover:text-red-700 text-sm mt-2">Delete</button>
    </div>
  `,
    )
    .join("");
}

function deleteEvent(id) {
  if (confirm("Delete this event?")) {
    let events = JSON.parse(localStorage.getItem("churchEvents") || "[]");
    events = events.filter((e) => e.id !== id);
    localStorage.setItem("churchEvents", JSON.stringify(events));
    renderEventList();
  }
}

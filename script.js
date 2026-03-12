// Mobile Menu Toggle
document.addEventListener("DOMContentLoaded", function () {
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden");
    });
  }

  // Initialize Logo
  loadLogo();
});

// Logo Management
// Updated Logo Management in script.js
function loadLogo() {
  // Use the uploaded image file name
  const logoPath = "output_ocyovl.png";

  const logoContainers = document.querySelectorAll(
    ".logo-container, #logoContainer",
  );
  const logoImages = document.querySelectorAll(
    ".site-logo, #siteLogo, #footerLogo",
  );
  const fallbacks = document.querySelectorAll(
    ".logo-fallback, .logo-fallback-footer",
  );

  // Set the logo source for all logo elements
  logoImages.forEach((img) => {
    img.src = logoPath;
    img.classList.remove("hidden");
  });

  // Hide the fallback icons (like the Lucide church icon)
  fallbacks.forEach((icon) => {
    icon.classList.add("hidden");
  });

  // Prepare containers for the star hover effect
  logoContainers.forEach((container) => {
    // This class will be targeted by your CSS for the star effect
    container.classList.add("logo-star-target");

    // Remove default styling to ensure the image and effect are clear
    container.classList.remove("bg-white", "border-2", "border-primary");
    container.style.backgroundColor = "transparent";
    container.style.border = "none";
  });
}

function handleLogoUpload(event) {
  const file = event.target.files[0];
  if (file && file.type.startsWith("image/")) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const logoData = e.target.result;
      localStorage.setItem("churchLogo", logoData);
      loadLogo();

      // Show success message
      showNotification("Logo uploaded successfully!", "success");
    };
    reader.readAsDataURL(file);
  } else {
    showNotification("Please select a valid image file.", "error");
  }
}

function removeLogo() {
  localStorage.removeItem("churchLogo");
  location.reload();
}

function showNotification(message, type = "success") {
  // Remove existing notifications
  const existing = document.querySelector(".logo-notification");
  if (existing) existing.remove();

  const notification = document.createElement("div");
  notification.className = `logo-notification fixed top-20 right-4 px-6 py-3 rounded-lg shadow-lg z-50 fade-in ${
    type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
  }`;
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

// Intersection Observer for fade-in animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("fade-in");
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll(".fade-in-trigger").forEach((el) => {
  observer.observe(el);
});

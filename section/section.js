// Logout
document.getElementById("logout").addEventListener("click", () => {
  sessionStorage.removeItem("owner_id");
  sessionStorage.removeItem("user_id");
  sessionStorage.removeItem("level");
  sessionStorage.removeItem("nama");
  alert("Logout clicked!");
  window.location.href = "login.html";
});

// Set nama user jika tersedia
const nama = sessionStorage.getItem("nama");
if (nama) {
  document.getElementById("nameUser").textContent = nama;
}

// Tailwind-compatible sidebar toggle
document.getElementById("sidebarToggle").addEventListener("click", () => {
  const sidebar = document.querySelector(".main-sidebar");
  sidebar.classList.toggle("hidden");
});

// Responsive layout adjustment
const handleResponsiveLayout = () => {
  const w = window.innerWidth;
  const body = document.body;

  if (w <= 1024) {
    body.classList.add("sidebar-gone");
    body.classList.remove("sidebar-show");
    document.querySelector(".main-sidebar")?.classList.add("hidden");
  } else {
    body.classList.remove("sidebar-gone");
    body.classList.add("sidebar-show");
    document.querySelector(".main-sidebar")?.classList.remove("hidden");
  }
};

// Run once on load and on resize
handleResponsiveLayout();
window.addEventListener("resize", handleResponsiveLayout);

// Optional: Dropdown menu toggle (click version for Tailwind)
const userDropdown = document.querySelector(".group");
if (userDropdown) {
  const toggleBtn = userDropdown.querySelector("button");
  const dropdown = userDropdown.querySelector("div.absolute");

  toggleBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    dropdown.classList.toggle("hidden");
  });

  document.addEventListener("click", () => {
    dropdown.classList.add("hidden");
  });
}
// Sidebar mini toggle
const sidebar = document.getElementById("sidebar");
const toggleBtn = document.getElementById("sidebarToggle");
const sidebarTextEls = document.querySelectorAll(".sidebar-text");

toggleBtn.addEventListener("click", () => {
  const isMini = sidebar.classList.contains("w-16");

  sidebar.classList.toggle("w-64", isMini);
  sidebar.classList.toggle("w-16", !isMini);

  // Toggle text visibility
  sidebarTextEls.forEach((el) => {
    el.classList.toggle("hidden", !isMini);
  });
});

const userBtn = document.getElementById("userMenuButton");
const dropdown = document.getElementById("userDropdown");

userBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  dropdown.classList.toggle("hidden");
});

document.addEventListener("click", () => {
  dropdown.classList.add("hidden");
});
    
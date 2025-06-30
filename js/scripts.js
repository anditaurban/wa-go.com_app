const default_module = "dashboard";

// Ambil session
const owner_id = sessionStorage.getItem("owner_id");
const user_id = sessionStorage.getItem("user_id");
const status_active = sessionStorage.getItem("status_active");
const level = sessionStorage.getItem("level");
const nama = sessionStorage.getItem("nama");
const logo = sessionStorage.getItem("logo");
const business_place = sessionStorage.getItem("business_place");
const address = sessionStorage.getItem("address");
const company_phone = sessionStorage.getItem("company_phone");
const printer_setting = JSON.parse(sessionStorage.getItem("printer_setting"));

// Cek login
function checksession() {
  if (!owner_id || !user_id || !level || !nama) {
    window.location.href = "login.html";
  }
}
checksession();

// Global variabel
let currentScript = null;
let apiUrl = "";
let defaultpage = 1;
let productsData = [];
let formHtml = null;
let h1Element = null;
let campaignTitle = null;
let responseData = "";

// Daftar script
const scriptsToLoad = [
  "./js/utils.js",
  "./js/api.js",
  "./js/table.js",
  "./js/general.js",
];

// Load script JS tambahan
scriptsToLoad.forEach((script) => {
  loadScript(`${script}?v=${Date.now()}`);
});

// Load utama
window.onload = loadAppSections;

// Load file HTML dinamis
async function loadSection(sectionPath) {
  try {
    const response = await fetch(sectionPath);
    if (response.ok) return await response.text();
    else throw new Error(`Failed to load ${sectionPath}`);
  } catch (error) {
    console.error(error);
    return `<div>Error loading ${sectionPath}</div>`;
  }
}

// Load script
function loadScript(src, callback) {
  const script = document.createElement("script");
  script.src = src;
  if (callback) script.onload = callback;
  script.onerror = () => console.error(`❌ Failed to load script: ${src}`);
  document.body.appendChild(script);
}

// Fungsi utama load layout awal
async function loadAppSections() {
  const sectionDataDiv = document.getElementById("section-data");

  const [headNavbar, sideNavbar, footer] = await Promise.all([
    loadSection(`section/headnavbar.html?v=${Date.now()}`),
    loadSection(`section/sidenavbar.html?v=${Date.now()}`),
    loadSection(`section/footer.html?v=${Date.now()}`),
  ]);

  // Inject layout utama + wrapper konten kosong
  sectionDataDiv.innerHTML = `
    ${headNavbar}
    ${sideNavbar}
    <main id="main-content-module" class="pt-6 px-4 sm:px-6 lg:px-4 flex-1 max-w-11xl mx-auto w-full sm:ml-60">
      <!-- Module content will be injected here -->
    </main>
    ${footer}
  `;

  // Load section.js jika ada
  loadScript(`./section/section.js?v=${Date.now()}`);
  // Tambahkan event listener side nav
  addSideNavListeners();

  // Load default modul (dashboard)
  loadModuleContent(default_module);
}

// Tambahkan event klik di sidenav
function addSideNavListeners() {
  const links = document.querySelectorAll("nav ul li a");
  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const module = link.getAttribute("data-module");
      if (module) {
        loadModuleContent(module);
        currentDataSearch = "";
      }
    });
  });
}

// Fungsi untuk load modul dinamis (ex: dashboard)
function loadModuleContent(module, Id = null, Detail = null) {
  fetch(`./module/${module}/data.html?v=${Date.now()}`)
    .then((response) => {
      if (!response.ok) throw new Error(`Error loading module: ${module}`);
      return response.text();
    })
    .then((data) => {
      const mainContent = document.getElementById("main-content-module");
      if (!mainContent) {
        console.error("❌ Container #main-content-module tidak ditemukan!");
        return;
      }

      // Inject isi modul
      mainContent.innerHTML = data;

      if (data.trim() !== "") {
        window.detail_id = Id;
        window.detail_desc = Detail;
      }

      // Hapus script sebelumnya kalau ada
      if (currentScript) {
        document.body.removeChild(currentScript);
        currentScript = null;
      }

      // Load script.js dari modul terkait
      currentScript = document.createElement("script");
      currentScript.src = `./module/${module}/script.js?v=${Date.now()}`;
      currentScript.onload = () => {
        console.log(`✅ Module ${module} loaded`);
        if (
          module === "dashboard" &&
          typeof initDashboardChart === "function"
        ) {
          setTimeout(() => {
            initDashboardChart();
          }, 0);
        }
      };

      currentScript.onerror = () => {
        console.error(`❌ Gagal load script module: ${module}`);
        if (
          module === "dashboard" &&
          typeof initDashboardChart === "function"
        ) {
          console.log("⚠️ Memanggil fallback initDashboardChart()");
          initDashboardChart();
        }
      };

      document.body.appendChild(currentScript);
    })
    .catch((error) => {
      console.error(error);
      const mainContent = document.getElementById("main-content-module");
      if (mainContent) {
        mainContent.innerHTML = `<p class="text-red-500">Gagal memuat modul ${module}</p>`;
      }
    });
}

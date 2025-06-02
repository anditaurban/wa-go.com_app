const default_module = "dashboard"

const owner_id = sessionStorage.getItem('owner_id');
const user_id = sessionStorage.getItem('user_id');
const status_active = sessionStorage.getItem('status_active');
const level = sessionStorage.getItem('level');
const nama = sessionStorage.getItem('nama');
const logo = sessionStorage.getItem('logo');
const business_place = sessionStorage.getItem('business_place');
const address = sessionStorage.getItem('address');
const company_phone = sessionStorage.getItem('company_phone');
const printer_setting = JSON.parse(sessionStorage.getItem('printer_setting'));
// const app_id = 5;
// const owner_id = 4409;
// const user_id = 4409;
// const level = 'owner';
// const nama = 'Untug Katsirin';

function checksession(){
    if (!owner_id || !user_id || !level || !nama) {
    window.location.href = 'login.html'; 
    }
}

checksession();

let currentScript = null;
let formHtml = null;
let h1Element = null;
let campaignTitle = null;
let responseData = "";

let apiUrl = '';
let defaultpage = 1;
let productsData = [];

const scriptsToLoad = [
  './js/utils.js?v=${new Date().getTime()}',
  './js/api.js?v=${new Date().getTime()}',
  './js/table.js?v=${new Date().getTime()}',
  './js/general.js?v=${new Date().getTime()}'
];

window.onload = loadAppSections;
scriptsToLoad.forEach(script => loadScript(`${script}?v=${new Date().getTime()}`, () => {}));

// Function to load HTML section
async function loadSection(sectionPath) {
  try {
    const response = await fetch(sectionPath);
    if (response.ok) {
      return await response.text();
    } else {
      throw new Error(`Failed to load ${sectionPath}`);
    }
  } catch (error) {
    console.error(error);
    return `<div>Error loading ${sectionPath}</div>`;
  }
}

// Function to load JavaScript files dynamically
function loadScript(src, callback) {
  const script = document.createElement('script');
  script.src = src;
  script.onload = callback;
  script.onerror = () => console.error(`Error loading script: ${src}`);
  document.body.appendChild(script);
}


// Function to load all sections and scripts
async function loadAppSections() {
  const sectionDataDiv = document.getElementById("section-data");

  const [headNavbar, sideNavbar, mainContent, footer] = await Promise.all([
    loadSection('section/headnavbar.html?v=${new Date().getTime()}'),
    loadSection('section/sidenavbar.html?v=${new Date().getTime()}'),
    loadSection('section/maincontent.html?v=${new Date().getTime()}'),
    loadSection('section/footer.html?v=${new Date().getTime()}')
  ]);

  sectionDataDiv.innerHTML = `${headNavbar}${sideNavbar}${mainContent}${footer}`;

  addSideNavListeners();

  loadScript(`./section/section.js?v=${new Date().getTime()}`, () => {});
  loadModuleContent('dashboard');
}

// Function to add event listeners after sidenav is loaded
function addSideNavListeners() {
  const links = document.querySelectorAll('nav div ul li a');
  links.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const module = link.getAttribute('data-module');
      if (module) { // Cek jika data-module tersedia
        loadModuleContent(module);
        currentDataSearch = '';
      }
    });
  });
}

// Function to load module content
function loadModuleContent(module, Id, Detail) {
  fetch(`./module/${module}/data.html?v=${new Date().getTime()}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Error loading module: ${module}`);
      }
      return response.text();
    })
    .then(data => {
      document.getElementById('content').innerHTML = data;

      if (data.trim() !== '') {
        window.detail_id = Id;
        window.detail_desc = Detail;
      }

      if (currentScript) {
        document.body.removeChild(currentScript);
      }

      currentScript = document.createElement('script');
      currentScript.src = `./module/${module}/script.js?v=${new Date().getTime()}`;
      document.body.appendChild(currentScript);
    })
    .catch(error => {
      console.error(error);
      document.getElementById('content').innerHTML = `<p>Error loading module ${module}</p>`;
    });
}
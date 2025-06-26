function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  sidebar.classList.toggle("hidden");
}

function showSuccessDialog(message) {
  showDialog("Success", message, "bg-green-600");
}

function showErrorDialog(message) {
  showDialog("Error", message, "bg-red-600");
}

function showDialog(title, message, colorClass) {
  const dialog = document.createElement("div");
  dialog.id = "customDialog";
  dialog.classList.add(
    "fixed",
    "inset-0",
    "z-50",
    "flex",
    "items-center",
    "justify-center",
    "bg-black",
    "bg-opacity-50"
  );

  dialog.innerHTML = `
    <div class="bg-white rounded-lg shadow-lg w-11/12 max-w-md p-6 text-center">
      <h2 class="text-2xl font-semibold mb-4">${title}</h2>
      <p class="text-gray-700 mb-6">${message}</p>
      <button onclick="closeDialog()" class="${colorClass} text-white px-4 py-2 rounded hover:opacity-90 focus:outline-none">
        OK
      </button>
    </div>
  `;

  document.body.appendChild(dialog);
}

function closeDialog() {
  const dialog = document.getElementById("customDialog");
  if (dialog) dialog.remove();
}

function showAlert(title, message, type = "blue") {
  const containerId = "alertContainer";
  let container = document.getElementById(containerId);

  if (!container) {
    container = document.createElement("div");
    container.id = containerId;
    container.className = "fixed bottom-4 right-4 z-50 space-y-2";
    document.body.appendChild(container);
  }

  const alert = document.createElement("div");
  alert.className = `flex items-start p-4 text-sm rounded-lg bg-${type}-100 text-${type}-800 shadow-md border-l-4 border-${type}-500`;

  alert.innerHTML = `
    <div class="mr-3 mt-1">
      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
      </svg>
    </div>
    <div>
      <span class="font-semibold">${title}:</span> ${message}
    </div>
  `;

  container.appendChild(alert);

  setTimeout(() => {
    alert.remove();
  }, 5000);
}

function showSuccessAlert(message) {
  showAlert("Success", message, "green");
}

function showErrorAlert(message) {
  showAlert("Error", message, "red");
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add("hidden");
  }
}

function debounce(func, delay) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
}

function copyLink(link) {
  navigator.clipboard
    .writeText(link)
    .then(() => {
      const copyButton = document.querySelector("button");
      copyButton.textContent = "Copied!";
      copyButton.classList.remove("bg-blue-600");
      copyButton.classList.add("bg-green-600");

      if (pagemodule === "Dashboard") {
        Swal.fire({
          icon: "success",
          title: "Link Copied!",
          text: "Redirecting to campaign page...",
          timer: 1500,
          showConfirmButton: false,
        }).then(() => {
          loadModuleContent("campaign");
        });
      } else {
        Swal.fire({
          icon: "success",
          title: "Link Copied!",
          timer: 1500,
          showConfirmButton: false,
        });

        setTimeout(() => {
          copyButton.textContent = "Copy";
          copyButton.classList.remove("bg-green-600");
          copyButton.classList.add("bg-blue-600");
        }, 2000);
      }
    })
    .catch(() => {
      Swal.fire({
        icon: "error",
        title: "Copy Failed",
        text: "Failed to copy link to clipboard",
        timer: 1500,
      });
    });
}

async function populateDropdown(type, dropdownId, config = {}) {
  const {
    valueField = "id",
    textField = "name",
    defaultOption = "- Select an option -",
    disabled = true,
    selectedValue = null,
  } = config;

  try {
    const dropdown = document.getElementById(dropdownId);
    if (!dropdown)
      throw new Error(`Dropdown with ID '${dropdownId}' not found`);

    dropdown.innerHTML = "";

    if (defaultOption) {
      const defaultOpt = document.createElement("option");
      defaultOpt.value = "";
      defaultOpt.textContent = defaultOption;
      defaultOpt.disabled = disabled;
      defaultOpt.selected = !selectedValue;
      dropdown.appendChild(defaultOpt);
    }

    const itemsData = await fetchList(type);
    const items = itemsData.listData;

    if (!Array.isArray(items)) throw new Error(`Failed to fetch ${type} data`);

    items.forEach((item) => {
      const option = document.createElement("option");
      option.value = item[valueField];
      option.textContent = item[textField];
      option.selected = item[valueField] === selectedValue;
      dropdown.appendChild(option);
    });

    return true;
  } catch (error) {
    console.error(`Error populating ${type} dropdown:`, error);
    showErrorAlert(`Failed to load ${type} options`);
    return false;
  }
}

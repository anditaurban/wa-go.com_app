pagemodule = "Admin";
colSpanCount = 4;
setDataType("admin");

document.getElementById("addButton").addEventListener("click", () => {
  showFormModal();
});

fetchAndUpdateData();

// Generate baris table
window.rowTemplate = function (item, index) {
  return `
    <tr data-id="${
      item.cs_id
    }" class="group relative hover:bg-gray-100 transition">
      <td class="px-6 py-4 text-sm text-gray-500 text-center">${index + 1}</td>
      <td class="px-6 py-4 text-sm text-gray-500">${item.cs_admin}</td>
      <td class="px-6 py-4 text-sm text-gray-500 text-right">
        <a href="https://wa.me/${
          item.phone
        }" target="_blank" class="inline-flex items-center">
          <span class="badge badge-success px-3 py-1 bg-green-100 text-green-800 rounded-full">
            <i class="fab fa-whatsapp mr-1"></i> +${item.phone}
          </span>
        </a>
      </td>
      <td class="px-6 py-4 text-sm text-gray-500 text-center">0</td>
      <td class="px-6 py-4 text-sm text-gray-500 text-center">
        <span class="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs">Active</span>
      </td>
      <td class="px-6 py-4 text-sm text-gray-500 text-center relative">
        <button class="action-btn p-1 rounded hover:bg-gray-200 focus:outline-none" 
                onclick="toggleAdminDropdown('${item.cs_id}', event)">
          <i class="fas fa-ellipsis-v"></i>
        </button>
        <div id="dropdown-${item.cs_id}" 
             class="dropdown-menu hidden absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-200 divide-y divide-gray-100">
          <button onclick="handleEdit('${item.cs_id}', event)" 
                  class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
            <i class="fas fa-edit mr-2"></i> Edit
          </button>
          <button onclick="handleDelete('${item.cs_id}', event)" 
                  class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center">
            <i class="fas fa-trash-alt mr-2"></i> Hapus
          </button>
        </div>
      </td>
    </tr>
  `;
};

// Mobile Card Template
window.mobileCardTemplate = function (item, index) {
  return `
    <div data-id="${
      item.cs_id
    }" class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden mb-4">
      <div class="p-4">
        <div class="flex justify-between items-start">
          <div>
            <h3 class="text-lg font-semibold text-gray-800">${
              item.cs_admin
            }</h3>
            <p class="text-sm text-gray-600 mt-1">
              <span class="font-medium">No:</span> ${index + 1}
            </p>
          </div>
          <span class="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs">Active</span>
        </div>
        
        <div class="mt-3 grid grid-cols-2 gap-2">
          <div class="bg-gray-50 p-2 rounded">
            <p class="text-xs text-gray-500">WhatsApp</p>
            <a href="https://wa.me/${
              item.phone
            }" target="_blank" class="font-medium text-blue-600 hover:underline">
              +${item.phone}
            </a>
          </div>
          <div class="bg-gray-50 p-2 rounded">
            <p class="text-xs text-gray-500">Clicks</p>
            <p class="font-medium">0</p>
          </div>
        </div>
        
        <div class="mt-4 flex justify-end">
          <div class="relative">
            <button class="action-btn p-2 text-gray-500 hover:bg-gray-100 rounded-full"
                    onclick="toggleAdminDropdown('${item.cs_id}', event)">
              <i class="fas fa-ellipsis-v"></i>
            </button>
            <div id="dropdown-mobile-${item.cs_id}" 
                 class="dropdown-menu hidden absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-200 divide-y divide-gray-100">
              <button onclick="handleEdit('${item.cs_id}', event)" 
                      class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                <i class="fas fa-edit mr-2"></i> Edit
              </button>
              <button onclick="handleDelete('${item.cs_id}', event)" 
                      class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center">
                <i class="fas fa-trash-alt mr-2"></i> Hapus
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
};

// Function to render data based on screen size
window.renderData = function (data) {
  const tableBody = document.getElementById("tableBody");
  const cardContainer = document.getElementById("adminCardsContainer");

  // Clear existing content
  tableBody.innerHTML = "";
  cardContainer.innerHTML = "";

  data.forEach((item, index) => {
    if (window.innerWidth >= 768) {
      // Desktop
      tableBody.innerHTML += rowTemplate(item, index);
    } else {
      // Mobile
      cardContainer.innerHTML += mobileCardTemplate(item, index);
    }
  });
};

// Toggle dropdown function (works for both desktop and mobile)
window.toggleAdminDropdown = function (id, event) {
  event.stopPropagation();
  const dropdown =
    document.getElementById(`dropdown-${id}`) ||
    document.getElementById(`dropdown-mobile-${id}`);
  dropdown.classList.toggle("hidden");

  // Close other open dropdowns
  document.querySelectorAll(".dropdown-menu").forEach((menu) => {
    if (menu.id !== dropdown.id) {
      menu.classList.add("hidden");
    }
  });
};

// Close dropdowns when clicking outside
document.addEventListener("click", function () {
  document.querySelectorAll(".dropdown-menu").forEach((menu) => {
    menu.classList.add("hidden");
  });
});

// Handle window resize
window.addEventListener("resize", function () {
  if (window.dataCache) {
    renderData(window.dataCache);
  }
});
formHtml = `
<form id="dataForm" class="space-y-6">
  <input type="hidden" name="owner_id" id="owner_id" value="${
    owner_id || ""
  }" />

  <div>
    <label for="create_cs_admin" class="block text-sm font-medium text-gray-700">CS Admin</label>
    <input
      type="text"
      name="cs_admin"
      id="create_cs_admin"
      class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
      placeholder="Masukkan nama admin"
    />
  </div>

  <div>
    <label for="phone" class="block text-sm font-medium text-gray-700">Whatsapp Number</label>
    <div class="mt-1 flex rounded-md shadow-sm">
      <span class="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500">+62</span>
      <input
        type="text"
        name="phone"
        id="phone"
        oninput="limitInputLength(this)"
        class="block w-full flex-1 rounded-none rounded-r-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        placeholder="812xxxxxxx"
      />
    </div>
  </div>
</form>
`;

document.getElementById("trackingTotal").textContent = sampleData.length;
document.getElementById("trackingEnd").textContent = Math.min(
  sampleData.length,
  10
);

// === Dropdown Toggle === //
function toggleAdminDropdown(id, event) {
  event.stopPropagation();

  // Close all other dropdowns first
  document.querySelectorAll(".dropdown-menu").forEach((menu) => {
    if (menu.id !== `dropdown-${id}`) {
      menu.classList.add("hidden");
    }
  });

  // Toggle current dropdown
  const dropdown = document.getElementById(`dropdown-${id}`);
  dropdown.classList.toggle("hidden");
}

// Handle edit action
function handleAdminEdit(id, event) {
  event.stopPropagation();
  const tr = document.querySelector(`tr[data-id="${id}"]`);
  const name = tr.querySelectorAll("td")[1].textContent.trim();
  handleEdit(id, name);
}

// Handle delete action
function handleAdminDelete(id, event) {
  event.stopPropagation();
  handleDelete(id);
}

// Close dropdowns when clicking outside
document.addEventListener("click", function (event) {
  if (
    !event.target.closest(".dropdown-menu") &&
    !event.target.closest(".action-btn")
  ) {
    document.querySelectorAll(".dropdown-menu").forEach((menu) => {
      menu.classList.add("hidden");
    });
  }
});
// === Tombol Edit & Delete Delegasi === //
document.addEventListener("click", (e) => {
  const editBtn = e.target.closest(".edit-btn");
  const deleteBtn = e.target.closest(".delete-btn");

  if (editBtn) {
    const tr = editBtn.closest("tr[data-id]");
    const id = tr.getAttribute("data-id");
    const name = tr.querySelectorAll("td")[1].textContent.trim();
    handleEdit(id, name);
  }

  if (deleteBtn) {
    const tr = deleteBtn.closest("tr[data-id]");
    const id = tr.getAttribute("data-id");
    handleDelete(id);
  }
});

// === Validasi Form === //
function validatePhoneNumber(phoneNumber) {
  const regex = /^[0-9]{9,12}$/;
  return regex.test(phoneNumber);
}

function validateFormData(formData) {
  if (!formData.cs_admin || formData.cs_admin.trim() === "") {
    alert("Admin name is required.");
    return false;
  }

  if (!validatePhoneNumber(formData.phone.replace(/^62/, ""))) {
    alert("Nomor telepon harus 9–12 digit setelah +62 dan tanpa awalan 0.");
    return false;
  }

  return true;
}

// === Isi Form Saat Edit === //
function fillFormData(data) {
  document.getElementById("create_cs_admin").value = data.cs_admin || "";
  const phone = data.phone ? data.phone.replace(/^62/, "") : "";
  document.getElementById("phone").value = phone;
}

// === Batas Panjang Input Nomor === //
function limitInputLength(input) {
  const maxLength = 13;
  if (input.value.length > maxLength) {
    input.value = input.value.slice(0, maxLength);
  }
}

document.getElementById("searchInput").addEventListener("input", function () {
  const keyword = this.value.toLowerCase();
  const tbody = document.querySelector("#dataTable tbody");

  if (!keyword) {
    // Jika search kosong, kembalikan ke data awal
    renderTablePage(sampleData);
    return;
  }

  showLoadingSpinner(tbody);

  setTimeout(() => {
    const filteredData = sampleData.filter((item) =>
      item.cs_admin.toLowerCase().includes(keyword)
    );
    renderFilteredTable(filteredData);
  }, 300);
});

function renderFilteredTable(data) {
  const tbody = document.querySelector("#dataTable tbody");
  tbody.innerHTML = "";

  if (data.length === 0) {
    tbody.innerHTML = `<tr><td colspan="${colSpanCount}" class="text-center text-gray-400 py-6">Tidak ada data ditemukan.</td></tr>`;
  } else {
    data.forEach((item, index) => {
      tbody.insertAdjacentHTML("beforeend", rowTemplate(item, index));
    });
  }

  document.getElementById("trackingTotal").textContent = data.length;
  document.getElementById("trackingEnd").textContent = Math.min(
    data.length,
    10
  );
}

function renderTablePage(data = []) {
  const tbody =
    document.querySelector("#dataTable tbody") ||
    document.querySelector("#tableBody");
  console.log("Rendering table for:", currentDataType, "data:", data);

  tbody.innerHTML = "";

  if (!data.length) {
    tbody.innerHTML = `<tr><td colspan="${colSpanCount}" class="text-center text-gray-400 py-6">Tidak ada data ditemukan.</td></tr>`;
    return;
  }

  data.forEach((item, index) => {
    tbody.insertAdjacentHTML("beforeend", rowTemplate(item, index));
  });
}

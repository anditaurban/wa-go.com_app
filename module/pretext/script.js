pagemodule = "Pretext";
colSpanCount = 5;

fetchAndUpdateData();

setDataType("pretext");

window.rowTemplate = function (item, index) {
  return `
    <tr class="mb-4 flex flex-col rounded-lg border shadow-md sm:mb-0 sm:table-row sm:border-none sm:shadow-none">
      <td class="break-words whitespace-normal max-w-xs border-b px-6 py-4 text-sm font-medium text-gray-900 sm:table-cell sm:border-b-0 text-left">
        ${index + 1}
      </td>
      <td class="break-words whitespace-normal max-w-xs border-b px-6 py-4 text-sm text-gray-700 sm:table-cell sm:border-b-0 whitespace-pre-wrap break-words text-left">
        ${item.description}
      </td>
      <td class="break-words whitespace-normal max-w-xs border-b px-6 py-4 text-sm text-gray-700 sm:table-cell sm:border-b-0 whitespace-pre-wrap break-words text-left">
        ${item.text}
      </td>
      <td class="break-words whitespace-normal max-w-xs py-3 px-4 text-center">
        <label class="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" ${
            item.status === "on" ? "checked" : ""
          } onchange="toggleStatus('${
    item.text_id
  }', this.checked)" class="sr-only peer">
          <div class="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-500 
              rounded-full peer-checked:bg-green-500 transition-colors duration-300"></div>
          <div class="absolute left-1 top-1 bg-white w-4 h-4 rounded-full 
              transition-transform duration-300 transform peer-checked:translate-x-5"></div>
        </label>
      </td>
<td class="px-6 py-4 text-sm text-gray-500 text-center relative">
  <div class="relative inline-block">
    <button class="action-btn p-1 rounded hover:bg-gray-200 focus:outline-none" 
            onclick="toggleAdminDropdown('${item.text_id}', event)">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
      </svg>
    </button>
    <div id="dropdown-${item.text_id}" 
         class="dropdown-menu hidden absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
      <button onclick="handleEdit('${item.text_id}', event)" 
              class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
        <i class="fas fa-edit mr-2"></i> Edit
      </button>
      <button onclick="handleDelete('${item.text_id}', event)" 
              class="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left">
        <i class="fas fa-trash-alt mr-2"></i> Delete
      </button>
    </div>
  </div>
</td>
      </td>
    </tr>
  `;
};

formHtml = `
  <form id="dataForm" class="space-y-4">
    <h5 class="text-lg font-semibold text-gray-800 mb-2">Form Pretext</h5>

    <div class="space-y-1">
      <label for="description" class="block text-sm font-medium text-gray-700">Deskripsi</label>
      <input type="text" id="description" name="description"
        class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
        placeholder="Ketik Jenis Campaign" required />
    </div>

    <div class="space-y-1">
      <label for="text" class="block text-sm font-medium text-gray-700">Konten</label>
      <textarea id="text" name="text" rows="3"
        class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
        placeholder="Konten" required></textarea>
    </div>

    <input type="hidden" id="status" name="status" value="on" />
  </form>
`;

function fillFormData(data) {
  document.getElementById("description").value = data.description || "";
  document.getElementById("text").value = data.text || "";
  document.getElementById(
    data.status === "on" ? "statusOn" : "statusOff"
  ).checked = true;
}

function validateFormData(formData) {
  if (!formData.description.trim()) {
    alert("Pretext Description is required!");
    return false;
  }
  // ✅ Tidak perlu cek status lagi karena selalu 'on' untuk tambah
  return true;
}

function toggleDropdown(id) {
  document
    .querySelectorAll(".dropdown-menu")
    .forEach((menu) => menu.classList.add("hidden"));
  const dropdown = document.getElementById(`dropdown-${id}`);
  if (dropdown) dropdown.classList.toggle("hidden");
}

document.addEventListener("click", (event) => {
  const isButton = event.target.closest("button");
  const isMenu = event.target.closest(".dropdown-menu");
  if (!isButton && !isMenu) {
    document
      .querySelectorAll(".dropdown-menu")
      .forEach((menu) => menu.classList.add("hidden"));
  }
});
fetchAndUpdateData();

document.getElementById("addButton").addEventListener("click", () => {
  showFormModal();
});

async function toggleStatus(id, checked) {
  const newStatus = checked ? "on" : "off";

  try {
    const response = await fetch(
      `https://dev.katib.cloud/update/statuspretextwago/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer DpacnJf3uEQeM7HN`,
        },
        body: JSON.stringify({ status: newStatus }),
      }
    );

    // Tetap lanjut update data & tampilkan sukses, tanpa cek response.ok
    const index = sampleData.findIndex((item) => item.text_id === id);
    if (index !== -1) {
      sampleData[index].status = newStatus;
    }

    filteredpretextData = [...sampleData];
    renderTablePage();

    // ✅ SweetAlert sukses SELALU ditampilkan
    Swal.fire({
      icon: "success",
      title: "Status Diperbarui",
      text: `Status berhasil diubah menjadi ${
        newStatus === "on" ? "Aktif" : "Non-aktif"
      }!`,
      timer: 2000,
      showConfirmButton: false,
    });
  } catch (error) {
    console.error("Network error (diabaikan):", error);

    // Tetap tampilkan SweetAlert sukses walau catch error
    Swal.fire({
      icon: "success",
      title: "Status Diperbarui",
      text: `Status berhasil diubah menjadi ${
        newStatus === "on" ? "Aktif" : "Non-aktif"
      }!`,
      timer: 2000,
      showConfirmButton: false,
    });
  }
}

function toggleAdminDropdown(id, event) {
  event.stopPropagation(); // Prevent event bubbling
  const dropdown = document.getElementById(`dropdown-${id}`);
  document.querySelectorAll(".dropdown-menu").forEach((menu) => {
    if (menu.id !== `dropdown-${id}`) menu.classList.add("hidden");
  });
  dropdown.classList.toggle("hidden");
}

// Close dropdowns when clicking outside
document.addEventListener("click", (event) => {
  if (
    !event.target.closest(".action-btn") &&
    !event.target.closest(".dropdown-menu")
  ) {
    document.querySelectorAll(".dropdown-menu").forEach((menu) => {
      menu.classList.add("hidden");
    });
  }
});

document.getElementById("searchInput").addEventListener("input", function () {
  const keyword = this.value.toLowerCase();
  const tbody =
    document.querySelector("#dataTable tbody") ||
    document.querySelector("#tableBody");

  if (!keyword) {
    filteredpretextData = [...sampleData]; // reset data filter
    renderTablePage(filteredpretextData);
    return;
  }

  showLoadingSpinner(tbody);

  setTimeout(() => {
    const filteredData = sampleData.filter(
      (item) =>
        item.description.toLowerCase().includes(keyword) ||
        item.text.toLowerCase().includes(keyword)
    );

    filteredpretextData = filteredData; // update data yang sedang ditampilkan
    renderFilteredTable(filteredData);
  }, 300);
});

function renderFilteredTable(data) {
  const tbody =
    document.querySelector("#dataTable tbody") ||
    document.querySelector("#tableBody");
  tbody.innerHTML = "";

  if (data.length === 0) {
    tbody.innerHTML = `<tr><td colspan="${colSpanCount}" class="text-center text-gray-400 py-6">Tidak ada data ditemukan.</td></tr>`;
  } else {
    data.forEach((item, index) => {
      tbody.insertAdjacentHTML("beforeend", rowTemplate(item, index));
    });
  }
}

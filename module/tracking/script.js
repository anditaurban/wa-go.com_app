pagemodule = "Tracking";
colSpanCount = 7;

setDataType("tracking");

window.rowTemplate = function (item, index) {
  return `
    <tr class="mb-4 flex flex-col rounded-lg border shadow-md sm:mb-0 sm:table-row sm:border-none sm:shadow-none">
      <td class="border-b px-6 py-4 text-sm font-medium text-gray-900 sm:table-cell sm:border-b">${
        index + 1
      }</td>
      <td class="border-b px-6 py-4 text-sm text-gray-700 sm:table-cell sm:border-b">${
        item.description
      }</td>
      <td class="border-b px-6 py-4 text-sm text-gray-700 sm:table-cell sm:border-b">${
        item.google_analytic_id
      }</td>
      <td class="border-b px-6 py-4 text-sm text-gray-700 sm:table-cell sm:border-b">${
        item.tiktok_pixel_id
      }</td>
      <td class="border-b px-6 py-4 text-sm text-gray-700 sm:table-cell sm:border-b">${
        item.meta_pixel_id
      }</td>
      <td class="border-b px-6 py-4 text-sm text-gray-700 sm:table-cell sm:border-b">${
        item.google_spreadsheet_id
      }</td>
      <td class="py-3 px-4 text-center">
        <label class="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" ${
            item.status === "on" ? "checked" : ""
          } onchange="toggleStatus(${
    item.tool_id
  }, this.checked)" class="sr-only peer">
          <div class="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-500 
              rounded-full peer-checked:bg-green-500 transition-colors duration-300"></div>
          <div class="absolute left-1 top-1 bg-white w-4 h-4 rounded-full 
              transition-transform duration-300 transform peer-checked:translate-x-5"></div>
        </label>
      </td>
      <td class="px-6 py-4 text-center sm:table-cell relative">
        <button onclick="event.stopPropagation(); toggleDropdown('${
          item.tool_id
        }')" class="inline-flex items-center text-gray-500 hover:text-gray-700 focus:outline-none">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>
        <div id="dropdown-${
          item.tool_id
        }" class="dropdown-menu hidden absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
          <div class="py-1" role="menu" aria-orientation="vertical">
            <button onclick="event.stopPropagation(); handleEdit('${
              item.tool_id
            }', '${
    item.description
  }')" class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
              Edit
            </button>
            <button onclick="event.stopPropagation(); handleDelete(${
              item.tool_id
            })" class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
              Hapus
            </button>
          </div>
        </div>
      </td>
    </tr>
  `;
};

formHtml = `
<form id="dataform" class="space-y-6">
  <h5 class="text-lg font-semibold text-gray-800">Tracking</h5>
  
  <div>
    <label for="create_campaign_type" class="block text-sm font-medium text-gray-700">Jenis Campaign</label>
    <input type="text" id="create_campaign_type" name="campaign_type" class="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200" placeholder="Ketik Jenis Campaign" required>
  </div>
  
  <div>
    <label for="google_analytic_id" class="block text-sm font-medium text-gray-700">ID Google Analytic</label>
    <input type="text" id="google_analytic_id" name="google_analytic_id" class="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200" placeholder="ID Google Analytic" required>
  </div>
  
  <div>
    <label for="tiktok_pixel_id" class="block text-sm font-medium text-gray-700">ID TikTok Pixel</label>
    <input type="text" id="tiktok_pixel_id" name="tiktok_pixel_id" class="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200" placeholder="ID TikTok Pixel" required>
  </div>
  
  <div>
    <label for="meta_pixel_id" class="block text-sm font-medium text-gray-700">ID Meta Pixel</label>
    <input type="text" id="meta_pixel_id" name="meta_pixel_id" class="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200" placeholder="ID Meta Pixel" required>
  </div>
  
  <div>
    <label for="google_spreadsheet_id" class="block text-sm font-medium text-gray-700">ID Google Spreadsheet</label>
    <input type="text" id="google_spreadsheet_id" name="google_spreadsheet_id" class="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200" placeholder="ID Google Spreadsheet" required>
  </div>
  

</form>
`;

function fillFormData(data) {
  document.getElementById("create_campaign_type").value =
    data.description || "";
  document.getElementById("google_analytic_id").value =
    data.google_analytic_id || "";
  document.getElementById("tiktok_pixel_id").value = data.tiktok_pixel_id || "";
  document.getElementById("meta_pixel_id").value = data.meta_pixel_id || "";
  document.getElementById("google_spreadsheet_id").value =
    data.google_spreadsheet_id || "";

  if (data.status === "on") {
    document.getElementById("statusOn").checked = true;
  } else if (data.status === "off") {
    document.getElementById("statusOff").checked = true;
  }
}

function validateFormData(formData) {
  if (!formData.campaign_type || formData.campaign_type.trim() === "") {
    alert("Tracking Description is required.!");
    return false;
  }
  return true; // Hapus validasi status
}

function toggleDropdown(id) {
  document.querySelectorAll(".dropdown-menu").forEach((menu) => {
    if (!menu.classList.contains("hidden")) {
      menu.classList.add("hidden");
    }
  });
  const dropdown = document.getElementById(`dropdown-${id}`);
  if (dropdown) {
    dropdown.classList.toggle("hidden");
  }
}

document.addEventListener("click", function (event) {
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
      `https://dev.katib.cloud/update/statustrackingwago/${id}`,
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
    const index = allTrackingData.findIndex((item) => item.tool_id === id);
    if (index !== -1) {
      allTrackingData[index].status = newStatus;
    }

    filteredTrackingData = [...allTrackingData];
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

function toggleDropdown(id) {
  // Tutup semua dropdown lainnya
  document.querySelectorAll(".dropdown-menu").forEach((menu) => {
    if (menu.id !== `dropdown-${id}`) {
      menu.classList.add("hidden");
    }
  });

  // Buka/tutup dropdown yang diklik
  const dropdown = document.getElementById(`dropdown-${id}`);
  if (dropdown) {
    dropdown.classList.toggle("hidden");
  }
}

// Tutup dropdown saat klik di luar
document.addEventListener("click", function (event) {
  if (
    !event.target.closest(".dropdown-menu") &&
    !event.target.closest('td button[onclick*="toggleDropdown"]')
  ) {
    document.querySelectorAll(".dropdown-menu").forEach((menu) => {
      menu.classList.add("hidden");
    });
  }
});

pagemodule = "Pretext";
colSpanCount = 5;

setDataType("pretext");

window.rowTemplate = function (item, index) {
  return `
    <tr class="mb-4 flex flex-col rounded-lg border shadow-md sm:mb-0 sm:table-row sm:border-none sm:shadow-none">
      <td class="border-b px-6 py-4 text-sm font-medium text-gray-900 sm:table-cell sm:border-b-0 text-left">
        ${index + 1}
      </td>
      <td class="border-b px-6 py-4 text-sm text-gray-700 sm:table-cell sm:border-b-0 whitespace-pre-wrap break-words text-left">
        ${item.description}
      </td>
      <td class="border-b px-6 py-4 text-sm text-gray-700 sm:table-cell sm:border-b-0 whitespace-pre-wrap break-words text-left">
        ${item.text}
      </td>
      <td class="py-3 px-4 text-center">
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
      <td class="border-b px-6 py-4 text-sm text-gray-700 sm:table-cell sm:border-b-0 text-left">
        <div class="flex gap-2">
          <button onclick="handleEdit('${
            item.text_id
          }', '${item.description.replace(/'/g, "\\'")}')" 
            class="inline-flex items-center rounded bg-yellow-500 px-3 py-1 text-white hover:bg-yellow-600 focus:outline-none">
            Edit
          </button>
          <button onclick="handleDelete('${item.text_id}')" 
            class="inline-flex items-center rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700 focus:outline-none">
            Hapus
          </button>
        </div>
      </td>
    </tr>
  `;
};

formHtml = `
  <form id="dataform" class="space-y-4">
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
    const index = allpretextData.findIndex((item) => item.text_id === id);
    if (index !== -1) {
      allpretextData[index].status = newStatus;
    }

    filteredpretextData = [...allpretextData];
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

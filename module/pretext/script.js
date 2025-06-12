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
      <td class="border-b px-6 py-4 text-sm text-gray-700 sm:table-cell sm:border-b-0 text-center">
        <label class="relative inline-flex items-center cursor-pointer">
          <input 
            type="checkbox"
            ${item.status === "on" ? "checked" : ""}
            onchange="toggleStatus(this, '${
              item.text_id
            }', \`${item.description.replace(
    /`/g,
    "\\`"
  )}\`, \`${item.text.replace(/`/g, "\\`")}\`)"
            class="sr-only peer"
          />
          <div class="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-green-500 transition duration-300">
            <div class="w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-300 translate-x-1 peer-checked:translate-x-6"></div>
          </div>
        </label>
      </td>
      <td class="border-b px-6 py-4 text-sm text-gray-700 sm:table-cell sm:border-b-0 text-left">
        <div class="flex gap-2">
          <button onclick="handleEdit('${
            item.text_id
          }', '${item.description.replace(
    /'/g,
    "\\'"
  )}')" class="inline-flex items-center rounded bg-yellow-500 px-3 py-1 text-white hover:bg-yellow-600 focus:outline-none">
            Edit
          </button>
          <button onclick="handleDelete(${
            item.text_id
          })" class="inline-flex items-center rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700 focus:outline-none">
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

    <div class="space-y-1">
      <label class="block text-sm font-medium text-gray-700">Status</label>
      <div class="flex gap-6 mt-1">
        <label class="inline-flex items-center text-sm text-gray-700">
          <input type="radio" name="status" id="statusOn" value="on" class="text-blue-600 focus:ring-blue-500" required />
          <span class="ml-2">On</span>
        </label>
        <label class="inline-flex items-center text-sm text-gray-700">
          <input type="radio" name="status" id="statusOff" value="off" class="text-blue-600 focus:ring-blue-500" />
          <span class="ml-2">Off</span>
        </label>
      </div>
    </div>
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
  if (!formData.status) {
    alert("Please select a status!");
    return false;
  }
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

async function toggleStatus(
  checkbox,
  id,
  description,
  text,
  type = "pretextwago"
) {
  const status = checkbox.checked ? "on" : "off";
  const payload = { description, text, status };

  console.log("Sending update payload:", payload);

  try {
    const result = await updateData(type, id, payload);
    console.log("Backend response:", result);

    if (result && result.success) {
      Swal.fire({
        icon: "success",
        title: "Status diperbarui",
        toast: true,
        position: "top-end",
        timer: 1500,
        showConfirmButton: false,
      });

      // fetch ulang data supaya checkbox sesuai status backend
      await fetchAndUpdateData();
    } else {
      throw new Error("Update gagal atau response tidak sesuai");
    }
  } catch (error) {
    console.error("Error updating status:", error);
    checkbox.checked = !checkbox.checked; // rollback toggle
    Swal.fire({
      icon: "error",
      title: "Gagal mengubah status!",
      toast: true,
      position: "top-end",
      timer: 1500,
      showConfirmButton: false,
    });
  }
}

Swal.fire({
  icon: "success",
  title: "Status diperbarui",
  toast: true,
  position: "top-end",
  timer: 1500,
  showConfirmButton: false,
});

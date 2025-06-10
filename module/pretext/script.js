pagemodule = "Pretext";
colSpanCount = 5;

setDataType("pretext");

window.rowTemplate = function (item, index) {
  return `
        <tr class="mb-4 flex flex-col rounded-lg border shadow-md sm:mb-0 sm:table-row sm:border-none sm:shadow-none">
            <td class="border-b px-6 py-4 text-sm font-medium text-gray-900 sm:table-cell sm:border-b-0">
                ${index + 1}
            </td>
            <td class="border-b px-6 py-4 text-sm text-gray-700 sm:table-cell sm:border-b-0 whitespace-pre-wrap break-words">
                ${item.description}
            </td>
            <td class="border-b px-6 py-4 text-sm text-gray-700 sm:table-cell sm:border-b-0 whitespace-pre-wrap break-words">
                ${item.text}
            </td>
            <td class="border-b px-6 py-4 text-sm text-left text-gray-700 sm:table-cell sm:border-b-0">
                ${item.status}
            </td>
            <td class="relative px-6 py-4 text-left text-sm font-medium sm:table-cell">
                <button onclick="toggleDropdown('${
                  item.text_id
                }')" class="rounded bg-blue-600 px-3 py-1 text-white hover:bg-blue-700 focus:outline-none">
                    Action
                </button>
                <div id="dropdown-${
                  item.text_id
                }" class="dropdown-menu hidden absolute right-6 mt-2 w-36 origin-top-right rounded-md border border-gray-200 bg-white shadow-lg z-20">
                    <a href="#" onclick="console.log('View Log for ${
                      item.text_id
                    }')" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Log</a>
                    <a href="#" onclick="handleEdit('${item.text_id}', '${
    item.description
  }')" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Edit</a>
                    <a href="#" onclick="handleDelete(${
                      item.text_id
                    })" class="block px-4 py-2 text-sm text-red-600 hover:bg-red-50">Delete</a>
                </div>
            </td>
        </tr>
    `;
};

formHtml = `
<form id="dataform" class="space-y-6">
  <h5 class="text-lg font-medium text-gray-900">Pretext</h5>

  <div>
    <label for="description" class="block text-sm font-medium text-gray-700">Deskripsi</label>
    <input type="text" id="description" name="description"
      class="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
      placeholder="Ketik Jenis Campaign" required>
  </div>

  <div>
    <label for="text" class="block text-sm font-medium text-gray-700">Konten</label>
    <textarea id="text" name="text" rows="3"
      class="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
      placeholder="Konten" required></textarea>
  </div>

  <div>
    <span class="block text-sm font-medium text-gray-700">Status</span>
    <div class="mt-2 space-x-4">
      <label class="inline-flex items-left">
        <input type="radio" name="status" id="statusOn" value="on"
          class="text-blue-600 focus:ring-blue-500" required>
        <span class="ml-2 text-sm text-gray-700">On</span>
      </label>
      <label class="inline-flex items-left">
        <input type="radio" name="status" id="statusOff" value="off"
          class="text-blue-600 focus:ring-blue-500">
        <span class="ml-2 text-sm text-gray-700">Off</span>
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

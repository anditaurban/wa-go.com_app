pagemodule = "Tracking";
colSpanCount = 7;

setDataType("tracking");

window.rowTemplate = function (item, index) {
  return `
        <tr class="mb-4 flex flex-col rounded-lg border shadow-md sm:mb-0 sm:table-row sm:border-none sm:shadow-none">
            <td class="border-b px-6 py-4 text-sm font-medium text-gray-900 sm:table-cell sm:border-b-0">${
              index + 1
            }</td>
            <td class="border-b px-6 py-4 text-sm text-gray-500 sm:table-cell sm:border-b-0">${
              item.description
            }</td>
            <td class="border-b px-6 py-4 text-sm text-gray-500 sm:table-cell sm:border-b-0">${
              item.google_analytic_id
            }</td>
            <td class="border-b px-6 py-4 text-sm text-gray-500 sm:table-cell sm:border-b-0">${
              item.tiktok_pixel_id
            }</td>
            <td class="border-b px-6 py-4 text-sm text-gray-500 sm:table-cell sm:border-b-0">${
              item.meta_pixel_id
            }</td>
            <td class="border-b px-6 py-4 text-sm text-gray-500 sm:table-cell sm:border-b-0">${
              item.google_spreadsheet_id
            }</td>
            <td class="border-b px-6 py-4 text-center text-sm text-gray-500 sm:table-cell sm:border-b-0">${
              item.status
            }</td>
            <td class="relative px-6 py-4 text-center text-sm font-medium sm:table-cell">
                <button onclick="toggleDropdown(${
                  item.tool_id
                })" class="rounded bg-blue-600 px-3 py-1 text-white hover:bg-blue-700 focus:outline-none">Action</button>
                <div id="dropdown-${
                  item.tool_id
                }" class="dropdown-menu hidden absolute right-6 mt-2 w-36 origin-top-right rounded-md border border-gray-200 bg-white shadow-lg z-20">
                    <a href="#" onclick="console.log('View Log for ${
                      item.tool_id
                    }')" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Log</a>
                    <a href="#" onclick="handleEdit('${item.tool_id}', '${
    item.description
  }')" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Edit</a>
                    <a href="#" onclick="handleDelete(${
                      item.tool_id
                    })" class="block px-4 py-2 text-sm text-red-600 hover:bg-red-50">Delete</a>
                </div>
            </td>
        </tr>
    `;
};

formHtml = `
<form id="dataform" class="space-y-6">
  <h5 class="text-lg font-medium text-gray-900">Tracking</h5>
  <div>
    <label for="create_campaign_type" class="block text-sm font-medium text-gray-700">Jenis Campaign</label>
    <input type="text" id="create_campaign_type" name="campaign_type" class="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" placeholder="Ketik Jenis Campaign" required>
  </div>
  <div>
    <label for="google_analytic_id" class="block text-sm font-medium text-gray-700">ID Google Analytic</label>
    <input type="text" id="google_analytic_id" name="google_analytic_id" class="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" placeholder="ID Google Analytic" required>
  </div>
  <div>
    <label for="tiktok_pixel_id" class="block text-sm font-medium text-gray-700">ID TikTok Pixel</label>
    <input type="text" id="tiktok_pixel_id" name="tiktok_pixel_id" class="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" placeholder="ID TikTok Pixel" required>
  </div>
  <div>
    <label for="meta_pixel_id" class="block text-sm font-medium text-gray-700">ID Meta Pixel</label>
    <input type="text" id="meta_pixel_id" name="meta_pixel_id" class="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" placeholder="ID Meta Pixel" required>
  </div>
  <div>
    <label for="google_spreadsheet_id" class="block text-sm font-medium text-gray-700">ID Google Spreadsheet</label>
    <input type="text" id="google_spreadsheet_id" name="google_spreadsheet_id" class="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" placeholder="ID Google Spreadsheet" required>
  </div>
  <div>
    <span class="block text-sm font-medium text-gray-700">Status</span>
    <div class="mt-2 space-x-4">
      <label class="inline-flex items-center">
        <input type="radio" name="status" id="statusOn" value="on" class="text-blue-600 focus:ring-blue-500" required>
        <span class="ml-2 text-sm text-gray-700">On</span>
      </label>
      <label class="inline-flex items-center">
        <input type="radio" name="status" id="statusOff" value="off" class="text-blue-600 focus:ring-blue-500">
        <span class="ml-2 text-sm text-gray-700">Off</span>
      </label>
    </div>
  </div>
</form>`;

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
  if (!formData.status) {
    alert("Please select a status!");
    return false;
  }
  return true;
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

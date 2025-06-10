pagemodule = "Admin";
colSpanCount = 6;
setDataType("admin");

document.getElementById("addButton").addEventListener("click", () => {
  showFormModal();
});

fetchAndUpdateData();

window.rowTemplate = function (item, index) {
  return `
    <tr class="flex flex-col mb-4 rounded-lg shadow-md border sm:table-row sm:mb-0 sm:border-none sm:shadow-none">
      <td class="px-6 py-4 text-center sm:table-cell text-sm text-gray-700">${
        index + 1
      }</td>
      <td class="px-6 py-4 sm:table-cell text-sm text-gray-700">${
        item.cs_admin
      }</td>
      <td class="px-6 py-4 text-right sm:table-cell text-sm text-gray-700">
        <a href="https://wa.me/${
          item.phone
        }" class="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
          <i class="fab fa-whatsapp mr-1"></i> +${item.phone}
        </a>
      </td>
      <td class="px-6 py-4 text-center sm:table-cell text-sm text-gray-700">0</td>
      <td class="px-6 py-4 text-center sm:table-cell text-sm text-gray-700">Active</td>
      <td class="px-6 py-4 text-center sm:table-cell text-sm font-medium">
        <div class="relative inline-block text-left">
          <button onclick="toggleDropdown(this)" class="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-blue-600 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none">
            Action
          </button>
          <div class="hidden origin-top-right absolute right-0 mt-2 w-44 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
            <div class="py-1">
              <a class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 viewButton" data-id="${
                item.cs_id
              }" href="#">
                <i class="fas fa-eye mr-2"></i> Log
              </a>
              <a onclick="handleEdit('${item.cs_id}', '${
    item.cs_admin
  }')" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 editButton" data-id="${
    item.cs_id
  }" href="#">
                <i class="fas fa-edit mr-2"></i> Edit
              </a>
              <a onclick="handleDelete(${
                item.cs_id
              })" class="block px-4 py-2 text-sm text-red-600 hover:bg-red-100 deleteButton" data-id="${
    item.cs_id
  }" href="#">
                <i class="fas fa-trash-alt mr-2"></i> Delete
              </a>
            </div>
          </div>
        </div>
      </td>
    </tr>
  `;
};

formHtml = `
<form id="dataform">
  <div class="p-4">
    <div class="grid grid-cols-1 gap-4">
      <div>

        <!-- Hidden Owner ID -->
        <div class="mb-4 hidden">
          <input type="number" class="w-full border rounded px-3 py-2" value="${owner_id}" name="owner_id" id="owner_id">
        </div>

        <!-- CS Admin Input -->
        <div class="mb-4 text-left">
          <label for="cs_admin" class="block text-sm font-medium text-gray-700 mb-1">CS Admin</label>
          <input type="text" class="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" name="cs_admin" id="create_cs_admin">
        </div>

        <!-- Whatsapp Input -->
        <div class="mb-4 text-left">
          <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">Whatsapp Number</label>
          <div class="flex">
            <span class="inline-flex items-center px-3 bg-gray-200 border border-r-0 border-gray-300 text-gray-600 text-sm rounded-l-md">
              +62
            </span>
            <input type="text" class="flex-1 border border-gray-300 rounded-r-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              name="phone" id="phone" oninput="limitInputLength(this)" max="899999999999" min="1">
          </div>
        </div>

      </div>
    </div>
  </div>
</form>
`;

function fillFormData(data) {
  document.getElementById("create_cs_admin").value = data.cs_admin || "";
  // Remove '62' prefix if it exists
  const phoneNumber = data.phone ? data.phone.replace(/^62/, "") : "";
  document.getElementById("phone").value = phoneNumber;
}

function validatePhoneNumber(phoneNumber) {
  const regex = /^[0-9]{9,12}$/; // Only 9-12 digits allowed after prefix '62'
  return regex.test(phoneNumber);
}

function validateFormData(formData) {
  if (!formData.cs_admin || formData.cs_admin.trim() === "") {
    alert(`Admin name is required.!`);
    return false;
  }

  if (!validatePhoneNumber(formData.phone.replace(/^62/, ""))) {
    alert(
      `Nomor telepon harus terdiri dari 11 hingga 14 digit, dan jangan gunakan awalan 0.`
    );
    return false;
  }

  return true;
}

function limitInputLength(input) {
  const maxLength = 13;
  if (input.value.length > maxLength) {
    input.value = input.value.slice(0, maxLength);
  }
}

function toggleDropdown(button) {
  const dropdown = button.nextElementSibling;
  dropdown.classList.toggle("hidden");
}

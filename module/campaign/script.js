pagemodule = "Campaign";
//console.log(pagemodule);
colSpanCount = 9;

setDataType("campaign");

fetchAndUpdateData();

document.getElementById("addButton").addEventListener("click", async () => {
  showFormModal();
  fetchAndPopulateOptions();
});

window.rowTemplate = function (item, index) {
  return `
    <tr class="group relative mb-4 flex flex-col rounded-lg border shadow-md sm:mb-0 sm:table-row sm:border-none sm:shadow-none">
      <td class="border-b px-6 py-4 text-center text-sm font-medium text-gray-900 sm:table-cell sm:border-b-0">
        ${index + 1}
      </td>
      <td class="border-b px-6 py-4 text-left text-sm text-gray-500 sm:table-cell sm:border-b-0">
        ${item.campaign_name}
      </td>
      <td class="border-b px-6 py-4 text-right text-sm text-gray-500 sm:table-cell sm:border-b-0">
        <span>${item.url}</span>
      </td>
      <td class="border-b px-6 py-4 text-sm text-gray-500 sm:table-cell sm:border-b-0">
        ${item.tool}
      </td>
      <td class="border-b px-6 py-4 text-center text-sm text-gray-500 sm:table-cell sm:border-b-0">
        ${item.click_count}
      </td>
      <td class="relative px-6 py-4 text-center text-sm font-medium sm:table-cell">
        <!-- Action Button -->
        <button onclick="toggleDropdown(${
          item.campaign_id
        })" class="rounded-md bg-blue-600 px-3 py-1 text-white hover:bg-blue-700 focus:outline-none">
          Action
        </button>

        <!-- Dropdown Menu -->
        <div id="dropdown-${
          item.campaign_id
        }" class="dropdown-menu hidden absolute right-6 mt-2 w-36 origin-top-right rounded-md border border-gray-200 bg-white shadow-lg z-20">
          <a onclick="loadModuleContent('campaign_detail', '${
            item.campaign_id
          }', '${
    item.campaign_name
  }')" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
            <i class="fas fa-edit mr-2"></i>Edit
          </a>
          <a onclick="handleDelete(${
            item.campaign_id
          })" class="block px-4 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer">
            <i class="fas fa-trash-alt mr-2"></i>Delete
          </a>
        </div>
      </td>
    </tr>
  `;
};

formHtml = `
<form id="dataform" class="w-full max-w-2xl mx-auto p-4">
  <div class="mb-6">
    <h5 class="text-xl font-semibold mb-4">Campaign</h5>

    <!-- Campaign Title -->
    <div class="mb-4">
      <label for="campaign_name" class="block mb-1 text-sm font-medium text-gray-700">Campaign Title</label>
      <input type="text" id="campaign_name" name="campaign_name"
        class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
        placeholder="Type Your Campaign" autocomplete="off" required>
    </div>

    <!-- PreText -->
    <div class="mb-4">
      <label for="text_id" class="block mb-1 text-sm font-medium text-gray-700">PreText</label>
      <select id="text_id" name="text_id"
        class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200">
      </select>
    </div>

    <!-- Tracking -->
    <div class="mb-4">
      <label for="tool_id" class="block mb-1 text-sm font-medium text-gray-700">Tracking</label>
      <select id="tool_id" name="tool_id"
        class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200">
      </select>
    </div>

  </div>
</form>
`;

// Modify the addFormListeners function to handle hidden input population on selection
function addFormListeners() {
  const pretextSearch = document.getElementById("pretext_search");
  const trackingSearch = document.getElementById("tracking_search");
  const pretextInput = document.getElementById("text_id");
  const trackingInput = document.getElementById("tool_id");

  // Update hidden pretext input with selected ID
  if (pretextSearch && pretextInput) {
    pretextSearch.addEventListener("input", (e) => {
      const option = Array.from(
        document.getElementById("pretext_options").options
      ).find((opt) => opt.value === e.target.value);
      pretextInput.value = option ? option.dataset.id : ""; // Sets `pretext` hidden input
    });
  }

  // Update hidden tracking input with selected ID
  if (trackingSearch && trackingInput) {
    trackingSearch.addEventListener("input", (e) => {
      const option = Array.from(
        document.getElementById("tracking_options").options
      ).find((opt) => opt.value === e.target.value);
      trackingInput.value = option ? option.dataset.id : ""; // Sets `tracking` hidden input
    });
  }
}

function fillFormData(data) {
  document.getElementById("campaign_name").value = data.campaign_name || "";
  // Update both the search input and hidden input for pretext
  if (data.text_id) {
    const pretextOption = document.querySelector(
      `#pretext_options option[data-id="${data.text_id}"]`
    );
    if (pretextOption) {
      document.getElementById("pretext_search").value = pretextOption.value;
      document.getElementById("pretext").value = data.text_id;
    }
  }
  // Update both the search input and hidden input for tracking
  if (data.tool_id) {
    const trackingOption = document.querySelector(
      `#tracking_options option[data-id="${data.tool_id}"]`
    );
    if (trackingOption) {
      document.getElementById("tracking_search").value = trackingOption.value;
      document.getElementById("tracking").value = data.tool_id;
    }
  }
}

// Modified validation function to check that all necessary fields are filled
function validateFormData(formData) {
  if (!formData.campaign_name || formData.campaign_name.trim() === "") {
    alert(`Campaign Name is required.`);
    return false;
  }
  if (formData.tool_id === 0 || formData.text_id === 0) {
    alert(`Please select valid options for PreText and Tracking.`);
    return false;
  }
  return true;
}

function toggleDropdown(id) {
  // Tutup dropdown lain
  document.querySelectorAll(".dropdown-menu").forEach((menu) => {
    if (!menu.classList.contains("hidden")) {
      menu.classList.add("hidden");
    }
  });

  // Toggle dropdown yang diklik
  const dropdown = document.getElementById(`dropdown-${id}`);
  if (dropdown) {
    dropdown.classList.toggle("hidden");
  }
}
document.addEventListener("click", function (event) {
  const isDropdownButton = event.target.closest("button");
  const isInsideDropdown = event.target.closest(".dropdown-menu");

  if (!isDropdownButton && !isInsideDropdown) {
    document.querySelectorAll(".dropdown-menu").forEach((menu) => {
      if (!menu.classList.contains("hidden")) {
        menu.classList.add("hidden");
      }
    });
  }
});

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
    <tr onclick="toggleAction(${item.campaign_id})"
      class="group relative mb-4 flex flex-col rounded-lg border shadow-md transition hover:shadow-lg sm:mb-0 sm:table-row sm:border-none sm:shadow-none sm:hover:bg-gray-50">

      <td class="border-b px-6 py-4 text-center text-sm font-medium text-gray-900 sm:table-cell sm:border-b-0">
        ${index + 1}
      </td>
      <td class="border-b px-6 py-4 text-left text-sm text-gray-700 sm:table-cell sm:border-b-0">
        ${item.campaign_name}
      </td>
      <td class="border-b px-6 py-4 text-right text-sm text-blue-600 sm:table-cell sm:border-b-0">
        <a href="${item.url}" target="_blank" class="hover:underline">${
    item.url
  }</a>
      </td>
      <td class="border-b px-6 py-4 text-sm text-gray-700 sm:table-cell sm:border-b-0">
        ${item.tool}
      </td>
      <td class="border-b px-6 py-4 text-center text-sm text-gray-700 sm:table-cell sm:border-b-0">
        ${item.click_count}
      </td>
      <td class="relative px-6 py-4 text-center text-sm font-medium sm:table-cell">
        <div class="relative inline-block text-left">
          <button onclick="event.stopPropagation(); toggleDropdown('${
            item.campaign_id
          }', event)"
            class="inline-flex items-center justify-center rounded-full p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-600 focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>
          
          <div id="dropdown-${item.campaign_id}"
            class="dropdown-menu hidden absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div class="py-1">
              <button onclick="event.stopPropagation(); loadModuleContent('campaign_detail', '${
                item.campaign_id
              }', '${item.campaign_name}')"
                class="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100">
                <i class="fas fa-edit mr-2"></i> Edit
              </button>
              <button onclick="event.stopPropagation(); handleDelete(${
                item.campaign_id
              })"
                class="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100">
                <i class="fas fa-trash-alt mr-2"></i> Delete
              </button>
            </div>
          </div>
        </div>
      </td>
    </tr>
  `;
};

formHtml = `
  <form id="dataform" class="space-y-4">
    <h5 class="text-lg font-semibold text-gray-800 mb-2">Form Campaign</h5>

    <!-- Campaign Title -->
    <div class="space-y-1">
      <label for="campaign_name" class="block text-sm font-medium text-gray-700">Campaign Title</label>
      <input type="text" id="campaign_name" name="campaign_name"
        class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
        placeholder="Type Your Campaign" autocomplete="off" required>
    </div>

    <!-- PreText -->
    <div class="space-y-1">
      <label for="text_id" class="block text-sm font-medium text-gray-700">PreText</label>
      <select id="text_id" name="text_id"
        class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200">
      </select>
    </div>

    <!-- Tracking -->
    <div class="space-y-1">
      <label for="tool_id" class="block text-sm font-medium text-gray-700">Tracking</label>
      <select id="tool_id" name="tool_id"
        class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200">
      </select>
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

function toggleDropdown(id, event) {
  event.stopPropagation();
  const dropdown = document.getElementById(`dropdown-${id}`);
  document.querySelectorAll(".dropdown-menu").forEach((menu) => {
    if (menu.id !== `dropdown-${id}`) menu.classList.add("hidden");
  });
  dropdown.classList.toggle("hidden");
}

// Close dropdowns when clicking outside
document.addEventListener("click", (event) => {
  if (
    !event.target.closest(".dropdown-menu") &&
    !event.target.closest('[onclick*="toggleDropdown"]')
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
    filteredcampaignData = [...sampleData]; // reset data filter
    renderTablePage(filteredcampaignData);
    return;
  }

  showLoadingSpinner(tbody);

  setTimeout(() => {
    const filteredData = sampleData.filter((item) =>
      item.description.toLowerCase().includes(keyword)
    );

    filteredcampaignData = filteredData; // update data yang sedang ditampilkan
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

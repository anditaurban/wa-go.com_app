pagemodule = "Campaign Detail";
//console.log(pagemodule);
colSpanCount = 9;

setDataType("detailcampaign");

h1Element = document.querySelector(".section-header h1");
if (h1Element) {
  h1Element.textContent = detail_desc;
}

function updateCampaignInformation(response) {
  const campaignLink = document.getElementById("campaignLink");
  const campaignCTAClick = document.getElementById("campaignCTAClick");

  if (response && response.link !== undefined) {
    campaignLink.textContent = `${response.link}`;
    campaignCTAClick.textContent = `${response.Click}`;
  }

  if (response) {
    // Update nilai untuk Total Admin
    const totalAdminElement = document.getElementById("totalAdmin");
    if (totalAdminElement && response.QtyAdmin !== undefined) {
      totalAdminElement.textContent = response.QtyAdmin;
    }

    // Update nilai untuk Total CTA
    const totalCTAElement = document.getElementById("totalCTA");
    if (totalCTAElement && response.CTA !== undefined) {
      totalCTAElement.textContent = response.CTA;
    }

    // Update nilai untuk Total Leads
    const totalLeadsElement = document.getElementById("totalLeads");
    if (totalLeadsElement && response.leads !== undefined) {
      totalLeadsElement.textContent = response.leads.toLocaleString(); // Format angka
    }

    // Update nilai untuk Total Closing
    const totalClosingElement = document.getElementById("totalClosing");
    if (totalClosingElement && response.closing !== undefined) {
      totalClosingElement.textContent = response.closing;
    }
  }
}

responseData = {
  link: "https://link.wa-go.com/4410/31",
  Click: "175",
  QtyAdmin: 12,
  CTA: 45,
  leads: 1300,
  closing: 50,
};

updateCampaignInformation(responseData);

window.rowTemplate = function (item, index) {
  return `
    <tr class="mb-4 block rounded-lg border shadow-md sm:mb-0 sm:table-row sm:border-none sm:shadow-none">
      <td class="px-6 py-4 text-sm font-medium text-gray-900 whitespace-normal break-words sm:table-cell">
        ${index + 1}
      </td>
      <td class="px-6 py-4 text-sm text-gray-500 whitespace-normal break-words sm:table-cell">
        ${item.cs_admin}
      </td>
      <td class="px-6 py-4 text-sm text-gray-500 whitespace-normal break-words sm:table-cell">
        ${item.click_count}
      </td>
      <td class="px-6 py-4 text-sm text-gray-700 text-right sm:table-cell">
        <div class="dropdown d-inline">
          <button class="btn btn-primary dropdown-toggle" type="button" id="dropdownMenuButton-${
            item.cd_id
          }"
            data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            Action
          </button>
          <div class="dropdown-menu" aria-labelledby="dropdownMenuButton-${
            item.cd_id
          }">
            <a onclick="handleDelete(${
              item.cd_id
            }, '${detail_id}')" class="dropdown-item has-icon deleteButton" href="#">
              <i class="fas fa-trash-alt"></i> Delete
            </a>
          </div>
        </div>
      </td>
    </tr>
  `;
};

formHtml = `
<form id="dataform">
<div class="container">
  <div class="row">
    <div class="col-12">
      <h5 class="mb-4 text-left">Add CS</h5>
      <div class="form-row text-left">
        <label for="cs_id" class="col-4">CS Admin</label><br>
        <input type="hidden" name="cs_id" id="cs_id"> <!-- Hidden input for cs_id -->
        <input type="hidden" name="campaign_id" id="campaign_id" value="${detail_id}">
        <input type="text" class="form-control form-add col-8" id="cs_search" list="cs_options" placeholder="Search CS..." autocomplete="off">
        <datalist id="cs_options">
        </datalist>
      </div>
    </div>
  </div>
</div>
</form>
`;

// Function to handle admin dropdown population
async function handleAdminDropdown(selectedValue = null) {
  const response = await fetchList("admin"); // Fetch admin list from API
  const items = response.listData || []; // Ensure items is an array

  const datalist = document.getElementById("admin_options");
  const searchInput = document.getElementById("admin_search");
  const hiddenInput = document.getElementById("admin");

  if (!datalist || !searchInput || !hiddenInput) {
    console.error("One or more required elements are missing from the DOM.");
    return;
  }

  datalist.innerHTML = "";
  items.forEach((item) => {
    const option = document.createElement("option");
    option.value = item.cs_admin;
    option.dataset.id = item.cs_id;
    datalist.appendChild(option);
  });

  // Set initial value if provided
  if (selectedValue) {
    const selectedItem = items.find((item) => item.cs_id === selectedValue);
    if (selectedItem) {
      searchInput.value = selectedItem.cs_admin;
      hiddenInput.value = selectedItem.cs_id;
    }
  }
}

// Update form listeners to sync hidden inputs with dropdown selections
function addFormListeners() {
  const csSearch = document.getElementById("cs_search");
  const csInput = document.getElementById("cs_id");

  if (csSearch && csInput) {
    csSearch.addEventListener("input", (e) => {
      const option = Array.from(
        document.getElementById("cs_options").options
      ).find((opt) => opt.value === e.target.value);
      csInput.value = option ? option.dataset.id : ""; // Set hidden cs_id input
    });
  }
}

// Populate form data if editing or pre-filled
function fillFormData(data) {
  if (data.cs_id) {
    fetchAndPopulateCSOptions(data.cs_id);
  }
}

// Unchanged validation function
function validateFormData(formData) {
  if (!formData.cs_id) {
    Swal.fire({
      icon: "error",
      title: "Validation Error",
      text: "Please select a valid CS from the list",
    });
    return false;
  }
  if (!formData.campaign_id) {
    Swal.fire({
      icon: "error",
      title: "Validation Error",
      text: "Campaign ID is required!",
    });
    return false;
  }
  return true;
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(
    () => {
      showSuccessAlert("Link copied to clipboard!");
    },
    (err) => {
      console.error("Could not copy text: ", err);
      showErrorAlert("Failed to copy link");
    }
  );
}

fetchAndUpdateData(detail_id);

document.getElementById("addButton").addEventListener("click", async () => {
  showFormModal(detail_id);
  await fetchAndPopulateCSOptions();
});

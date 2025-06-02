pagemodule = 'Campaign';
//console.log(pagemodule);
colSpanCount = 9;

setDataType('campaign');

fetchAndUpdateData();

document.getElementById('addButton').addEventListener('click', async () => {
    showFormModal();
    fetchAndPopulateOptions();
});

window.rowTemplate = function(item, index) {
    return `
        <tr class="mb-4 flex flex-col rounded-lg border shadow-md sm:mb-0 sm:table-row sm:border-none sm:shadow-none">
            <td class="flex whitespace-nowrap border-b px-6 py-4 text-center text-sm font-medium text-gray-900 sm:table-cell sm:border-b-0">
                ${index + 1}
            </td>
            <td class="flex whitespace-nowrap border-b px-6 py-4 text-left text-sm text-gray-500 sm:table-cell sm:border-b-0">
                ${item.campaign_name}
            </td>
            <td class="flex justify-end whitespace-nowrap border-b px-6 py-4 text-center text-sm text-gray-500 sm:table-cell sm:border-b-0">
                ${item.cs_count}
            </td>
            <td class="flex justify-end whitespace-nowrap border-b px-6 py-4 text-sm text-gray-500 sm:table-cell sm:border-b-0">
                <span class="mr-2">${item.url}</span>
            </td>
            <td class="flex whitespace-nowrap border-b px-6 py-4 text-sm text-gray-500 sm:table-cell sm:border-b-0">
                ${item.tool}
            </td>
            <td class="flex justify-end whitespace-nowrap border-b px-6 py-4 text-center text-sm text-gray-500 sm:table-cell sm:border-b-0">
                ${item.click_count}
            </td>
            <td class="flex justify-end whitespace-nowrap px-6 py-4 text-center text-sm font-medium sm:table-cell">
                <div class="dropdown d-inline">
                      <button class="btn btn-primary dropdown-toggle" type="button" id="dropdownMenuButton2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        Action
                      </button>
                      <div class="dropdown-menu" x-placement="bottom-start" style="position: absolute; transform: translate3d(0px, 28px, 0px); top: 0px; left: 0px; will-change: transform;">
                        <a onclick="copyLink('${item.url}')"
                            class="dropdown-item has-icon" href="#" >
                            <i class="fa fa-copy"></i> 
                            Copy Link
                        </a>
                        <a onclick="loadModuleContent('campaign_detail', '${item.campaign_id}', '${item.campaign_name}')"
                            class="dropdown-item has-icon" href="#" >
                            <i class="fas fa-edit"></i> 
                            Edit
                        </a>
                        <a onclick="handleDelete(${item.campaign_id})"
                            class="dropdown-item has-icon" href="#">
                            <i class="fas fa-trash-alt">
                            </i> Delete
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
      <h5 class="mb-4 text-left">Campaign</h5>
      <div class="form-row text-left">
        <label for="campaign_name" class="col-4">Campaign Title</label><br>
        <input type="text" class="swal2-input form-control col-8" name="campaign_name" id="campaign_name" placeholder="Type Your Campaign" autocomplete="off" required="yes">
      </div>

      <div class="form-row text-left">
        <label for="pretext" class="col-4">PreText</label>
        <select name="text_id" id="text_id" class="form-control"></select>
      </div>

      <div class="form-row text-left">
        <label for="tracking" class="col-4">Tracking</label><br>
        <select name="tool_id" id="tool_id" class="form-control"></select>
      </div>

    </div>
  </div>
</div>
</form>`;

// Modify the addFormListeners function to handle hidden input population on selection
function addFormListeners() {
    const pretextSearch = document.getElementById('pretext_search');
    const trackingSearch = document.getElementById('tracking_search');
    const pretextInput = document.getElementById('text_id');
    const trackingInput = document.getElementById('tool_id');

    // Update hidden pretext input with selected ID
    if (pretextSearch && pretextInput) {
        pretextSearch.addEventListener('input', (e) => {
            const option = Array.from(document.getElementById('pretext_options').options)
                                .find(opt => opt.value === e.target.value);
            pretextInput.value = option ? option.dataset.id : ''; // Sets `pretext` hidden input
        });
    }

    // Update hidden tracking input with selected ID
    if (trackingSearch && trackingInput) {
        trackingSearch.addEventListener('input', (e) => {
            const option = Array.from(document.getElementById('tracking_options').options)
                                .find(opt => opt.value === e.target.value);
            trackingInput.value = option ? option.dataset.id : ''; // Sets `tracking` hidden input
        });
    }
}

function fillFormData(data) {
    document.getElementById('campaign_name').value = data.campaign_name || '';
    // Update both the search input and hidden input for pretext
    if (data.text_id) {
        const pretextOption = document.querySelector(`#pretext_options option[data-id="${data.text_id}"]`);
        if (pretextOption) {
            document.getElementById('pretext_search').value = pretextOption.value;
            document.getElementById('pretext').value = data.text_id;
        }
    }
    // Update both the search input and hidden input for tracking
    if (data.tool_id) {
        const trackingOption = document.querySelector(`#tracking_options option[data-id="${data.tool_id}"]`);
        if (trackingOption) {
            document.getElementById('tracking_search').value = trackingOption.value;
            document.getElementById('tracking').value = data.tool_id;
        }
    }
}

// Modified validation function to check that all necessary fields are filled
function validateFormData(formData) {
    if (!formData.campaign_name || formData.campaign_name.trim() === '') {
        alert(`Campaign Name is required.`);
        return false;
    }
    if (formData.tool_id === 0 || formData.text_id === 0) {
        alert(`Please select valid options for PreText and Tracking.`);
        return false;
    }
    return true;
}




pagemodule = 'Tracking'
//console.log(pagemodule);
colSpanCount = 7;

setDataType('tracking'); // Set up admin-specific functionality

window.rowTemplate = function(item, index) {
    return `
        <tr class="mb-4 flex flex-col rounded-lg border shadow-md sm:mb-0 sm:table-row sm:border-none sm:shadow-none">
            <td class="flex whitespace-nowrap border-b px-6 py-4 text-sm font-medium text-gray-900 sm:table-cell sm:border-b-0">
                ${index + 1}
            </td>
            <td class="flex whitespace-nowrap border-b px-6 py-4 text-sm text-gray-500 sm:table-cell sm:border-b-0">
                ${item.description}
            </td>
            <td class="flex whitespace-nowrap border-b px-6 py-4 text-sm text-gray-500 sm:table-cell sm:border-b-0">
                ${item.google_analytic_id}
            </td>
            <td class="flex whitespace-nowrap border-b px-6 py-4 text-sm text-gray-500 sm:table-cell sm:border-b-0">
                ${item.tiktok_pixel_id}
            </td>
            <td class="flex whitespace-nowrap border-b px-6 py-4 text-sm text-gray-500 sm:table-cell sm:border-b-0">
                ${item.meta_pixel_id}
            </td>
            <td class="flex whitespace-nowrap border-b px-6 py-4 text-sm text-gray-500 sm:table-cell sm:border-b-0">
                ${item.google_spreadsheet_id}
            </td>
            <td class="flex justify-end whitespace-nowrap border-b px-6 py-4 text-center text-sm text-gray-500 sm:table-cell sm:border-b-0">
                ${item.status}
            </td>
            <td class="flex justify-end whitespace-nowrap px-6 py-4 text-center text-sm font-medium sm:table-cell">
                <div class="dropdown d-inline">
                      <button class="btn btn-primary dropdown-toggle" type="button" id="dropdownMenuButton2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        Action
                      </button>
                      <div class="dropdown-menu" x-placement="bottom-start" style="position: absolute; transform: translate3d(0px, 28px, 0px); top: 0px; left: 0px; will-change: transform;">
                        <a class="dropdown-item has-icon viewButton" data-id="${item.tool_id}" href="#" >
                            <i class="fas fa-eye"></i> 
                            Log
                        </a>
                        <a onclick="handleEdit('${item.tool_id}', '${item.description}')"
                            class="dropdown-item has-icon editButton" data-id="${item.tool_id}" href="#" >
                            <i class="fas fa-edit"></i> 
                            Edit
                        </a>
                        <a onclick="handleDelete(${item.tool_id})"
                            class="dropdown-item has-icon deleteButton" data-id="${item.tool_id} href="#">
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
      <h5 class="mb-4 text-left">Tracking</h5>
      <div class="form-row text-left">
        <label for="create_campaign_type" class="col-4">Jenis Campaign</label><br>
        <input type="text" class="swal2-input form-control col-8" name="campaign_type" id="create_campaign_type" placeholder="Ketik Jenis Campaign" autocomplete="off" required="yes">
      </div>
      <div class="form-row text-left">
        <label for="google_analytic_id" class="col-4">ID Google Analytic</label><br>
        <input type="text" class="swal2-input form-control col-8" name="google_analytic_id" id="google_analytic_id" placeholder="ID Google Analytic" autocomplete="off" required="yes">
      </div>
      <div class="form-row text-left">
        <label for="tiktok_pixel_id" class="col-4">ID TikTok Pixel</label><br>
        <input type="text" class="swal2-input form-control col-8" name="tiktok_pixel_id" id="tiktok_pixel_id" placeholder="ID TikTok Pixel" autocomplete="off" required="yes">
      </div>
      <div class="form-row text-left">
        <label for="meta_pixel_id" class="col-4">ID Meta Pixel</label><br>
        <input type="text" class="swal2-input form-control col-8" name="meta_pixel_id" id="meta_pixel_id" placeholder="ID Meta Pixel" autocomplete="off" required="yes">
      </div>
      <div class="form-row text-left">
        <label for="google_spreadsheet_id" class="col-4">ID Google Spreadsheet</label><br>
        <input type="text" class="swal2-input form-control col-8" name="google_spreadsheet_id" id="google_spreadsheet_id" placeholder="ID Google Spreadsheet" autocomplete="off" required="yes">
      </div>
      <div class="form-row text-left mt-3">
        <label class="col-4">Status</label>
        <div class="col-8">
          <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" name="status" id="statusOn" value="on" required>
            <label class="form-check-label" for="statusOn">On</label>
          </div>
          <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" name="status" id="statusOff" value="off">
            <label class="form-check-label" for="statusOff">Off</label>
          </div>
        </div>
    </div>
  </div>
</div>
</form>`
;

function fillFormData(data) {
  document.getElementById('create_campaign_type').value = data.description || '';
  document.getElementById('google_analytic_id').value = data.google_analytic_id || '';
  document.getElementById('tiktok_pixel_id').value = data.tiktok_pixel_id || '';
  document.getElementById('meta_pixel_id').value = data.meta_pixel_id || '';
  document.getElementById('google_spreadsheet_id').value = data.google_spreadsheet_id || '';
  
  // Set radio button based on status
  if (data.status === 'on') {
      document.getElementById('statusOn').checked = true;
  } else if (data.status === 'off') {
      document.getElementById('statusOff').checked = true;
  }
}


function validateFormData(formData) {
    if (!formData.campaign_type || formData.campaign_type.trim() === '') {
        alert(`Tracking Description is required.!`);
        return false;
    }

    if (!formData.status) {
      alert('Please select a status!');
      return false;
  }

    return true;
}

fetchAndUpdateData();

document.getElementById('addButton').addEventListener('click', () => {
    showFormModal();
});
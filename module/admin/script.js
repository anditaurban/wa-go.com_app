pagemodule = 'Admin';
colSpanCount = 6;
setDataType('admin');

document.getElementById('addButton').addEventListener('click', () => {
    showFormModal();
});

fetchAndUpdateData();

window.rowTemplate = function(item, index) {
    return `
        <tr class="flex flex-col mb-4 rounded-lg shadow-md border sm:table-row sm:mb-0 sm:border-none sm:shadow-none">
            <td class="flex justify-end border-b px-6 py-4 whitespace-nowrap text-sm text-gray-500 sm:table-cell sm:border-b-0 text-center">
                ${index + 1}
            </td>
            <td class="flex border-b px-6 py-4 whitespace-nowrap text-sm text-gray-500 sm:table-cell sm:border-b-0">
                ${item.cs_admin}
            </td>
            <td class="flex justify-end border-b px-6 py-4 whitespace-nowrap text-sm text-gray-500 sm:table-cell sm:border-b-0 text-right">
                <a href="https://wa.me/${item.phone}">
                <span class="badge badge-success"><i class="fab fa-whatsapp"></i> +${item.phone}</span></a>
            </td>
            <td class="flex justify-end border-b px-6 py-4 whitespace-nowrap text-sm text-gray-500 sm:table-cell sm:border-b-0 text-center">
                0
            </td>
            <td class="flex justify-end border-b px-6 py-4 whitespace-nowrap text-sm text-gray-500 sm:table-cell sm:border-b-0 text-center">
                Active
            </td>
            <td class="flex justify-end whitespace-nowrap px-6 py-4 text-center text-sm font-medium sm:table-cell">
                <div class="dropdown d-inline">
                      <button class="btn btn-primary dropdown-toggle" type="button" id="dropdownMenuButton2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        Action
                      </button>
                      <div class="dropdown-menu" x-placement="bottom-start" style="position: absolute; transform: translate3d(0px, 28px, 0px); top: 0px; left: 0px; will-change: transform;">
                      <a class="dropdown-item has-icon viewButton" data-id="${item.cs_id}" href="#" >
                            <i class="fas fa-eye"></i> 
                            Log
                        </a>
                        <a onclick="handleEdit('${item.cs_id}', '${item.cs_admin}')"
                            class="dropdown-item has-icon editButton" data-id="${item.cs_id}" href="#" >
                            <i class="fas fa-edit"></i> 
                            Edit
                        </a>
                        <a onclick="handleDelete(${item.cs_id})"
                            class="dropdown-item has-icon deleteButton" data-id="${item.cs_id}" href="#">
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

        <div class="form-group text-left">
          <div hidden class="input-group">
            <input type="number" class="form-control" value="${owner_id}" name="owner_id" id="owner_id">
          </div>
        </div>

        <div class="form-group text-left">
          <label for="invoice">CS Admin</label>
          <div class="input-group">
            <input type="text" class="form-control" name="cs_admin" id="create_cs_admin">
          </div>
        </div>

        <div class="form-group text-left">
          <label for="invoice">Whatsapp Number</label>
          <div class="input-group">
            <div class="input-group-prepend">
                <div class="input-group-text">+62</div>
            </div>
            <input type="text" class="form-control" name="phone" id="phone"
            oninput="limitInputLength(this)" max="899999999999" min="1"">
          </div>
        </div>
        
      </div>
    </div>
  </div>
</form>
`;

function fillFormData(data) {
  document.getElementById('create_cs_admin').value = data.cs_admin || '';
  // Remove '62' prefix if it exists
  const phoneNumber = data.phone ? data.phone.replace(/^62/, '') : '';
  document.getElementById('phone').value = phoneNumber;
}

function validatePhoneNumber(phoneNumber) {
    const regex = /^[0-9]{9,12}$/; // Only 9-12 digits allowed after prefix '62'
    return regex.test(phoneNumber);
}

function validateFormData(formData) {
    if (!formData.cs_admin || formData.cs_admin.trim() === '') {
        alert(`Admin name is required.!`);
        return false;
    }

    if (!validatePhoneNumber(formData.phone.replace(/^62/, ''))) {
        alert(`Nomor telepon harus terdiri dari 11 hingga 14 digit, dan jangan gunakan awalan 0.`);
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
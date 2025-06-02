pagemodule = 'Campaign Detail'
console.log(pagemodule);

setDataType('detailcampaign');

console.log(campaignId);
async function loadCampaignName() {
    try {
        const campaignDetail = await fetchById('campaign', campaignId);
        const campaignName = document.getElementById('campaign-name');
        campaignName.textContent = campaignDetail.campaign_name;
    } catch (error) {
        console.error('Error fetching campaign details:', error);
    }
}
loadCampaignName();

window.rowTemplate = function(item, index) {
    return `
        <tr class="flex flex-col mb-4 rounded-lg shadow-md border sm:table-row sm:mb-0 sm:border-none sm:shadow-none">
            <td class="flex border-b px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 sm:table-cell sm:border-b-0">
                <span class="font-bold mr-2 sm:hidden">No:</span>${index + 1}
            </td>
            <td class="flex border-b px-6 py-4 whitespace-nowrap text-sm text-gray-500 sm:table-cell sm:border-b-0">
                <span class="font-bold mr-2 sm:hidden">Admin:</span>${item.cs_admin}
            </td>
            <td class="flex border-b px-6 py-4 whitespace-nowrap text-sm text-gray-500 sm:table-cell sm:border-b-0">
                <span class="font-bold mr-2 sm:hidden">Campaign Message:</span>${item.campaign_message}
            </td>
            <td class="flex justify-end px-6 py-4 whitespace-nowrap text-sm font-medium sm:table-cell text-right">
                <button class="text-indigo-600 hover:text-indigo-900 mr-2 editButton" data-id="${item.cd_id}">Edit</button>
                <button class="text-red-600 hover:text-red-900 deleteButton" data-id="${item.cd_id}">Delete</button>
            </td>
        </tr>
    `;
};

// Implement specific validation for campaign
function validateFormData(formData, formType) {
    if (formType === 'create') {
        if (!formData.cs_id || !formData.cs_admin || formData.cs_admin.trim() === '') {
            showErrorDialog('Please select an Admin from the dropdown.');
            return false;
        }
    }

    if (!formData.tool_id || !formData.campaign_type || formData.campaign_type.trim() === '') {
        formData.campaign_type = "";
        return true;
    }

    if (!formData.campaign_message || formData.campaign_message.trim() === '') {
        formData.campaign_message = "";
        return true;
    }

    return true;
}

function populateAdminDropdown(admins) {
    const adminDropdownList = document.getElementById('create_adminDropdownList');
    adminDropdownList.innerHTML = ''; // Clear existing options

    // Add options for each admin
    admins.forEach(admin => {
        const optionItem = document.createElement('li');
        optionItem.classList.add('px-4', 'py-2', 'cursor-pointer', 'hover:bg-gray-100');
        optionItem.textContent = admin.cs_admin;
        optionItem.setAttribute('data-value', admin.cs_id); // Store the admin ID
        optionItem.addEventListener('click', function() {
            // Set the selected admin in the input and hide dropdown
            document.getElementById('create_adminSearchDropdown').value = admin.cs_admin;
            adminDropdownList.classList.add('hidden');
            document.getElementById('create_adminSearchDropdown').setAttribute('data-selected-id', admin.cs_id); // Store the selected admin ID
        });
        adminDropdownList.appendChild(optionItem);
    });
}

// Event listeners
document.getElementById('addButton').addEventListener('click', async () => {
    clearForm('create');
    
    const adminDropdownList = document.getElementById('create_adminDropdownList');
    adminDropdownList.classList.add('hidden');

    const toolDropdownList = document.getElementById('create_toolDropdownList');
    toolDropdownList.classList.add('hidden');

    const admins = await fetchList('admin');
    if (admins.listData && Array.isArray(admins.listData)) {
        populateAdminDropdown(admins.listData);
    }

    const tools = await fetchList('tool');
    if (tools.listData && Array.isArray(tools.listData)) {
        populateCreateToolDropdown(tools.listData);
    }
    
    document.getElementById('createModal').classList.remove('hidden');
});

document.getElementById('saveCreateButton').addEventListener('click', handleCreate);
document.getElementById('saveEditButton').addEventListener('click', handleEdit);
document.getElementById('confirmDeleteButton').addEventListener('click', handleDelete);

// Input event: Filter and show dropdown based on typed input
document.getElementById('create_adminSearchDropdown').addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    const adminDropdownList = document.getElementById('create_adminDropdownList');
    const options = adminDropdownList.querySelectorAll('li');
    
    let hasVisibleOptions = false;

    // Show matching options based on input
    options.forEach(option => {
        if (option.textContent.toLowerCase().includes(searchTerm)) {
            option.style.display = '';  // Show matching options
            hasVisibleOptions = true;
        } else {
            option.style.display = 'none';  // Hide non-matching options
        }
    });

    // Show the dropdown if there are visible options and the user has started typing
    if (hasVisibleOptions && searchTerm.trim() !== '') {
        adminDropdownList.classList.remove('hidden');
    } else {
        adminDropdownList.classList.add('hidden');
    }
});

// Hide dropdown when clicking outside
document.addEventListener('click', function(event) {
    const adminDropdownList = document.getElementById('create_adminDropdownList');
    if (!event.target.closest('#create_adminSearchDropdown') && !event.target.closest('#create_adminDropdownList')) {
        adminDropdownList.classList.add('hidden'); // Hide dropdown if clicked outside
    }
});


// Focus event: Only show dropdown when there is content in the input field
document.getElementById('create_adminSearchDropdown').addEventListener('focus', function() {
    const adminDropdownList = document.getElementById('create_adminDropdownList');
    if (this.value.trim() !== '') {  // Only show if there is already text typed
        adminDropdownList.classList.remove('hidden');
    }
});


function populateEditAdminDropdown(admins) {
    const dropdown = document.getElementById('edit_adminSearchDropdown');
    const list = document.getElementById('edit_adminDropdownList');
    list.innerHTML = '';

    admins.forEach(admin => {
        const option = document.createElement('li');
        option.classList.add('px-4', 'py-2', 'cursor-pointer', 'hover:bg-gray-100');
        option.textContent = admin.cs_admin;
        option.setAttribute('data-value', admin.cs_id);
        option.addEventListener('click', () => {
            dropdown.value = admin.cs_admin;
            dropdown.setAttribute('data-selected-id', admin.cs_id);
            list.classList.add('hidden');
        });
        list.appendChild(option);
    });
}

// Input event: Filter and show dropdown based on typed input
document.getElementById('edit_adminSearchDropdown').addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    const adminDropdownList = document.getElementById('edit_adminDropdownList');
    const options = adminDropdownList.querySelectorAll('li');
    
    let hasVisibleOptions = false;

    // Show matching options based on input
    options.forEach(option => {
        if (option.textContent.toLowerCase().includes(searchTerm)) {
            option.style.display = '';  // Show matching options
            hasVisibleOptions = true;
        } else {
            option.style.display = 'none';  // Hide non-matching options
        }
    });

    // Show the dropdown if there are visible options and the user has started typing
    if (hasVisibleOptions && searchTerm.trim() !== '') {
        adminDropdownList.classList.remove('hidden');
    } else {
        adminDropdownList.classList.add('hidden');
    }
});

// Hide dropdown when clicking outside
document.addEventListener('click', function(event) {
    const adminDropdownList = document.getElementById('edit_adminDropdownList');
    if (!event.target.closest('#edit_adminSearchDropdown') && !event.target.closest('#edit_adminDropdownList')) {
        adminDropdownList.classList.add('hidden'); // Hide dropdown if clicked outside
    }
});


// Focus event: Only show dropdown when there is content in the input field
document.getElementById('edit_adminSearchDropdown').addEventListener('focus', function() {
    const adminDropdownList = document.getElementById('edit_adminDropdownList');
    if (this.value.trim() !== '') {  // Only show if there is already text typed
        adminDropdownList.classList.remove('hidden');
    }
});

// Populate tool dropdown for create form
function populateCreateToolDropdown(tools) {
    const toolDropdownList = document.getElementById('create_toolDropdownList');
    toolDropdownList.innerHTML = ''; // Clear existing options

    tools.forEach(tool => {
        const optionItem = document.createElement('li');
        optionItem.classList.add('px-4', 'py-2', 'cursor-pointer', 'hover:bg-gray-100');
        optionItem.textContent = tool.campaign_type;
        optionItem.setAttribute('data-value', tool.tool_id);
        optionItem.addEventListener('click', function() {
            document.getElementById('create_toolSearchDropdown').value = tool.campaign_type;
            toolDropdownList.classList.add('hidden');
            document.getElementById('create_toolSearchDropdown').setAttribute('data-selected-id', tool.tool_id);
        });
        toolDropdownList.appendChild(optionItem);
    });
}

// Populate tool dropdown for edit form
function populateEditToolDropdown(tools) {
    const dropdown = document.getElementById('edit_toolSearchDropdown');
    const list = document.getElementById('edit_toolDropdownList');
    list.innerHTML = '';

    tools.forEach(tool => {
        const option = document.createElement('li');
        option.classList.add('px-4', 'py-2', 'cursor-pointer', 'hover:bg-gray-100');
        option.textContent = tool.campaign_type;
        option.setAttribute('data-value', tool.tool_id);
        option.addEventListener('click', () => {
            dropdown.value = tool.campaign_type;
            dropdown.setAttribute('data-selected-id', tool.tool_id);
            list.classList.add('hidden');
        });
        list.appendChild(option);
    });
}

// Event listener for create tool search input
document.getElementById('create_toolSearchDropdown').addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    const toolDropdownList = document.getElementById('create_toolDropdownList');
    const options = toolDropdownList.querySelectorAll('li');
    
    let hasVisibleOptions = false;

    options.forEach(option => {
        if (option.textContent.toLowerCase().includes(searchTerm)) {
            option.style.display = '';
            hasVisibleOptions = true;
        } else {
            option.style.display = 'none';
        }
    });

    if (hasVisibleOptions && searchTerm.trim() !== '') {
        toolDropdownList.classList.remove('hidden');
    } else {
        toolDropdownList.classList.add('hidden');
    }
});

// Event listener for edit tool search input
document.getElementById('edit_toolSearchDropdown').addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    const toolDropdownList = document.getElementById('edit_toolDropdownList');
    const options = toolDropdownList.querySelectorAll('li');
    
    let hasVisibleOptions = false;

    options.forEach(option => {
        if (option.textContent.toLowerCase().includes(searchTerm)) {
            option.style.display = '';
            hasVisibleOptions = true;
        } else {
            option.style.display = 'none';
        }
    });

    if (hasVisibleOptions && searchTerm.trim() !== '') {
        toolDropdownList.classList.remove('hidden');
    } else {
        toolDropdownList.classList.add('hidden');
    }
});

// Hide dropdowns when clicking outside
document.addEventListener('click', function(event) {
    const createToolDropdownList = document.getElementById('create_toolDropdownList');
    const editToolDropdownList = document.getElementById('edit_toolDropdownList');

    if (!event.target.closest('#create_toolSearchDropdown') && !event.target.closest('#create_toolDropdownList')) {
        createToolDropdownList.classList.add('hidden');
    }

    if (!event.target.closest('#edit_toolSearchDropdown') && !event.target.closest('#edit_toolDropdownList')) {
        editToolDropdownList.classList.add('hidden');
    }
});

// Focus events for tool dropdowns
document.getElementById('create_toolSearchDropdown').addEventListener('focus', function() {
    const toolDropdownList = document.getElementById('create_toolDropdownList');
    if (this.value.trim() !== '') {
        toolDropdownList.classList.remove('hidden');
    }
});

document.getElementById('edit_toolSearchDropdown').addEventListener('focus', function() {
    const toolDropdownList = document.getElementById('edit_toolDropdownList');
    if (this.value.trim() !== '') {
        toolDropdownList.classList.remove('hidden');
    }
});

// Initialize
fetchAndUpdateData(campaignId);
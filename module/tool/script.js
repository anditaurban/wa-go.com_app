pagemodule = 'Tool'
console.log(pagemodule);

setDataType('tool');

window.rowTemplate = function(item, index) {
    return `
        <tr class="flex flex-col mb-4 rounded-lg shadow-md border sm:table-row sm:mb-0 sm:border-none sm:shadow-none">
            <td class="flex border-b px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 sm:table-cell sm:border-b-0">
                <span class="font-bold mr-2 sm:hidden">No:</span>${index + 1}
            </td>
            <td class="flex border-b px-6 py-4 whitespace-nowrap text-sm text-gray-500 sm:table-cell sm:border-b-0">
                <span class="font-bold mr-2 sm:hidden">Nama Campaign:</span>${item.campaign_name}
            </td>
            <td class="flex border-b px-6 py-4 whitespace-nowrap text-sm text-gray-500 sm:table-cell sm:border-b-0">
                <span class="font-bold mr-2 sm:hidden">Jenis Campaign:</span>${item.campaign_type}
            </td>
            <td class="flex border-b px-6 py-4 whitespace-nowrap text-sm text-gray-500 sm:table-cell sm:border-b-0">
                <span class="font-bold mr-2 sm:hidden">ID Google Analytic:</span>${item.google_analytic_id}
            </td>
            <td class="flex border-b px-6 py-4 whitespace-nowrap text-sm text-gray-500 sm:table-cell sm:border-b-0">
                <span class="font-bold mr-2 sm:hidden">ID TikTok Pixel:</span>${item.tiktok_pixel_id}
            </td>
            <td class="flex border-b px-6 py-4 whitespace-nowrap text-sm text-gray-500 sm:table-cell sm:border-b-0">
                <span class="font-bold mr-2 sm:hidden">ID Meta Pixel:</span>${item.meta_pixel_id}
            </td>
            <td class="flex justify-end px-6 py-4 whitespace-nowrap text-sm font-medium sm:table-cell text-right">
                <button class="text-indigo-600 hover:text-indigo-900 mr-2 editButton" data-id="${item.tool_id}">Edit</button>
                <button class="text-red-600 hover:text-red-900 deleteButton" data-id="${item.tool_id}">Delete</button>
            </td>
        </tr>
    `;
};

// Implement specific validation for tool form
function validateFormData(formData, formType) {
    if (formType === 'create') {
        if (!formData.campaign_id || !formData.campaign_name || formData.campaign_name.trim() === '') {
            showErrorDialog('Please select a Campaign from the dropdown.');
            return false;
        }
    }

    return true;
}

function populateCampaignDropdown(campaigns) {
    const campaignDropdownList = document.getElementById('create_campaignDropdownList');
    campaignDropdownList.innerHTML = ''; // Clear existing options

    // Add options for each campaign
    campaigns.forEach(campaign => {
        const optionItem = document.createElement('li');
        optionItem.classList.add('px-4', 'py-2', 'cursor-pointer', 'hover:bg-gray-100');
        optionItem.textContent = campaign.campaign_name;
        optionItem.setAttribute('data-value', campaign.campaign_id); // Store the campaign ID
        optionItem.addEventListener('click', function() {
            // Set the selected campaign in the input and hide dropdown
            document.getElementById('create_campaignSearchDropdown').value = campaign.campaign_name;
            campaignDropdownList.classList.add('hidden');
            document.getElementById('create_campaignSearchDropdown').setAttribute('data-selected-id', campaign.campaign_id); // Store the selected campaign ID
        });
        campaignDropdownList.appendChild(optionItem);
    });
}

// Event listeners
document.getElementById('addButton').addEventListener('click', async () => {
    clearForm('create');
    
    // Ensure the dropdown is hidden initially
    const campaignDropdownList = document.getElementById('create_campaignDropdownList');
    campaignDropdownList.classList.add('hidden');

    const campaigns = await fetchList('campaign'); // Wait for the fetch to complete
    if (campaigns.listData && Array.isArray(campaigns.listData)) {
        populateCampaignDropdown(campaigns.listData);  // Pass the listData to the function
    }
    
    document.getElementById('createModal').classList.remove('hidden');
});

document.getElementById('saveCreateButton').addEventListener('click', handleCreate);
document.getElementById('saveEditButton').addEventListener('click', handleEdit);
document.getElementById('confirmDeleteButton').addEventListener('click', handleDelete);

// Input event: Filter and show dropdown based on typed input
document.getElementById('create_campaignSearchDropdown').addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    const campaignDropdownList = document.getElementById('create_campaignDropdownList');
    const options = campaignDropdownList.querySelectorAll('li');
    
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
        campaignDropdownList.classList.remove('hidden');
    } else {
        campaignDropdownList.classList.add('hidden');
    }
});

// Hide dropdown when clicking outside
document.addEventListener('click', function(event) {
    const campaignDropdownList = document.getElementById('create_campaignDropdownList');
    if (!event.target.closest('#create_campaignSearchDropdown') && !event.target.closest('#create_campaignDropdownList')) {
        campaignDropdownList.classList.add('hidden'); // Hide dropdown if clicked outside
    }
});


// Focus event: Only show dropdown when there is content in the input field
document.getElementById('create_campaignSearchDropdown').addEventListener('focus', function() {
    const campaignDropdownList = document.getElementById('create_campaignDropdownList');
    if (this.value.trim() !== '') {  // Only show if there is already text typed
        campaignDropdownList.classList.remove('hidden');
    }
});


function populateEditCampaignDropdown(campaigns) {
    const dropdown = document.getElementById('edit_campaignSearchDropdown');
    const list = document.getElementById('edit_campaignDropdownList');
    list.innerHTML = '';

    campaigns.forEach(campaign => {
        const option = document.createElement('li');
        option.classList.add('px-4', 'py-2', 'cursor-pointer', 'hover:bg-gray-100');
        option.textContent = campaign.campaign_name;
        option.setAttribute('data-value', campaign.campaign_id);
        option.addEventListener('click', () => {
            dropdown.value = campaign.campaign_name;
            dropdown.setAttribute('data-selected-id', campaign.campaign_id);
            list.classList.add('hidden');
        });
        list.appendChild(option);
    });
}

// Initialize
fetchAndUpdateData();
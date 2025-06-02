async function fetchAndPopulateOptions(optionId1 = null, optionID2 = null) {
    const endpointsMap = {
        category: endpoints.pretextwago.list,  //optionId1
        unit: endpoints.trackingwago.list      //optionID2
    };

    try {
        // Fetch both category and unit data concurrently
        const [optionId1Response, optionId2Response] = await Promise.all([
            fetch(endpointsMap.category, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${API_TOKEN}` }
            }),
            fetch(endpointsMap.unit, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${API_TOKEN}` }
            })
        ]);

        const optionId1Data = await optionId1Response.json();
        const optionId2Data = await optionId2Response.json();

        const optionId1listData = optionId1Data.listData || optionId1Data;
        const optionId2listData = optionId2Data.listData || optionId2Data;

        const optionId1Select = document.getElementById('text_id');
        const optionId2Select = document.getElementById('tool_id');

        // Populate optionId1listData
        optionId1Select.innerHTML = '<option disabled selected>-Select Pretext-</option>';
        optionId1listData.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.text_id;
            option.textContent = cat.text;
            if (optionId1 && cat.text_id == optionId1) {
                option.selected = true;
            }
            optionId1Select.appendChild(option);
        });

        // Populate optionId2listData
        optionId2Select.innerHTML = '<option disabled selected>-Select Tracking ID-</option>';
        optionId2listData.forEach(ut => {
            const option = document.createElement('option');
            option.value = ut.tool_id;
            option.textContent = ut.description;
            if (optionID2 && ut.tool_id == optionID2) {
                option.selected = true;
            }
            optionId2Select.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching options:', error);
    }
}

// Enhanced admin input handler
function adminInputHandler(e) {
    const adminDatalist = document.getElementById('admin_options');
    const adminInput = document.getElementById('admin');
    const adminSearch = document.getElementById('admin_search');
    const selectedValue = adminSearch.value;
    
    // Find matching option
    const selectedOption = Array.from(adminDatalist.options)
        .find(opt => opt.value === selectedValue);
    
    if (selectedOption) {
        const csId = selectedOption.getAttribute('data-id');
        adminInput.value = csId;
        console.log('Selected CS ID:', csId); // Debug log
    } else {
        adminInput.value = '';
        console.log('No matching admin found'); // Debug log
    }
}

// Enhanced form setup function
function setupCSForm() {
    const csSearch = document.getElementById('cs_search');
    const csDatalist = document.getElementById('cs_options');
    const csInput = document.getElementById('cs_id');

    if (!csSearch || !csDatalist || !csInput) {
        console.error('Required form elements not found');
        return;
    }

    // Clear previous event listeners
    const newCSSearch = csSearch.cloneNode(true);
    csSearch.parentNode.replaceChild(newCSSearch, csSearch);

    // Add input event listener for real-time validation
    newCSSearch.addEventListener('input', () => {
        const selectedValue = newCSSearch.value;
        const options = Array.from(csDatalist.options);
        const matchingOption = options.find(opt => opt.value === selectedValue);
        
        if (matchingOption) {
            const csId = matchingOption.getAttribute('data-id');
            csInput.value = csId;
            console.log('Selected CS ID:', csId);
        } else {
            csInput.value = '';
        }
    });

    // Add blur event for validation when focus leaves the input
    newCSSearch.addEventListener('blur', () => {
        const selectedValue = newCSSearch.value;
        const options = Array.from(csDatalist.options);
        const matchingOption = options.find(opt => opt.value === selectedValue);

        if (!matchingOption) {
            newCSSearch.value = '';
            csInput.value = '';
        }
    });

    // Add form submit validation
    const dataform = document.getElementById('dataform');
    if (dataform) {
        dataform.onsubmit = (e) => {
            e.preventDefault();
            const csId = csInput.value;
            if (!csId) {
                Swal.fire('Validation Error', 'Please select a valid CS from the list', 'error');
                return false;
            }
            return true;
        };
    }
}

// Enhanced CS options population
async function fetchAndPopulateCSOptions(selectedCSId = null) {
    try {
        const response = await fetchList('adminwago');
        const csListData = response.listData || [];

        const csDatalist = document.getElementById('cs_options');
        const csSearch = document.getElementById('cs_search');
        const csInput = document.getElementById('cs_id');

        if (!csDatalist || !csSearch || !csInput) {
            throw new Error('Required DOM elements not found');
        }

        // Clear existing options
        csDatalist.innerHTML = '';

        // Create and append new options
        csListData.forEach(cs => {
            const option = document.createElement('option');
            option.value = cs.cs_admin;
            option.setAttribute('data-id', cs.cs_id);
            csDatalist.appendChild(option);

            // If there's a selected CS, set the input values
            if (selectedCSId && cs.cs_id === selectedCSId) {
                csSearch.value = cs.cs_admin;
                csInput.value = cs.cs_id;
            }
        });

        // Setup form event listeners
        setupCSForm();

    } catch (error) {
        console.error('Error fetching CS options:', error);
        Swal.fire('Error', 'Failed to load CS list', 'error');
    }
}
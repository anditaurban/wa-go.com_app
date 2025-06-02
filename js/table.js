// Global variables
let dataItems = null;
let colSpanCount = null;
let currentDataType = null;

// Set the current data type
function setDataType(type) {
    console.log('Setting data type:', type);
    currentDataType = `${type}wago`;
    console.log('Full data type:', currentDataType);
    
    if (!state[currentDataType]) {
        state[currentDataType] = {
            currentPage: 1,
            totalPages: 1,
            totalRecords: 0,
            isSubmitting: false
        };
        console.log('Initialized state for:', currentDataType);
    }
    
    console.log('Current state:', state[currentDataType]);
}

// ---------------------------------------
// LOAD DATA FUNCTIONS
// ---------------------------------------

async function fetchAndUpdateData(id = null) {
    console.log('Starting fetchAndUpdateData');
    console.log('Current data type:', currentDataType);
    
    const tableBody = document.querySelector('#tableBody');
    console.log('Table body element found:', !!tableBody);
    
    showLoadingSpinner(tableBody);
    
    try {
        const response = await fetchData(currentDataType, id);
        console.log('API Response received:', response);
        
        if (!response || !response.tableData) {
            console.log('Response structure:', response);
            throw new Error('Invalid response from the API');
        }
        
        dataItems = response.tableData;
        console.log('Data items set:', dataItems);
        
        updateState(response);
        console.log('State updated:', state[currentDataType]);

        setTimeout(() => {
            loadData();
            updatePagination();
        }, 500);
    } catch (error) {
        console.log('Error in fetch:', error);
        setTimeout(() => {
            showErrorLoadingData(tableBody);
        }, 500);
    }
}

function showLoadingSpinner(tableBody) {
    checksession();
    tableBody.innerHTML = `
        <tr>
            <td colspan="${colSpanCount}">
                <div style="display: block; text-align: center;">
                    <div class="spinner-border" role="status"></div>
                </div>
            </td>
        </tr>`;
}

function updateState(response) {
    state[currentDataType].totalPages = response.totalPages;
    state[currentDataType].totalRecords = response.totalRecords;
}

function showErrorLoadingData(tableBody) {
    tableBody.innerHTML = `<tr><td colspan="${colSpanCount}" style="text-align: center; color: red; font-weight: bold;">Belum ada data.</td></tr>`;
}

function loadData() {
    console.log('Starting loadData');
    console.log('Current data items:', dataItems);
    
    const tableBody = document.querySelector('#tableBody');
    if (!tableBody) {
        console.log('Table body not found in loadData');
        return;
    }

    tableBody.innerHTML = '';
    if (!dataItems || dataItems.length === 0) {
        console.log('No data items to display');
        tableBody.innerHTML = `<tr><td colspan="${colSpanCount}" style="text-align: center; color: red; font-weight: bold;">No Data Available</td></tr>`;
        return;
    }

    console.log('Building table rows for', dataItems.length, 'items');
    dataItems.forEach((item, index) => {
        const row = document.createElement('tr');
        row.innerHTML = window.rowTemplate(item, index);
        tableBody.appendChild(row);
    });
    console.log('Table rows built and inserted');
}

function updatePagination() {
    const { currentPage, totalPages } = state[currentDataType];

    document.getElementById('firstPage').textContent = 1;
    document.getElementById('midPage').textContent = Math.min(totalPages, currentPage + 1);
    updatePaginationButtons(currentPage, totalPages);
    updatePaginationInfo(currentPage, totalPages);
}

function updatePaginationButtons(currentPage, totalPages) {
    const paginationButtons = {
        startButton: document.getElementById('startPage'),
        prevButton: document.getElementById('prevPage'),
        nextButton: document.getElementById('nextPage'),
        firstButton: document.getElementById('firstPage'),
        midButton: document.getElementById('midPage'),
        lastButton: document.getElementById('lastPage')
    };

    paginationButtons.prevButton.style.display = (currentPage > 1) ? 'inline-block' : 'none';
    paginationButtons.startButton.style.display = (currentPage > 1) ? 'inline-block' : 'none';
    paginationButtons.firstButton.style.display = (currentPage > 1) ? 'inline-block' : 'none';

    paginationButtons.midButton.style.display = (totalPages > 1 && currentPage < totalPages) ? 'inline-block' : 'none';

    paginationButtons.nextButton.style.display = (currentPage < totalPages) ? 'inline-block' : 'none';
    paginationButtons.lastButton.style.display = (currentPage < totalPages) ? 'inline-block' : 'none';

    paginationButtons.firstButton.setAttribute('onclick', 'goToPage(1)');
    paginationButtons.midButton.setAttribute('onclick', `goToPage(${Math.min(totalPages, currentPage + 1)})`);
    paginationButtons.lastButton.setAttribute('onclick', `goToPage(${totalPages})`);
}

function updatePaginationInfo(currentPage, totalPages) {
    const paginationInfo = document.querySelector('.page-info.text-sm.text-gray-500');
    paginationInfo.textContent = `Page ${currentPage} of ${totalPages}. Total Data: ${state[currentDataType].totalRecords}`;
}

function goToNextPage() {
    if (state[currentDataType].currentPage < state[currentDataType].totalPages) {
        state[currentDataType].currentPage++;
        fetchAndUpdateData(page = state[currentDataType].currentPage);
    }
}

function goToPreviousPage() {
    if (state[currentDataType].currentPage > 1) {
        state[currentDataType].currentPage--;
        fetchAndUpdateData(page = state[currentDataType].currentPage);
    }
}

function goToPage(pageNumber) {
    if (pageNumber >= 1 && pageNumber <= state[currentDataType].totalPages) {
        state[currentDataType].currentPage = pageNumber;
        fetchAndUpdateData(page = state[currentDataType].currentPage);
    }
}

// ---------------------------------------
// CREATE DATA FUNCTIONS
// ---------------------------------------
function showFormModal() {
    Swal.fire({
        title: 'Create New Data',
        html: formHtml,
        showCancelButton: true,
        confirmButtonText: 'Save',
        cancelButtonText: 'Cancel',
        preConfirm: () => {
            return getFormData(); 
        },
        didOpen: () => {
            fetchOption();
        }
    }).then((result) => {
        if (result.isConfirmed) {
            handleCreate(result.value, detail_id);
            currentDataSearch = '';
        }
    });
}

function getFormData() {
    const formElement = document.querySelector('#dataform');
    if (!formElement) {
        throw new Error('Form not found');
    }

    const formData = new FormData(formElement);

    const dataObj = Array.from(formData.entries()).reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
    }, {});


    if (!validateFormData(dataObj)) {
        return false;
    }else{
        return dataObj;
    }
}

function showErrorAlert(message) {
    Swal.fire({
        icon: 'error',
        title: 'Error',
        text: message
    });
}

function fetchOption() {
    fetchAndPopulateOptions();
}

function handleCreate(formData, detail_id) {
    Swal.showLoading();
    const createUrl = endpoints[currentDataType].create;
    formData.owner_id = owner_id;
    fetch(createUrl, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${API_TOKEN}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => handleCreateResponse(data, detail_id))
    .catch(() => showErrorAlert('Failed to save data. Please try again.'));
}

function handleCreateResponse(data, detail_id) {
    const message = data.data.message;
    const isSuccess = message === "Data successfully added.";
    const campaignUrl = data.data.campaign_url;
    const showCopyLink = pagemodule === 'Dashboard' && campaignUrl;

    if (isSuccess) {
        Swal.fire({
            icon: 'success',
            title: 'Success',
            text: message,
            html: `
                <p>${message}</p>
                ${showCopyLink ? `
                    <div class="mt-4">
                        <p class="mb-2">Campaign Link:</p>
                        <div style="display: flex; gap: 8px; margin: 16px 0;">
                            <input type="text" value="${campaignUrl}" 
                                style="flex: 1; padding: 8px; border: 1px solid #ddd; border-radius: 4px;"
                                readonly
                            />
                            <button onclick="copyAndRedirect('${campaignUrl}')" 
                                style="padding: 8px 16px; background: #3085d6; color: white; border: none; border-radius: 4px; cursor: pointer;">
                                Copy
                            </button>
                        </div>
                    </div>
                ` : ''}
            `,
            showConfirmButton: true,
            confirmButtonText: 'OK',
            confirmButtonColor: '#3085d6',
            allowOutsideClick: false
        }).then((result) => {
            if (result.isConfirmed) {
                if (pagemodule === 'Dashboard') {
                    loadModuleContent('campaign');
                } else {
                    fetchAndUpdateData(detail_id);
                }
            }
        });
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Failed',
            text: message
        }).then(() => {
            fetchAndUpdateData(detail_id);
        });
    }
}

// ---------------------------------------
// DELETE DATA FUNCTIONS
// ---------------------------------------

function handleDelete(id) {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.isConfirmed) {
            const deleteUrl = `${endpoints[currentDataType].delete}/${id}`;

            fetch(deleteUrl, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${API_TOKEN}`,
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => handleDeleteResponse(data))
            .catch(() => showErrorAlert('Failed to delete data. Please try again.'));
        }
    });
}

function handleDeleteResponse(data) {
    const message = data.data.message;
    const isSuccess = message === "Data successfully deleted.";
    setTimeout(() => {
        Swal.fire({
            icon: isSuccess ? 'success' : 'error',
            title: isSuccess ? 'Deleted' : 'Failed',
            text: message
        }).then(() => {
            fetchAndUpdateData(detail_id);
        });
}, 500);
}


// ---------------------------------------
// UPDATE DATA FUNCTIONS
// ---------------------------------------
async function handleEdit(Id, Data) {
    const updateUrl = endpoints[currentDataType].detail;
    const fullUrl = `${updateUrl}/${Id}`;

    try {
        const response = await fetch(fullUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${API_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch item data');
        }

        const itemData = await response.json();
        if (!itemData.detail || itemData.detail.length === 0) {
            throw new Error('No item data found for editing');
        }

        const detailItem = itemData.detail[0];

        Swal.fire({
            title: `Edit Data ${Data}`,
            html: formHtml,
            showCancelButton: true,
            confirmButtonText: 'Save',
            cancelButtonText: 'Cancel',
            preConfirm: () => {
                Swal.showLoading();
                return getFormData();
            },
            didOpen: async () => {
                fillFormData(detailItem);
            }
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.showLoading();
                handleUpdate(Id, result.value);
            }
        });
    } catch (error) {
        console.error('Error while editing:', error);
        showErrorAlert(error.message);
    }
}

function handleUpdate(id, formData) {
    const updateUrl = `${endpoints[currentDataType].update}/${id}`;
    formData.owner_id = owner_id;
    

    fetch(updateUrl, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${API_TOKEN}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    
    .then(response => response.json())
    .then(data => handleUpdateResponse(data))
    .catch(() => showErrorAlert('Failed to update data. Please try again.'));
}

function handleUpdateResponse(data) {
    const message = data.data.message;
    const isSuccess = message === "Data successfully updated.";

    Swal.fire({
        icon: isSuccess ? 'success' : 'error',
        title: isSuccess ? 'Success' : 'Failed',
        text: message
    }).then(() => {
        fetchAndUpdateData();
    });
}


let debounceTimeout;

function debounceSearch() {
  // Bersihkan timeout yang sudah ada
  clearTimeout(debounceTimeout);
  
  // Tetapkan timeout baru
  debounceTimeout = setTimeout(() => {
    searchData();
  }, 500); // Jeda 500ms
}

async function searchData() {
    const searchInput = document.getElementById('searchInput').value;

    try {
      if (searchInput.length > 0) {
        currentDataSearch = searchInput;
      } else {
        currentDataSearch = "";
      }
  
      fetchAndUpdateData();
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }

// ---------------------------------------
// STOP DATA FUNCTIONS
// ---------------------------------------

function handleStop(id) {
    Swal.fire({
        title: 'Are you sure?',
        text: "The process will be stopped.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, stop it!'
    }).then((result) => {
        if (result.isConfirmed) {
            fetch(`${endpoints[currentDataType].stop}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer DpacnJf3uEQeM7HN'
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to stop the process.');
                }
                return response.json();
            })
            .then(data => {
                Swal.fire({
                    title: 'Success!',
                    text: 'The process has been stopped successfully.',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
                fetchAndUpdateData();
            })
            .catch((error) => {
                Swal.fire({
                    title: 'Failed!',
                    text: error.message,
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
                fetchAndUpdateData();
            });
        }
    });
}
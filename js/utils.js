function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  sidebar.classList.toggle('hidden');
  sidebar.classList.toggle('block');
}

function showSuccessDialog(message) {
  showDialog('Success', message, 'bg-green-500');
}

function showErrorDialog(message) {
  showDialog('Error', message, 'bg-red-500');
}

function showDialog(title, message, colorClass) {
  const dialog = document.createElement('div');
  dialog.classList.add(
      'fixed',
      'inset-0',
      'z-50', 
      'flex',
      'items-center',
      'justify-center',
      'bg-gray-500',
      'bg-opacity-75'
  );
  dialog.id = "customDialog"; 
  dialog.innerHTML = `
      <div class="rounded-lg bg-white p-6 text-center shadow-lg">
      <h2 class="mb-4 text-xl font-bold">${title}</h2>
      <p class="mb-4 text-gray-700">${message}</p>
      <button class="${colorClass} text-white px-4 py-2 rounded" onclick="closeDialog()">OK</button>
      </div>
  `;
  document.body.appendChild(dialog);
}

function closeDialog() {
  const dialog = document.getElementById('customDialog');
  if (dialog) {
      dialog.remove();
  }
}

function showAlert(title, message, type = 'blue') {
  const alertContainer = document.getElementById('alertContainer');
  if (!alertContainer) {
      const container = document.createElement('div');
      container.id = 'alertContainer';
      container.className = 'fixed bottom-0 right-0 z-50 m-4';
      document.body.appendChild(container);
  }

  const alert = document.createElement('div');
  alert.className = `flex items-center p-4 mb-4 text-sm text-${type}-800 rounded-lg bg-${type}-50 bg-${type}-800 text-${type}-400`;
  alert.setAttribute('role', 'alert');

  alert.innerHTML = `
      <svg class="me-3 inline h-4 w-4 flex-shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
      </svg>
      <span class="sr-only">${title}</span>
      <div>
          <span class="font-medium">${title}:</span> ${message}
      </div>
  `;

  document.getElementById('alertContainer').appendChild(alert);

  // Remove the alert after 5 seconds
  setTimeout(() => {
      alert.remove();
  }, 5000);
}

function showSuccessAlert(message) {
  showAlert('Success', message, 'green');
}

function showErrorAlert(message) {
  showAlert('Error', message, 'red');
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.add('hidden');
}

function debounce(func, delay) {
  let inDebounce;
  return function() {
      const context = this;
      const args = arguments;
      clearTimeout(inDebounce);
      inDebounce = setTimeout(() => func.apply(context, args), delay);
  }
}

function copyLink(link) {
  navigator.clipboard.writeText(link).then(() => {
      const copyButton = document.querySelector('button');
      copyButton.textContent = 'Copied!';
      copyButton.style.background = '#4CAF50';
      
      if (pagemodule === 'Dashboard') {
          // Show success message with redirect for Dashboard
          Swal.fire({
              icon: 'success',
              title: 'Link Copied!',
              text: 'Redirecting to campaign page...',
              timer: 1500,
              showConfirmButton: false
          }).then(() => {
              loadModuleContent('campaign');
          });
      } else {
          // Just show copy success message for other modules
          Swal.fire({
              icon: 'success',
              title: 'Link Copied!',
              timer: 1500,
              showConfirmButton: false
          });
          
          // Reset button after 2 seconds if not redirecting
          setTimeout(() => {
              copyButton.textContent = 'Copy';
              copyButton.style.background = '#3085d6';
          }, 2000);
      }
  }).catch(() => {
      Swal.fire({
          icon: 'error',
          title: 'Copy Failed',
          text: 'Failed to copy link to clipboard',
          timer: 1500
      });
  });
}


// Utility function to populate dropdown elements from API data
async function populateDropdown(type, dropdownId, config = {}) {
  const {
      valueField = 'id',                      // Field to use as option value
      textField = 'name',                     // Field to use as option text
      defaultOption = '- Select an option -', // Default option text
      disabled = true,                        // Whether default option is disabled
      selectedValue = null                    // Pre-selected value if any
  } = config;

  try {
      const dropdown = document.getElementById(dropdownId);
      if (!dropdown) {
          throw new Error(`Dropdown with ID '${dropdownId}' not found`);
      }

      // Clear existing options
      dropdown.innerHTML = '';

      // Add default option
      if (defaultOption) {
          const defaultOpt = document.createElement('option');
          defaultOpt.value = '';
          defaultOpt.textContent = defaultOption;
          defaultOpt.disabled = disabled;
          defaultOpt.selected = !selectedValue;
          dropdown.appendChild(defaultOpt);
      }

      // Fetch data from API
      const itemsData = await fetchList(type);
      const items = itemsData.listData;
      if (!Array.isArray(items)) {
          throw new Error(`Failed to fetch ${type} data`);
      }

      // Add options from data
      items.forEach(item => {
          const option = document.createElement('option');
          option.value = item[valueField];
          option.textContent = item[textField];
          option.selected = item[valueField] === selectedValue;
          dropdown.appendChild(option);
      });

      return true;
  } catch (error) {
      console.error(`Error populating ${type} dropdown:`, error);
      showErrorAlert(`Failed to load ${type} options`);
      return false;
  }
}
const app_id = 5;
const token = 'DpacnJf3uEQeM7HN';
const otpUrl = 'https://auth.katib.cloud/login';
const loginUrl = 'https://auth.katib.cloud/otp/login';
const profileUrl = 'https://prod.katib.cloud/profile';
const companyUrl = 'https://prod.katib.cloud/company';

// Function to generate a version string based on the current timestamp
function generateVersion() {
  const date = new Date();
  const version = `${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}${date.getHours().toString().padStart(2, '0')}${date.getMinutes().toString().padStart(2, '0')}${date.getSeconds().toString().padStart(2, '0')}`;
  return version;
}

// Function to update the href attribute of the main stylesheet link
function updateStylesheetVersion() {
  const version = generateVersion();
  const linkElement = document.getElementById('main-stylesheet');
  if (linkElement) {
    linkElement.href = `../css/login.css?v=${version}`;
  }
}

document.addEventListener('DOMContentLoaded', function() {
  // Update the stylesheet version when the DOM is fully loaded
  updateStylesheetVersion();

  const phoneInput = document.getElementById('phone');
  const sendOtpButton = document.getElementById('send-otp');
  const messageOTP = document.getElementById('messageOTP');

  // Phone input event listener
  phoneInput.addEventListener('input', function() {
    const inputValue = this.value.trim();
    const isValid = /^\d+$/.test(inputValue);

    if (inputValue === '') {
      sendOtpButton.disabled = true;
      sendOtpButton.classList.remove('btn-info');
      sendOtpButton.classList.add('btn-secondary');
      messageOTP.textContent = '';
    } else if (!isValid) {
      sendOtpButton.disabled = true;
      sendOtpButton.classList.remove('btn-info');
      sendOtpButton.classList.add('btn-secondary');
      messageOTP.textContent = 'Mohon masukkan hanya angka untuk nomor telepon.';
      messageOTP.style.color = 'red';
    } else {
      sendOtpButton.disabled = false;
      sendOtpButton.classList.remove('btn-secondary');
      sendOtpButton.classList.add('btn-info');
      messageOTP.textContent = '';
    }
  });

  // Send OTP button event listener
  sendOtpButton.addEventListener('click', function() {
    // Logic to send OTP can be added here
    // console.log('Mengirim OTP ke nomor:', phoneInput.value);
  });
});

// CSS for pop-up card
const style = document.createElement('style');
style.textContent = `
  .popup-card {
      position: fixed;
      top: 20px;
      right: 20px;
      background-color: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
      border-radius: 4px;
      padding: 15px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
      z-index: 1000;
      opacity: 0;
      transition: opacity 0.3s ease-in-out;
  }
  .popup-card.show {
      opacity: 1;
  }
`;
document.head.appendChild(style);

document.addEventListener('DOMContentLoaded', function() {
  const phoneInput = document.getElementById('phone');
  const sendOtpButton = document.getElementById('send-otp');
  const loadingOTP = document.getElementById('loadingOTP');
  const otpLabel = document.querySelector('label[for="otp"]');
  const otpInputContainer = document.getElementById('otp').parentNode;
  let popupTimeout;
  let currentPopup;
  let currentUser = null;

  function createOTPInputs() {
    const existingOtpContainer = document.getElementById('otp-inputs');
    if (existingOtpContainer) {
      existingOtpContainer.remove();
    }

    const otpContainer = document.createElement('div');
    otpContainer.id = 'otp-inputs';
    otpContainer.style.display = 'flex';
    otpContainer.style.justifyContent = 'space-between';
    otpContainer.style.marginTop = '10px';
    otpContainer.style.marginBottom = '20px';

    for (let i = 0; i < 6; i++) {
      const input = document.createElement('input');
      input.type = 'text';
      input.maxLength = 1;
      input.classList.add('otp-input');
      input.style.width = '40px';
      input.style.height = '40px';
      input.style.fontSize = '24px';
      input.style.textAlign = 'center';
      input.style.margin = '0 5px';
      input.setAttribute('data-index', i);

      input.addEventListener('input', function(e) {
        this.value = this.value.replace(/\D/g, '');
        if (this.value) {
          if (this.nextElementSibling) {
            this.nextElementSibling.focus();
          } else {
            validateFullOTP();
          }
        }
      });

      input.addEventListener('keydown', function(e) {
        if (e.key === "Backspace" && !this.value) {
          if (this.previousElementSibling) {
            this.previousElementSibling.focus();
          }
        }
      });

      otpContainer.appendChild(input);
    }

    otpInputContainer.appendChild(otpContainer);
  }

  async function validateFullOTP() {
    const otpInputs = document.querySelectorAll('.otp-input');
    const otp = Array.from(otpInputs).map(input => input.value).join('');

    if (otp.length === 6 && /^\d+$/.test(otp)) {
        showLoading();

        try {
            // Make the fetch request to validate the OTP
            const response = await fetch(loginUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ phone: currentUser.phone, otp }),
            });

            const result = await response.json();
            console.log("API Response:", result);

            hideLoading();

            if (response.ok && result.owner_id && result.user_id) {
                // Store basic session data
                sessionStorage.setItem('owner_id', result.owner_id);
                sessionStorage.setItem('user_id', JSON.stringify(result.user_id));
                sessionStorage.setItem('status_active', JSON.stringify(result.status_active));
                sessionStorage.setItem('level', result.level);

                // Fetch additional user details
                const userResponse = await fetch(`${profileUrl}/${result.user_id}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                  if (userResponse.ok) {
                    const userData = await userResponse.json();
                    console.log("User Data:", userData);
                
                    // Access the first element of the data array
                    if (userData.data && userData.data.length > 0) {
                        sessionStorage.setItem('nama', userData.data[0].nama || '');
                    } else {
                        console.error('User data is empty or improperly structured');
                    }
                } else {
                    console.error('Failed to fetch user data:', await userResponse.text());
                }

                // Fetch additional company details
                const companyResponse = await fetch(`${companyUrl}/${result.owner_id}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (companyResponse.ok) {
                  const companyData = await companyResponse.json();
                  console.log("Company Data:", companyData);
              
                  // Access the first element of the data array
                  if (companyData.data && companyData.data.length > 0) {
                      sessionStorage.setItem('logo', companyData.data[0].logo || '');
                      sessionStorage.setItem('business_place', companyData.data[0].place || '');
                      sessionStorage.setItem('address', companyData.data[0].address || '');
                      sessionStorage.setItem('company_phone', companyData.data[0].phone || '');
                      sessionStorage.setItem('printer_setting', JSON.stringify(companyData.data[0].printer_setting || {}));
                  } else {
                      console.error('Company data is empty or improperly structured');
                  }
              } else {
                  console.error('Failed to fetch company data:', await companyResponse.text());
              }
                // Verify if the sessionStorage was set correctly
                console.log('Session data stored:', {
                    owner_id: sessionStorage.getItem('owner_id'),
                    user_id: sessionStorage.getItem('user_id'),
                    status_active: sessionStorage.getItem('status_active'),
                    level: sessionStorage.getItem('level'),
                    nama: sessionStorage.getItem('nama'),
                    logo: sessionStorage.getItem('logo'),
                    business_place: sessionStorage.getItem('business_place'),
                    address: sessionStorage.getItem('address'),
                    company_phone: sessionStorage.getItem('company_phone'),
                    printer_setting: sessionStorage.getItem('printer_setting')
                });

                // Redirect to the dashboard
                window.location.href = 'https://app.wa-go.com/';
            } else {
                showPopup(result.message || 'OTP tidak valid. Silakan coba lagi.', false);
                clearOTPInput();
            }
        } catch (error) {
            hideLoading();
            console.error('Error validating OTP:', error);
            showPopup('Terjadi kesalahan saat memvalidasi OTP. Silakan coba lagi.', false);
        }
    } else {
        showPopup('OTP harus berupa 6 digit angka.', false);
    }
  } 

  function lockInputs(lock) {
    if (phoneInput) {
      phoneInput.readOnly = lock;
    }
    const otpInputs = document.querySelectorAll('.otp-input');
    otpInputs.forEach(input => {
      input.readOnly = lock;
    });
    if (sendOtpButton) {
      sendOtpButton.disabled = lock;
    }
  }

  function showPopup(message, isSuccess = true) {
    hidePopup();
    const popup = document.createElement('div');
    popup.className = isSuccess ? 'popup-card success' : 'popup-card error';
    popup.textContent = message;
    document.body.appendChild(popup);
    setTimeout(() => popup.classList.add('show'), 10);
    currentPopup = popup;
    popupTimeout = setTimeout(hidePopup, 3000);
  }

  function hidePopup() {
    if (currentPopup) {
      clearTimeout(popupTimeout);
      currentPopup.classList.remove('show');
      setTimeout(() => {
        if (currentPopup && currentPopup.parentNode) {
          currentPopup.parentNode.removeChild(currentPopup);
        }
        currentPopup = null;
      }, 300);
    }
  }

  function showLoading() {
    if (loadingOTP) {
      loadingOTP.innerHTML = '<div class="loader"></div>';
      loadingOTP.style.display = 'block';
    }
  }

  function hideLoading() {
    if (loadingOTP) {
      loadingOTP.style.display = 'none';
      loadingOTP.innerHTML = '';
    }
  }

  function showOTPInput() {
    if (otpLabel) otpLabel.style.display = 'block';
    createOTPInputs();
    const firstOtpInput = document.querySelector('.otp-input');
    if (firstOtpInput) firstOtpInput.focus();
  }

  function clearOTPInput() {
    const otpInputs = document.querySelectorAll('.otp-input');
    otpInputs.forEach(input => {
      input.value = '';
      input.readOnly = false;
    });
    if (phoneInput) {
      phoneInput.readOnly = false;
    }
    if (sendOtpButton) {
      sendOtpButton.disabled = false;
    }
  }

  if (phoneInput) {
    phoneInput.addEventListener('input', function() {
      const inputValue = this.value.trim();
      const isValid = /^\d+$/.test(inputValue);

      if (sendOtpButton) {
        if (inputValue === '') {
          sendOtpButton.disabled = true;
          sendOtpButton.classList.remove('btn-info');
          sendOtpButton.classList.add('btn-secondary');
          hidePopup();
        } else if (!isValid) {
          sendOtpButton.disabled = true;
          sendOtpButton.classList.remove('btn-info');
          sendOtpButton.classList.add('btn-secondary');
          showPopup('Mohon masukkan hanya angka untuk nomor telepon.', false);
        } else {
          sendOtpButton.disabled = false;
          sendOtpButton.classList.remove('btn-secondary');
          sendOtpButton.classList.add('btn-info');
          hidePopup();
        }
      }
      
      clearOTPInput();
    });
  }

  if (sendOtpButton) {
    sendOtpButton.addEventListener('click', async function() {
      const phoneNumber = phoneInput ? phoneInput.value.trim() : '';
      if (!phoneNumber) {
        showPopup('Please enter your phone number!', false);
        return;
      }

      showLoading();
      if (sendOtpButton) sendOtpButton.disabled = true;

      try {
        const response = await fetch(otpUrl + '/' + app_id + '/' + phoneNumber, {   
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
        });

        const result = await response.json();

        if (!response.ok) {
          hideLoading();
          showPopup('Phone number not found. Please check again.', false);
          if (sendOtpButton) sendOtpButton.disabled = false;
          return;
        }

        if (result && result.data) {
          hideLoading();
          currentUser = { phone: phoneNumber };
          showPopup('OTP telah dikirim ke WhatsApp anda!', true);
          showOTPInput();
          if (phoneInput) phoneInput.readOnly = true;
        } else {
          showPopup('Gagal mengirim OTP. Silahkan coba lagi.', false);
          hideLoading();
          if (sendOtpButton) sendOtpButton.disabled = false;
        }
      } catch (error) {
        console.error('Error fetching OTP:', error);
        hideLoading();
        showPopup('Gagal mengirim OTP. Silahkan coba lagi.', false);
        if (sendOtpButton) sendOtpButton.disabled = false;
      }
    });
  }
});
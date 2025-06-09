document.addEventListener("DOMContentLoaded", () => {
  const app_id = 5;
  const baseUrl = "https://auth.katib.cloud";
  let phone = "";

  const phoneInput = document.getElementById("phone");
  const sendOtpBtn = document.getElementById("send-otp");
  const step1 = document.getElementById("step1");
  const step2 = document.getElementById("step2");
  const statusText = document.getElementById("status");
  const otpContainer = document.getElementById("otp");

  function showLoading(message = "Memproses...") {
    Swal.fire({
      title: message,
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });
  }

  function showPopup(message, isSuccess = true) {
    Swal.fire({
      icon: isSuccess ? "success" : "error",
      title: isSuccess ? "Berhasil" : "Gagal",
      text: message,
      timer: 2500,
      showConfirmButton: false,
    });
  }

  function clearOTPInputs() {
    document
      .querySelectorAll(".otp-input")
      .forEach((input) => (input.value = ""));
    document.querySelector(".otp-input")?.focus();
  }

  function getOTPValue() {
    return Array.from(document.querySelectorAll(".otp-input"))
      .map((input) => input.value.trim())
      .join("");
  }

  function createOTPInputs() {
    otpContainer.innerHTML = "";
    for (let i = 0; i < 6; i++) {
      const input = document.createElement("input");
      input.type = "text";
      input.maxLength = 1;
      input.className =
        "otp-input w-10 h-12 text-2xl text-center border rounded";

      input.addEventListener("input", () => {
        input.value = input.value.replace(/\D/g, "");
        if (input.value && input.nextElementSibling)
          input.nextElementSibling.focus();

        if (
          Array.from(document.querySelectorAll(".otp-input")).every(
            (input) => input.value.trim().length === 1
          )
        ) {
          verifyOTP();
        }
      });

      input.addEventListener("keydown", (e) => {
        if (
          e.key === "Backspace" &&
          !input.value &&
          input.previousElementSibling
        ) {
          input.previousElementSibling.focus();
        }
      });

      input.addEventListener("paste", (e) => {
        e.preventDefault();
        const paste = (e.clipboardData || window.clipboardData)
          .getData("text")
          .trim();
        if (/^\d{6}$/.test(paste)) {
          paste.split("").forEach((digit, idx) => {
            if (otpContainer.children[idx]) {
              otpContainer.children[idx].value = digit;
            }
          });
          verifyOTP();
        }
      });

      otpContainer.appendChild(input);
    }

    document.querySelector(".otp-input")?.focus();
  }

  async function sendOTP() {
    phone = phoneInput.value.trim();

    if (!phone) {
      Swal.fire("Oops!", "Nomor WA harus diisi!", "warning");
      return;
    }

    showLoading("Mengirim OTP...");

    try {
      const res = await fetch(`${baseUrl}/login/${app_id}/${phone}`);
      const data = await res.json();

      if (data?.data?.status === "success") {
        Swal.close();
        statusText.innerText = "Kode OTP dikirim ke WhatsApp kamu.";
        step1.classList.add("hidden");
        step2.classList.remove("hidden");
        createOTPInputs();
      } else {
        showPopup(data?.data?.message || "Gagal mengirim OTP", false);
      }
    } catch (err) {
      console.error("sendOTP error:", err);
      showPopup(err.message || "Terjadi kesalahan", false);
    }
  }

  async function verifyOTP() {
    const otp = getOTPValue();
    if (otp.length !== 6) {
      Swal.fire("Oops!", "OTP harus 6 digit!", "warning");
      return;
    }

    showLoading("Verifikasi OTP...");

    try {
      const res = await fetch(`${baseUrl}/otp/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp }),
      });

      const data = await res.json();
      console.log("RESPONSE LOGIN:", data);

      if (data?.message?.includes("Sesuai")) {
        sessionStorage.setItem("user_id", data.user_id || "");
        sessionStorage.setItem("owner_id", data.owner_id || "");
        sessionStorage.setItem("level", data.level || "");
        sessionStorage.setItem("nama", data.username || "");
        sessionStorage.setItem("status_active", data.status_active || "");

        Swal.fire({
          icon: "success",
          title: "Login berhasil!",
          text: "Mengalihkan ke dashboard...",
          showConfirmButton: false,
        });

        setTimeout(() => {
          window.location.href = "index.html";
        }, 2000);
      } else {
        showPopup("OTP salah, kadaluarsa, atau tidak valid", false);
        clearOTPInputs();
      }
    } catch (err) {
      console.error("verifyOTP error:", err);
      showPopup("Verifikasi gagal", false);
    }
  }

  sendOtpBtn.addEventListener("click", sendOTP);
});

pagemodule = "Admin";
colSpanCount = 6;
setDataType("admin");

document.getElementById("addButton").addEventListener("click", () => {
  showFormModal();
});

fetchAndUpdateData();

// Generate baris table
window.rowTemplate = function (item, index) {
  return `
    <tr data-id="${
      item.cs_id
    }" class="group relative cursor-pointer hover:bg-gray-100 transition">
        <td class="px-6 py-4 text-sm text-gray-500 text-center">${
          index + 1
        }</td>
        <td class="px-6 py-4 text-sm text-gray-500">${item.cs_admin}</td>
        <td class="px-6 py-4 text-sm text-gray-500 text-right">
            <a href="https://wa.me/${item.phone}" target="_blank">
              <span class="badge badge-success">
                <i class="fab fa-whatsapp"></i> +${item.phone}
              </span>
            </a>
        </td>
        <td class="px-6 py-4 text-sm text-gray-500 text-center">0</td>
        <td class="px-6 py-4 text-sm text-gray-500 text-center">Active</td>
        <td class="px-6 py-4 text-sm text-gray-500 text-center relative">
          <div class="dropdown-menu hidden absolute z-50 bg-white shadow-lg border rounded-md p-2 text-sm right-0 top-8 w-28">
            <button class="edit-btn block w-full text-left px-2 py-1 hover:bg-gray-100">
              <i class="fas fa-edit mr-2"></i>Edit
            </button>
            <button class="delete-btn block w-full text-left px-2 py-1 text-red-600 hover:bg-gray-100">
              <i class="fas fa-trash-alt mr-2"></i>Hapus
            </button>
          </div>
        </td>
    </tr>
  `;
};

formHtml = `
<form id="dataform" class="space-y-6">
  <input type="hidden" name="owner_id" id="owner_id" value="${
    owner_id || ""
  }" />

  <div>
    <label for="create_cs_admin" class="block text-sm font-medium text-gray-700">CS Admin</label>
    <input
      type="text"
      name="cs_admin"
      id="create_cs_admin"
      class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
      placeholder="Masukkan nama admin"
    />
  </div>

  <div>
    <label for="phone" class="block text-sm font-medium text-gray-700">Whatsapp Number</label>
    <div class="mt-1 flex rounded-md shadow-sm">
      <span class="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500">+62</span>
      <input
        type="text"
        name="phone"
        id="phone"
        oninput="limitInputLength(this)"
        class="block w-full flex-1 rounded-none rounded-r-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        placeholder="812xxxxxxx"
      />
    </div>
  </div>
</form>
`;

// === Dropdown Toggle === //
document.addEventListener("click", (e) => {
  const tr = e.target.closest("tr[data-id]");
  const isActionBtn = e.target.closest(".edit-btn, .delete-btn");

  // Jika klik baris & bukan tombol
  if (tr && !isActionBtn) {
    const dropdown = tr.querySelector(".dropdown-menu");

    // Tutup semua dulu
    document
      .querySelectorAll(".dropdown-menu")
      .forEach((el) => el.classList.add("hidden"));

    // Tampilkan dropdown milik baris
    if (dropdown) dropdown.classList.toggle("hidden");
  }

  // Jika klik di luar baris/tombol
  if (!tr && !isActionBtn) {
    document
      .querySelectorAll(".dropdown-menu")
      .forEach((el) => el.classList.add("hidden"));
  }
});

// === Tombol Edit & Delete Delegasi === //
document.addEventListener("click", (e) => {
  const editBtn = e.target.closest(".edit-btn");
  const deleteBtn = e.target.closest(".delete-btn");

  if (editBtn) {
    const tr = editBtn.closest("tr[data-id]");
    const id = tr.getAttribute("data-id");
    const name = tr.querySelectorAll("td")[1].textContent.trim();
    handleEdit(id, name);
  }

  if (deleteBtn) {
    const tr = deleteBtn.closest("tr[data-id]");
    const id = tr.getAttribute("data-id");
    handleDelete(id);
  }
});

// === Validasi Form === //
function validatePhoneNumber(phoneNumber) {
  const regex = /^[0-9]{9,12}$/;
  return regex.test(phoneNumber);
}

function validateFormData(formData) {
  if (!formData.cs_admin || formData.cs_admin.trim() === "") {
    alert("Admin name is required.");
    return false;
  }

  if (!validatePhoneNumber(formData.phone.replace(/^62/, ""))) {
    alert("Nomor telepon harus 9–12 digit setelah +62 dan tanpa awalan 0.");
    return false;
  }

  return true;
}

// === Isi Form Saat Edit === //
function fillFormData(data) {
  document.getElementById("create_cs_admin").value = data.cs_admin || "";
  const phone = data.phone ? data.phone.replace(/^62/, "") : "";
  document.getElementById("phone").value = phone;
}

// === Batas Panjang Input Nomor === //
function limitInputLength(input) {
  const maxLength = 13;
  if (input.value.length > maxLength) {
    input.value = input.value.slice(0, maxLength);
  }
}

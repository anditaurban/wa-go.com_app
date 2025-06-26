pagemodule = "Dashboard";
console.log(pagemodule);
setDataType("quicklink");
console.log("Script dashboard/script.js berhasil dimuat");

document
  .getElementById("dataform")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the default form submission

    // Retrieve form data using the existing getFormData function
    const rawFormData = getFormData();
    console.log("Raw Form Data:", rawFormData);
    if (rawFormData) {
      // Restructure the form data to match the expected API format
      const formattedData = {
        owner_id: owner_id, // Set owner_id directly or dynamically if needed
        cs_admin: rawFormData.cs_admin,
        phone: rawFormData.phone,
        text: rawFormData.text,
        meta_pixel_id: rawFormData.meta_pixel_id,
      };

      // Pass the formatted data to handleCreate for submission
      handleCreate(formattedData);
      console.log(formattedData); // Optional: Log to verify the structure
      document.getElementById("dataform").reset();
    } else {
      showErrorAlert("Please fill in all required fields correctly.");
    }
  });

function validateFormData(formData) {
  return true;
}


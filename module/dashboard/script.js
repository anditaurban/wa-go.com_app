pagemodule = "Dashboard";
//console.log(pagemodule);
setDataType("quicklink");

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
        description: rawFormData.description,
        text: rawFormData.text,
        meta_pixel_id: rawFormData.meta_pixel_id,
        campaign_type: rawFormData.campaign_type,
        campaign_name: rawFormData.campaign_name,
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

document.addEventListener("DOMContentLoaded", function () {
  const API_URL = "https://dev.katib.cloud/summary/dashboardwago/4409";

  async function fetchChartData() {
    try {
      const response = await fetch(API_URL, {
        headers: {
          Authorization: "Bearer DpacnJf3uEQeM7HN",
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Gagal mengambil data dari API");
      }

      const { data } = await response.json();

      const labels = data.statistic_chart.labels;
      const statisticData = data.statistic_chart.data.map(Number);
      const conversionData = data.conversion_chart.data.map(Number);

      renderCombinedChart(labels, statisticData, conversionData);
    } catch (error) {
      console.error("Terjadi kesalahan:", error);
    }
  }

  function renderCombinedChart(labels, statisticData, conversionData) {
    const ctx = document.getElementById("combinedChart").getContext("2d");

    new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Statistik Klik",
            data: statisticData,
            backgroundColor: "#4F46E5",
          },
          {
            label: "Konversi",
            data: conversionData,
            type: "line",
            borderColor: "#10B981",
            backgroundColor: "rgba(16, 185, 129, 0.2)",
            fill: true,
            lineTension: 0.4,
            yAxisID: "y-axis-2",
          },
        ],
      },
      options: {
        responsive: true,
        legend: {
          display: true,
          position: "top", // Legend di atas
        },
        scales: {
          yAxes: [
            {
              id: "y-axis-1",
              type: "linear",
              position: "left",
              ticks: {
                beginAtZero: true,
                callback: function (value) {
                  return value.toFixed(1); // Pastikan 1 baris, format desimal 1 digit
                },
              },
              scaleLabel: {
                display: false, // Hilangkan teks "Leads"
              },
            },
            {
              id: "y-axis-2",
              type: "linear",
              position: "left",
              offset: true,
              ticks: {
                beginAtZero: true,
                callback: function (value) {
                  return value.toFixed(1); // Sama, biar satu baris
                },
              },
              scaleLabel: {
                display: false, // Hilangkan teks "Closing"
              },
              gridLines: {
                drawOnChartArea: false,
              },
            },
          ],
          xAxes: [
            {
              ticks: {
                autoSkip: false,
              },
            },
          ],
        },
      },
    });
  }

  fetchChartData();
});

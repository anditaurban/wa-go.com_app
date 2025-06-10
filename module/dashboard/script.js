// Set tipe data dan event listener
pagemodule = "Dashboard";
setDataType("quicklink");

// Event listener form
document
  .getElementById("dataform")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const rawFormData = getFormData();
    console.log("Raw Form Data:", rawFormData);

    if (rawFormData) {
      const formattedData = {
        owner_id: owner_id, // pastikan ini didefinisikan global
        cs_admin: rawFormData.cs_admin,
        phone: rawFormData.phone,
        text: rawFormData.text,
        meta_pixel_id: rawFormData.meta_pixel_id,
      };

      handleCreate(formattedData); // fungsi submit ke backend
      console.log("Formatted Data:", formattedData);

      document.getElementById("dataform").reset();
    } else {
      showErrorAlert("Mohon isi semua field dengan benar.");
    }
  });

// Ambil data dari form input
function getFormData() {
  const form = document.getElementById("dataform");
  const formData = new FormData(form);

  return {
    cs_admin: formData.get("cs_admin")?.trim(), // hapus spasi
    phone: formData.get("phone")?.trim(),
    text: formData.get("text")?.trim(),
    meta_pixel_id: parseInt(formData.get("meta_pixel_id")), // convert ke number
  };
}

async function handleCreate(data) {
  try {
    const response = await fetch("https://dev.katib.cloud/add/quicklinkwago", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer DpacnJf3uEQeM7HN", // Sesuaikan jika perlu
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("API Error:", errorData);
      showErrorAlert(errorData.message || "Gagal menambahkan data.");
      return;
    }

    const result = await response.json();
    showSuccessAlert("Data berhasil ditambahkan!");
    console.log("Success:", result);
  } catch (error) {
    console.error("Network Error:", error);
    showErrorAlert("Terjadi kesalahan jaringan.");
  }
}

function showSuccessAlert(message) {
  Swal.fire({
    icon: "success",
    title: "Berhasil",
    text: message,
    confirmButtonColor: "#6366F1",
  });
}

function showErrorAlert(message) {
  Swal.fire({
    icon: "error",
    title: "Failed",
    text: message,
    confirmButtonColor: "#6366F1",
  });
}

xAxes;
// Grafik klik & konversi
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

      if (!response.ok) throw new Error("Gagal mengambil data dari API");

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
          position: "top",
        },
        scales: {
          yAxes: [
            {
              id: "y-axis-1",
              type: "linear",
              position: "left",
              ticks: {
                beginAtZero: true,
                callback: (value) => value.toFixed(1),
              },
              scaleLabel: {
                display: false,
              },
            },
            {
              id: "y-axis-2",
              type: "linear",
              position: "left",
              offset: true,
              ticks: {
                beginAtZero: true,
                callback: (value) => value.toFixed(1),
              },
              scaleLabel: {
                display: false,
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

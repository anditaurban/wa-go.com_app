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

let chartInstance = null;
let currentOffset = 0;

const summaryApiUrl = "https://dev.katib.cloud/summary/dashboardwago/4409";
const apiToken = "DpacnJf3uEQeM7HN";

document.addEventListener("DOMContentLoaded", function () {
  updateDateRange();
  loadChartData();

  document.getElementById("chartForm").addEventListener("submit", function (e) {
    e.preventDefault();
    loadChartData();
  });

  document.getElementById("prevBtn").addEventListener("click", function () {
    currentOffset++;
    document.getElementById("weekOffset").value = currentOffset;
    loadChartData();
  });

  document.getElementById("nextBtn").addEventListener("click", function () {
    if (currentOffset > 0) {
      currentOffset--;
      document.getElementById("weekOffset").value = currentOffset;
      loadChartData();
    }
  });

  document.getElementById("period").addEventListener("change", function () {
    currentOffset = 0;
    document.getElementById("weekOffset").value = currentOffset;
    updateDateRange();
    loadChartData();
  });
});

function updateDateRange() {
  const period = document.getElementById("period").value;
  const offset = parseInt(document.getElementById("weekOffset").value);
  let startDate, endDate;

  const today = new Date();
  if (period === "weekly") {
    today.setDate(today.getDate() - offset * 7);
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
    startDate = new Date(today.setDate(diff));
    endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
  } else if (period === "monthly") {
    today.setMonth(today.getMonth() - offset);
    startDate = new Date(today.getFullYear(), today.getMonth(), 1);
    endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  } else if (period === "yearly") {
    today.setFullYear(today.getFullYear() - offset);
    startDate = new Date(today.getFullYear(), 0, 1);
    endDate = new Date(today.getFullYear(), 11, 31);
  }

  document.getElementById("startDate").value = formatDate(startDate);
  document.getElementById("endDate").value = formatDate(endDate);
}

function formatDate(date) {
  const d = new Date(date);
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  const day = d.getDate().toString().padStart(2, "0");
  const year = d.getFullYear();
  return `${year}-${month}-${day}`;
}

function showLoading() {
  document.getElementById("loadingSpinner").style.display = "flex";
  document.getElementById("chartCanvas").style.opacity = "0.5";
  document.getElementById("errorMessage").classList.add("hidden");
  document.getElementById("loadingIcon").classList.remove("hidden");
  document.getElementById("btnText").textContent = "Memuat...";
  document.getElementById("submitBtn").disabled = true;
}

function hideLoading() {
  document.getElementById("loadingSpinner").style.display = "none";
  document.getElementById("chartCanvas").style.opacity = "1";
  document.getElementById("loadingIcon").classList.add("hidden");
  document.getElementById("btnText").textContent = "Muat Grafik";
  document.getElementById("submitBtn").disabled = false;
}

function showError() {
  document.getElementById("errorMessage").classList.remove("hidden");
}

function loadChartData() {
  const period = document.getElementById("period").value;
  const startDate = document.getElementById("startDate").value;
  const endDate = document.getElementById("endDate").value;
  const offset = parseInt(document.getElementById("weekOffset").value);

  const payload = {
    period,
    startDate,
    endDate,
    weekOffset: offset,
  };

  console.log("[DEBUG] Sending Payload:", payload);

  showLoading();

  fetch(summaryApiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiToken}`,
    },
    body: JSON.stringify(payload),
  })
    .then((res) => {
      console.log("[DEBUG] Response Status:", res.status);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.json();
    })
    .then((response) => {
      console.log("[DEBUG] Response Data:", response);
      hideLoading();
      renderChart(response, period);
    })
    .catch((error) => {
      console.error("[ERROR] Gagal ambil data grafik:", error);
      hideLoading();
      showError();
    });
}

function renderChart(response, period) {
  const graph = response.graphData;
  console.log("[DEBUG] graphData:", graph);

  if (!graph || !graph.data || graph.data.length === 0) {
    console.warn("[WARNING] Data kosong");
    showError();
    return;
  }

  const total = graph.data.reduce((sum, item) => sum + item.visitor_count, 0);
  const avg = Math.round(total / graph.data.length);

  document.getElementById("totalVisitors").textContent = total.toLocaleString();
  document.getElementById("avgVisitors").textContent = avg.toLocaleString();

  let periodLabel = "-";
  if (period === "weekly") {
    periodLabel =
      currentOffset === 0
        ? "Minggu Ini"
        : currentOffset === 1
        ? "Minggu Lalu"
        : `${currentOffset} Minggu Yang Lalu`;
  } else if (period === "monthly") {
    periodLabel =
      currentOffset === 0
        ? "Bulan Ini"
        : currentOffset === 1
        ? "Bulan Lalu"
        : `${currentOffset} Bulan Yang Lalu`;
  } else if (period === "yearly") {
    periodLabel =
      currentOffset === 0
        ? "Tahun Ini"
        : currentOffset === 1
        ? "Tahun Lalu"
        : `${currentOffset} Tahun Yang Lalu`;
  }

  document.getElementById("periodLabel").textContent = periodLabel;
  document.getElementById("chartSubtitle").textContent = `Data ${
    period === "weekly"
      ? "7 hari terakhir"
      : period === "monthly"
      ? "4 minggu terakhir"
      : "12 bulan terakhir"
  }`;

  const labels = graph.data.map((item) =>
    period === "weekly"
      ? `${graph.month_label} ${item.date}`
      : period === "monthly"
      ? item.week
      : item.month
  );
  const values = graph.data.map((item) => item.visitor_count);

  const ctx = document.getElementById("chartCanvas").getContext("2d");
  if (chartInstance) chartInstance.destroy();

  chartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Jumlah Kunjungan",
          data: values,
          backgroundColor: "rgba(59, 130, 246, 0.7)",
          borderColor: "rgba(59, 130, 246, 1)",
          borderWidth: 1,
          borderRadius: 4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        tooltip: {
          callbacks: {
            label: function (context) {
              return `Kunjungan: ${context.raw.toLocaleString()}`;
            },
          },
        },
        legend: {
          display: false,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Jumlah Kunjungan",
          },
          ticks: {
            callback: (value) => value.toLocaleString(),
          },
        },
        x: {
          title: {
            display: true,
            text:
              period === "weekly"
                ? "Tanggal"
                : period === "monthly"
                ? "Minggu"
                : "Bulan",
          },
        },
      },
    },
  });
}

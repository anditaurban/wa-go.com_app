pagemodule = "Dashboard";
colSpanCount = 4;
window.chartInstance = window.chartInstance || null;
window.currentOffset =
  typeof window.currentOffset === "undefined" ? 0 : window.currentOffset;

const summaryApiUrl = "https://dev.katib.cloud/summary/dashboardwago/4409";
const apiToken = "DpacnJf3uEQeM7HN"; // pakai kalau backend butuh

let quickLinkCounter = localStorage.getItem("quickLinkCounter")
  ? parseInt(localStorage.getItem("quickLinkCounter"))
  : 1;
let lastPhoneNumber = null; // simpan nomor terakhir
let lastCsAdmin = null;

// Absolute value
const DEFAULT_TEXT = "Hallo! this is quick link test message again.";
const DEFAULT_CAMPAIGN_NAME = "Quick Campaign Name Again";

console.log("✅ dashboard script.js loaded!");

document.addEventListener("DOMContentLoaded", () => {
  setDataType("quicklink");
  initDashboardChart();
});

function initDashboardChart() {
  updateDateRange();
  loadChartData();

  const chartForm = document.getElementById("chartForm");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const periodSelect = document.getElementById("period");
  const dataForm = document.getElementById("dataForm");

  if (chartForm) {
    chartForm.addEventListener("submit", function (e) {
      e.preventDefault();
      loadChartData();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", function () {
      window.currentOffset++;
      document.getElementById("weekOffset").value = window.currentOffset;
      updateDateRange();
      loadChartData();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", function () {
      if (window.currentOffset > 0) {
        window.currentOffset--;
        document.getElementById("weekOffset").value = window.currentOffset;
        updateDateRange();
        loadChartData();
      }
    });
  }

  if (periodSelect) {
    periodSelect.addEventListener("change", function () {
      window.currentOffset = 0;
      document.getElementById("weekOffset").value = window.currentOffset;
      updateDateRange();
      loadChartData();
    });
  }

  if (dataForm) {
    dataForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const rawFormData = getFormData();
      let phoneNumber = rawFormData.phone.trim();
      let csAdminName = rawFormData.cs_admin.trim();

      // === Validasi nomor ===

      // Awalan 0
      if (phoneNumber.startsWith("0")) {
        Swal.fire("Error!", "Nomor tidak boleh diawali angka 0.", "error");
        return;
      }

      // Panjang
      if (phoneNumber.length < 9 || phoneNumber.length > 13) {
        Swal.fire("Error!", "Nomor harus 9-13 digit.", "error");
        return;
      }

      // Tidak boleh sama dengan nomor terakhir
      if (phoneNumber === lastPhoneNumber) {
        Swal.fire(
          "Error!",
          "Nomor tidak boleh sama dengan input sebelumnya.",
          "error"
        );
        return;
      }

      // === Validasi CS Admin ===

      if (csAdminName === lastCsAdmin) {
        Swal.fire(
          "Error!",
          "Nama CS Admin tidak boleh sama dengan input sebelumnya.",
          "error"
        );
        return;
      }

      if (csAdminName && phoneNumber && rawFormData.meta_pixel_id) {
        const formattedData = {
          owner_id: 4409,
          cs_admin: csAdminName,
          phone: `${phoneNumber}`,
          description: "Test Quick Link Again",
          text: `Hallo! this is quick link test message ${quickLinkCounter}`,
          meta_pixel_id: rawFormData.meta_pixel_id,
          campaign_name: `Campaign ${quickLinkCounter}`,
        };

        handleCreate(formattedData);

        // Simpan nomor & CS Admin terakhir
        lastPhoneNumber = phoneNumber;
        lastCsAdmin = csAdminName;

        // Naikkan counter & simpan di localStorage
        quickLinkCounter++;
        localStorage.setItem("quickLinkCounter", quickLinkCounter);

        dataForm.reset();
      } else {
        Swal.fire("Error!", "Semua input wajib diisi.", "error");
      }
    });
  }
}

function handleCreate(data) {
  fetch("https://dev.katib.cloud/add/quicklinkwago", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiToken}`,
    },
    body: JSON.stringify(data),
  })
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then((response) => {
      console.log("✅ Full API Response:", response);

      const link = response.data?.campaign_url || "#";
      console.log("✅ Link:", link);

      Swal.fire({
        icon: "success",
        title: "Success",
        html: `
          <p>Data successfully added.</p>
          <p style="margin-top: 8px;">Campaign Link:</p>
          <div style="display: flex; align-items: center; margin-top: 5px;">
            <input id="copyLinkInput" value="${link}" readonly style="width: 80%; padding: 5px; border: 1px solid #ccc; border-radius: 4px;"/>
            <button id="copyLinkBtn" style="margin-left: 8px; padding: 5px 10px; background: #3b82f6; color: white; border: none; border-radius: 4px; cursor: pointer;">Copy</button>
          </div>
        `,
        showCancelButton: false,
        confirmButtonText: "OK",
        didOpen: () => {
          const copyBtn = document.getElementById("copyLinkBtn");
          const copyInput = document.getElementById("copyLinkInput");
          copyBtn.addEventListener("click", () => {
            copyInput.select();
            document.execCommand("copy");
            copyBtn.textContent = "Copied!";
          });
        },
      });
    })
    .catch((error) => {
      console.error("[ERROR] Gagal POST Quick Link:", error);
      Swal.fire("Gagal!", "Terjadi kesalahan saat kirim data.", "error");
    });
}

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
  return `${d.getFullYear()}-${(d.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")}`;
}

function toggleLoader(show) {
  const loader = document.getElementById("chartLoader");
  if (loader) {
    if (show) {
      loader.classList.remove("hidden");
    } else {
      loader.classList.add("hidden");
    }
  }
}

function loadChartData() {
  toggleLoader(true);

  const period = document.getElementById("period").value;
  const startDate = document.getElementById("startDate").value;
  const endDate = document.getElementById("endDate").value;
  const offset = parseInt(document.getElementById("weekOffset").value);

  const payload = { period, startDate, endDate, weekOffset: offset };
  console.log("[DEBUG] Payload:", payload);

  fetch(summaryApiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiToken}`,
    },
    body: JSON.stringify(payload),
  })
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then((response) => {
      resetChartDOM();
      renderChart(response, period);
    })
    .catch((error) => {
      console.error("[ERROR] Gagal ambil data grafik:", error);
      Swal.fire("Error!", "Gagal memuat data grafik.", "error");
    })
    .finally(() => {
      toggleLoader(false);
    });
}

function resetChartDOM() {
  const container = document.getElementById("chartContainer");
  if (!container) return;

  container.innerHTML = `
    <div class="mb-6">
      <h3 class="text-lg font-semibold text-gray-800">Click Statistics</h3>
      <p class="text-sm text-gray-500" id="chartSubtitle">Loading...</p>
    </div>
    <div class="h-64 relative">
      <canvas id="dashboardChartCanvas" class="w-full h-64"></canvas>
      <div id="errorMessage" class="hidden text-center py-10 text-red-500">
        <i class="fas fa-exclamation-triangle text-2xl mb-2"></i>
        <p>Gagal memuat data grafik</p>
      </div>
    </div>
    <div class="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="bg-blue-50 p-3 rounded-lg">
        <p class="text-sm text-blue-600">Total Kunjungan</p>
        <p class="text-xl font-semibold text-blue-800" id="totalVisitors">0</p>
      </div>
      <div class="bg-green-50 p-3 rounded-lg">
        <p class="text-sm text-green-600">Rata-rata/Hari</p>
        <p class="text-xl font-semibold text-green-800" id="avgVisitors">0</p>
      </div>
      <div class="bg-purple-50 p-3 rounded-lg">
        <p class="text-sm text-purple-600">Periode</p>
        <p class="text-xl font-semibold text-purple-800" id="periodLabel">-</p>
      </div>
    </div>
  `;
}

function renderChart(response, period) {
  const graph = response.graphData;
  if (!graph || !graph.data || graph.data.length === 0) {
    console.warn("⚠️ Data grafik kosong");
    Swal.fire("Info!", "Data grafik kosong.", "info");
    return;
  }

  const canvas = document.getElementById("dashboardChartCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  if (window.chartInstance) window.chartInstance.destroy();

  const total = graph.data.reduce((sum, item) => sum + item.visitor_count, 0);
  const avg = Math.round(total / graph.data.length);

  document.getElementById("totalVisitors").textContent = total.toLocaleString();
  document.getElementById("avgVisitors").textContent = avg.toLocaleString();

  let periodLabel = "-";
  if (period === "weekly") {
    periodLabel =
      window.currentOffset === 0
        ? "Minggu Ini"
        : `${window.currentOffset} Minggu Yang Lalu`;
  } else if (period === "monthly") {
    periodLabel =
      window.currentOffset === 0
        ? "Bulan Ini"
        : `${window.currentOffset} Bulan Yang Lalu`;
  } else {
    periodLabel =
      window.currentOffset === 0
        ? "Tahun Ini"
        : `${window.currentOffset} Tahun Yang Lalu`;
  }

  document.getElementById("periodLabel").textContent = periodLabel;
  document.getElementById("chartSubtitle").textContent =
    period === "weekly"
      ? "7 hari terakhir"
      : period === "monthly"
      ? "4 minggu terakhir"
      : "12 bulan terakhir";

  const labels = graph.data.map((item) =>
    period === "weekly"
      ? `${graph.month_label} ${item.date}`
      : period === "monthly"
      ? item.week
      : item.month
  );
  const values = graph.data.map((item) => item.visitor_count);

  window.chartInstance = new Chart(ctx, {
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
            label: (context) => `Kunjungan: ${context.raw.toLocaleString()}`,
          },
        },
        legend: { display: false },
      },
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: "Jumlah Kunjungan" },
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

// Setelah handleCreate
quickLinkCounter++;
localStorage.setItem("quickLinkCounter", quickLinkCounter);

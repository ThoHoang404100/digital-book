/*
 * Admin portal (ẩn, không public) — mockup thao tác:
 * đăng nhập demo, dashboard thống kê, CMS, công cụ convert PDF -> Audio.
 * Toàn bộ dữ liệu và tiến trình đều là mô phỏng phía client, không gọi API thật.
 */

function setupLogin() {
  const loginView = document.getElementById("admin-login");
  const shell = document.getElementById("admin-shell");
  const form = document.getElementById("login-form");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    loginView.style.display = "none";
    shell.classList.add("is-active");
  });
}

function setupSidebarNav() {
  const buttons = document.querySelectorAll(".admin-nav button");
  const views = document.querySelectorAll(".admin-view");

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("is-active"));
      views.forEach((v) => v.classList.remove("is-active"));

      btn.classList.add("is-active");
      document.getElementById(btn.dataset.view).classList.add("is-active");
    });
  });
}

function renderDashboard() {
  const kpiRow = document.getElementById("kpi-row");
  const chart = document.getElementById("bar-chart");
  const topTable = document.getElementById("top-table-body");
  if (!kpiRow) return;

  const kpis = [
    { label: "Tổng tài liệu", value: "500", delta: "Mục tiêu dự án" },
    { label: "Đã chuyển đổi", value: "4", delta: "Dữ liệu demo" },
    { label: "Giờ audio", value: "1,5 giờ", delta: "Trong bản demo" },
    { label: "Lượt nghe (demo)", value: "128", delta: "+12% tuần này" },
  ];

  kpiRow.innerHTML = kpis
    .map(
      (k) => `
      <div class="kpi-card">
        <div class="kpi-label">${k.label}</div>
        <div class="kpi-value">${k.value}</div>
        <div class="kpi-delta">${k.delta}</div>
      </div>
    `,
    )
    .join("");

  const weekly = [
    { label: "T2", value: 40 },
    { label: "T3", value: 65 },
    { label: "T4", value: 50 },
    { label: "T5", value: 80 },
    { label: "T6", value: 95 },
    { label: "T7", value: 60 },
    { label: "CN", value: 35 },
  ];

  chart.innerHTML = weekly
    .map(
      (d) => `<div class="bar" style="height:${d.value}%"><span>${d.label}</span></div>`,
    )
    .join("");

  const topDocs = CMS_DOCUMENTS.filter((d) => d.status === "Đã xuất bản");

  topTable.innerHTML = topDocs
    .map(
      (d) => `
      <tr>
        <td>${d.title}</td>
        <td>${d.category}</td>
        <td>${d.duration}</td>
      </tr>
    `,
    )
    .join("");
}

function renderCMS() {
  const body = document.getElementById("cms-table-body");
  if (!body) return;

  const statusBadge = (status) => {
    const map = {
      "Đã xuất bản": "badge",
      "Chờ xử lý": "badge-accent",
      Nháp: "badge-muted",
    };
    return `<span class="badge ${map[status] || ""}">${status}</span>`;
  };

  body.innerHTML = CMS_DOCUMENTS.map(
    (d) => `
      <tr>
        <td>${d.title}</td>
        <td>${d.category}</td>
        <td>${d.type}</td>
        <td>${d.duration}</td>
        <td>${statusBadge(d.status)}</td>
        <td>
          <div class="row-actions">
            <button class="btn btn-ghost btn-sm" type="button">Sửa</button>
            <button class="btn btn-ghost btn-sm" type="button">Xoá</button>
          </div>
        </td>
      </tr>
    `,
  ).join("");
}

function renderPipelineSteps() {
  const container = document.getElementById("pipeline-steps");
  if (!container) return;

  container.innerHTML = PIPELINE_STEPS.map(
    (step, i) => `
      <div class="pipeline-step" data-step="${i}">
        <div class="step-index">${i + 1}</div>
        <div class="step-body">
          <strong>${step.title}</strong>
          <small>${step.detail}</small>
        </div>
        <div class="step-status">Chờ xử lý</div>
      </div>
    `,
  ).join("");
}

function runConvertSimulation() {
  const steps = document.querySelectorAll("#pipeline-steps .pipeline-step");
  const outputBox = document.getElementById("convert-output");
  const startBtn = document.getElementById("convert-start");

  if (!steps.length) return;

  steps.forEach((step) => {
    step.classList.remove("is-active", "is-done");
    step.querySelector(".step-status").textContent = "Chờ xử lý";
  });
  outputBox.innerHTML = "";
  startBtn.disabled = true;
  startBtn.textContent = "Đang xử lý...";

  let index = 0;

  function runNext() {
    if (index > 0) {
      const prev = steps[index - 1];
      prev.classList.remove("is-active");
      prev.classList.add("is-done");
      prev.querySelector(".step-status").textContent = "Hoàn tất";
    }

    if (index >= steps.length) {
      startBtn.disabled = false;
      startBtn.textContent = "Bắt đầu chuyển đổi";
      outputBox.innerHTML = `
        <div class="empty-note" style="border-style:solid;">
          Hoàn tất mô phỏng. File audio đầu ra sẽ xuất hiện trong Quản lý nội dung (CMS).
        </div>
      `;
      return;
    }

    const current = steps[index];
    current.classList.add("is-active");
    current.querySelector(".step-status").textContent = "Đang xử lý...";

    index += 1;
    setTimeout(runNext, 900);
  }

  runNext();
}

function setupConvertForm() {
  const form = document.getElementById("convert-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    runConvertSimulation();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setupLogin();
  setupSidebarNav();
  renderDashboard();
  renderCMS();
  renderPipelineSteps();
  setupConvertForm();
});

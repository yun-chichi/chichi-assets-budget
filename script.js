function formatWon(value) {
  const num = Number(value || 0);
  return num.toLocaleString("ko-KR") + "원";
}

function formatMonthLabel(date) {
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 급여월`;
}

function formatDateShort(date) {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const week = ["일", "월", "화", "수", "목", "금", "토"][date.getDay()];
  return `${month}.${day}(${week})`;
}

function getSalaryBudgetPeriod(today = new Date()) {
  const year = today.getFullYear();
  const month = today.getMonth();

  let startDate;
  let endDate;

  if (today.getDate() >= 25) {
    startDate = new Date(year, month, 25);
    endDate = new Date(year, month + 1, 24);
  } else {
    startDate = new Date(year, month - 1, 25);
    endDate = new Date(year, month, 24);
  }

  return { startDate, endDate };
}

function getDaysLeftInclusive(endDate, today = new Date()) {
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const end = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
  const diff = end - start;
  return Math.max(Math.floor(diff / (1000 * 60 * 60 * 24)) + 1, 1);
}

function loadData() {
  return {
    salary: Number(localStorage.getItem("salary") || 0),
    saving: Number(localStorage.getItem("saving") || 0),
    fixed: Number(localStorage.getItem("fixed") || 0),
    spent: Number(localStorage.getItem("spent") || 0),
  };
}

function saveData() {
  localStorage.setItem("salary", document.getElementById("salary").value || 0);
  localStorage.setItem("saving", document.getElementById("saving").value || 0);
  localStorage.setItem("fixed", document.getElementById("fixed").value || 0);
  localStorage.setItem("spent", document.getElementById("spent").value || 0);
}

function fillInputs(data) {
  document.getElementById("salary").value = data.salary || "";
  document.getElementById("saving").value = data.saving || "";
  document.getElementById("fixed").value = data.fixed || "";
  document.getElementById("spent").value = data.spent || "";
}

function render() {
  const data = loadData();
  const { startDate, endDate } = getSalaryBudgetPeriod(new Date());

  const available = data.salary - data.saving - data.fixed;
  const remaining = available - data.spent;
  const daysLeft = getDaysLeftInclusive(endDate, new Date());
  const daily = Math.floor(remaining / daysLeft);

  document.getElementById("budgetPeriod").textContent =
    `${formatDateShort(startDate)} ~ ${formatDateShort(endDate)}`;

  document.getElementById("budgetTitle").textContent = formatMonthLabel(startDate);
  document.getElementById("remainingAmount").textContent = formatWon(remaining);
  document.getElementById("remainingDetail").textContent =
    `사용 가능 예산 ${formatWon(available)}`;

  document.getElementById("availableBudget").textContent = formatWon(available);
  document.getElementById("currentSpent").textContent = formatWon(data.spent);
  document.getElementById("remainingBudget").textContent = formatWon(remaining);
  document.getElementById("dailyBudget").textContent = formatWon(daily);

  fillInputs(data);
}

document.getElementById("saveBtn").addEventListener("click", () => {
  saveData();
  render();
  alert("저장되었습니다.");
});

render();

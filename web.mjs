// web.mjs
import daysData from "./days.json" with { type: "json" };

// --- Constants ---
const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const months = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];
const occurences = ["first","second","third","forth","fifth"];

let month, year;
let firstDateDay, lastDateDay;
let weekCount = 0;

// --- Inline CSS for calendar UI ---
const style = document.createElement('style');
style.textContent = `
body {
  font-family: Arial, sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px;
}
table {
  border-collapse: collapse;
  margin-top: 10px;
  width: 90%;
  max-width: 600px;
}
th, td {
  border: 1px solid #999;
  padding: 8px;
  text-align: center;
  vertical-align: top;
}
th {
  background-color: #eee;
}
td:focus {
  outline: 2px solid #0078D4;
  background-color: #e0f0ff;
}
button {
  padding: 5px 10px;
  cursor: pointer;
}
button:hover {
  background-color: #0078D4;
  color: white;
}
.month-year-selector {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin: 10px 0;
}
.month-year-selector label {
  font-weight: bold;
}
.month-year-selector select {
  padding: 3px 6px;
}
.header-div {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 5px;
}
`;
document.head.appendChild(style);

// --- Utility functions ---
function getTodayDate() {
  const today = new Date();
  month = today.getMonth();
  year = today.getFullYear();
}

function findFirstDateDay(month, year) {
  const date = new Date(year, month, 1);
  firstDateDay = (date.getDay() + 6) % 7; // Monday=0, Sunday=6
}

function findLastDateDay(month, year) {
  const date = new Date(year, month + 1, 0);
  lastDateDay = date.getDate();
}

function getMatchingDays(monthName, dayName, occ) {
  let param = occ;
  if (weekCount === 5 && occ === "fifth") param = "last";
  else if (weekCount === 4 && occ === "forth") param = "last";

  return daysData.filter(day =>
    (!monthName || day.monthName === monthName) &&
    (!dayName || day.dayName === dayName) &&
    (!param || day.occurence === param)
  );
}

// --- Calendar generation ---
function createCalendar() {
  const tbody = document.querySelector("#calendarBody");
  tbody.innerHTML = "";

  findFirstDateDay(month, year);
  findLastDateDay(month, year);

  let dayCounter = 1;
  weekCount = Math.ceil((firstDateDay + lastDateDay) / 7);

  for (let w = 0; w < weekCount; w++) {
    const tr = document.createElement("tr");
    for (let d = 0; d < 7; d++) {
      const td = document.createElement("td");
      td.setAttribute("role", "gridcell");

      if ((w === 0 && d < firstDateDay) || dayCounter > lastDateDay) {
        td.textContent = "";
      } else {
        const monthName = months[month];
        const dayName = days[d];
        const occ = occurences[w];
        const matches = getMatchingDays(monthName, dayName, occ);
        td.innerHTML = `${dayCounter}${matches.length ? "<br>" + matches[0].name : ""}`;
        td.tabIndex = 0; // keyboard focusable
        dayCounter++;
      }

      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  }

  document.querySelector("#calendarHeader").textContent = 'Calendar';
}

// --- Navigation ---
function prevMonth() {
  month === 0 ? (month = 11, year--) : month--;
  createCalendar();
  document.querySelector("#monthSelect").value = month;
  document.querySelector("#yearSelect").value = year;
}

function nextMonth() {
  month === 11 ? (month = 0, year++) : month++;
  createCalendar();
  document.querySelector("#monthSelect").value = month;
  document.querySelector("#yearSelect").value = year;
}

// --- Month/Year selectors ---
function createMonthYearSelectors() {
  const container = document.createElement("div");
  container.className = "month-year-selector";

  const monthLabel = document.createElement("label");
  monthLabel.textContent = "Month:";
  monthLabel.setAttribute("for", "monthSelect");
  const monthSelect = document.createElement("select");
  monthSelect.id = "monthSelect";
  months.forEach((m,i)=>{
    const opt = document.createElement("option");
    opt.value = i;
    opt.textContent = m;
    monthSelect.appendChild(opt);
  });
  monthSelect.value = month;
  monthSelect.addEventListener("change", ()=>{
    month = parseInt(monthSelect.value);
    createCalendar();
  });

  const yearLabel = document.createElement("label");
  yearLabel.textContent = "Year:";
  yearLabel.setAttribute("for","yearSelect");
  const yearSelect = document.createElement("select");
  yearSelect.id = "yearSelect";
  for(let y=1900; y<=2100; y++){
    const opt = document.createElement("option");
    opt.value = y;
    opt.textContent = y;
    yearSelect.appendChild(opt);
  }
  yearSelect.value = year;
  yearSelect.addEventListener("change", ()=>{
    year = parseInt(yearSelect.value);
    createCalendar();
  });

  container.appendChild(monthLabel);
  container.appendChild(monthSelect);
  container.appendChild(yearLabel);
  container.appendChild(yearSelect);

  document.body.insertBefore(container, document.querySelector("table"));
}

// --- Build static DOM ---
function buildCalendarDOM() {
  const headerDiv = document.createElement("div");
  headerDiv.className = "header-div";

  const btnPrev = document.createElement("button");
  btnPrev.id = "btnPrevious";
  btnPrev.textContent = "Previous Month";
  btnPrev.addEventListener("click", prevMonth);

  const header = document.createElement("h2");
  header.id = "calendarHeader";

  const btnNext = document.createElement("button");
  btnNext.id = "btnNext";
  btnNext.textContent = "Next Month";
  btnNext.addEventListener("click", nextMonth);

  headerDiv.appendChild(btnPrev);
  headerDiv.appendChild(header);
  headerDiv.appendChild(btnNext);
  document.body.appendChild(headerDiv);

  const table = document.createElement("table");
  table.id = "calendarTable";
  table.setAttribute("role", "grid");

  const thead = document.createElement("thead");
  const trHead = document.createElement("tr");
  days.forEach(day => {
    const th = document.createElement("th");
    th.scope = "col";
    th.textContent = day;
    trHead.appendChild(th);
  });
  thead.appendChild(trHead);

  const tbody = document.createElement("tbody");
  tbody.id = "calendarBody";

  table.appendChild(thead);
  table.appendChild(tbody);
  document.body.appendChild(table);
}

// --- Initialize ---
window.onload = function(){
  getTodayDate();
  buildCalendarDOM();
  createMonthYearSelectors();
  createCalendar();
};

// web.mjs
import { getGreeting } from "./common.mjs";
import daysData from "./days.json" with { type: "json" };

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const months = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"];
const occurences = ["first", "second", "third", "forth", "fifth"];

let month, year;
let firstDateDay, lastDateDay;
let weekCount = 0;

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
    const tbody = document.querySelector("tbody");
    tbody.innerHTML = "";
    findFirstDateDay(month, year);
    findLastDateDay(month, year);

    let dayCounter = 1;
    weekCount = Math.ceil((firstDateDay + lastDateDay) / 7);

    for (let w = 0; w < weekCount; w++) {
        const tr = document.createElement("tr");
        for (let d = 0; d < 7; d++) {
            const th = document.createElement("th");

            if ((w === 0 && d < firstDateDay) || dayCounter > lastDateDay) {
                th.textContent = "";
            } else {
                const monthName = months[month];
                const dayName = days[d];
                const occ = occurences[w];
                const matches = getMatchingDays(monthName, dayName, occ);
                th.innerHTML = `${dayCounter}${matches.length ? "<br>" + matches[0].name : ""}`;
                dayCounter++;
            }

            tr.appendChild(th);
        }
        tbody.appendChild(tr);
    }

    document.querySelector("#header").textContent = `${months[month]} ${year}`;
}

// --- Navigation ---
function prevMonth() {
    month === 0 ? (month = 11, year--) : month--;
    createCalendar();
}

function nextMonth() {
    month === 11 ? (month = 0, year++) : month++;
    createCalendar();
}

// --- Month/Year jump ---
function createMonthYearSelectors() {
    const container = document.createElement("div");
    container.style.margin = "10px 0";

    const monthSelect = document.createElement("select");
    months.forEach((m, i) => {
        const opt = document.createElement("option");
        opt.value = i;
        opt.textContent = m;
        monthSelect.appendChild(opt);
    });
    monthSelect.value = month;

    const yearSelect = document.createElement("select");
    for (let y = 1900; y <= 2100; y++) {
        const opt = document.createElement("option");
        opt.value = y;
        opt.textContent = y;
        yearSelect.appendChild(opt);
    }
    yearSelect.value = year;

    monthSelect.addEventListener("change", () => {
        month = parseInt(monthSelect.value);
        createCalendar();
    });

    yearSelect.addEventListener("change", () => {
        year = parseInt(yearSelect.value);
        createCalendar();
    });

    container.appendChild(monthSelect);
    container.appendChild(yearSelect);
    document.body.insertBefore(container, document.querySelector("table"));
}

// --- Event listeners ---
window.onload = function() {
    document.querySelector("body").insertAdjacentText("afterbegin", `${getGreeting()} - there are ${daysData.length} known days\n`);

    getTodayDate();
    createMonthYearSelectors();

    document.querySelector("#btnPrevious").addEventListener("click", prevMonth);
    document.querySelector("#btnNext").addEventListener("click", nextMonth);

    createCalendar();
};

// This is a placeholder file which shows how you can access functions and data defined in other files.
// It can be loaded into index.html.
// Note that when running locally, in order to open a web page which uses modules, you must serve the directory over HTTP e.g. with https://www.npmjs.com/package/http-server
// You can't open the index.html file using a file:// URL.

import { getGreeting } from "./common.mjs";
import daysData from "./days.json" with { type: "json" };

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday","Sunday"];
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const occurences = ["first", "second", "third", "forth", "fifth"];
const dayObjectList = [];
const exportList = [];

let todayDate;
let firstDateDay;
let lastDateDay;
let weekRow=0;
let month;
let year;
let montCount = 1;
let lastWeek=0;


function getTodayDate() {
    const today = new Date();
    month = today.getMonth();
    year = today.getFullYear(); 
}

function setCalendar(){
    getTodayDate();
    createCalendarHeader();
    populateCalendar();
}
function populateCalendar(){
    montCount = 0;
    weekRow=0;
    findFirstDateDay(month,year);
    findLastDateDay(month,year);
    createFirstWeek();
    createWeek();
    createHeader();
}


function findFirstDateDay(month, year) {
  const date = new Date(year, month, 1);
  const day = date.getDay(); // 0 (Sunday) → 6 (Saturday)
  // convert so Monday = 0, Sunday = 6
  firstDateDay = (day + 6) % 7;
}
function findLastDateDay(month, year) {
  // month is 1-based (January = 1)
  const date = new Date(year, month+1, 0);
  lastDateDay = date.getDate(); // returns the day of the month (e.g., 28, 30, 31)
}
function createCalendarHeader(){

const thead = document.querySelector("thead"); // or create one dynamically if needed
const tr = document.createElement("tr");
days.forEach(day => {
  const th = document.createElement("th");
  th.textContent = day; // set text inside <th>
  tr.appendChild(th);
});
thead.appendChild(tr);
}

function createFirstWeek(){
    const thead = document.querySelector("tbody"); 
    const tr = document.createElement("tr");
    for (let i=0; i<=6; i++) {
            const th = document.createElement("th");
            if (i>=firstDateDay) {montCount++;th.innerHTML = `${montCount}<br>${createCalendarDay(i, weekRow)}`;} 
            tr.appendChild(th);
    }
    thead.appendChild(tr);
    weekRow++;
    
}
function countWeek(){
    let counter=montCount;
    let result=weekRow;
        while (counter<=lastDateDay){
        for (let i=0; i<=6; i++) {
            if (i<=lastDateDay) {counter++;} 
            if (counter>lastDateDay) break;
        }
        result++;
    }
    return result;
}
function createWeek(){
        lastWeek=countWeek();
        while (montCount<=lastDateDay){
            const thead = document.querySelector("tbody"); 
            const tr = document.createElement("tr");    
        for (let i=0; i<=6; i++) {
            console.log(montCount);
            console.log(lastDateDay);
            if (montCount>lastDateDay) break;
            const th = document.createElement("th");
            if (montCount<=lastDateDay) {th.innerHTML = `${montCount}<br>${createCalendarDay(i, weekRow)}`;montCount++;} 
            tr.appendChild(th);
        }
        thead.appendChild(tr);
        weekRow++;
    }
}

function createCalendarDay(i,weekRow){
    let monthName = months[month];
    let dayName=days[i];
    let occ=occurences[weekRow];
    const matches=filterDays(monthName, dayName, occ);
    return matches
}
   

function filterDays(monthName, dayName, occ) {
 let param;
 if (lastWeek==5 && occ=="fifth")  {param="last";}
 else if (lastWeek==4 && occ=="forth")  {param="last";}
 else {param=occ;}
 const result = daysData.filter(day =>
    (!monthName || day.monthName === monthName) &&
    (!dayName || day.dayName === dayName) &&
    (!param || day.occurence === param)
  );
   return result.length > 0 ? result[0].name : "";
}


function clickPreviousButton() {
  month === 0 ? (month = 11, year--) : month--;
  const tbody = document.querySelector("tbody");
  tbody.innerHTML = "";
  findLastDateDay(month,year);
  populateCalendar();
}

function clickNextButton() {
  month === 11 ? (month = 0, year++) : month++; 
  const tbody = document.querySelector("tbody");
  tbody.innerHTML = "";
  findLastDateDay(month,year);
  populateCalendar(); 
}

function createHeader() {
  document.querySelector("#header").textContent = `${months[month]} ${year}`;

  const prvBtn = document.querySelector("#btnPrevious");
  prvBtn.addEventListener("click", clickPreviousButton);

  const nxtBtn = document.querySelector("#btnNext");
  nxtBtn.addEventListener("click", clickNextButton); // ✅ fixed
}

window.onload = function() {
    
    document.querySelector("body").insertAdjacentText("afterbegin", `${getGreeting()} - there are ${daysData.length} known days\n`);
    setCalendar();
}

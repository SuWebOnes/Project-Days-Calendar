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
let montCount = 0;
let lastWeek=0;


function getTodayDate() {
    const today = new Date();
    month = today.getMonth();
    year = today.getFullYear(); 
}

function setCalendar(){
    getTodayDate()
    //clickNextButton();
    createCalendarHeader();
    findFirstDateDay(month,year);
    findLastDateDay(month,year);
    createFirstWeek();
    createWeek();
    console.log(daysData);
    console.log(month)
}
function findFirstDateDay(month, year) {
    console.log(month); //9
    console.log(year); //2025
  const date = new Date(year, month, 1);
  const day = date.getDay(); // 0 (Sunday) → 6 (Saturday)
  // convert so Monday = 0, Sunday = 6
  firstDateDay = (day + 6) % 7;
  console.log(firstDateDay);
}
function findLastDateDay(month, year) {
  // month is 1-based (January = 1)
  const date = new Date(year, month, 0);
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
    console.log(firstDateDay);
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
            console.log(result);
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
            const th = document.createElement("th");
            if (i<=lastDateDay) {montCount++;th.innerHTML = `${montCount}<br>${createCalendarDay(i, weekRow)}`;} 
            tr.appendChild(th);
            if (montCount>lastDateDay) break;
        }
        thead.appendChild(tr);
        weekRow++;
    }
}

function createCalendarDay(i,weekRow){
    console.log("Day : " + i, "Week:"+ weekRow,"No:"+montCount);
    let monthName = months[month];
    let dayName=days[i];
    let occ=occurences[weekRow];
    console.log(monthName,dayName,occ);
    const matches=filterDays(monthName, dayName, occ);
    console.log(matches);
    return matches
}
   

function filterDays(monthName, dayName, occ) {

 if (lastWeek==5 && occ=="fifth")  occ="last";
 if (lastWeek==4 && occ=="forth")  occ="last";
 console.log(lastWeek + occ);
  const result = daysData.filter(day =>
    (!monthName || day.monthName === monthName) &&
    (!dayName || day.dayName === dayName) &&
    (!occ || day.occurence === occ)
  );
  return result.length > 0 ? result[0].name : "";
}


function clickPreviousButton() {
  month === 0 ? (month = 11, year--) : month--;
}

function clickNextButton() {
  month === 11 ? (month = 0, year++) : month++;
}


window.onload = function() {
    
    document.querySelector("body").insertAdjacentText("afterbegin", `${getGreeting()} - there are ${daysData.length} known days\n`);
    setCalendar();
}

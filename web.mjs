// This is a placeholder file which shows how you can access functions and data defined in other files.
// It can be loaded into index.html.
// Note that when running locally, in order to open a web page which uses modules, you must serve the directory over HTTP e.g. with https://www.npmjs.com/package/http-server
// You can't open the index.html file using a file:// URL.

import { getGreeting } from "./common.mjs";
import daysData from "./days.json" with { type: "json" };

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

let todayDate;
let firstDateDay;
let lastDateDay;
let weekRow=1;
let month;
let year;
let montCount = 0;


function getTodayDate() {
    const today = new Date();
    month = today.getMonth();
    year = today.getFullYear(); 
}

function setCalendar(){
    getTodayDate()
    findFirstDateDay(month,year);
    findLastDateDay(month,year);
    createFirstWeek();
    createWeek();
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

function createFirstWeek(){
    console.log(firstDateDay);
    for (let i=firstDateDay; i<=6; i++) {
        createCalendarDay(i,weekRow);
        montCount++;
    }
    weekRow++;
    
}
function createWeek(){
        while (montCount<=lastDateDay){
        for (let i=0; i<=6; i++) {
            createCalendarDay(i,weekRow);
            montCount++;
            if (montCount>lastDateDay) return;
        }
        weekRow++;
    }
}

function createCalendarDay(i,weekRow){
    console.log("Day : " + i, "Week:"+ weekRow,"No:"+montCount);
    }

window.onload = function() {
    document.querySelector("body").innerText = `${getGreeting()} - there are ${daysData.length} known days`;
    setCalendar();
}

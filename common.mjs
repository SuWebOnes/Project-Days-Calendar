
// Load commemorative days JSON
let daysData = [];
fetch("days.json")
  .then(res => res.json())
  .then(data => { daysData = data; initCalendar(); });

// --- Constants ---
const DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const OCCS = ["first","second","third","fourth","fifth"];

// --- Global state ---
let state = { month: new Date().getMonth(), year: new Date().getFullYear() };

// --- Initialize DOM ---
function initCalendar() {  
  

 // Attach to global for render access
  window._calendar = { tbody, eventsDiv, headerH2, monthSelect, yearSelect };

  renderCalendar();
}

// --- Render calendar ---
function renderCalendar() {
  const {month, year} = state;
  const tbody = document.querySelector("tbody");
  const eventsDiv = document.querySelector("#events");
  tbody.innerHTML = ""; eventsDiv.innerHTML = "";

  const firstDay = (new Date(year, month, 1).getDay()+6)%7; // Monday=0
  const lastDate = new Date(year, month+1, 0).getDate();
  const totalWeeks = Math.ceil((firstDay+lastDate)/7);

  let day = 1;
  const currentMonthEvents = [];

  for(let w=0; w<totalWeeks; w++){
    const row = document.createElement("tr");
    for(let d=0; d<7; d++){
      const cell = document.createElement("td");
      cell.style.padding="8px"; cell.style.height="60px"; cell.style.verticalAlign="top"; cell.style.border="1px solid #ddd";

      if(w===0 && d<firstDay || day>lastDate){
        cell.textContent="";
      } else {
        const occ = getOccurrenceOfDay(year, month, day);
        const matches = findCommemoratives(MONTHS[month], DAYS[d], occ);

        if(matches.length>0){
          // Green before number and star
          cell.innerHTML = `<span style="background-color:lightgreen; border-radius:50%; padding:2px 6px; margin-right:3px;">⭐</span>${day}`;
          cell.style.background="#ccffcc"; // light green background
          cell.style.fontWeight="bold";
          cell.title = matches.map(m=>m.name).join(", ");
          matches.forEach(m=> currentMonthEvents.push(`${MONTHS[month]} ${day}: ${m.name}`));
        } else {
          cell.textContent = day;
        }
        day++;
      }
      row.appendChild(cell);
    }
    tbody.appendChild(row);
  }

  document.querySelector("#header").textContent = `${MONTHS[month]} ${year}`;

  // --- Event list below ---
  if(currentMonthEvents.length>0){
    const list = document.createElement("ul");
    currentMonthEvents.forEach(e=>{
      const li = document.createElement("li"); li.textContent=e; list.appendChild(li);
    });
    eventsDiv.appendChild(list);
  } else {
    eventsDiv.innerHTML="<p>No commemorative days this month.</p>";
  }
}

// --- Helper: Calculate occurrence (nth weekday) ---
function getOccurrenceOfDay(year, month, day){
  const date = new Date(year, month, day);
  const weekday = (date.getDay()+6)%7;
  const firstDay = (new Date(year, month, 1).getDay()+6)%7;
  const weekNum = Math.floor((day+firstDay-weekday-1)/7)+1;
  const lastDate = new Date(year, month+1, 0).getDate();
  const nextWeekSameDay = day+7>lastDate;
  return nextWeekSameDay?"last":OCCS[weekNum-1];
}

// --- Helper: Filter matching events ---
function findCommemoratives(monthName, dayName, occ){
  return daysData.filter(d=> d.monthName===monthName && d.dayName===dayName && d.occurence===occ);
}

// --- Navigation ---
function prevMonth(){ state.month===0?(state.month=11,state.year--):state.month--; renderCalendar(); }
function nextMonth(){ state.month===11?(state.month=0,state.year++):state.month++; renderCalendar(); }

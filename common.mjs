
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
  document.body.innerHTML = "";
  const container = document.createElement("div");
  container.style.fontFamily = "sans-serif";
  container.style.display = "flex";
  container.style.flexDirection = "column";
  container.style.alignItems = "center";
  container.style.marginTop = "20px";
  document.body.appendChild(container);

  // Controls container
  const controlsDiv = document.createElement("div");
  controlsDiv.style.display = "flex";
  controlsDiv.style.justifyContent = "space-between";
  controlsDiv.style.width = "800px";
  controlsDiv.style.alignItems = "center";
  controlsDiv.style.marginBottom = "10px";
  container.appendChild(controlsDiv);

  // Previous button
  const prevBtn = document.createElement("button");
  prevBtn.textContent = "⬅️ Previous";
  prevBtn.onclick = prevMonth;
  controlsDiv.appendChild(prevBtn);

  // Month/year selector container
  const selectorDiv = document.createElement("div");
  selectorDiv.style.display = "flex";
  selectorDiv.style.gap = "10px";
  controlsDiv.appendChild(selectorDiv);

  // Month selector
  const monthSelect = document.createElement("select");
  MONTHS.forEach((m,i)=>{
    const option = document.createElement("option");
    option.value = i;
    option.textContent = m;
    if(i===state.month) option.selected=true;
    monthSelect.appendChild(option);
  });
  monthSelect.onchange = () => { state.month = parseInt(monthSelect.value); renderCalendar(); };
  selectorDiv.appendChild(monthSelect);

  // Year selector
  const yearSelect = document.createElement("select");
  for(let y=state.year-10; y<=state.year+10; y++){
    const option = document.createElement("option");
    option.value=y;
    option.textContent=y;
    if(y===state.year) option.selected=true;
    yearSelect.appendChild(option);
  }
  yearSelect.onchange = () => { state.year = parseInt(yearSelect.value); renderCalendar(); };
  selectorDiv.appendChild(yearSelect);

  // Next button
  const nextBtn = document.createElement("button");
  nextBtn.textContent = "Next ➡️";
  nextBtn.onclick = nextMonth;
  controlsDiv.appendChild(nextBtn);

  // Header
  const headerH2 = document.createElement("h2");
  headerH2.style.margin="10px 0";
  container.appendChild(headerH2);

  // Table
  const table = document.createElement("table");
  table.style.borderCollapse = "collapse";
  table.style.width = "800px";
  table.style.textAlign = "center";
  table.style.boxShadow = "0 0 10px rgba(0,0,0,0.1)";
  container.appendChild(table);

  // Table head
  const thead = document.createElement("thead");
  thead.style.background="#f0f0f0";
  const trHead = document.createElement("tr");
  DAYS.forEach(d=>{
    const th=document.createElement("th");
    th.textContent=d;
    th.style.padding="6px";
    trHead.appendChild(th);
  });
  thead.appendChild(trHead);
  table.appendChild(thead);

  // Table body
  const tbody = document.createElement("tbody");
  table.appendChild(tbody);

  // Events list
  const eventsDiv = document.createElement("div");
  eventsDiv.style.marginTop="20px";
  eventsDiv.style.width="800px";
  eventsDiv.style.textAlign="left";
  eventsDiv.style.fontSize="15px";
  eventsDiv.style.lineHeight="1.5";
  container.appendChild(eventsDiv);

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

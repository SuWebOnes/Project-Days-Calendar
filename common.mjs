// Set page title for accessibility
document.title = "Commemorative Calendar";

// Load commemorative days JSON
let daysData = [];
fetch("days.json")
  .then(res => res.json())
  .then(data => { daysData = data; initCalendar(); })
  .catch(err => console.error("Failed to load days.json:", err));

// === Constants ===
const DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const OCCS = ["first","second","third","fourth","fifth"];

// === Global state ===
let state = { 
  month: new Date().getMonth(), 
  year: new Date().getFullYear() 
};

// === Initialize DOM ===
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
  controlsDiv.style.width = "100%";
  controlsDiv.style.maxWidth = "900px";
  controlsDiv.style.alignItems = "center";
  controlsDiv.style.marginBottom = "10px";
  container.appendChild(controlsDiv);

  // Previous button
  const prevBtn = document.createElement("button");
  prevBtn.textContent = "⬅️ Previous";
  prevBtn.onclick = prevMonth;
  prevBtn.style.padding = "6px 12px";
  controlsDiv.appendChild(prevBtn);

  // Month/Year selector container
  const selectorDiv = document.createElement("div");
  selectorDiv.style.display = "flex";
  selectorDiv.style.gap = "10px";
  controlsDiv.appendChild(selectorDiv);

  // Month selector label
  const monthLabel = document.createElement("label");
  monthLabel.textContent = "Month: ";
  monthLabel.setAttribute("for","monthSelect");
  selectorDiv.appendChild(monthLabel);

  // Month selector
  const monthSelect = document.createElement("select");
  monthSelect.id = "monthSelect";
  MONTHS.forEach((m,i)=>{
    const option = document.createElement("option");
    option.value = i;
    option.textContent = m;
    if(i===state.month) option.selected=true;
    monthSelect.appendChild(option);
  });
  monthSelect.onchange = () => { state.month = parseInt(monthSelect.value); renderCalendar(); };
  selectorDiv.appendChild(monthSelect);

  // Year input label
  const yearLabel = document.createElement("label");
  yearLabel.textContent = "Year: ";
  yearLabel.setAttribute("for","yearInput");
  selectorDiv.appendChild(yearLabel);

  // Year input (unlimited)
  const yearInput = document.createElement("input");
  yearInput.type = "number";
  yearInput.min = 1;
  yearInput.value = state.year;
  yearInput.id = "yearInput";
  yearInput.style.width = "80px";
  yearInput.onchange = () => {
    if(yearInput.value < 1) yearInput.value = 1;
    state.year = parseInt(yearInput.value);
    renderCalendar();
  };
  selectorDiv.appendChild(yearInput);

  // Next button
  const nextBtn = document.createElement("button");
  nextBtn.textContent = "Next ➡️";
  nextBtn.onclick = nextMonth;
  nextBtn.style.padding = "6px 12px";
  controlsDiv.appendChild(nextBtn);

  // Header
  const headerH2 = document.createElement("h2");
  headerH2.style.margin="10px 0";
  container.appendChild(headerH2);

  // Calendar table
  const table = document.createElement("table");
  table.style.borderCollapse = "collapse";
  table.style.width = "100%";
  table.style.maxWidth = "900px";
  table.style.textAlign = "center";
  table.style.boxShadow = "0 0 10px rgba(0,0,0,0.1)";
  table.setAttribute("role","grid");
  container.appendChild(table);

  // Table head
  const thead = document.createElement("thead");
  thead.style.background="#f0f0f0";
  const trHead = document.createElement("tr");
  DAYS.forEach(d=>{
    const th=document.createElement("th");
    th.textContent=d;
    th.style.padding="6px";
    th.setAttribute("role","columnheader");
    trHead.appendChild(th);
  });
  thead.appendChild(trHead);
  table.appendChild(thead);

  // Table body
  const tbody = document.createElement("tbody");
  table.appendChild(tbody);

  // Events container
  const eventsDiv = document.createElement("div");
  eventsDiv.style.marginTop="20px";
  eventsDiv.style.width = "100%";
  eventsDiv.style.maxWidth = "900px";
  eventsDiv.style.textAlign = "left";
  eventsDiv.style.fontSize = "15px";
  eventsDiv.style.lineHeight = "1.5";
  container.appendChild(eventsDiv);

  // Attach to global
  window._calendar = { tbody, eventsDiv, headerH2, monthSelect, yearInput };

  renderCalendar();
}

// === Render calendar ===
function renderCalendar() {
  const { month, year } = state;
  const { tbody, eventsDiv, headerH2, monthSelect, yearInput } = window._calendar;
  tbody.innerHTML = ""; 
  eventsDiv.innerHTML = "";

  const firstDay = (new Date(year, month, 1).getDay()+6)%7;
  const lastDate = new Date(year, month+1, 0).getDate();
  const totalWeeks = Math.ceil((firstDay+lastDate)/7);

  let day = 1;
  const currentMonthEvents = [];
  const today = new Date();

  for(let w=0; w<totalWeeks; w++){
    const tr = document.createElement("tr");
    for(let d=0; d<7; d++){
      const td = document.createElement("td");
      td.style.padding="8px"; 
      td.style.height="60px"; 
      td.style.verticalAlign="top"; 
      td.style.border="1px solid #ddd";
      td.setAttribute("role","gridcell");

      if(w===0 && d<firstDay || day>lastDate){ td.textContent=""; }
      else{
        const occ = getOccurrenceOfDay(year, month, day);
        const matches = findCommemoratives(MONTHS[month], DAYS[d], occ);

        if(matches.length>0){
          td.innerHTML=`<span style="background-color:lightgreen; border-radius:50%; padding:2px 6px; margin-right:3px;">⭐</span>${day}`;
          td.style.background="#ccffcc"; 
          td.style.fontWeight="bold";
          td.title = matches.map(m=>m.name).join(", ");
          matches.forEach(m=>currentMonthEvents.push(`${MONTHS[month]} ${day}: ${m.name}`));
        } else {
          td.textContent = day;
        }

        if(year===today.getFullYear() && month===today.getMonth() && day===today.getDate()){
          td.style.border="2px solid blue";
        }

        day++;
      }
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  }

  headerH2.textContent = `${MONTHS[month]} ${year}`;
  monthSelect.value = month;
  yearInput.value = year;

  if(currentMonthEvents.length>0){
    const ul = document.createElement("ul");
    currentMonthEvents.forEach(e=>{
      const li = document.createElement("li");
      li.textContent = e;
      ul.appendChild(li);
    });
    eventsDiv.appendChild(ul);
  } else {
    eventsDiv.textContent = "No commemorative days this month.";
  }
}

// === Helper: nth weekday occurrence ===
function getOccurrenceOfDay(year, month, day){
  const date = new Date(year, month, day);
  const weekday = (date.getDay()+6)%7;
  const firstDay = (new Date(year, month,1).getDay()+6)%7;
  const weekNum = Math.floor((day+firstDay-weekday-1)/7)+1;
  const lastDate = new Date(year, month+1,0).getDate();
  return (day+7>lastDate)?"last":OCCS[weekNum-1];
}

// === Filter commemorative days ===
function findCommemoratives(monthName, dayName, occ){
  return daysData.filter(d=> d.monthName===monthName && d.dayName===dayName && d.occurence===occ);
}

// === Navigation ===
function prevMonth(){ state.month===0?(state.month=11,state.year--):state.month--; renderCalendar(); }
function nextMonth(){ state.month===11?(state.month=0,state.year++):state.month++; renderCalendar(); }

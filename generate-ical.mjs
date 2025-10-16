
import fs from "fs";
import daysData from "./days.json" with { type: "json" };

// Weekday mapping
const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

// Month mapping
const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

// Get the date of the nth weekday of a month
function getDateFromOccurrence(year, month, weekdayName, occurrence) {
  const targetDay = weekdays.indexOf(weekdayName);
  if (targetDay === -1) return null;

  const firstOfMonth = new Date(year, month, 1);
  let firstWeekday = (targetDay + 7 - ((firstOfMonth.getDay() + 6) % 7)) % 7 + 1;

  let day;
  switch(occurrence) {
    case "first": day = firstWeekday; break;
    case "second": day = firstWeekday + 7; break;
    case "third": day = firstWeekday + 14; break;
    case "forth": day = firstWeekday + 21; break;
    case "fifth": day = firstWeekday + 28; break;
    case "last":
      const lastDate = new Date(year, month + 1, 0).getDate();
      let temp = firstWeekday;
      while (temp + 7 <= lastDate) temp += 7;
      day = temp;
      break;
    default: day = firstWeekday;
  }

  const lastDay = new Date(year, month + 1, 0).getDate();
  if (day > lastDay) return null;
  return day;
}

// Build ICS content
let ics = `BEGIN:VCALENDAR
VERSION:2.0
CALSCALE:GREGORIAN
`;

for (let year = 2020; year <= 2030; year++) {
  for (const day of daysData) {
    const monthIndex = months.indexOf(day.monthName);
    const dayNumber = getDateFromOccurrence(year, monthIndex, day.dayName, day.occurence);
    if (!dayNumber) continue;

    const dateStr = `${year}${String(monthIndex + 1).padStart(2, '0')}${String(dayNumber).padStart(2, '0')}`;

    ics += `BEGIN:VEVENT
SUMMARY:${day.name}
DTSTART;VALUE=DATE:${dateStr}
DTEND;VALUE=DATE:${dateStr}
DESCRIPTION:${day.descriptionURL}
END:VEVENT
`;
  }
}

ics += "END:VCALENDAR\n";

// Write to file
fs.writeFileSync("days.ics", ics, "utf8");
console.log("days.ics successfully generated!");

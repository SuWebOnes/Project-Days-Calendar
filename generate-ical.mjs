// This is a placeholder file which shows how you can access functions and data defined in other files. You can delete the contents of the file once you have understood how it works.
// It can be run with `node`.

// import { getGreeting } from "./common.mjs";
// import daysData from "./days.json" with { type: "json" };

// console.log(` - there are ${daysData.length} known days`);


import fs from "fs";
import { DAYS, MONTHS, getOccurrenceOfDay, findCommemoratives } from "./common.mjs";
import daysData from "./days.json" with { type: "json" };

// Make data globally available if needed by findCommemoratives
globalThis.daysData = daysData;

// Escape text safely for ICS
function escapeICS(text) {
  return text.replace(/([,;])/g, "\\$1").replace(/\n/g, "\\n");
}

function generateICal() {
  let ical = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Commemorative Days Calendar//EN\nCALSCALE:GREGORIAN\n";

  for (let year = 2020; year <= 2030; year++) {
    for (let month = 0; month < 12; month++) {
      const lastDate = new Date(year, month + 1, 0).getDate();

      for (let day = 1; day <= lastDate; day++) {
        const weekdayIndex = (new Date(year, month, day).getDay() + 6) % 7;
        const occurrence = getOccurrenceOfDay(year, month, day);
        const matches = findCommemoratives(MONTHS[month], DAYS[weekdayIndex], occurrence);

        for (const event of matches) {
          const dateStr = `${year}${String(month + 1).padStart(2, "0")}${String(day).padStart(2, "0")}`;
          const uid = `${event.name.replace(/\s+/g, "_")}-${dateStr}@calendar`;

          ical += [
            "BEGIN:VEVENT",
            `UID:${uid}`,
            `DTSTAMP:${dateStr}T000000Z`,
            `DTSTART;VALUE=DATE:${dateStr}`,
            `DTEND;VALUE=DATE:${dateStr}`,
            `SUMMARY:${escapeICS(event.name)}`,
            event.descriptionURL ? `DESCRIPTION:${escapeICS(event.descriptionURL)}` : "",
            "END:VEVENT"
          ].filter(Boolean).join("\n") + "\n";
        }
      }
    }
  }

  ical += "END:VCALENDAR\n";
  return ical;
}

// === Write to .ics file ===
const icalContent = generateICal();
fs.writeFileSync("days.ics", icalContent, "utf8");
console.log("✅ days.ics file created successfully!");

// Optional: Show quick stats
const eventCount = (icalContent.match(/BEGIN:VEVENT/g) || []).length;
console.log(`📅 Total events generated: ${eventCount}`);

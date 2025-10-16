// common.mjs
import daysData from "./days.json" with { type: "json" };

export const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
export const months = ["January", "February", "March", "April", "May", "June",
                       "July", "August", "September", "October", "November", "December"];

/**
 * Get all commemorative days for a given month/year.
 * Returns an array of objects: { dayNumber, name, dayName, monthName, occurence }
 */
export function getDaysForMonth(year, month) {
    const result = [];
    const lastDate = new Date(year, month + 1, 0).getDate();

    // Build weekday map: weekday index → array of dates in month
    const weekdayMap = [[], [], [], [], [], [], []]; // Monday=0..Sunday=6

    for (let d = 1; d <= lastDate; d++) {
        const weekday = (new Date(year, month, d).getDay() + 6) % 7; // Monday=0
        weekdayMap[weekday].push(d);
    }

    for (const day of daysData) {
        if (day.monthName !== months[month]) continue;
        const weekdayIdx = days.indexOf(day.dayName);
        const dates = weekdayMap[weekdayIdx];
        if (!dates || dates.length === 0) continue;

        let dayNumber;
        switch (day.occurence) {
            case "first":
                dayNumber = dates[0];
                break;
            case "second":
                dayNumber = dates[1];
                break;
            case "third":
                dayNumber = dates[2];
                break;
            case "forth":
                dayNumber = dates[3];
                break;
            case "fifth":
                dayNumber = dates[4];
                break;
            case "last":
                dayNumber = dates[dates.length - 1];
                break;
            default:
                dayNumber = dates[0];
        }

        if (dayNumber) {
            result.push({
                dayNumber,
                name: day.name,
                dayName: day.dayName,
                monthName: day.monthName,
                occurence: day.occurence,
                descriptionURL: day.descriptionURL
            });
        }
    }

    return result;
}

/**
 * Get all commemorative days for a specific year.
 * Returns an array of objects: { year, month, dayNumber, name, dayName, monthName, occurence, descriptionURL }
 */
export function getDaysForYear(year) {
    const result = [];
    for (let m = 0; m < 12; m++) {
        const monthDays = getDaysForMonth(year, m);
        monthDays.forEach(day => {
            result.push({ ...day, month: m + 1, year });
        });
    }
    return result;
}

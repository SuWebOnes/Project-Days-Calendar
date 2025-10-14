import assert from "node:assert";
import test from "node:test";
import { getOccurrenceOfDay, findCommemoratives, DAYS, MONTHS } from "./common.mjs";

// Provide mock data for Node environment
globalThis.daysData = [
  { name: "Ada Lovelace Day", monthName: "October", dayName: "Tuesday", occurence: "second" },
  { name: "World Lemur Day", monthName: "October", dayName: "Friday", occurence: "last" }
];

test("MONTHS contains 12 months", () => {
  assert.equal(MONTHS.length, 12);
});

test("DAYS starts with Monday", () => {
  assert.equal(DAYS[0], "Monday");
});

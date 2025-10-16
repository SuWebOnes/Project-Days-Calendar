import assert from "assert";
import { getDaysForMonth } from "./common.mjs";

const days = getDaysForMonth(2024, 9); // October 2024
const lemurDay = days.find(d=>d.name==="World Lemur Day");
assert.strictEqual(lemurDay.dayNumber, 25, "World Lemur Day 2024 should be on October 25");
console.log("Test passed");

// ============================================================
//  CINEMA SEAT MANAGER - Interactive Console App
//
//  Pick a starting scenario, then reserve seats from a menu.
// ============================================================

import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import {
  ROWS,
  COLS,
  createEmptySeating,
  displaySeating,
  reserveSeat,
  countSeats,
  findAdjacentAvailableSeats,
} from "./seatManager";

const terminal = readline.createInterface({ input, output });

// --- STARTING SCENARIOS ------------------------------------

// Some seats already sold across the room.
function createPartiallyFilledRoom(): number[][] {
  const seating = createEmptySeating();
  const soldSeats = [
    [0, 0], [0, 1], [1, 5], [3, 2], [3, 3], [4, 7], [6, 9],
  ];
  for (let i = 0; i < soldSeats.length; i++) {
    seating[soldSeats[i][0]][soldSeats[i][1]] = 1;
  }
  return seating;
}

// Every seat occupied except a few single seats with no free neighbor.
function createNearlyFullRoom(): number[][] {
  const seating = createFullRoom();
  seating[0][0] = 0;
  seating[0][2] = 0;
  seating[3][5] = 0;
  seating[7][7] = 0;
  return seating;
}

// Every seat occupied.
function createFullRoom(): number[][] {
  const seating = createEmptySeating();
  for (let row = 0; row < seating.length; row++) {
    for (let column = 0; column < seating[row].length; column++) {
      seating[row][column] = 1;
    }
  }
  return seating;
}

// Asks which scenario to start from and returns that room.
async function chooseScenario(): Promise<number[][]> {
  while (true) {
    console.log("\nChoose a starting scenario:");
    console.log("  1. Empty room");
    console.log("  2. Partially filled room");
    console.log("  3. Nearly full room (only scattered single seats)");
    console.log("  4. Full room");
    const choice = (await terminal.question("Scenario number: ")).trim();

    if (choice === "1") return createEmptySeating();
    if (choice === "2") return createPartiallyFilledRoom();
    if (choice === "3") return createNearlyFullRoom();
    if (choice === "4") return createFullRoom();
    console.log("Please type 1, 2, 3 or 4.");
  }
}

// --- INPUT HELPERS -----------------------------------------

// Returns the typed whole number, or null if the input is not one.
async function askNumber(question: string): Promise<number | null> {
  const answer = (await terminal.question(question)).trim();
  const value = Number(answer);
  if (answer === "" || !Number.isInteger(value)) {
    console.log("Please type a whole number.");
    return null;
  }
  return value;
}

function printMenu(): void {
  console.log("What do you want to do?");
  console.log("  1. Show seat map");
  console.log("  2. Reserve a seat");
  console.log("  3. Show seat counts");
  console.log("  4. Find two adjacent seats");
  console.log("  5. Load another scenario");
  console.log("  0. Exit");
}

// --- MAIN LOOP ---------------------------------------------

console.log("\n########## CINEMA SEAT MANAGER ##########");

let room = await chooseScenario();
displaySeating(room);

let running = true;
while (running) {
  printMenu();
  const choice = (await terminal.question("Option: ")).trim();

  if (choice === "1") {
    displaySeating(room);
  } else if (choice === "2") {
    const row = await askNumber(`Row (0-${ROWS - 1}): `);
    if (row === null) continue;
    const column = await askNumber(`Column (0-${COLS - 1}): `);
    if (column === null) continue;

    console.log("\n" + reserveSeat(room, row, column));
    displaySeating(room);
  } else if (choice === "3") {
    const counts = countSeats(room);
    console.log(
      `\nOccupied: ${counts.occupied} | Available: ${counts.available} | Total: ${counts.total}\n`
    );
  } else if (choice === "4") {
    const pair = findAdjacentAvailableSeats(room);
    if (pair === null) {
      console.log("\nNo adjacent available seats found.\n");
    } else {
      console.log(
        `\nAdjacent seats found: row ${pair.row}, columns ${pair.firstColumn} and ${pair.secondColumn}.`
      );
      displaySeating(room, pair);

      const answer = (await terminal.question("Reserve these two seats? (y/n): ")).trim().toLowerCase();
      if (answer === "y") {
        console.log(reserveSeat(room, pair.row, pair.firstColumn));
        console.log(reserveSeat(room, pair.row, pair.secondColumn));
        displaySeating(room);
      }
    }
  } else if (choice === "5") {
    room = await chooseScenario();
    displaySeating(room);
  } else if (choice === "0") {
    running = false;
  } else {
    console.log("\nPlease choose an option from the menu.\n");
  }
}

console.log("Goodbye!");
terminal.close();

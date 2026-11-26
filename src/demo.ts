// ============================================================
//  CINEMA SEAT MANAGER - Demo / Test Program
//
//  Runs the seat manager logic through several real-world
//  scenarios so we can verify every feature works correctly.
// ============================================================

import {
  createEmptySeating,
  displaySeating,
  reserveSeat,
  countSeats,
  findAdjacentAvailableSeats,
} from "./seatManager";

// Helper: fills a row with occupied seats (1) for testing.
function occupyRow(seating: number[][], row: number): void {
  for (let colIndex = 0; colIndex < seating[row].length; colIndex++) {
    seating[row][colIndex] = 1;
  }
}

// Helper: print a summary of the occupancy counts.
function printCounts(label: string, seating: number[][]): void {
  const counts = countSeats(seating);
  console.log(
    `[${label}] Occupied: ${counts.occupied} | Available: ${counts.available} | Total: ${counts.total}`
  );
}

// Helper: print the result of an adjacent-seat search.
function printAdjacent(label: string, seating: number[][]): void {
  const pair = findAdjacentAvailableSeats(seating);
  if (pair) {
    console.log(
      `[${label}] Adjacent seats found: row ${pair.row}, columns ${pair.firstColumn} and ${pair.secondColumn}.`
    );
  } else {
    console.log(`[${label}] No adjacent available seats found.`);
  }
}

console.log("\n########## CINEMA SEAT MANAGER - DEMO ##########");

// ==============================================================
// SCENARIO 1: EMPTY ROOM (all seats available)
// ==============================================================
console.log("\n===== SCENARIO 1: EMPTY ROOM =====");
let room = createEmptySeating();
displaySeating(room);
printCounts("Empty room", room);
printAdjacent("Empty room", room);

// Reserve a seat in an empty room
console.log(reserveSeat(room, 2, 3));
console.log(reserveSeat(room, 0, 0));
displaySeating(room);

// ==============================================================
// SCENARIO 2: PARTIALLY FILLED ROOM
// ==============================================================
console.log("\n===== SCENARIO 2: PARTIALLY FILLED ROOM =====");
room = createEmptySeating();

// Reserve several seats across the room
console.log(reserveSeat(room, 0, 0));
console.log(reserveSeat(room, 0, 1));
console.log(reserveSeat(room, 1, 5));
console.log(reserveSeat(room, 3, 2));
console.log(reserveSeat(room, 3, 3));
console.log(reserveSeat(room, 4, 7));
console.log(reserveSeat(room, 6, 9));

displaySeating(room, findAdjacentAvailableSeats(room));
printCounts("Partially filled", room);
printAdjacent("Partially filled", room);

// Test that reserving an already-occupied seat fails
console.log(reserveSeat(room, 0, 1)); // already occupied -> should fail
console.log(reserveSeat(room, 3, 2)); // already occupied -> should fail

// ==============================================================
// SCENARIO 3: NEARLY FULL ROOM (scattered single seats left)
// ==============================================================
console.log("\n===== SCENARIO 3: NEARLY FULL ROOM =====");
room = createEmptySeating();

// Fill every seat in every row
for (let r = 0; r < room.length; r++) {
  occupyRow(room, r);
}

// Free up a few scattered seats so only singles remain
room[0][0] = 0;
room[0][2] = 0;
room[3][5] = 0;
room[7][7] = 0;

displaySeating(room);
printCounts("Nearly full", room);
printAdjacent("Nearly full", room); // no two adjacent free -> should find none

// ==============================================================
// SCENARIO 4: FULL ROOM (no seats available)
// ==============================================================
console.log("\n===== SCENARIO 4: FULL ROOM =====");
room = createEmptySeating();
for (let r = 0; r < room.length; r++) {
  occupyRow(room, r);
}

displaySeating(room);
printCounts("Full room", room);
printAdjacent("Full room", room);

// Any reservation should fail on a full room
console.log(reserveSeat(room, 2, 2));

// ==============================================================
// EXTRA EDGE CASES: invalid positions
// ==============================================================
console.log("\n===== EXTRA: EDGE CASES =====");
room = createEmptySeating();
console.log(reserveSeat(room, -1, 0)); // row out of bounds
console.log(reserveSeat(room, 8, 0)); // row out of bounds (only 0-7)
console.log(reserveSeat(room, 0, 10)); // column out of bounds (only 0-9)

// Search again on a nearly empty room where a pair definitely exists
console.log(reserveSeat(room, 5, 4));
printAdjacent("After single reservation", room);

console.log("\n########## END OF DEMO ##########");

export {};


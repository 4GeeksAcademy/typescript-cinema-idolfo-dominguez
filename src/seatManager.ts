// ============================================================
//  CINEMA SEAT MANAGER - Core Logic Module
//
//  This module models the screening room as a two-dimensional
//  array (matrix). Each cell represents a seat:
//      - 0  => available (libre = L)
//      - 1  => occupied  (ocupado = X)
//
//  IMPORTANT: No objects or classes are used. The seating data
//  is represented exclusively by a 2D array of numbers.
// ============================================================

// Room dimensions: 8 rows x 10 columns
export const ROWS = 8;
export const COLS = 10;

// --- 1. INITIALIZE THE SEATING MATRIX ----------------------
// Creates a fresh 2D array of 8 rows and 10 columns where every
// seat starts available (0). Returns the new matrix.
export function createEmptySeating(): number[][] {
  const seating: number[][] = [];

  for (let rowIndex = 0; rowIndex < ROWS; rowIndex++) {
    // Build one row with all seats available (0)
    const row: number[] = [];
    for (let colIndex = 0; colIndex < COLS; colIndex++) {
      row.push(0);
    }
    seating.push(row);
  }

  return seating;
}

// ANSI color codes for the terminal
const GREEN = "\x1b[32m";
const RED = "\x1b[31m";
const ORANGE = "\x1b[38;5;208m";
const RESET = "\x1b[0m";

// --- 2. DISPLAY THE SCREENING ROOM -------------------------
// Prints the room as a seat map with a SCREEN banner:
//   [L] green  => available
//   [X] red    => occupied
//   [L] orange => adjacent pair (optional highlight)
// Row and column numbers are printed to help identify seats.
export function displaySeating(
  seating: number[][],
  highlightedPair: ReturnType<typeof findAdjacentAvailableSeats> = null
): void {
  const mapWidth = COLS * 4;
  const screenLabel = " SCREEN ";
  const sideWidth = Math.floor((mapWidth - screenLabel.length) / 2);

  console.log("");
  console.log("    " + "_".repeat(sideWidth) + screenLabel + "_".repeat(sideWidth));
  console.log("");

  // Column numbers header (each seat tile is 4 characters wide)
  let header = "    ";
  for (let colIndex = 0; colIndex < COLS; colIndex++) {
    header += ` ${colIndex}  `;
  }
  console.log(header);

  for (let rowIndex = 0; rowIndex < seating.length; rowIndex++) {
    let rowText = ` ${rowIndex}  `;
    for (let colIndex = 0; colIndex < seating[rowIndex].length; colIndex++) {
      const isHighlighted =
        highlightedPair !== null &&
        highlightedPair.row === rowIndex &&
        colIndex >= highlightedPair.firstColumn &&
        colIndex <= highlightedPair.secondColumn;

      if (isHighlighted) {
        rowText += `${ORANGE}[L]${RESET} `;
      } else if (seating[rowIndex][colIndex] === 1) {
        rowText += `${RED}[X]${RESET} `;
      } else {
        rowText += `${GREEN}[L]${RESET} `;
      }
    }
    console.log(rowText);
  }

  console.log("");
  console.log(
    `    ${GREEN}[L]${RESET} Available (0)   ${RED}[X]${RESET} Occupied (1)   ${ORANGE}[L]${RESET} Adjacent pair`
  );
  console.log("");
}

// --- 3. RESERVE A SEAT -------------------------------------
// Attempts to reserve the seat at (row, column).
// Validates that the position exists and that the seat is not
// already occupied. If successful, marks the seat as occupied
// (0 -> 1) and returns a success message; otherwise returns an
// appropriate error message.
export function reserveSeat(
  seating: number[][],
  row: number,
  column: number
): string {
  // Fractions and NaN would pass the range checks below
  if (!Number.isInteger(row) || !Number.isInteger(column)) {
    return `Reservation FAILED: Row and column must be whole numbers.`;
  }

  // Validate that the row is within bounds
  if (row < 0 || row >= seating.length) {
    return `Reservation FAILED: Row ${row} does not exist (valid rows are 0-${ROWS - 1}).`;
  }

  // Validate that the column is within bounds for this row
  if (column < 0 || column >= seating[row].length) {
    return `Reservation FAILED: Column ${column} does not exist (valid columns are 0-${COLS - 1}).`;
  }

  // Check if the seat is already occupied
  if (seating[row][column] === 1) {
    return `Reservation FAILED: Seat (row ${row}, column ${column}) is already occupied.`;
  }

  // Mark the seat as occupied
  seating[row][column] = 1;
  return `Reservation CONFIRMED: Seat (row ${row}, column ${column}) is now reserved.`;
}

// --- 4. COUNT OCCUPIED AND AVAILABLE SEATS -----------------
// Counts how many seats are occupied and how many are available
// across the whole room. Returns the result as a JSON structure
// (the task allows JSON for additional metadata).
export function countSeats(seating: number[][]): {
  occupied: number;
  available: number;
  total: number;
} {
  let occupied = 0;
  let available = 0;

  for (let rowIndex = 0; rowIndex < seating.length; rowIndex++) {
    for (let colIndex = 0; colIndex < seating[rowIndex].length; colIndex++) {
      if (seating[rowIndex][colIndex] === 1) {
        occupied++;
      } else {
        available++;
      }
    }
  }

  return {
    occupied,
    available,
    total: occupied + available,
  };
}

// --- 5. FIND TWO ADJACENT AVAILABLE SEATS ------------------
// Searches for the first pair of horizontally adjacent available
// seats in the same row. If found, returns their positions as a
// JSON structure. If none are found, returns null so the caller
// can report it clearly.
export function findAdjacentAvailableSeats(
  seating: number[][]
): { row: number; firstColumn: number; secondColumn: number } | null {
  for (let rowIndex = 0; rowIndex < seating.length; rowIndex++) {
    // Stop one seat early so colIndex + 1 stays inside the row
    for (let colIndex = 0; colIndex < seating[rowIndex].length - 1; colIndex++) {
      if (seating[rowIndex][colIndex] === 0 && seating[rowIndex][colIndex + 1] === 0) {
        return {
          row: rowIndex,
          firstColumn: colIndex,
          secondColumn: colIndex + 1,
        };
      }
    }
  }

  return null;
}

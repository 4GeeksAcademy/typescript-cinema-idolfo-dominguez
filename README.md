# Cinema Seat Manager (TypeScript)

A command-line seat reservation system for a cinema screening room with **8 rows and 10 seats per row**.

The room is stored as a **two-dimensional array** (`number[][]`):

- `0` = available seat
- `1` = occupied seat

`seating[row][column]` is one seat. Rows go from `0` to `7` and columns from `0` to `9`.

---

## 1. Requirements

- Node.js 20 or newer
- npm

In GitHub Codespaces, both are already installed, and `npm install` runs automatically when the codespace is created.

## 2. Installation

```bash
npm install
```

## 3. Commands

| Command | What it does |
|---|---|
| `npm start` | Opens the **interactive app**. You pick a starting scenario and reserve seats from a menu. |
| `npm run demo` | Runs **every test scenario automatically** and prints the results. No input needed. |
| `npm run typecheck` | Checks the TypeScript code for type errors. |

---

## 4. User guide: interactive app (`npm start`)

### Step 1: Choose a starting scenario

When the app opens, it asks which room to start from:

```
Choose a starting scenario:
  1. Empty room
  2. Partially filled room
  3. Nearly full room (only scattered single seats)
  4. Full room
Scenario number:
```

Type a number and press **Enter**.

| Scenario | Starting state |
|---|---|
| 1. Empty room | All 80 seats available |
| 2. Partially filled room | 7 seats taken: (0,0), (0,1), (1,5), (3,2), (3,3), (4,7), (6,9) |
| 3. Nearly full room | Only 4 free seats, none next to each other: (0,0), (0,2), (3,5), (7,7) |
| 4. Full room | All 80 seats taken |

### Step 2: Read the seat map

```
    ________________ SCREEN ________________

     0   1   2   3   4   5   6   7   8   9
 0  [X] [X] [L] [L] [L] [L] [L] [L] [L] [L]
 1  [L] [L] [L] [L] [L] [X] [L] [L] [L] [L]
 ...

    [L] Available (0)   [X] Occupied (1)   [L] Adjacent pair
```

- Numbers across the top are **columns**. Numbers down the left side are **rows**.
- `[L]` in **green**: available
- `[X]` in **red**: occupied
- `[L]` in **orange**: the adjacent pair found by option 4

### Step 3: Use the menu

```
What do you want to do?
  1. Show seat map
  2. Reserve a seat
  3. Show seat counts
  4. Find two adjacent seats
  5. Load another scenario
  0. Exit
Option:
```

| Option | What it does | What you type |
|---|---|---|
| `1` | Shows the current seat map | Nothing else |
| `2` | Reserves one seat | A row (0-7), then a column (0-9) |
| `3` | Shows how many seats are occupied and available | Nothing else |
| `4` | Finds the first two free seats side by side in the same row, highlights them, and asks whether to book them | `y` to reserve both, `n` to skip |
| `5` | Replaces the room with a new starting scenario | A scenario number (1-4) |
| `0` | Exits the app | Nothing else |

You can repeat option `2` as many times as you like to keep filling the room.

### Messages you may see

| Message | Meaning |
|---|---|
| `Reservation CONFIRMED: Seat (row R, column C) is now reserved.` | The seat was free and is now taken. |
| `Reservation FAILED: Seat (row R, column C) is already occupied.` | The seat was already taken. Nothing changed. |
| `Reservation FAILED: Row R does not exist (valid rows are 0-7).` | The row is outside the room. |
| `Reservation FAILED: Column C does not exist (valid columns are 0-9).` | The column is outside the room. |
| `Please type a whole number.` | The row or column wasn't a number. You return to the menu. |
| `Adjacent seats found: row R, columns A and B.` | Two free seats side by side were found. |
| `No adjacent available seats found.` | No row has two free seats next to each other. |
| `Occupied: N \| Available: N \| Total: 80` | Current seat counts. |

### Example session

```
Scenario number: 2              <- start from the partially filled room
Option: 2                       <- reserve a seat
Row (0-7): 3
Column (0-9): 2
Reservation FAILED: Seat (row 3, column 2) is already occupied.

Option: 4                       <- find two seats together
Adjacent seats found: row 0, columns 2 and 3.
Reserve these two seats? (y/n): y
Reservation CONFIRMED: Seat (row 0, column 2) is now reserved.
Reservation CONFIRMED: Seat (row 0, column 3) is now reserved.

Option: 3                       <- check the counts
Occupied: 9 | Available: 71 | Total: 80

Option: 0
Goodbye!
```

---

## 5. Suggested review steps

Each check below covers one requirement of the project.

| # | Do this in `npm start` | Expected result |
|---|---|---|
| 1 | Scenario `1`, then option `3` | `Occupied: 0 \| Available: 80` |
| 2 | Option `2`, row `4`, column `5` | `Reservation CONFIRMED`, and seat (4,5) shows `[X]` |
| 3 | Option `2`, row `4`, column `5` again | `Reservation FAILED ... already occupied` |
| 4 | Option `2`, row `8`, column `0` | `Row 8 does not exist` |
| 5 | Option `4` | Row 0, columns 0 and 1 are highlighted in orange |
| 6 | Option `5`, scenario `3`, then option `4` | `No adjacent available seats found.` |
| 7 | Option `5`, scenario `4`, then option `3` | `Occupied: 80 \| Available: 0` |
| 8 | Option `0` | `Goodbye!` |

### Automatic test run (`npm run demo`)

Runs all four required scenarios and the invalid-input cases with no input. Expected results:

| Section | Expected result |
|---|---|
| Scenario 1: Empty room | 0 / 80, pair at row 0, columns 0-1, two reservations confirmed |
| Scenario 2: Partially filled | 7 / 73, pair at row 0, columns 2-3 (orange), two `already occupied` failures |
| Scenario 3: Nearly full | 76 / 4, `No adjacent available seats found.` |
| Scenario 4: Full room | 80 / 0, no pair, the reservation fails |
| Edge cases | Rows `-1` and `8` and column `10` rejected, then (5,4) confirmed |

---

## 6. Code structure

```
src/
  seatManager.ts   Core logic: the seat matrix and its functions
  main.ts          Interactive console app (npm start)
  demo.ts          Automatic test scenarios (npm run demo)
```

### Functions in `src/seatManager.ts`

| Function | Parameters | Returns |
|---|---|---|
| `createEmptySeating()` | none | A new 8x10 matrix of `0`s |
| `displaySeating(seating, highlightedPair?)` | The matrix, plus an optional pair to highlight | Nothing; prints the seat map |
| `reserveSeat(seating, row, column)` | The matrix, a row and a column | A success or failure message |
| `countSeats(seating)` | The matrix | `{ occupied, available, total }` |
| `findAdjacentAvailableSeats(seating)` | The matrix | `{ row, firstColumn, secondColumn }`, or `null` if no pair exists |

The seating data is only the two-dimensional array; no classes are used. The counts and the found pair are returned as small JSON-style results, which the project allows for additional data.

## 7. Troubleshooting

- **No colors:** some terminals don't support colors. The `[L]` and `[X]` letters still show each seat's state.
- **The app is waiting:** it needs an answer. Type it in the terminal and press **Enter**.
- **Exit at any time:** choose option `0`, or press **Ctrl + C**.

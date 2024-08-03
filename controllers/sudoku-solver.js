const { set } = require("mongoose");

class SudokuSolver {

  validate(puzzleString) {
    if (!puzzleString) {
      return { error: "Required field missing" };
    }
    if (puzzleString.length !== 81) {
      return { error: "Expected puzzle to be 81 characters long" };
    }
    if (/[^1-9.]/.test(puzzleString)) {
      return { error: "Invalid characters in puzzle" };
    }
    return {};
  }

  checkRowPlacement(puzzleString, row, column, value) {
    const start = row * 9;
    for (let i = 0; i < 9; i++) {
      if (puzzleString[start + i] == value) {
        return false;
      }
    }
    return true;
  }

  checkColPlacement(puzzleString, row, column, value) {
    for (let i = 0; i < 9; i++) {
      if (puzzleString[column + i * 9] == value) {
        return false;
      }
    }
    return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(column / 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (puzzleString[(startRow + i) * 9 + startCol + j] == value) {
          return false;
        }
      }
    }
    return true;
  }
  checkIsSolved(puzzleString) {
    //check rows
    if(!puzzleString){
      return false;
    }
    for (let i = 0; i < 9; i++) {
      let set = new Set();
      for (let j = 0; j < 9; j++) {
        set.add(puzzleString[i * 9 + j]);

      }
      if (set.size != 9) {
        return false;
      }
    }
    //check columns
    for (let i = 0; i < 9; i++) {
      let set = new Set();
      for (let j = 0; j < 9; j++) {
        set.add(puzzleString[j * 9 + i]);
      }
      if (set.size != 9) {
        return false;
      }
    }
    //check regions
    for (let i = 0; i < 9; i += 3) {
      for (let j = 0; j < 9; j += 3) {
        let set = new Set();
        for (let k = 0; k < 3; k++) {
          for (let l = 0; l < 3; l++) {
            set.add(puzzleString[(i + k) * 9 + j + l]);
          }
        }
        if (set.size != 9) {
          return false;
        }
      }
    }
    return true;
  }
  solve(puzzleString) {

    const findEmpty = (puzzleString) => {
      for (let i = 0; i < 81; i++) {
        if (puzzleString[i] === '.') {
          return i;
        }
      }
      return -1;
    };

    const solveHelper = (puzzleString) => {
      const emptyIndex = findEmpty(puzzleString);
      if (emptyIndex === -1) {

        return puzzleString;
      }

      const row = Math.floor(emptyIndex / 9);
      const col = emptyIndex % 9;

      for (let num = 1; num <= 9; num++) {
        const value = num.toString();
        if (this.checkRowPlacement(puzzleString, row, col, value) &&
          this.checkColPlacement(puzzleString, row, col, value) &&
          this.checkRegionPlacement(puzzleString, row, col, value)) {
          const newPuzzleString = puzzleString.slice(0, emptyIndex) + value + puzzleString.slice(emptyIndex + 1);
          const solvedPuzzle = solveHelper(newPuzzleString);
          if (solvedPuzzle) {
            return solvedPuzzle;
          }
        }
      }
      return null;
    };

    if (this.validate(puzzleString).error) {
      return null;
    }
    const solvedPuzzle = solveHelper(puzzleString);
    if (this.checkIsSolved(solvedPuzzle)) {
      return solvedPuzzle;
    }
    return null;

  }
}
module.exports = SudokuSolver;
const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver;

suite('Unit Tests', () => {
   suiteSetup(() => {
      solver = new Solver();
   });
   
   test('Logic handles a valid puzzle string of 81 characters', function() {
      const puzzleString = '123456789'.repeat(9);
      assert.deepEqual(solver.validate(puzzleString), {});
   });
   
   test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', function() {
      const puzzleString = '123456a89'.repeat(9);
      assert.deepEqual(solver.validate(puzzleString), { error: 'Invalid characters in puzzle' });
   });

   test('Logic handles a puzzle string that is not 81 characters in length', function() {
      const puzzleString = '123456799'.repeat(8);
      assert.deepEqual(solver.validate(puzzleString), { error: 'Expected puzzle to be 81 characters long' });
   });

   test('Logic handles a valid row placement', function() {
      const puzzleString = '.35762984946381257728459613694517832812936745357824196473298561581673429269145378';
      assert.isTrue(solver.checkRowPlacement(puzzleString, 0, 0, 1));
   });
   test('Logic handles an invalid row placement', function() {
      const puzzleString = '123456789'.repeat(9);
      assert.isFalse(solver.checkRowPlacement(puzzleString, 0, 0, 1));
   });

   test('Logic handles a valid column placement', function() {
      const puzzleString = '123456789'.repeat(9);
      assert.isTrue(solver.checkColPlacement(puzzleString, 0, 0, 5));
   });

   test('Logic handles an invalid column placement', function() {
      const puzzleString = '123456789'.repeat(9);
      assert.isFalse(solver.checkColPlacement(puzzleString, 0, 0, 1));
   });

   test('Logic handles a valid region (3x3 grid) placement', function() {
      const puzzleString = '123456789'.repeat(9);
      assert.isTrue(solver.checkRegionPlacement(puzzleString, 0, 0, 5));
   });

   test('Logic handles an invalid region (3x3 grid) placement', function() {
      const puzzleString = '123456789'.repeat(9);
      assert.isFalse(solver.checkRegionPlacement(puzzleString, 0, 0, 1));
   });

   test('Valid puzzle strings pass the solver', function() {
      const puzzleString = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
      assert.equal(solver.solve(puzzleString), '135762984946381257728459613694517832812936745357824196473298561581673429269145378');
   });

   test('Invalid puzzle strings fail the solver', function() {
      const puzzleString = '123456789'.repeat(8);
      assert.isNull(solver.solve(puzzleString));
   });

   test('Solver returns the the expected solution for an incomplete puzzle', function() {
      const puzzleString = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
      assert.equal(solver.solve(puzzleString), '135762984946381257728459613694517832812936745357824196473298561581673429269145378');
   });



      
});

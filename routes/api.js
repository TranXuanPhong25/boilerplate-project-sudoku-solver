'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      let puzzle = req.body.puzzle;
      let coordinate = req.body.coordinate;
      let value = req.body.value;
      if (!puzzle || !coordinate || !value) {
        return res.json({error: "Required field(s) missing"});
      }
      const check = solver.validate(puzzle);
      if(check.error) {
        return res.json(check);
      }
      if (!coordinate.match(/^[A-I][1-9]$/)) {
        return res.json({error: "Invalid coordinate"});
      }
      if (!value.match(/^[1-9]$/)) {
        return res.json({error: "Invalid value"});
      }
      let conflict = [];
      if(puzzle[coordinate.charCodeAt(0) - 65 + (coordinate[1] - 1) * 9] === value) {
        return res.json({valid: true});
      }
      if (!solver.checkRowPlacement(puzzle, coordinate[1] - 1, coordinate.charCodeAt(0) - 65, value)) {
        conflict.push("row");
      }
      if (!solver.checkColPlacement(puzzle, coordinate[1] - 1, coordinate.charCodeAt(0) - 65, value)) {
        conflict.push("column");
      }
      if (!solver.checkRegionPlacement(puzzle, coordinate[1] - 1, coordinate.charCodeAt(0) - 65, value)) {
        conflict.push("region");
      }
    
      if (conflict.length === 0) {
        return res.json({valid: true});
      }
      
      return res.json({valid: false, conflict});
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      let puzzle = req.body.puzzle;
      const check = solver.validate(puzzle);
      if(check.error) {
        return res.json(check);
      }
      let solution = solver.solve(puzzle);
      
      if (!solution) {
        return res.json({error: "Puzzle cannot be solved"});
      }
      return res.json({solution});
    });
};

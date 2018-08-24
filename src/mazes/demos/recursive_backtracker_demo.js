"use strict";

const Grid = require('../core/grid');
const RecursiveBacktracker = require('../algorithms/recursive_backtracker');

let grid = new Grid(15, 15);
RecursiveBacktracker.on(grid, grid.random_cell);

console.log(String(grid));

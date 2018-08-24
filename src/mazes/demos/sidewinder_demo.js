"use strict";

const Grid = require('../core/grid');
const Sidewinder = require('../algorithms/sidewinder');

let grid = new Grid(4, 4);
Sidewinder.on(grid);

console.log(String(grid));

"use strict";

// const Grid = require('../core/distance_grid');
const Grid = require('../core/grid');
const Wilsons = require('../algorithms/wilsons');

let grid = new Grid(15, 15);
Wilsons.on(grid);

// let start = grid.cell_at(0, 0);
// let distances = start.distances();

// grid.distances = distances;
console.log(String(grid));

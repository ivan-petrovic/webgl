"use strict";

const DistanceGrid = require('../core/distance_grid');
const BinaryTree = require('../algorithms/binary_tree');

let grid = new DistanceGrid(5, 5);
BinaryTree.on(grid);

let start = grid.cell_at(0, 0);
let distances = start.distances();

grid.distances = distances;
console.log(String(grid));

grid.distances = distances.path_to(grid.cell_at(grid.rows - 1, 0));
console.log("\nPath from northwest corner to southwest corner:");
console.log(String(grid));

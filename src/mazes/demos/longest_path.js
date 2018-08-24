"use strict";

const DistanceGrid = require('../core/distance_grid');
const BinaryTree = require('../algorithms/binary_tree');

let grid = new DistanceGrid(5, 5);
BinaryTree.on(grid);

let start = grid.cell_at(0, 0);
let distances = start.distances();

let new_start;
let distance;
let goal;

[new_start, distance] = distances.max();

let new_distances = new_start.distances();
[goal, distance] = new_distances.max();

grid.distances = new_distances.path_to(goal);
console.log(String(grid));

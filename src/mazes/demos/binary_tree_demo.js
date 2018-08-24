"use strict";

const Grid = require('../core/grid');
const BinaryTree = require('../algorithms/binary_tree');

let grid = new Grid(5, 5);
BinaryTree.on(grid);

console.log(String(grid));

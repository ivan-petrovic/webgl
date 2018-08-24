"use strict";

const Grid = require('../core/grid');
const AldousBroder = require('../algorithms/aldous_broder');

let grid = new Grid(15, 15);
AldousBroder.on(grid);

console.log(String(grid));

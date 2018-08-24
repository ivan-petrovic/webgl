"use strict";

const Grid = require('../core/grid');
const HuntAndKill = require('../algorithms/hunt_and_kill');

let grid = new Grid(15, 15);
HuntAndKill.on(grid);

console.log(String(grid));

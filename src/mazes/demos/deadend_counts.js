"use strict";

const Grid = require('../core/grid');
const BinaryTree = require('../algorithms/binary_tree');
const Sidewinder = require('../algorithms/sidewinder');
const AldousBroder = require('../algorithms/aldous_broder');
const Wilsons = require('../algorithms/wilsons');
const HuntAndKill = require('../algorithms/hunt_and_kill');
const RecursiveBacktracker = require('../algorithms/recursive_backtracker');

let algorithms = ['BinaryTree', 'Sidewinder', 'AldousBroder', 'Wilsons', 'HuntAndKill', 'RecursiveBacktracker'];
let algorithmsClass = {
    'BinaryTree': BinaryTree,
    'Sidewinder': Sidewinder,
    'AldousBroder': AldousBroder,
    'Wilsons': Wilsons,
    'HuntAndKill': HuntAndKill,
    'RecursiveBacktracker': RecursiveBacktracker
};

let tries = 100;
let size = 20;

let averages = {};
let deadend_counts;

algorithms.forEach((algorithm) => {
    console.log(`running ${algorithm}...`);

    deadend_counts = [];
    for(let i = 0; i < tries; i += 1) {
        let grid = new Grid(size, size);
        algorithmsClass[algorithm].on(grid);
        deadend_counts.push(grid.deadends.length);
    }

    let total_deadends = deadend_counts.reduce((accumulator, currentValue) => accumulator + currentValue);
    averages[algorithm] = total_deadends / deadend_counts.length;
});

let total_cells = size * size;
console.log(`\nAverage dead-ends per ${size}x${size} maze (${total_cells} cells):\n`);

algorithms.sort((alg1, alg2) => { return averages[alg2] - averages[alg1] });
algorithms.forEach((algorithm) => {
    let percentage = averages[algorithm] * 100.0 / total_cells;
    console.log("%s: %d/%d (%d%%)", algorithm.padStart(20), Math.round(averages[algorithm]), total_cells, percentage);
});

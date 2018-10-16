"use strict";

import 'babel-core/register';
import 'babel-polyfill';

import MnEngine from './engine/engine';
import Camera from './engine/camera';
import Grid from './mazes/core/distance_grid';
import BinaryTree from './mazes/algorithms/binary_tree';
import ColoredSquare from './colored_square_renderable';

export function main() {
    let engine = new MnEngine();
    let camera = new Camera(
        vec3.fromValues(125.0, 125.0, 10.0), // position
        vec3.fromValues(125.0, 125.0, 0.0),  // lookAt
        400.0,                            // width
        [0, 0, 640, 480]                 // viewportArray
    );
    engine.setCamera(camera);

    let grid = new Grid(25, 25, engine);
    BinaryTree.on(grid);

    let start = grid.cell_at(Math.round(grid.rows / 2), Math.round(grid.columns / 2));
    // let start = grid.cell_at(12, 12);
    grid.set_distances(start.distances());

    let square = new ColoredSquare(engine, 0.0, 0.0, 8.0, 8.0);
    square.setColor([0.2, 0.0, 0.8, 1.0]);
    square.setGrid(grid);
    square.setPositionOnGrid(4, 3);

    engine.add_renderable(square);
    engine.add_renderable(grid);

    engine.load_resources_and_start();
}

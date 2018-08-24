"use strict";

import MnEngine from './engine/engine';
import Camera from './engine/camera';
import ColoredSquare from './colored_square_renderable';
import Grid from './grid_renderable';

export function main() {
    let engine = new MnEngine();
    let camera = new Camera(
        vec3.fromValues(0.0, 0.0, 10.0), // position
        vec3.fromValues(0.0, 0.0, 0.0),  // lookAt
        80.0,                            // width
        [0, 0, 640, 480]                 // viewportArray
    );
    engine.setCamera(camera);

    let grid = new Grid(engine, -20.0, -20.0, 40.0, 40.0, 5, 5);
    let square = new ColoredSquare(engine, 0.0, 0.0, 8.0, 8.0);
    square.setColor([0.2, 0.0, 0.8, 1.0]);
    square.setGrid(grid);
    // square.setPositionOnGrid(4, 3);

    engine.addRenderable(grid);
    engine.addRenderable(square);

    engine.loadResourcesAndStart();
}

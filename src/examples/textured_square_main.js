"use strict";

import MnEngine from './engine/engine';
import Camera from './engine/camera/orthographic';
import TexturedSquare from './model/textured_square';
import Grid from './model/grid';

export function main() {
    let engine = new MnEngine();
    let camera = new Camera(
        vec3.fromValues(0.0, 0.0, 10.0), // position
        vec3.fromValues(0.0, 0.0, 0.0),  // lookAt
        80.0,                            // width
        [0, 0, 640, 480]                 // viewportArray
    );
    engine.camera = camera;

    let grid = new Grid(engine, -20.0, -20.0, 40.0, 40.0, 5, 5);
    let square = new TexturedSquare(engine, 0.0, 0.0, 8.0, 8.0, 'images/bubble-guppies.png');
    square.setGrid(grid);

    engine.scene.add_renderable(grid);
    engine.scene.add_renderable(square);

    engine.load_resources_and_start();
}

"use strict";

import MnEngine from './engine';
import Camera from './camera';
import ColoredSquare from './colored_square_renderable';

export function main() {
    let engine = new MnEngine();
    let camera = new Camera(
        vec3.fromValues(0.0, 0.0, 10.0), // position
        vec3.fromValues(0.0, 0.0, 0.0),  // lookAt
        80.0,                            // width
        [0, 0, 640, 480]                 // viewportArray
    );
    engine.setCamera(camera);

    let square1 = new ColoredSquare(engine, -10.0, -10.0, 8.0, 4.0);
    let square2 = new ColoredSquare(engine, 30.0, 0.0, 7.0, 15.0);
    square2.setColor([0.0, 1.0, 0.0, 1.0]); // green
    let square3 = new ColoredSquare(engine, 0.0, 0.0, 3.0, 3.0);
    square3.setColor([0.0, 0.0, 1.0, 1.0]); // blue

    engine.addRenderable(square1);
    engine.addRenderable(square2);
    engine.addRenderable(square3);

    engine.loadResourcesAndStart();
}

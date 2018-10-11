"use strict";

import MnEngine from './engine/engine';
import Camera from './engine/camera';
import Square from './square';

export function main() {
    let engine = new MnEngine();
    let camera = new Camera(
        vec3.fromValues(0.0, 0.0, 10.0), // position
        vec3.fromValues(0.0, 0.0, 0.0),  // lookAt
        10.0,                            // width
        [0, 0, 640, 480]                 // viewportArray
    );
    engine.setCamera(camera);

    let square = new Square(engine);

    engine.addRenderable(square);

    engine.loadResourcesAndStart();
}

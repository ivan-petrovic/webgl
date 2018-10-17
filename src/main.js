"use strict";

import MnEngine from './engine/engine';
import Camera from './engine/perspective_camera';
import Icosahedron from './icosahedron';

export function main() {
    let engine = new MnEngine();
    let camera = new Camera(
        vec3.fromValues(0.0, 0.0, 3.0),  // position
        vec3.fromValues(0.0, 0.0, 0.0),  // lookAt
        1.0,                             // fovy
        [0, 0, 640, 480]                 // viewportArray
    );
    engine.setCamera(camera);

    let icosahedron = new Icosahedron(engine, 1.0, 2);
    engine.add_renderable(icosahedron);

    engine.load_resources_and_start();
}

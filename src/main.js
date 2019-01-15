"use strict";

import MnEngine from './engine/engine';
import Camera from './engine/camera/orthographic';
import SpiralsWithLinesScene from './examples/spiral_with_lines_scene';

export function main() {
    let engine = new MnEngine();
    let camera = new Camera(
        vec3.fromValues(0.0, 0.0, 10.0), // position
        vec3.fromValues(0.0, 0.0, 0.0),  // lookAt
        80.0,                            // width 80 x 60, because aspect ratio is 4:3
        [0, 0, 640, 480]                 // viewportArray
    );
    engine.camera = camera;
    // engine.animation_loop = false;

    engine.scene = new SpiralsWithLinesScene(engine);

    engine.load_resources_and_start();
}

"use strict";

import MnEngine from './engine/engine';
import Camera from './engine/camera/orthographic';
// import LineIntersections from './example_scenes/line_intersections';
import PointBounce from './example_scenes/point_bounce';

export function main() {
    let engine = new MnEngine();
    let camera = new Camera(
        vec3.fromValues(0.0, 0.0, 10.0), // position
        vec3.fromValues(0.0, 0.0, 0.0),  // lookAt
        80.0,                            // width 80 x 60, because aspect ratio is 4:3
        [0, 0, 640, 480]                 // viewportArray
    );
    engine.camera = camera;

    // engine.scene = new LineIntersections(engine);
    engine.scene = new PointBounce(engine);

    engine.load_resources_and_start();
}

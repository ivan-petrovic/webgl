"use strict";

import MnEngine from './engine/engine';
import Camera from './engine/perspective_camera';
// import CameraZoomBehaviour from './camera_zoom_behaviour';
import OrbitBehaviour from './orbit_behaviour';
import Icosahedron from './icosahedron';
import Axes from './coordinate_axes';

export function main() {
    let engine = new MnEngine();
    let camera = new Camera(
        vec3.fromValues(0.0, 0.0, 3.0),  // position
        vec3.fromValues(0.0, 0.0, 0.0),  // lookAt
        1.0,                             // fovy
        [0, 0, 640, 480]                 // viewportArray
    );
    camera.add_behaviour(new OrbitBehaviour(camera, {
        'right': engine.input.Keys.D,
        'left': engine.input.Keys.A,
        'up': engine.input.Keys.W,
        'down': engine.input.Keys.S,
        'zoom_in': engine.input.Keys.J,
        'zoom_out': engine.input.Keys.K,
    }));
    engine.camera = camera;

    let axes = new Axes(engine);

    let icosahedron1 = new Icosahedron(engine, 1.0, 1);
    icosahedron1.add_behaviour(new OrbitBehaviour(icosahedron1));
    icosahedron1.position = [0.0, 0.0, 1.0];
    icosahedron1.color = [0.0, 0.0, 1.0, 1.0];
    icosahedron1.scale = 0.2;
    
    let icosahedron2 = new Icosahedron(engine, 1.0, 1);
    icosahedron2.color = [1.0, 1.0, 0.0, 1.0];

    engine.add_renderable(axes);
    engine.add_renderable(icosahedron1);
    engine.add_renderable(icosahedron2);

    engine.load_resources_and_start();
}

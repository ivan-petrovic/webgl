"use strict";

import MnEngine from './engine/engine';
import Camera from './engine/perspective_camera';
import CameraZoomBehaviour from './camera_zoom_behaviour';
import OrbitBehaviour from './orbit_behaviour';
import Icosahedron from './icosahedron';

export function main() {
    let engine = new MnEngine();
    let camera = new Camera(
        vec3.fromValues(0.0, 0.0, 3.0),  // position
        vec3.fromValues(0.0, 0.0, 0.0),  // lookAt
        1.0,                             // fovy
        [0, 0, 640, 480]                 // viewportArray
    );
    camera.add_behaviour(new CameraZoomBehaviour(camera));
    // camera.add_behaviour(new OrbitBehaviour(camera));
    engine.camera = camera;

    let icosahedron1 = new Icosahedron(engine, 1.0, 1);
    icosahedron1.add_behaviour(new OrbitBehaviour(icosahedron1));
    icosahedron1.position = [3.0, 0.0, 0.0];
    icosahedron1.color = [0.0, 0.0, 1.0, 1.0];
    
    let icosahedron2 = new Icosahedron(engine, 1.0, 1);
    icosahedron2.color = [1.0, 1.0, 0.0, 1.0];
    
    console.log('ico1' + icosahedron1.position);
    console.log('ico1' + icosahedron1.color);
    console.log('ico2' + icosahedron2.position);
    console.log('ico2' + icosahedron2.color);

    engine.add_renderable(icosahedron1);
    engine.add_renderable(icosahedron2);

    engine.load_resources_and_start();
}

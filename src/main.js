"use strict";

import MnEngine from './engine/engine';
import Camera from './engine/perspective_camera';
import Light from './engine/directional_light';
import OrbitBehaviour from './orbit_behaviour';
import Floor from './model/floor_grid';
import SpaceShip from './model/simple_space_ship';

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

    let light = new Light();
    light.direction = [0.0, 0.0, 1.0];
    engine.add_light(light);

    let floor = new Floor(engine);
    let ship = new SpaceShip(engine);

    engine.add_renderable(floor);
    engine.add_renderable(ship);

    engine.load_resources_and_start();
}

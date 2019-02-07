"use strict";

import MnEngine from './engine/engine';
import Camera from './engine/camera/orthographic';
import Sprite from './model/sprite';
// import TexturedSquare from './model/textured_square';
import MovingBehaviour from './behaviour/moving';

export function main() {
    let engine = new MnEngine();
    let camera = new Camera(
        vec3.fromValues(0.0, 0.0, 10.0), // position
        vec3.fromValues(0.0, 0.0, 0.0),  // lookAt
        80.0,                            // width
        [0, 0, 640, 480]                 // viewportArray
    );
    engine.camera = camera;

    // let square = new TexturedSquare(engine, 0.0, 0.0, 8.0, 8.0, 'images/bubble-guppies.png');

    let sprite1 = new Sprite(engine, vec3.fromValues(-10.0, -10.0, 0.0), 10.0, 10.0, 'images/minion_sprite.png');
    sprite1.setColor([1.0, 0.0, 0.0, 0.2]);
    sprite1.set_element_pixel_positions1(130, 310, 0, 180);

    let sprite2 = new Sprite(engine, vec3.fromValues(30.0, 0.0, 0.0), 10.0, 10.0, 'images/minion_sprite.png');
    sprite2.setColor([0.0, 0.0, 0.0, 0.0]);  // no tinting
    sprite2.set_element_pixel_positions1(315, 495, 0, 180);

    let hero = new Sprite(engine, vec3.fromValues(20.0, 20.0, 1.0), 8.0, 12.0, 'images/minion_sprite.png');
    hero.setColor([1.0, 1.0, 1.0, 0.0]);
    hero.set_element_pixel_positions1(0, 120, 0, 180);
    hero.add_behaviour(new MovingBehaviour(hero));

    // engine.scene.add_renderable(square);
    engine.scene.add_renderable(sprite1);
    engine.scene.add_renderable(sprite2);
    engine.scene.add_renderable(hero);

    engine.load_resources_and_start();
}

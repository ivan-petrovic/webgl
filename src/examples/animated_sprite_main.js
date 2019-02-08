"use strict";

import MnEngine from './engine/engine';
import Camera from './engine/camera/orthographic';
import Sprite from './model/animated_sprite';
// import Sprite from './model/sprite';
// import TexturedSquare from './model/textured_square';
// import MovingBehaviour from './behaviour/moving';

export function main() {
    let engine = new MnEngine();
    let camera = new Camera(
        vec3.fromValues(0.0, 0.0, 10.0), // position
        vec3.fromValues(0.0, 0.0, 0.0),  // lookAt
        80.0,                            // width
        [0, 0, 640, 480]                 // viewportArray
    );
    engine.camera = camera;

    let right_minion = new Sprite(engine, vec3.fromValues(-25.0, 10.0, 0.0), 8.0, 6.4, 'images/minion_sprite.png');
    right_minion.setColor([1, 1, 1, 0]);
    right_minion.set_sprite_sequence1(
        512, 0,     // first element position: top-right, 512 is top, 0 is right
        204,162,    // width x height in pixels
        5,          // number of elements in this sequence
        0           // horizontal padding in between
    );
    right_minion.set_animation_type(0); // eAnimationType.eAnimateRight
    right_minion.set_animation_speed(15);

    // the left minion
    let left_minion = new Sprite(engine, vec3.fromValues(-20.0, -15.0, 0.0), 8.0, 6.4, 'images/minion_sprite.png');
    left_minion.setColor([1, 1, 1, 0]);
    left_minion.set_sprite_sequence1(
        348, 0,     // first element: top-right, 164 from 512 is top, 0 is right
        204,164,    // widthxheight in pixels
        5,          // number of elements in this sequence
        0           // horizontal padding in between
    );
    left_minion.set_animation_type(0); // eAnimationType.eAnimateRight
    left_minion.set_animation_speed(15);

    // let square = new TexturedSquare(engine, 0.0, 0.0, 8.0, 8.0, 'images/bubble-guppies.png');

    // let sprite1 = new Sprite(engine, vec3.fromValues(-10.0, -10.0, 0.0), 10.0, 10.0, 'images/minion_sprite.png');
    // sprite1.setColor([1.0, 0.0, 0.0, 0.2]);
    // sprite1.set_element_pixel_positions1(130, 310, 0, 180);

    // let sprite2 = new Sprite(engine, vec3.fromValues(30.0, 0.0, 0.0), 10.0, 10.0, 'images/minion_sprite.png');
    // sprite2.setColor([0.0, 0.0, 0.0, 0.0]);  // no tinting
    // sprite2.set_element_pixel_positions1(315, 495, 0, 180);

    // let hero = new Sprite(engine, vec3.fromValues(20.0, 20.0, 1.0), 8.0, 12.0, 'images/minion_sprite.png');
    // hero.setColor([1.0, 1.0, 1.0, 0.0]);
    // hero.set_element_pixel_positions1(0, 120, 0, 180);
    // hero.add_behaviour(new MovingBehaviour(hero));

    engine.scene.add_renderable(right_minion);
    engine.scene.add_renderable(left_minion);
    // engine.scene.add_renderable(square);
    // engine.scene.add_renderable(sprite1);
    // engine.scene.add_renderable(sprite2);
    // engine.scene.add_renderable(hero);

    // engine.scene.add_renderable(square);

    engine.load_resources_and_start();
}

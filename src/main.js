"use strict";

import MnEngine from './engine/engine';
import Camera from './engine/camera/orthographic';
import Line from './model/line';
import ColoredSquare from './model/colored_square';
import DefaultScene from './engine/scene';
import reflect from './engine/utils/reflection';

export function main() {
    let engine = new MnEngine();
    let camera = new Camera(
        vec3.fromValues(0.0, 0.0, 10.0), // position
        vec3.fromValues(0.0, 0.0, 0.0),  // lookAt
        80.0,                            // width
        [0, 0, 640, 480]                 // viewportArray
    );
    engine.camera = camera;
    engine.animation_loop = false;

    engine.scene = new DefaultScene(engine);

    let line1 = new Line(engine, vec2.fromValues(-10.0,-10.0), vec2.fromValues(20.0,20.0));
    let line2 = new Line(engine, vec2.fromValues(-20.0,20.0), vec2.fromValues(15.0,10.0));

    let r = line2.intersection(line1);
    let square1 = new ColoredSquare(engine, [r[0], r[1]], 1.0, 1.0);

    let v1 = vec2.subtract(vec2.create(), r, vec2.fromValues(-20.0,20.0));
    let v2 = vec2.subtract(vec2.create(), r, vec2.fromValues(15.0,10.0));
    let n = line1.n;
    let v3 = reflect(v1, n);
    vec2.normalize(v3, v3);
    vec2.scale(v3, v3, vec2.length(v2));

    let line3 = new Line(engine, r, vec2.add(vec2.create(), r, v3));

    engine.scene.add_renderable(line1);
    engine.scene.add_renderable(line2);
    engine.scene.add_renderable(line3);
    engine.scene.add_renderable(square1);

    engine.load_resources_and_start();
}

// let line4 = new Line(engine, vec2.fromValues(0.0, 3.0), vec2.fromValues(-2.0, -1.0));
// console.log("--- Line 4 ---");
// line4.print();

// let line5 = new Line(engine, vec2.fromValues(0.0, 8.0), vec2.fromValues(4.0, 0.0));
// console.log("--- Line 5 ---");
// line5.print();

// let r = line4.intersection(line5);

// let square1 = new ColoredSquare(engine, [-10.0, -10.0], 1.0, 1.0);
// let square2 = new ColoredSquare(engine, [30.0, 0.0], 7.0, 15.0);
// square2.color = [0.0, 1.0, 0.0, 1.0]; // green
// let square3 = new ColoredSquare(engine, [0.0, 0.0], 3.0, 3.0);
// square3.color = [0.0, 0.0, 1.0, 1.0]; // blue

// engine.scene.add_renderable(square1);
// engine.scene.add_renderable(square2);
// engine.scene.add_renderable(square3);

"use strict";

import MnEngine from './engine/engine';
import Camera from './engine/camera/orthographic';
import ColoredSquare from './model/colored_square';

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

    engine.scene = new MyScene(engine);

    engine.load_resources_and_start();
}

class MyScene {
    constructor(engine) {
        this.square = new ColoredSquare(engine, [0.0, 0.0], 60.0, 60.0);
    }

    load_resources() {  this.square.load_resources(); }

    initialize() { this.square.initialize(); }
    
    update() { }

    before_draw(gl) {
        gl.disable(gl.DEPTH_TEST);
    }

    draw(gl) {
        let count = 1;
        let s = 0.9;
        let k = Math.sqrt(2 * s * s - 2 * s + 1);
        let delta_angle = Math.atan(1 / s - 1) * 180 / Math.PI;
        
        while(this.square.width > 1) {
            if(count % 2 === 0) {
                this.square.color = [0.1, 0.1, 0.1, 1.0]; // black
            } else {
                this.square.color = [0.9, 0.9, 0.9, 1.0]; // white
            }
            count += 1;

            this.square.draw(gl);
            
            this.square.width *= k;
            this.square.height *= k;
            this.square.angle += delta_angle;
        }
    }
}

/*
    let square1 = new ColoredSquare(engine, [-10.0, -10.0], 1.0, 1.0);
    let square2 = new ColoredSquare(engine, [30.0, 0.0], 7.0, 15.0);
    square2.color = [0.0, 1.0, 0.0, 1.0]; // green
    let square3 = new ColoredSquare(engine, [0.0, 0.0], 3.0, 3.0);
    square3.color = [0.0, 0.0, 1.0, 1.0]; // blue

    engine.scene.add_renderable(square1);
    engine.scene.add_renderable(square2);
    engine.scene.add_renderable(square3);
*/
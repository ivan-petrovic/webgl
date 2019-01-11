"use strict";

import MnEngine from './engine/engine';
import Camera from './engine/camera/orthographic';
import Line from './model/line';
import LineSet from './model/line_set';
import DefaultScene from './engine/scene';

export function main() {
    let engine = new MnEngine();
    let camera = new Camera(
        vec3.fromValues(0.0, 0.0, 10.0), // position
        vec3.fromValues(0.0, 0.0, 0.0),  // lookAt
        80.0,                            // width 80 x 60, because aspect ratio is 4:3
        [0, 0, 640, 480]                 // viewportArray
    );
    engine.camera = camera;
    engine.animation_loop = false;

    engine.scene = new DefaultScene(engine);

    let line0 = new Line(engine, vec2.fromValues(-35.0,-25.0), vec2.fromValues(35.0,-25.0));
    let line1 = new Line(engine, vec2.fromValues(35.0,-25.0), vec2.fromValues(35.0,25.0));
    let line2 = new Line(engine, vec2.fromValues(35.0,25.0), vec2.fromValues(-35.0,25.0));
    let line3 = new Line(engine, vec2.fromValues(-35.0,25.0), vec2.fromValues(-35.0,-25.0));
    
    line0.show_normal = false; 
    line1.show_normal = false; 
    line2.show_normal = false; 
    line3.show_normal = false; 

    let line_set = new LineSet(engine);
    
    line_set.add_line(line0);
    line_set.add_line(line1);
    line_set.add_line(line2);
    line_set.add_line(line3);

    let t = 0.05;
    let i = 0;
    let start_point = line_set.lines[0].p;

    while(true) {
        // console.log("i: " + i);
        let crosses_with = line_set.lines[i + 1].at(t);

        let new_line = new Line(engine, start_point, crosses_with);
        new_line.show_normal = false;
        
        // console.log("start_point: " + vec2.str(start_point));
        // console.log("crosses_with: " + vec2.str(crosses_with));
        // console.log("Nova linija duzina: " + new_line.length);

        line_set.add_line(new_line);

        if(new_line.length < 1.0) break;

        start_point = crosses_with;
        i += 1;
    }

    console.log("Ukupno linija: " + line_set.lines.length);

    engine.scene.add_renderable(line_set);

    engine.load_resources_and_start();
}

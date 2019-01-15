"use strict";

import Line from '../model/line';
import LineSet from '../model/line_set';

import IScene from '../engine/scene';

export default class extends IScene {

    constructor(engine) {
        super();

        this.engine = engine;
        this.line_set = new LineSet(engine);

        let line0 = new Line(this.engine, vec2.fromValues(-35.0,-25.0), vec2.fromValues(35.0,-25.0));
        let line1 = new Line(this.engine, vec2.fromValues(35.0,-25.0), vec2.fromValues(35.0,25.0));
        let line2 = new Line(this.engine, vec2.fromValues(35.0,25.0), vec2.fromValues(-35.0,25.0));
        let line3 = new Line(this.engine, vec2.fromValues(-35.0,25.0), vec2.fromValues(-35.0,-25.0));

        line0.show_normal = false; 
        line1.show_normal = false; 
        line2.show_normal = false; 
        line3.show_normal = false; 
            
        this.line_set.add_line(line0);
        this.line_set.add_line(line1);
        this.line_set.add_line(line2);
        this.line_set.add_line(line3);

        this.t = 0.05;
        // this.make_lines(this.t);
    }

    make_lines(t) {
        let i = 0;
        let start_point = this.line_set.lines[0].p;
        this.line_set.valid_lines_count = 4;
        
        while(true) {
            let crosses_with = this.line_set.lines[i + 1].at(t);
            let curr_line_num = i + 4;
    
            if(this.line_set.lines_count > curr_line_num) {
                this.line_set.lines[curr_line_num].change(start_point, crosses_with);
                this.line_set.lines[curr_line_num].update_buffer();
                this.line_set.valid_lines_count += 1;

                if(this.line_set.lines[curr_line_num].length < 1.0) break;
            } else {
                let new_line = new Line(this.engine, start_point, crosses_with);
                new_line.show_normal = false;
                new_line.insert_in_buffer();
    
                this.line_set.add_line(new_line);
                this.line_set.valid_lines_count += 1;

                if(new_line.length < 1.0) break;
            }
            // let new_line = new Line(this.engine, start_point, crosses_with);
            // new_line.show_normal = false;
            
            // this.line_set.add_line(new_line);
    
            start_point = crosses_with;
            i += 1;
        }
    
        console.log("t: " + t);
        console.log("Ukupno linija: " + this.line_set.lines.length);
        console.log("Lines count: " + this.line_set.lines_count);
        console.log("Lines valid count: " + this.line_set.valid_lines_count);
    }

    load_resources() {
        this.line_set.load_resources();
    }

    initialize() {
        this.line_set.lines[0].insert_in_buffer();
        this.line_set.lines[1].insert_in_buffer();
        this.line_set.lines[2].insert_in_buffer();
        this.line_set.lines[3].insert_in_buffer();
        this.make_lines(this.t);
        this.line_set.initialize();
    }

    update(input) {
        let t_changed = false;

        if (input.isKeyClicked(input.Keys.Right)) {
            this.t += 0.01; // increase t
            t_changed = true;
        }
        if (input.isKeyClicked(input.Keys.Left)) {
            this.t -= 0.01; // decrease t
            t_changed = true;
        }

        if (input.isKeyClicked(input.Keys.Up)) {
            this.t += 0.1; // increase t
            t_changed = true;
        }
        if (input.isKeyClicked(input.Keys.Down)) {
            this.t -= 0.1; // decrease t
            t_changed = true;
        }

        if(t_changed) {
            if(this.t > 0.98) this.t = 0.98;
            if(this.t < 0.02) this.t = 0.02;
            this.make_lines(this.t);
        }

        // if (input.isKeyPressed(input.Keys.Right)) {
        //     this.t /= 0.975; // increase t
        //     t_changed = true;
        // }
        // if (input.isKeyPressed(input.Keys.Left)) {
        //     this.t *= 0.975; // decrease t
        //     t_changed = true;
        // }
        // console.log("this.t: " + this.t);
    }

    draw(gl) {
        this.line_set.draw(gl);
    }

    // before_draw(gl) {
    //     gl.clearColor(0.0, 0.0, 0.0, 1.0);
    //     gl.clear(gl.COLOR_BUFFER_BIT);
    // }
}

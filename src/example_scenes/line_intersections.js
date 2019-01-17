"use strict";

import Line from '../model/line';
// import LineSet from '../model/line_set';
import reflect from '../engine/utils/reflection';

import IScene from '../engine/scene';

export default class extends IScene {

    constructor(engine) {
        super();
        this.engine = engine;

        this.line = new Line(engine, vec2.fromValues(-35.0, 0.0), vec2.fromValues(35.0,-25.0));
        this.line.show_normal = false;
        this.line.color = [0.0, 0.0, 1.0, 1.0];

        // this.line_set = new LineSet(engine);
        // some static lines in scene
        let line1 = new Line(engine, vec2.fromValues(15.0, 0.0), vec2.fromValues(0.0,-15.0));
        let line2 = new Line(engine, vec2.fromValues(25.0, 0.0), vec2.fromValues(0.0,-25.0));
        let line3 = new Line(engine, vec2.fromValues(15.0, 5.0), vec2.fromValues(-15.0,5.0));

        line1.show_normal = false;
        line2.show_normal = false;
        line3.show_normal = false;

        this.line_set = [];
        this.line_set.push(line1);
        this.line_set.push(line2);
        this.line_set.push(line3);

        // this.line1 = new Line(engine, vec2.fromValues(15.0, 0.0), vec2.fromValues(0.0,-15.0));
        // this.line2 = new Line(engine, vec2.fromValues(25.0, 0.0), vec2.fromValues(0.0,-25.0));
        // this.line3 = new Line(engine, vec2.fromValues(15.0, 5.0), vec2.fromValues(-15.0,5.0));
    }

    load_resources() {
        this.line.load_resources();
        for(let i = 0; i < this.line_set.length; i += 1) {
            this.line_set[i].load_resources();
        }
        // this.line_set.load_resources();
    }

    initialize() {
        this.line.initialize();

        for(let i = 0; i < this.line_set.length; i += 1) {
            this.line_set[i].initialize();
        }

        // this.line_set.lines[0].insert_in_buffer();
        // this.line_set.lines[1].insert_in_buffer();
        // this.line_set.lines[2].insert_in_buffer();

        // this.line1.initialize();
        // this.line2.initialize();
        // this.line3.initialize();
        // this.line_set.initialize();
    }

    update(input) {
        // let changed = false;

        // if (input.isKeyClicked(input.Keys.Right)) {
        //     this.line.q[0] += 1.0;
        //     changed = true;
        // }
        // if (input.isKeyClicked(input.Keys.Left)) {
        //     this.line.q[0] -= 1.0;
        //     changed = true;
        // }

        // if (input.isKeyClicked(input.Keys.Up)) {
        //     this.line.q[1] += 1.0;
        //     changed = true;
        // }
        // if (input.isKeyClicked(input.Keys.Down)) {
        //     this.line.q[1] -= 1.0;
        //     changed = true;
        // }

        // if(changed) {
        //     // if(this.t > 0.98) this.t = 0.98;
        //     this.line.update_buffer();
        // }

        // if (input.isKeyPressed(input.Keys.Right)) {
        //     this.t /= 0.975; // increase t
        //     t_changed = true;
        // }

        this.line.change(this.line.p, input.get_pos(40, 30));
        this.line.update_buffer();
        // console.log(vec2.str(this.line.q));

        this.check_intersection();
    }

    check_intersection() {
        let r = this.line.intersection(this.line_set[0]);
    
        let v1 = vec2.subtract(vec2.create(), r, this.line.p);
        let v2 = vec2.subtract(vec2.create(), r, this.line.q);
        let n = this.line_set[0].n;
        let v3 = reflect(v1, n);
        vec2.normalize(v3, v3);
        vec2.scale(v3, v3, vec2.length(v2));
    
        let new_line = new Line(this.engine, r, vec2.add(vec2.create(), r, v3));
        new_line.show_normal = false;
        new_line.initialize();
        this.line_set.push(new_line);

        // this.line.change(this.line.p, input.get_pos(40, 30));
        // this.line.update_buffer();
    
    }

    draw(gl) {
        // this.line_set.draw(gl);
        for(let i = 0; i < this.line_set.length; i += 1) {
            this.line_set[i].draw(gl);
        }

        this.line.draw(gl);
        // this.line1.draw(gl);
        // this.line2.draw(gl);
        // this.line3.draw(gl);
    }

    // before_draw(gl) {
    //     gl.clearColor(0.0, 0.0, 0.0, 1.0);
    //     gl.clear(gl.COLOR_BUFFER_BIT);
    // }
}

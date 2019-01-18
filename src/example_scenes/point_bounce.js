"use strict";

import IScene from '../engine/scene';
import reflect from '../engine/utils/reflection';
import Line from '../model/line';
import ColoredSquare from '../model/colored_square';

export default class extends IScene {

    constructor(engine) {
        super();
        this.engine = engine;

        // player ball
        this.ball = new ColoredSquare(engine, [-30.0, -10.0], 0.5, 0.5);
        this.ball.color = [0.0, 0.0, 1.0, 1.0]; // blue
        this.velocity = vec2.fromValues(0.5, 0.0);
        this.speed = 0.5;
        this.line = new Line(engine, vec2.fromValues(-35.0, 0.0), vec2.fromValues(35.0,-25.0));

        this.line_set = [];

        // some static lines in scene
        let line0 = new Line(this.engine, vec2.fromValues(-35.0,-25.0), vec2.fromValues(35.0,-25.0));
        let line1 = new Line(this.engine, vec2.fromValues(35.0,-25.0), vec2.fromValues(35.0,25.0));
        let line2 = new Line(this.engine, vec2.fromValues(35.0,25.0), vec2.fromValues(-35.0,25.0));
        let line3 = new Line(this.engine, vec2.fromValues(-35.0,25.0), vec2.fromValues(-35.0,-25.0));

        line0.show_normal = false; 
        line1.show_normal = false; 
        line2.show_normal = false; 
        line3.show_normal = false; 
            
        this.line_set.push(line0);
        this.line_set.push(line1);
        this.line_set.push(line2);
        this.line_set.push(line3);

        for(let i = 0; i < 5; i += 1) {
            let x1 = Math.floor(Math.random() * 80) - 40;
            let y1 = Math.floor(Math.random() * 60) - 30;
            let x2 = Math.floor(Math.random() * 80) - 40;
            let y2 = Math.floor(Math.random() * 60) - 30;

            let line = new Line(engine, vec2.fromValues(x1, y1), vec2.fromValues(x2, y2));
            line.show_normal = false;
            this.line_set.push(line);
        }

        this.intersection = false;

        this.reflected_lines_set = [];
        this.valid_cnt = 0;
        this.last_checked_line = null;
    }

    load_resources() {
        this.ball.load_resources();

        for(let i = 0; i < this.line_set.length; i += 1) {
            this.line_set[i].load_resources();
        }
    }

    initialize() {
        this.ball.initialize();

        for(let i = 0; i < this.line_set.length; i += 1) {
            this.line_set[i].initialize();
        }
    }

    update(input) {
        let curr_position = vec2.fromValues(this.ball.position[0], this.ball.position[1]);
        let new_position = vec2.create();
        vec2.add(new_position, curr_position, this.velocity);

        this.line.change(curr_position, new_position);

        this.last_checked_line = null;
        this.valid_cnt = 0;
        this.intersection = false;
        
        let reflected_segment = this.check_intersection(this.line);
        while(reflected_segment !== null) {
            reflected_segment = this.check_intersection(reflected_segment);
        }

        if(this.intersection) {
            this.ball.position[0] = this.reflected_lines_set[this.valid_cnt - 1].q[0];
            this.ball.position[1] = this.reflected_lines_set[this.valid_cnt - 1].q[1];

            vec2.normalize(this.velocity, this.reflected_lines_set[this.valid_cnt - 1].v);
            vec2.scale(this.velocity, this.velocity, this.speed);
        } else {
            this.ball.position[0] = new_position[0];
            this.ball.position[1] = new_position[1];
        }
    }

    check_intersection(line) {
        let r;
        let r1;
        let chosen_line = null;
        let chosen_point = null;
        let second_part = null;
        let min_distance = 1000000.0;
        let found_intersection = false;
        
        for(let i = 0; i < this.line_set.length; i += 1) {
            let curr_line = this.line_set[i];

            if(curr_line === this.last_checked_line) {
                continue;
            }

            r = line.intersection(curr_line);
            r1 = curr_line.intersection(line);
    
            if(r === false || r1 === false) {
                continue;
            }

            found_intersection = true;
            let distance = vec2.distance(r, line.p);
            if(distance < min_distance) {
                chosen_line = curr_line;
                chosen_point = r;
                min_distance = distance;
            }
        }

        if(found_intersection) {
            this.intersection = true;
            this.last_checked_line = chosen_line;

            let v1 = vec2.subtract(vec2.create(), chosen_point, line.p);
            let v2 = vec2.subtract(vec2.create(), chosen_point, line.q);
            let n = chosen_line.n;
            let v3 = reflect(v1, n);
            vec2.normalize(v3, v3);
            vec2.scale(v3, v3, vec2.length(v2));

            second_part = new Line(this.engine, chosen_point, vec2.add(vec2.create(), chosen_point, v3));

            this.add_to_reflected_lines_set(line.p, chosen_point);
        } else {
            this.last_checked_line = null;
            this.add_to_reflected_lines_set(line.p, line.q);
        }

        return second_part;
    }

    add_to_reflected_lines_set(start_point, end_point) {
        if(this.reflected_lines_set.length > this.valid_cnt) {
            this.reflected_lines_set[this.valid_cnt].change(start_point, end_point);
            this.reflected_lines_set[this.valid_cnt].update_buffer();
            this.valid_cnt += 1;
        } else {
            let new_line = new Line(this.engine, start_point, end_point);
            new_line.show_normal = false;
            new_line.color = [0.0, 0.0, 1.0, 1.0];
            new_line.initialize();

            this.reflected_lines_set.push(new_line);
            this.valid_cnt += 1;
        }
    }

    draw(gl) {
        for(let i = 0; i < this.line_set.length; i += 1) {
            this.line_set[i].draw(gl);
        }
        
        this.ball.draw(gl);
    }
}

"use strict";

import Renderable from '../engine/renderable';

export default class LineSet extends Renderable {
    constructor(engine) {
        super(engine, 'basic_vs.glsl', 'basic_fs.glsl');

        this.lines = [];
    }

    add_line(line) {
        this.lines.push(line);
    }

    load_resources() {
        for (let line of this.lines) {
            line.load_resources();
        }
    }

    initialize() {
        for (let line of this.lines) {
            line.initialize();
        }
    }

    update(input) {
        for (let line of this.lines) {
            line.update(input);
        }
    }

    draw(gl) {
        for (let line of this.lines) {
            line.draw(gl);
        }
    }
}
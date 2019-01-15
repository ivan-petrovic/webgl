"use strict";

import Renderable from '../engine/renderable';

export default class LineSet extends Renderable {
    constructor(engine) {
        super(engine, 'basic_vs.glsl', 'basic_fs.glsl');
        this.vertex_buffer_id = null;

        this.lines = [];
        this.lines_count = 0;
        this.valid_lines_count = 0;
    }

    add_line(line) {
        this.lines.push(line);
        this.lines_count += 1;
    }

    load_resources() {
        for (let line of this.lines) {
            line.load_resources();
        }
    }

    initialize() {
        super.initialize();
        this.vertex_buffer_id = this.engine.vbos_library.get_vbo_id('VBO_POSITION');
        
        // for (let line of this.lines) {
        //     line.initialize();
        // }
    }

    update(input) {
        for (let line of this.lines) {
            line.update(input);
        }
    }

    draw(gl) {
        // for (let line of this.lines) {
        //     line.draw(gl);
        // }

        let pvmMatrix = this.engine.camera.getPVMatrix();

        this.shader.activate(gl);

        // Activates the vertex buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertex_buffer_id);

        // Describe the characteristic of the vertex position attribute
        gl.vertexAttribPointer(this.shader.attributes.position,
            3,              // each element is a 3-float (x,y,z)
            gl.FLOAT,       // data type is FLOAT
            false,          // if the content is normalized vectors
            0,              // number of bytes to skip in between elements
            0);             // offsets to the first element
        gl.enableVertexAttribArray(this.shader.attributes.position);

        gl.uniformMatrix4fv(this.shader.uniforms.PVM_transform, false, pvmMatrix);
        gl.uniform4fv(this.shader.uniforms.pixel_color, [1.0, 0.0, 0.0, 1.0]);
        gl.drawArrays(gl.LINES, this.lines[0].offset / 12, this.valid_lines_count * 2);
    }
}
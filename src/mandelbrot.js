"use strict";

import Renderable from './engine/renderable';

export default class Mandelbrot extends Renderable {
    constructor(engine) {
        super(engine, 'fractal_vs.glsl', 'fractal_fs.glsl');

        this.vertix_buffer_id = null;

        this.canvasSize = [engine.canvas_width, engine.canvas_height];
        this.offset = [-0.5, 0];
        this.scale = 1.0;
    }

    initialize() {
        super.initialize();

        this.vertix_buffer_id = this.engine.retrieve_vbo('WHOLE_CANVAS');
    }

    update(input) {
        // Pan left, right, up and down
        if (input.isKeyPressed(input.Keys.Right)) {
            this.offset[0] += this.scale / 25;
        }
        if (input.isKeyPressed(input.Keys.Left)) {
            this.offset[0] -= this.scale / 25;
        }
        if (input.isKeyPressed(input.Keys.Up)) {
            this.offset[1] += this.scale / 25;
        }
        if (input.isKeyPressed(input.Keys.Down)) {
            this.offset[1] -= this.scale / 25;
        }
        
        // Zoom in and out
        if (input.isKeyPressed(input.Keys.Z)) {
            this.scale *= 0.975; // zoomin
        }
        if (input.isKeyPressed(input.Keys.X)) {
            this.scale /= 0.975; // zoomout
        }
    }

    draw(gl) {
        this.shader.activate(gl);

        // Activates the vertex buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertix_buffer_id);

        // Describe the characteristic of the vertex position attribute
        gl.vertexAttribPointer(this.shader.attributes.position,
            3,              // each element is a 3-float (x,y,z)
            gl.FLOAT,       // data type is FLOAT
            false,          // if the content is normalized vectors
            0,              // number of bytes to skip in between elements
            0);             // offsets to the first element

        gl.enableVertexAttribArray(this.shader.attributes.position);

        gl.uniform2f(this.shader.uniforms.canvas_size, this.canvasSize[0], this.canvasSize[1]);
        gl.uniform2f(this.shader.uniforms.offset, this.offset[0], this.offset[1]);
        gl.uniform1f(this.shader.uniforms.scale, this.scale);

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
}

"use strict";

import Renderable from './engine/renderable';

export default class LightSaber extends Renderable {
    constructor(engine, p1x, p1y, p2x, p2y) {
        super(engine, 'fractal_vs.glsl', 'lightsaber_fs.glsl');

        // End points of light saber
        this.p1x = p1x;
        this.p1y = p1y;
        this.p2x = p2x;
        this.p2y = p2y;

        this.vertex_buffer_id = null;

        // Variables used for animation (update function)
        this.time = 0.0;
        this.min_distance = 10.0;
        this.amplitude = 50.0;
        this.distance = this.min_distance + this.amplitude;
    }

    initialize() {
        super.initialize();

        this.vertex_buffer_id = this.engine.retrieve_vbo('WHOLE_CANVAS');        
    }

    update(input) {
        // Triangle wave with period 2 and amplitude from 0 to 1
        this.time += 0.005;
        let wave = 2 * Math.abs(Math.round(0.5 * this.time) - 0.5 * this.time);
        this.distance = this.min_distance + this.amplitude * wave;

        // if (this.input.isKeyPressed(this.input.Keys.Right)) {
        //     console.log('Pressed right');
        // }
        // if (this.input.isKeyClicked(this.input.Keys.Left)) {
        //     console.log('Clicked left');
        // }
    }

    draw(gl) {
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
        gl.uniform1f(this.shader.uniforms.distance, this.distance);
        gl.uniform4fv(this.shader.uniforms.end_points, [this.p1x,this.p1y,this.p2x,this.p2y]);

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
}
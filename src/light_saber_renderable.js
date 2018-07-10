"use strict";

import Renderable from './renderable';
import SaberShader from './light_saber_shader';
import VertexBuffer from './buffer';

export default class extends Renderable {
    constructor(engine, vertexShader, fragmentShader) {
        super(engine, vertexShader, fragmentShader);
        
        // Variables used for animation (update function)
        this.time = 0.0;
        this.distance = 0.0;
    }

    initialize() {
        this.shader = new SaberShader(this.vertexShader, this.fragmentShader);
        this.shader.initialize(this.engine.getResources(), this.engine.getWebGLContext());

        let verticesOfSquare = [
            1.0, 1.0, 0.0,
            -1.0, 1.0, 0.0,
            1.0, -1.0, 0.0,
            -1.0, -1.0, 0.0
        ];
        this.vertexBuffer = new VertexBuffer(verticesOfSquare);
        this.vertexBuffer.initialize(this.engine.getWebGLContext());
    }

    update() {
        let MIN_DISTANCE = 10.0;
        let AMPLITUDE = 50.0;

        // Triangle wave with period 2 and amplitude from 0 to 1
        this.time += 0.005;
        let wave = 2 * Math.abs(Math.round(0.5 * this.time) - 0.5 * this.time);
        this.distance = MIN_DISTANCE + AMPLITUDE * wave;
    }

    draw(gl) {
        // Activates the vertex buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer.getId());

        // Describe the characteristic of the vertex position attribute
        gl.vertexAttribPointer(this.shader.getPositionLocation(),
            3,              // each element is a 3-float (x,y,z)
            gl.FLOAT,       // data type is FLOAT
            false,          // if the content is normalized vectors
            0,              // number of bytes to skip in between elements
            0);             // offsets to the first element

        gl.enableVertexAttribArray(this.shader.getPositionLocation());
        gl.uniform1f(this.shader.getDistanceLocation(), this.distance);
        // gl.uniform4fv(this.shader.getViewportLocation(), new Float32Array([320.0,240.0,320.0,240.0]));
        gl.uniform4fv(this.shader.getViewportLocation(), [0.0,0.0,640.0,480.0]);
        // this.shader.activate();

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
}
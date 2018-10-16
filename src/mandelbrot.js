"use strict";

import Renderable from './engine/renderable';
import VertexBuffer from './engine/buffer';

// Next property is shared by all instances of class (static properties)
let _vertexBuffer = null;   // the vertex buffer for this object

export default class Mandelbrot extends Renderable {
    constructor(engine) {
        super(engine, 'fractal_vs.glsl', 'fractal_fs.glsl');

        this.canvasSize = [engine.canvas_width, engine.canvas_height];
        this.offset = [-0.5, 0];
        this.scale = 1.0;
    }

    static get vertexBuffer() { return _vertexBuffer; }
    static set vertexBuffer(value) { _vertexBuffer = value; }
    
    initialize() {
        super.initialize();

        if(Mandelbrot.vertexBuffer === null) {
            let verticesOfSquare = [
                1.0, 1.0, 0.0,
                -1.0, 1.0, 0.0,
                1.0, -1.0, 0.0,
                -1.0, -1.0, 0.0
            ];
            Mandelbrot.vertexBuffer = new VertexBuffer(verticesOfSquare);
            Mandelbrot.vertexBuffer.initialize(this.engine.webgl_context);
        }
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
        gl.bindBuffer(gl.ARRAY_BUFFER, Mandelbrot.vertexBuffer.getId());

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

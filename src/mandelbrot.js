"use strict";

import Renderable from './engine/renderable';
import VertexBuffer from './engine/buffer';
// import Shader from './engine/shader';

// Next two properties are shared by all instances of class (static properties)
// let _shader = null;         // the shader for shading this object
let _vertexBuffer = null;   // the vertex buffer for this object

export default class Mandelbrot extends Renderable {
    constructor(engine) {
        super(engine, 'shaders/simpleVS.glsl', 'shaders/mandelbrotFS.glsl');

        this.canvasSize = [engine.getCanvasWidth(), engine.getCanvasHeight()];
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
            Mandelbrot.vertexBuffer.initialize(this.engine.getWebGLContext());
        }
    }

    update() {
        let input = this.engine.getInput();

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
        this._shader_program.activate(gl);

        // Activates the vertex buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, Mandelbrot.vertexBuffer.getId());

        // Describe the characteristic of the vertex position attribute
        gl.vertexAttribPointer(this._shader_program.attributes.a_position,
            3,              // each element is a 3-float (x,y,z)
            gl.FLOAT,       // data type is FLOAT
            false,          // if the content is normalized vectors
            0,              // number of bytes to skip in between elements
            0);             // offsets to the first element

        gl.enableVertexAttribArray(this._shader_program.attributes.a_position);
        // console.log(this.canvasSize[0], this.canvasSize[1]);
        gl.uniform2f(this._shader_program.uniforms.uCanvasSize, this.canvasSize[0], this.canvasSize[1]);
        gl.uniform2f(this._shader_program.uniforms.uOffset, this.offset[0], this.offset[1]);
        gl.uniform1f(this._shader_program.uniforms.uScale, this.scale);

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
}

"use strict";

import Renderable from './engine/renderable';
import VertexBuffer from './engine/buffer';
import Shader from './engine/shader';

// Next two properties are shared by all instances of class (static properties)
let _shader = null;         // the shader for shading this object
let _vertexBuffer = null;   // the vertex buffer for this object

export default class Mandelbrot extends Renderable {
    constructor(engine) {
        super(engine);

        this.canvasSize = [engine.getCanvasWidth(), engine.getCanvasHeight()];
        this.offset = [-0.5, 0];
        this.scale = 1.0;
    }

    static get vertexShaderName() { return 'shaders/simpleVS.glsl'; }
    static get fragmentShaderName() { return 'shaders/mandelbrotFS.glsl'; }
    static get shader() { return _shader; }
    static set shader(value) { _shader = value; }
    static get vertexBuffer() { return _vertexBuffer; }
    static set vertexBuffer(value) { _vertexBuffer = value; }
    
    loadResources() {
        Mandelbrot.shader = null;
        Mandelbrot.vertexBuffer = null;

        // Load necessery shader files asynchroniously
        let textFileLoader = this.engine.getTextFileLoader();
        textFileLoader.loadTextFile(Mandelbrot.vertexShaderName, textFileLoader.eTextFileType.eTextFile);
        textFileLoader.loadTextFile(Mandelbrot.fragmentShaderName, textFileLoader.eTextFileType.eTextFile);
    }

    initialize() {
        if(Mandelbrot.shader === null) {
            Mandelbrot.shader = new MandelbrotShader(Mandelbrot.vertexShaderName, Mandelbrot.fragmentShaderName);
            Mandelbrot.shader.initialize(this.engine.getResources(), this.engine.getWebGLContext());
        }

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
        // Activates the vertex buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, Mandelbrot.vertexBuffer.getId());

        // Describe the characteristic of the vertex position attribute
        gl.vertexAttribPointer(Mandelbrot.shader.getPositionLocation(),
            3,              // each element is a 3-float (x,y,z)
            gl.FLOAT,       // data type is FLOAT
            false,          // if the content is normalized vectors
            0,              // number of bytes to skip in between elements
            0);             // offsets to the first element

        gl.enableVertexAttribArray(Mandelbrot.shader.getPositionLocation());
        // console.log(this.canvasSize[0], this.canvasSize[1]);
        gl.uniform2f(Mandelbrot.shader.canvasSizeUniform, this.canvasSize[0], this.canvasSize[1]);
        gl.uniform2f(Mandelbrot.shader.offsetUniform, this.offset[0], this.offset[1]);
        gl.uniform1f(Mandelbrot.shader.scaleUniform, this.scale);
        // Mandelbrot.shader.activate();

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
}

class MandelbrotShader extends Shader {
    constructor(vertexShaderId, fragmentShaderId) {
        super(vertexShaderId, fragmentShaderId);

        // Specific locations for this shader
        this.positionAttribute = null;
        this.canvasSizeUniform = null;
		this.offsetUniform = null;
		this.scaleUniform = null;
    }

    getLocations(gl) {
        this.positionAttribute = gl.getAttribLocation(this.program, "a_position");
        this.canvasSizeUniform = gl.getUniformLocation(this.program, 'uCanvasSize');
		this.offsetUniform = gl.getUniformLocation(this.program, 'uOffset');
		this.scaleUniform = gl.getUniformLocation(this.program, 'uScale');
    }

    getPositionLocation() { return this.positionAttribute; }
    getCanvasSizeUniformLocation() { return this.canvasSizeUniform; }
    getOffsetUniformLocation() { return this.offsetUniform; }
    getScaleUniformnLocation() { return this.scaleUniform; }
}

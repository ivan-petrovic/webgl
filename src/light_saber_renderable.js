"use strict";

import Renderable from './renderable';
import SaberShader from './light_saber_shader';
import VertexBuffer from './buffer';

// Next two properties are shared by all instances of class (static properties)
let _shader = null;         // the shader for shading this object
let _vertexBuffer = null;   // the vertex buffer for this object

export default class LightSaber extends Renderable {
    constructor(engine, p1x, p1y, p2x, p2y) {
        super(engine);

        // End points of saber
        this.p1x = p1x;
        this.p1y = p1y;
        this.p2x = p2x;
        this.p2y = p2y;

        // Variables used for animation (update function)
        this.time = 0.0;
        this.distance = 0.0;
    }

    static get vertexShaderName() { return 'shaders/simpleVS.glsl'; }
    static get fragmentShaderName() { return 'shaders/lightsaberFS.glsl'; }
    static get shader() { return _shader; }
    static set shader(value) { _shader = value; }
    static get vertexBuffer() { return _vertexBuffer; }
    static set vertexBuffer(value) { _vertexBuffer = value; }
    
    loadResources() {
        LightSaber.shader = null;
        LightSaber.vertexBuffer = null;

        // Load necessery shader files asynchroniously
        let textFileLoader = this.engine.text_file_loader;
        textFileLoader.loadTextFile(LightSaber.vertexShaderName, textFileLoader.eTextFileType.eTextFile);
        textFileLoader.loadTextFile(LightSaber.fragmentShaderName, textFileLoader.eTextFileType.eTextFile);
    }

    initialize() {
        if(LightSaber.shader === null) {
            LightSaber.shader = new SaberShader(LightSaber.vertexShaderName, LightSaber.fragmentShaderName);
            LightSaber.shader.initialize(this.engine.resources, this.engine.webgl_context);
        }

        if(LightSaber.vertexBuffer === null) {
            let verticesOfSquare = [
                1.0, 1.0, 0.0,
                -1.0, 1.0, 0.0,
                1.0, -1.0, 0.0,
                -1.0, -1.0, 0.0
            ];
            LightSaber.vertexBuffer = new VertexBuffer(verticesOfSquare);
            LightSaber.vertexBuffer.initialize(this.engine.webgl_context);
        }
    }

    update() {
        let MIN_DISTANCE = 10.0;
        let AMPLITUDE = 50.0;

        // Triangle wave with period 2 and amplitude from 0 to 1
        this.time += 0.005;
        let wave = 2 * Math.abs(Math.round(0.5 * this.time) - 0.5 * this.time);
        this.distance = MIN_DISTANCE + AMPLITUDE * wave;

        // if (this.input.isKeyPressed(this.input.Keys.Right)) {
        //     console.log('Pressed right');
        // }
        // if (this.input.isKeyClicked(this.input.Keys.Left)) {
        //     console.log('Clicked left');
        // }
    }

    draw(gl) {
        // Activates the vertex buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, LightSaber.vertexBuffer.id);

        // Describe the characteristic of the vertex position attribute
        gl.vertexAttribPointer(LightSaber.shader.getPositionLocation(),
            3,              // each element is a 3-float (x,y,z)
            gl.FLOAT,       // data type is FLOAT
            false,          // if the content is normalized vectors
            0,              // number of bytes to skip in between elements
            0);             // offsets to the first element

        gl.enableVertexAttribArray(LightSaber.shader.getPositionLocation());
        gl.uniform1f(LightSaber.shader.getDistanceLocation(), this.distance);
        gl.uniform4fv(LightSaber.shader.getPointsLocation(), [this.p1x,this.p1y,this.p2x,this.p2y]);
        // LightSaber.shader.activate();

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
}
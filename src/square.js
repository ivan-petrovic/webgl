"use strict";

import Renderable from './engine/renderable';
import VertexBuffer from './engine/buffer';

// Next property is shared by all instances of class (static property)
let _vertexBuffer = null;   // the vertex buffer for this object

export default class ColoredSquare extends Renderable {
    constructor(engine) {
        super(engine);

        this.color = [1.0, 1.0, 0.0, 1.0]; // default red color

        this._shader_program = null;         // the shader for shading this object
        // Specific locations for this shader
        this.positionLocation = null;
        this.PVMTransformLocation = null;
        this.colorLocation = null;
    }

    static get vertexShaderName() { return 'shaders/simpleVS.glsl'; }
    static get fragmentShaderName() { return 'shaders/simplecolorFS.glsl'; }
    static get vertexBuffer() { return _vertexBuffer; }
    static set vertexBuffer(value) { _vertexBuffer = value; }
    
    setColor(color) { this.color = color; }
    getColor() { return this.color; }
    
    loadResources() {
        // Load necessery shader files asynchroniously
        let textFileLoader = this.engine.text_file_loader;
        textFileLoader.loadTextFile(ColoredSquare.vertexShaderName, textFileLoader.eTextFileType.eTextFile);
        textFileLoader.loadTextFile(ColoredSquare.fragmentShaderName, textFileLoader.eTextFileType.eTextFile);
    }

    initialize() {
        let gl = this.engine.webgl_context;
        this._shader_program = this.engine.shaders_library.retrieveShader(ColoredSquare.vertexShaderName, ColoredSquare.fragmentShaderName);
        this.positionLocation = gl.getAttribLocation(this._shader_program.program_id, "a_position");
        this.colorLocation = gl.getUniformLocation(this._shader_program.program_id, "u_pixel_color");
        this.PVMTransformLocation = gl.getUniformLocation(this._shader_program.program_id, "u_PVM_transform");
        // console.log('this.positionLocation ' + this.positionLocation);

        if(ColoredSquare.vertexBuffer === null) {
            let verticesOfSquare = [
                0.5, 0.5, 0.0,
                -0.5, 0.5, 0.0,
                0.5, -0.5, 0.0,
                -0.5, -0.5, 0.0,
            ];
            ColoredSquare.vertexBuffer = new VertexBuffer(verticesOfSquare);
            ColoredSquare.vertexBuffer.initialize(gl);
        }
    }

    draw(gl) {
        let camera = this.engine.camera;
        let pvm_matrix = camera.getPVMatrix();

        this._shader_program.activate(gl);

        // Activates the vertex buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, ColoredSquare.vertexBuffer.getId());

        // Describe the characteristic of the vertex position attribute
        gl.vertexAttribPointer(this.positionLocation,
            3,              // each element is a 3-float (x,y,z)
            gl.FLOAT,       // data type is FLOAT
            false,          // if the content is normalized vectors
            0,              // number of bytes to skip in between elements
            0);             // offsets to the first element

        gl.enableVertexAttribArray(this.positionLocation);
        gl.uniform4fv(this.colorLocation, this.color);
        gl.uniformMatrix4fv(this.PVMTransformLocation, false, pvm_matrix);

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
}

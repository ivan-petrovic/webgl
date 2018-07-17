"use strict";

import Renderable from './renderable';
import ConstColorShader from './const_color_shader';
import VertexBuffer from './buffer';

// Next two properties are shared by all instances of class (static properties)
let _shader = null;         // the shader for shading this object
let _vertexBuffer = null;   // the vertex buffer for this object

export default class ColoredSquare extends Renderable {
    constructor(engine, centerX, centerY, width, height) {
        super(engine);

        // Center and width of square
        this.centerX = centerX;
        this.centerY = centerY;
        this.width = width;
        this.height = height;
        this.color = [1.0, 0.0, 0.0, 1.0]; // default red color
        // this.modelMatrix = mat4.create();
        // this.vertexBuffer = null;
    }

    static get vertexShaderName() { return 'shaders/basicVS.glsl'; }
    static get fragmentShaderName() { return 'shaders/basicFS.glsl'; }
    static get shader() { return _shader; }
    static set shader(value) { _shader = value; }
    static get vertexBuffer() { return _vertexBuffer; }
    static set vertexBuffer(value) { _vertexBuffer = value; }
    
    setColor(color) { this.color = color; }
    getColor() { return this.color; }

    loadResources() {
        // ColoredSquare.shader = null;
        // ColoredSquare.vertexBuffer = null;

        // Load necessery shader files asynchroniously
        let textFileLoader = this.engine.getTextFileLoader();
        textFileLoader.loadTextFile(ColoredSquare.vertexShaderName, textFileLoader.eTextFileType.eTextFile);
        textFileLoader.loadTextFile(ColoredSquare.fragmentShaderName, textFileLoader.eTextFileType.eTextFile);
    }

    initialize() {
        if(ColoredSquare.shader === null) {
            ColoredSquare.shader = new ConstColorShader(ColoredSquare.vertexShaderName, ColoredSquare.fragmentShaderName);
            ColoredSquare.shader.initialize(this.engine.getResources(), this.engine.getWebGLContext());
        }

        if(ColoredSquare.vertexBuffer === null) {
            let verticesOfSquare = [
                0.5, 0.5, 0.0,
                -0.5, 0.5, 0.0,
                0.5, -0.5, 0.0,
                -0.5, -0.5, 0.0
            ];
            ColoredSquare.vertexBuffer = new VertexBuffer(verticesOfSquare);
            ColoredSquare.vertexBuffer.initialize(this.engine.getWebGLContext());
        }
    }

    update() {
        let input = this.engine.getInput();

        if (input.isKeyClicked(input.Keys.Right)) {
            this.centerX += 1.0;
            // console.log('this.centerX: ', this.centerX);
        }
        if (input.isKeyClicked(input.Keys.Left)) {
            this.centerX -= 1.0;
            // console.log('this.centerX: ', this.centerX);
        }
    }

    draw(gl) {
        let camera = this.engine.getCamera();
        let pvmMatrix = mat4.create();
        let modelMatrix = mat4.create(); // Creates a blank identity matrix
        
        // modelMatrix = mat4.fromTranslation(this.modelMatrix, [this.centerX, this.centerY, 0.0]);
        
        // Step A: compute translation, for now z is always at 0.0
        mat4.translate(modelMatrix, modelMatrix, vec3.fromValues(this.centerX, this.centerY, 0.0));
        // Step B: concatenate with rotation.
        // mat4.rotateZ(matrix, matrix, this.getRotationInRad());
        // Step C: concatenate with scaling
        mat4.scale(modelMatrix, modelMatrix, vec3.fromValues(this.width, this.height, 1.0));

        mat4.multiply(pvmMatrix, camera.getPVMatrix(), modelMatrix);

        // Activates the vertex buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, ColoredSquare.vertexBuffer.getId());

        // Describe the characteristic of the vertex position attribute
        gl.vertexAttribPointer(ColoredSquare.shader.getPositionLocation(),
            3,              // each element is a 3-float (x,y,z)
            gl.FLOAT,       // data type is FLOAT
            false,          // if the content is normalized vectors
            0,              // number of bytes to skip in between elements
            0);             // offsets to the first element

        gl.enableVertexAttribArray(ColoredSquare.shader.getPositionLocation());
        gl.uniformMatrix4fv(ColoredSquare.shader.getPVMTransformLocation(), false, pvmMatrix);
        gl.uniform4fv(ColoredSquare.shader.getColorLocation(), this.color);
        // gl.uniform1f(ColoredSquare.shader.getDistanceLocation(), this.distance);
        // gl.uniform4fv(ColoredSquare.shader.getPointsLocation(), [this.p1x,this.p1y,this.p2x,this.p2y]);
        // ColoredSquare.shader.activate();

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
}

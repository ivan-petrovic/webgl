"use strict";

import Renderable from './engine/renderable';
import VertexBuffer from './engine/buffer';

// Next property is shared by all instances of class (static property)
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

        this.grid = null;
        this.row = 0;
        this.column = 0;

        this.movingRight = false;
        this.movingLeft = false;
        this.movingUp = false;
        this.movingDown = false;
        this.goalPosition = null;

        this._shader_program = null;         // the shader for shading this object
        // Specific locations for this shader
        this.positionLocation = null;
        this.PVMTransformLocation = null;
        this.colorLocation = null;
    }

    static get vertexShaderName() { return 'shaders/basicVS.glsl'; }
    static get fragmentShaderName() { return 'shaders/basicFS.glsl'; }
    static get vertexBuffer() { return _vertexBuffer; }
    static set vertexBuffer(value) { _vertexBuffer = value; }
    
    setColor(color) { this.color = color; }
    getColor() { return this.color; }
    
    setGrid(grid) { this.grid = grid; this.getPositionOnGrid(); }
    setPositionOnGrid(row, column) {
        this.row = row;
        this.column = column;
        this.getPositionOnGrid();
    }
    getPositionOnGrid() {
        let position = this.grid.getCellCenter(this.row, this.column);
        this.centerX = position[0];
        this.centerY = position[1];
    }

    loadResources() {
        // Load necessery shader files asynchroniously
        let textFileLoader = this.engine.getTextFileLoader();
        textFileLoader.loadTextFile(ColoredSquare.vertexShaderName, textFileLoader.eTextFileType.eTextFile);
        textFileLoader.loadTextFile(ColoredSquare.fragmentShaderName, textFileLoader.eTextFileType.eTextFile);
    }

    initialize() {
        let gl = this.engine.getWebGLContext();
        this._shader_program = this.engine.getShadersLibrary().retrieveShader(ColoredSquare.vertexShaderName, ColoredSquare.fragmentShaderName);
        // this.positionLocation = gl.getAttribLocation(this._shader_program.program_id, "a_position");
        // this.PVMTransformLocation = gl.getUniformLocation(this._shader_program.program_id, "u_PVM_transform");
        // this.colorLocation = gl.getUniformLocation(this._shader_program.program_id, "u_PixelColor");
        // console.log('this.positionLocation ' + this.positionLocation);
        // console.log('this.PVMTransformLocation ' + this.PVMTransformLocation);
        // console.log('this.colorLocation ' + this.colorLocation);
        // console.log("SHADER PROGRAM:");
        // console.log(this._shader_program);
        // console.log("ATTRIBUTES:");
        // console.log(this._shader_program.attributes);
        // console.log("UNIFORMS:");
        // console.log(this._shader_program.uniforms);

        if(ColoredSquare.vertexBuffer === null) {
            let verticesOfSquare = [
                0.5, 0.5, 0.0,
                -0.5, 0.5, 0.0,
                0.5, -0.5, 0.0,
                -0.5, -0.5, 0.0
            ];
            ColoredSquare.vertexBuffer = new VertexBuffer(verticesOfSquare);
            ColoredSquare.vertexBuffer.initialize(gl);
        }
    }

    isMoving() {
        return this.movingLeft || this.movingRight || this.movingUp || this.movingDown;
    }

    update() {
        let input = this.engine.getInput();
        let speed = 0.4;

        if (input.isKeyPressed(input.Keys.Right)) {
            if(!this.isMoving()) {
                this.movingRight = true;
                this.column = this.grid.getNextRight(this.row, this.column);
                // console.log('right' + this.column);
                this.goalPosition = this.grid.getCellCenter(this.row, this.column);
            }
        }

        if (input.isKeyPressed(input.Keys.Left)) {
            if(!this.isMoving()) {
                this.movingLeft = true;
                this.column = this.grid.getNextLeft(this.row, this.column);
                // console.log('left' + this.column);
                this.goalPosition = this.grid.getCellCenter(this.row, this.column);
            }
        }

        if (input.isKeyPressed(input.Keys.Up)) {
            if(!this.isMoving()) {
                this.movingUp = true;
                this.row = this.grid.getNextUp(this.row, this.column);
                // console.log('up' + this.row);
                this.goalPosition = this.grid.getCellCenter(this.row, this.column);
            }
        }

        if (input.isKeyPressed(input.Keys.Down)) {
            if(!this.isMoving()) {
                this.movingDown = true;
                this.row = this.grid.getNextDown(this.row, this.column);
                // console.log('down' + this.row);
                this.goalPosition = this.grid.getCellCenter(this.row, this.column);
            }
        }

        if(this.movingRight) {
            this.centerX += speed;
            if(this.centerX > this.goalPosition[0]) {
                this.centerX = this.goalPosition[0];
                this.movingRight = false;
            }
        }

        if(this.movingLeft) {
            this.centerX -= speed;
            if(this.centerX < this.goalPosition[0]) {
                this.centerX = this.goalPosition[0];
                this.movingLeft = false;
            }
        }

        if(this.movingUp) {
            this.centerY += speed;
            if(this.centerY > this.goalPosition[1]) {
                this.centerY = this.goalPosition[1];
                this.movingUp = false;
            }
        }

        if(this.movingDown) {
            this.centerY -= speed;
            if(this.centerY < this.goalPosition[1]) {
                this.centerY = this.goalPosition[1];
                this.movingDown = false;
            }
        }

        /*
        if (input.isKeyClicked(input.Keys.Right)) {
            this.column = this.grid.getNextRight(this.column);
        }
        if (input.isKeyClicked(input.Keys.Left)) {
            this.column = this.grid.getNextLeft(this.column);
        }
        if (input.isKeyClicked(input.Keys.Up)) {
            this.row = this.grid.getNextUp(this.row);
        }
        if (input.isKeyClicked(input.Keys.Down)) {
            this.row = this.grid.getNextDown(this.row);
        }
        this.getPositionOnGrid();
        */
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
        this.engine.getShadersLibrary().retrieveShader(ColoredSquare.vertexShaderName, ColoredSquare.fragmentShaderName).activate(gl);
        // ColoredSquare.shader.activate(gl);
        // Activates the vertex buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, ColoredSquare.vertexBuffer.getId());

        // Describe the characteristic of the vertex position attribute
        gl.vertexAttribPointer(this._shader_program.attributes.a_position, // this.positionLocation,
            3,              // each element is a 3-float (x,y,z)
            gl.FLOAT,       // data type is FLOAT
            false,          // if the content is normalized vectors
            0,              // number of bytes to skip in between elements
            0);             // offsets to the first element

        gl.enableVertexAttribArray(this._shader_program.attributes.a_position);
        gl.uniformMatrix4fv(this._shader_program.uniforms.u_PVM_transform, false, pvmMatrix);
        gl.uniform4fv(this._shader_program.uniforms.u_PixelColor, this.color);
        // gl.uniform1f(ColoredSquare.shader.getDistanceLocation(), this.distance);
        // gl.uniform4fv(ColoredSquare.shader.getPointsLocation(), [this.p1x,this.p1y,this.p2x,this.p2y]);
        // ColoredSquare.shader.activate();

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
}

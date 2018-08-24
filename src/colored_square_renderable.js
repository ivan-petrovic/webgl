"use strict";

import Renderable from './engine/renderable';
import ConstColorShader from './const_color_shader';
import VertexBuffer from './engine/buffer';

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

        this.grid = null;
        this.row = 0;
        this.column = 0;

        this.movingRight = false;
        this.movingLeft = false;
        this.movingUp = false;
        this.movingDown = false;
        this.goalPosition = null;
    }

    static get vertexShaderName() { return 'shaders/basicVS.glsl'; }
    static get fragmentShaderName() { return 'shaders/basicFS.glsl'; }
    static get shader() { return _shader; }
    static set shader(value) { _shader = value; }
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
        ColoredSquare.shader.activate(gl);
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

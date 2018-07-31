"use strict";

import Renderable from './engine/renderable';
import Shader from './engine/shader';

// Next two properties are shared by all instances of class (static properties)
let _shader = null;         // the shader for shading this object
let _vertexBuffer = null;   // the vertex buffer for this object

export default class TexturedSquare extends Renderable {
    constructor(engine, centerX, centerY, width, height, textureName) {
        super(engine);

        // Center and width of square
        this.centerX = centerX;
        this.centerY = centerY;
        this.width = width;
        this.height = height;
        this.color = [1.0, 0.0, 0.0, 0.0]; // default red color

        this.textureName = textureName;
        // these two instance variables are to cache texture information
        // for supporting per-pixel accurate collision
        this.mTextureInfo = null;
        this.mColorArray = null;
        // defined for subclass to override
        this.mTexWidth = 0;
        this.mTexHeight = 0;
        this.mTexLeftIndex = 0;
        this.mTexBottomIndex = 0;

        this.grid = null;
        this.row = 0;
        this.column = 0;

        this.movingRight = false;
        this.movingLeft = false;
        this.movingUp = false;
        this.movingDown = false;
        this.goalPosition = null;
    }

    static get vertexShaderName() { return 'shaders/textureVS.glsl'; }
    static get fragmentShaderName() { return 'shaders/textureFS.glsl'; }
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
    }
    getPositionOnGrid() {
        let position = this.grid.getCellCenter(this.row, this.column);
        this.centerX = position[0];
        this.centerY = position[1];
    }

    loadResources() {
        // Load necessery shader files asynchroniously
        let textFileLoader = this.engine.getTextFileLoader();
        let textureLoader = this.engine.getTextureLoader();

        textFileLoader.loadTextFile(TexturedSquare.vertexShaderName, textFileLoader.eTextFileType.eTextFile);
        textFileLoader.loadTextFile(TexturedSquare.fragmentShaderName, textFileLoader.eTextFileType.eTextFile);
        textureLoader.loadTexture(this.textureName);
    }

    initialize() {
        if(TexturedSquare.shader === null) {
            TexturedSquare.shader = new TextureShader(TexturedSquare.vertexShaderName, TexturedSquare.fragmentShaderName);
            TexturedSquare.shader.initialize(this.engine.getResources(), this.engine.getWebGLContext());
        }

        if(TexturedSquare.vertexBuffer === null) {
            let verticesOfSquare = [
                0.5, 0.5, 0.0,
                -0.5, 0.5, 0.0,
                0.5, -0.5, 0.0,
                -0.5, -0.5, 0.0
            ];
            var textureCoordinates = [
                1.0, 1.0,
                0.0, 1.0,
                1.0, 0.0,
                0.0, 0.0
            ];
            TexturedSquare.vertexBuffer = new VertexBuffer(verticesOfSquare, textureCoordinates);
            TexturedSquare.vertexBuffer.initialize(this.engine.getWebGLContext());
        }

        this.initTexture();     // texture for this object, cannot be a "null"
    }

    getTexture() { return this.texture; }
    initTexture() {
        // these two instance variables are to cache texture information
        // for supporting per-pixel accurate collision
        this.mTextureInfo = this.engine.getTextureLoader().getTextureInfo(this.textureName);
        this.mColorArray = null;
        // defined for subclass to override
        this.mTexWidth = this.mTextureInfo.mWidth;
        this.mTexHeight = this.mTextureInfo.mHeight;
        // console.log(this.mTexWidth, this.mTexHeight);
        this.mTexLeftIndex = 0;
        this.mTexBottomIndex = 0;
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
                this.column = this.grid.getNextRight(this.column);
                this.goalPosition = this.grid.getCellCenter(this.row, this.column);
            }
        }

        if (input.isKeyPressed(input.Keys.Left)) {
            if(!this.isMoving()) {
                this.movingLeft = true;
                this.column = this.grid.getNextLeft(this.column);
                this.goalPosition = this.grid.getCellCenter(this.row, this.column);
            }
        }

        if (input.isKeyPressed(input.Keys.Up)) {
            if(!this.isMoving()) {
                this.movingUp = true;
                this.row = this.grid.getNextUp(this.row);
                this.goalPosition = this.grid.getCellCenter(this.row, this.column);
            }
        }

        if (input.isKeyPressed(input.Keys.Down)) {
            if(!this.isMoving()) {
                this.movingDown = true;
                this.row = this.grid.getNextDown(this.row);
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
        TexturedSquare.shader.activate(gl);
        
        this.engine.getTextureLoader().activateTexture(this.textureName);
        
        // Activates the vertex buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, TexturedSquare.vertexBuffer.getVertexBufferId());

        // Describe the characteristic of the vertex position attribute
        gl.vertexAttribPointer(TexturedSquare.shader.positionLocation,
            3,              // each element is a 3-float (x,y,z)
            gl.FLOAT,       // data type is FLOAT
            false,          // if the content is normalized vectors
            0,              // number of bytes to skip in between elements
            0);             // offsets to the first element

        gl.enableVertexAttribArray(TexturedSquare.shader.positionLocation);

        gl.bindBuffer(gl.ARRAY_BUFFER, TexturedSquare.vertexBuffer.getTextureCoordinatesBufferId());
        gl.enableVertexAttribArray(TexturedSquare.shader.textureCoordLocation);
        gl.vertexAttribPointer(TexturedSquare.shader.textureCoordLocation, 2, gl.FLOAT, false, 0, 0);

        gl.uniformMatrix4fv(TexturedSquare.shader.PVMTransformLocation, false, pvmMatrix);
        gl.uniform4fv(TexturedSquare.shader.colorLocation, this.color);
        gl.uniform1i(TexturedSquare.shader.samplerLocation, 0);
        // TexturedSquare.shader.activate();

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
}

class TextureShader extends Shader {
    constructor(vertexShaderId, fragmentShaderId) {
        super(vertexShaderId, fragmentShaderId);

        // Specific locations for this shader
        this.positionLocation = null;
        this.PVMTransformLocation = null;
        this.colorLocation = null;
    }

    getLocations(gl) {
        this.positionLocation = gl.getAttribLocation(this.program, "aVertexPosition");
        this.textureCoordLocation = gl.getAttribLocation(this.program, "aTextureCoordinate");
        this.PVMTransformLocation = gl.getUniformLocation(this.program, "uPVMTransform");
        this.colorLocation = gl.getUniformLocation(this.program, "uPixelColor");
        this.samplerLocation = gl.getUniformLocation(this.program, "uSampler");
    }
}

class VertexBuffer {
    constructor(aVertices, aTextureCoordinates) {
        this.vertices = aVertices;   // vertices of the object
        this.textureCoordinates = aTextureCoordinates;   // vertices of the object
        this.vertexBufferId = null;  // reference to the vertex positions for the square in the gl context
        this.textureBufferId = null;  // reference to the vertex positions for the square in the gl context
    }

    // gl - webgl context
    initialize(gl) {
        // Step A: Create a buffer on the WebGL context for our vertex positions
        this.vertexBufferId = gl.createBuffer();

        // Step B: Activate vertex buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBufferId);

        // Step C: Loads vertices into the vertex buffer
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);

        this.textureBufferId = gl.createBuffer();

        // Activate vertexBuffer
        gl.bindBuffer(gl.ARRAY_BUFFER, this.textureBufferId);

        // Loads verticesOfSquare into the vertexBuffer
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.textureCoordinates), gl.STATIC_DRAW);
    }

    getVertexBufferId() { return this.vertexBufferId; }
    getTextureCoordinatesBufferId() { return this.textureBufferId; }
}
"use strict";

import Renderable from '../engine/renderable';

export default class TexturedSquare extends Renderable {
    constructor(engine, centerX, centerY, width, height, textureName) {
        super(engine, 'texture_vs.glsl', 'texture_fs.glsl');

        // Center and width of square
        this.centerX = centerX;
        this.centerY = centerY;
        this.width = width;
        this.height = height;
        this.color = [1.0, 0.0, 0.0, 0.0]; // default red color

        this.vertex_buffer_id = null;
        this.texture_buffer_id = null;

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

    load_resources() {
        super.load_resources();
        this.engine.texture_file_loader.loadTexture(this.textureName);
    }

    initialize() {
        super.initialize();

        this.vertex_buffer_id = this.engine.retrieve_vbo('UNIT_SQUARE');
        this.texture_buffer_id = this.engine.retrieve_vbo('UNIT_SQUARE_TEXTURE');

        if (this.vertex_buffer_id === null) {
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

            let gl = this.engine.webgl_context;
            this.vertex_buffer_id = this.engine.vbos_library.add_vbo('UNIT_SQUARE', new Float32Array(verticesOfSquare), gl.ARRAY_BUFFER, gl);
            this.texture_buffer_id = this.engine.vbos_library.add_vbo('UNIT_SQUARE_TEXTURE', new Float32Array(textureCoordinates), gl.ARRAY_BUFFER, gl);
        }

        this.initTexture();     // texture for this object, cannot be a "null"
    }

    initTexture() {
        // these two instance variables are to cache texture information
        // for supporting per-pixel accurate collision
        // console.log('init texture');
        this.mTextureInfo = this.engine.texture_file_loader.getTextureInfo(this.textureName);
        // console.log('mTextureInfo.name ' + this.mTextureInfo.mName);
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
        let input = this.engine.input;
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
        let camera = this.engine.camera;
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

        this.shader.activate(gl);

        this.engine.texture_file_loader.activateTexture(this.textureName);
        
        // Activates the vertex buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertex_buffer_id);

        // Describe the characteristic of the vertex position attribute
        gl.vertexAttribPointer(this.shader.attributes.position,
            3,              // each element is a 3-float (x,y,z)
            gl.FLOAT,       // data type is FLOAT
            false,          // if the content is normalized vectors
            0,              // number of bytes to skip in between elements
            0);             // offsets to the first element
        gl.enableVertexAttribArray(this.shader.attributes.position);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.texture_buffer_id);
        gl.enableVertexAttribArray(this.shader.attributes.texture_coordinate);
        gl.vertexAttribPointer(this.shader.attributes.texture_coordinate, 2, gl.FLOAT, false, 0, 0);

        gl.uniformMatrix4fv(this.shader.uniforms.PVM_transform, false, pvmMatrix);
        gl.uniform4fv(this.shader.uniforms.pixel_color, this.color);
        gl.uniform1i(this.shader.uniforms.sampler, 0);

        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA); // for transparent texture

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

        gl.disable(gl.BLEND);
    }
}

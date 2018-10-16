"use strict";

import Renderable from './engine/renderable';
import ConstColorShader from './const_color_shader';
import VertexBuffer from './engine/buffer';

// Next two properties are shared by all instances of class (static properties)
let _shader = null;         // the shader for shading this object
// let _vertexBuffer = null;   // the vertex buffer for this object

export default class Grid extends Renderable {
    constructor(engine, originX, originY, width, height, nColumns, nRows) {
        super(engine);

        this.originX = originX;
        this.originY = originY;
        this.width = width;
        this.height = height;
        this.nColumns = nColumns;
        this.nRows = nRows;
        this.columnWidth = this.width / this.nColumns;
        this.rowHeight = this.height / this.nRows;
        this.color = [0.8, 0.0, 0.0, 1.0]; // default red color
        this.vertexBuffer = null;
    }

    static get vertexShaderName() { return 'shaders/basicVS.glsl'; }
    static get fragmentShaderName() { return 'shaders/basicFS.glsl'; }
    static get shader() { return _shader; }
    static set shader(value) { _shader = value; }
    
    setColor(color) { this.color = color; }
    getColor() { return this.color; }
    getCellCenter(row, column) {
        let x = this.originX + (column * this.columnWidth + this.columnWidth / 2.0);
        let y = this.originY + (row * this.rowHeight + this.rowHeight / 2.0)
        return vec2.fromValues(x, y);
    }
    getNextRight(column) {
        if (column < this.nColumns - 1) {
            return column + 1;
        }
        return column;
    }
    getNextLeft(column) {
        if (column > 0) {
            return column - 1;
        }
        return column;
    }
    getNextUp(row) {
        if (row < this.nRows - 1) {
            return row + 1;
        }
        return row;
    }
    getNextDown(row) {
        if (row > 0) {
            return row - 1;
        }
        return row;
    }

    loadResources() {
        // Load necessery shader files asynchroniously
        let textFileLoader = this.engine.text_file_loader;
        textFileLoader.loadTextFile(Grid.vertexShaderName, textFileLoader.eTextFileType.eTextFile);
        textFileLoader.loadTextFile(Grid.fragmentShaderName, textFileLoader.eTextFileType.eTextFile);
    }

    initialize() {
        if(Grid.shader === null) {
            Grid.shader = new ConstColorShader(Grid.vertexShaderName, Grid.fragmentShaderName);
            Grid.shader.initialize(this.engine.resources, this.engine.webgl_context);
        }

        let verticesOfGrid = [];
        let linePosition;
        let columnWidth = this.width / this.nColumns;
        for (let i = 0; i <= this.nColumns; i += 1) {
            linePosition = i * columnWidth;
            verticesOfGrid.push(linePosition, 0.0, 0.0, linePosition, this.height, 0.0);
        }
        let rowHeight = this.height / this.nRows;
        for (let i = 0; i <= this.nRows; i += 1) {
            linePosition = i * rowHeight;
            verticesOfGrid.push(0.0, linePosition, 0.0, this.width, linePosition, 0.0);
        }
        this.vertexBuffer = new VertexBuffer(verticesOfGrid);
        this.vertexBuffer.initialize(this.engine.webgl_context);
    }
/*
    update() {
        let input = this.engine.input;

        if (input.isKeyClicked(input.Keys.Right)) {
            this.originX += 1.0;
        }
        if (input.isKeyClicked(input.Keys.Left)) {
            this.originX -= 1.0;
        }
        if (input.isKeyClicked(input.Keys.Up)) {
            this.originY += 1.0;
        }
        if (input.isKeyClicked(input.Keys.Down)) {
            this.originY -= 1.0;
        }
    }
*/
    draw(gl) {
        let camera = this.engine.camera;
        let pvmMatrix = mat4.create();
        let modelMatrix = mat4.create(); // Creates a blank identity matrix
        
        // Step A: compute translation, for now z is always at 0.0
        mat4.translate(modelMatrix, modelMatrix, vec3.fromValues(this.originX, this.originY, 0.0));
        // Step B: concatenate with rotation.
        // mat4.rotateZ(matrix, matrix, this.getRotationInRad());
        // Step C: concatenate with scaling
        // mat4.scale(modelMatrix, modelMatrix, vec3.fromValues(this.width, this.height, 1.0));

        mat4.multiply(pvmMatrix, camera.getPVMatrix(), modelMatrix);

        // Activates the vertex buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer.getId());

        Grid.shader.activate(gl);
        // Describe the characteristic of the vertex position attribute
        gl.vertexAttribPointer(Grid.shader.getPositionLocation(),
            3,              // each element is a 3-float (x,y,z)
            gl.FLOAT,       // data type is FLOAT
            false,          // if the content is normalized vectors
            0,              // number of bytes to skip in between elements
            0);             // offsets to the first element

        gl.enableVertexAttribArray(Grid.shader.getPositionLocation());
        gl.uniformMatrix4fv(Grid.shader.getPVMTransformLocation(), false, pvmMatrix);
        gl.uniform4fv(Grid.shader.getColorLocation(), this.color);
        // Grid.shader.activate();

        let numOfVertices = (this.nColumns + 1) * 2 + (this.nRows + 1) * 2
        gl.drawArrays(gl.LINES, 0, numOfVertices);
    }
}

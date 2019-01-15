"use strict";

import Renderable from '../engine/renderable';

export default class Grid extends Renderable {
    constructor(engine, originX, originY, width, height, nColumns, nRows) {
        super(engine, 'basic_vs.glsl', 'basic_fs.glsl');

        this.originX = originX;
        this.originY = originY;
        this.width = width;
        this.height = height;
        this.nColumns = nColumns;
        this.nRows = nRows;
        this.columnWidth = this.width / this.nColumns;
        this.rowHeight = this.height / this.nRows;
        this.color = [0.8, 0.0, 0.0, 1.0]; // default red color
        this.vertex_buffer_id = null;
    }

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

    initialize() {
        super.initialize();

        this.vertex_buffer_id = this.engine.retrieve_vbo('GRID');

        if (this.vertex_buffer_id === null) {
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

            let gl = this.engine.webgl_context;
            this.vertex_buffer_id = this.engine.vbos_library.add_vbo('GRID', new Float32Array(verticesOfGrid), gl.ARRAY_BUFFER, gl);
        }
    }

    draw(gl) {
        let camera = this.engine.camera;
        let pvmMatrix = mat4.create();
        let modelMatrix = mat4.create();

        // Step A: compute translation, for now z is always at 0.0
        mat4.translate(modelMatrix, modelMatrix, vec3.fromValues(this.originX, this.originY, 0.0));
        // Step B: concatenate with rotation.
        // mat4.rotateZ(matrix, matrix, this.getRotationInRad());
        // Step C: concatenate with scaling
        // mat4.scale(modelMatrix, modelMatrix, vec3.fromValues(this.width, this.height, 1.0));

        mat4.multiply(pvmMatrix, camera.getPVMatrix(), modelMatrix);

        this.shader.activate(gl);

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
        gl.uniformMatrix4fv(this.shader.uniforms.PVM_transform, false, pvmMatrix);
        gl.uniform4fv(this.shader.pixel_color, this.color);

        let numOfVertices = (this.nColumns + 1) * 2 + (this.nRows + 1) * 2
        gl.drawArrays(gl.LINES, 0, numOfVertices);
    }

    // update(input) {
    //     if (input.isKeyClicked(input.Keys.Right)) {
    //         this.originX += 1.0;
    //     }
    //     if (input.isKeyClicked(input.Keys.Left)) {
    //         this.originX -= 1.0;
    //     }
    //     if (input.isKeyClicked(input.Keys.Up)) {
    //         this.originY += 1.0;
    //     }
    //     if (input.isKeyClicked(input.Keys.Down)) {
    //         this.originY -= 1.0;
    //     }
    // }
}

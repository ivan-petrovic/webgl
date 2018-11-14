"use strict";

import Renderable from '../engine/renderable';

export default class ColoredSquare extends Renderable {
    constructor(engine, position, width, height) {
        super(engine, 'basic_vs.glsl', 'basic_fs.glsl');

        this.vertex_buffer_id = null;

        this._position = position;
        this.z = 0;
        this._width = width;
        this._height = height;
        this._angle = 0;
        this._color = [1.0, 0.0, 0.0, 1.0];
    }

    set color(color) { this._color = color; }
    get color() { return this._color; }

    set position(position) { this._position = position; }
    get position() { return this._position; }

    set width(width) { this._width = width; }
    get width() { return this._width; }

    set height(height) { this._height = height; }
    get height() { return this._height; }

    set angle(angle) { this._angle = angle; }
    get angle() { return this._angle; }

    initialize() {
        super.initialize();

        this.vertex_buffer_id = this.engine.retrieve_vbo('UNIT_SQUARE');

        if (this.vertex_buffer_id === null) {
            let verticesOfSquare = [
                0.5, 0.5, 0.0,
                -0.5, 0.5, 0.0,
                0.5, -0.5, 0.0,
                -0.5, -0.5, 0.0
            ];

            let gl = this.engine.webgl_context;
            this.vertex_buffer_id = this.engine.vbos_library.add_vbo('UNIT_SQUARE', new Float32Array(verticesOfSquare), gl.ARRAY_BUFFER, gl);
        }
    }

    draw(gl) {
        let camera = this.engine.camera;
        let pvmMatrix = mat4.create();
        let modelMatrix = mat4.create(); // Creates a blank identity matrix

        // Step A: compute translation, for now z is always at 0.0
        mat4.translate(modelMatrix, modelMatrix, vec3.fromValues(this.position[0], this.position[1], this.z));
        // Step B: concatenate with rotation.
        mat4.rotateZ(modelMatrix, modelMatrix, this.angle * Math.PI / 180);
        // Step C: concatenate with scaling
        mat4.scale(modelMatrix, modelMatrix, vec3.fromValues(this.width, this.height, 1.0));

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
        gl.uniform4fv(this.shader.uniforms.pixel_color, this.color);

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
}

"use strict";

import Renderable from '../engine/renderable';

export default class Axes extends Renderable {
    constructor(engine, length = 5.0) {
        super(engine, 'basic_vs.glsl', 'basic_fs.glsl');

        this._length = length;
        this.vertix_buffer_id = null;

        this.vertices = [
            -this._length, 0.0, 0.0, this._length, 0.0, 0.0,    // x-axix
            0.0, -this._length, 0.0, 0.0, this._length, 0.0,    // y-axix
            0.0, 0.0, -this._length, 0.0, 0.0, this._length     // z-axix
        ];
    }
   
    set length(length) { this._length = length; }
    get length() { return this._length; }

    initialize() {
        super.initialize();

        this.vertix_buffer_id = this.engine.retrieve_vbo('AXES');

        if(this.vertix_buffer_id === null) {
            let gl = this.engine.webgl_context;
            this.vertix_buffer_id = this.engine.vbos_library.add_vbo(
                'AXES', new Float32Array(this.vertices), gl.ARRAY_BUFFER, gl
            );
        }
    }

    draw(gl) {
        let camera = this.engine.camera;
        let pvm_matrix = mat4.create();
        let model_matrix = mat4.create(); // Creates a blank identity matrix
        
        mat4.multiply(pvm_matrix, camera.getPVMatrix(), model_matrix);
        this.shader.activate(gl);
        
        // Activates the vertex buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertix_buffer_id);

        // Describe the characteristic of the vertex position attribute
        gl.vertexAttribPointer(this.shader.attributes.position,
            3,              // each element is a 3-float (x,y,z)
            gl.FLOAT,       // data type is FLOAT
            false,          // if the content is normalized vectors
            0,              // number of bytes to skip in between elements
            0);             // offsets to the first element

        gl.enableVertexAttribArray(this.shader.attributes.position);

        gl.uniformMatrix4fv(this.shader.uniforms.PVM_transform, false, pvm_matrix);
        gl.uniform4fv(this.shader.uniforms.pixel_color, [1.0, 0.0, 0.0, 1.0]);
        gl.drawArrays(gl.LINES, 0, 2);

        gl.uniform4fv(this.shader.uniforms.pixel_color, [0.0, 1.0, 0.0, 1.0]);
        gl.drawArrays(gl.LINES, 2, 2);

        gl.uniform4fv(this.shader.uniforms.pixel_color, [0.0, 0.0, 1.0, 1.0]);
        gl.drawArrays(gl.LINES, 4, 2);

    }
}

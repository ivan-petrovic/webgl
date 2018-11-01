"use strict";

import Renderable from '../engine/renderable';

export default class FloorGrid extends Renderable {
    constructor(engine, length = 5.0, spacing = 1.0) {
        super(engine, 'basic_vs.glsl', 'basic_fs.glsl');

        this._length = length;
        this._spacing = spacing;
        
        this.vertix_buffer_id = null;
        this.vertices = [];
        this.vertices_count = 0;
    }
   
    set length(length) { this._length = length; }
    get length() { return this._length; }

    set spacing(spacing) { this._spacing = spacing; }
    get spacing() { return this._spacing; }

    initialize() {
        super.initialize();

        this.vertix_buffer_id = this.engine.retrieve_vbo('FLOOR_GRID');
        this.vertices_count = 2 * 2 * (2 * Math.floor(this.length / this.spacing) + 1)
        // console.log('this.vertices_count: ' + this.vertices_count);

        if(this.vertix_buffer_id === null) {
            let gl = this.engine.webgl_context;
            // console.log('call _generate_vertices');
            this._generate_vertices();
            // console.log('finished _generate_vertices');
            // console.log(this.vertices);

            this.vertix_buffer_id = this.engine.vbos_library.add_vbo(
                'FLOOR_GRID', new Float32Array(this.vertices), gl.ARRAY_BUFFER, gl
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
        gl.uniform4fv(this.shader.uniforms.pixel_color, [0.3, 0.3, 0.3, 1.0]);
        gl.drawArrays(gl.LINES, 0, this.vertices_count);
    }

    _generate_vertices() {
        // console.log('inside _generate_vertices')
        for (let coord_x = -this.length; coord_x <= this.length; coord_x += this.spacing) {
            // console.log(coord_x);
            this.vertices.push(coord_x); this.vertices.push(0.0); this.vertices.push(-this.length);
            this.vertices.push(coord_x); this.vertices.push(0.0); this.vertices.push(this.length);
            // console.log(this.vertices);
        }

        for (let coord_z = -this.length; coord_z <= this.length; coord_z += this.spacing) {
            this.vertices.push(-this.length); this.vertices.push(0.0); this.vertices.push(coord_z);
            this.vertices.push(this.length); this.vertices.push(0.0); this.vertices.push(coord_z);
            // console.log(this.vertices);
        }
    }
}

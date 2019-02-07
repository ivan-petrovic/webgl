"use strict";

// Data in the form:
// new Float32Array(this.vertices)
// new Uint8Array(this.indices)
export default class {
    constructor(data, type) {
        this.data = data;       // vertices or indices of the object
        this.type = type;       // gl.ARRAY_BUFFER or gl.ELEMENT_ARRAY_BUFFER
        this.usage = null;
        this.buffer_id = null;  // reference to the buffer in the gl context
    }

    initialize(gl) {
        // Step A: Create a buffer on the WebGL context for our vertex positions
        this.buffer_id = gl.createBuffer();

        // Step B: Activate vertex buffer
        gl.bindBuffer(this.type, this.buffer_id);

        // Step C: Loads data into the buffer
        if(this.usage === null) {
            gl.bufferData(this.type, this.data, gl.STATIC_DRAW);
        } else {
            gl.bufferData(this.type, this.data, this.usage);
        }
    }

    update(data, gl) {
        this.data = data;

        gl.bindBuffer(this.type, this.buffer_id);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, new Float32Array(data));
    }

    get id() { return this.buffer_id; }
}
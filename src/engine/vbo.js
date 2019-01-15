"use strict";

export default class {
    constructor(size, type) {
        this.size = size;       // size of buffer
        this.type = type;       // gl.ARRAY_BUFFER or gl.ELEMENT_ARRAY_BUFFER
        this.buffer_id = null;  // reference to the buffer in the gl context

        this.current_position = 0; // next free position in buffer
    }

    initialize(gl) {
        // Step A: Create a buffer on the WebGL context for our vertex positions
        this.buffer_id = gl.createBuffer();

        // Step B: Activate vertex buffer
        gl.bindBuffer(this.type, this.buffer_id);

        // Step C: Reserve size in bytes
        void gl.bufferData(this.type, this.size, gl.STATIC_DRAW); 
    }

    load_data(data, gl) {
        if((this.current_position + data.length) > this.size) {
            console.log("No more space in buffer");
            return;
        }
        let offset = this.current_position;
        // Step B: Activate vertex buffer
        gl.bindBuffer(this.type, this.buffer_id);

        // Step C: Loads data into the buffer
        gl.bufferSubData(this.type, this.current_position, data); 
        // console.log("Added: " + data.length + " data at position " + this.current_position + " of " + this.size);
        this.current_position += data.length * 4;   // size of float32 is 4 bytes
        // console.log("Current position: " + this.current_position);
        return offset;
    }

    load_data_at_offset(data, offset, gl) {
        if((offset + data.length) > this.size) {
            console.log("No more space in buffer");
            return;
        }

        if(offset > this.current_position) {
            console.log("Offset behind current position in buffer");
            return;
        }

        // Step B: Activate vertex buffer
        gl.bindBuffer(this.type, this.buffer_id);

        // Step C: Loads data into the buffer
        gl.bufferSubData(this.type, offset, data); 
        // console.log("Added: " + data.length + " data at position " + this.current_position + " of " + this.size);
        // this.current_position += data.length * 4;   // size of float32 is 4 bytes
        // console.log("Current position: " + this.current_position);
        // return offset;
    }

    get id() { return this.buffer_id; }
}
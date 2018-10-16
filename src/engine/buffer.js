export default class {
    constructor(aVertices, indices) {
        this.vertices = aVertices;   // vertices of the object
        this.indices = indices;
        this.vertexBufferId = null;  // reference to the vertex positions for the square in the gl context
        this.indexBufferId = null;  // reference to the vertex positions for the square in the gl context
    }

    // gl - webgl context
    initialize(gl) {
        // Step A: Create a buffer on the WebGL context for our vertex positions
        this.vertexBufferId = gl.createBuffer();

        // Step B: Activate vertex buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBufferId);

        // Step C: Loads vertices into the vertex buffer
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);

        if (this.indices !== null) {
            // Create a buffer object
            this.indexBufferId = gl.createBuffer();

            // Write the indices to the buffer object
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBufferId);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(this.indices), gl.STATIC_DRAW);
        }
    }

    getId() { return this.vertexBufferId; }
    get id() { return this.vertexBufferId; }
    getVertexBufferId() { return this.vertexBufferId; }
    getIndexBufferId() { return this.indexBufferId; }
}
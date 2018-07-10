export default class {
    constructor(aVertices) {
        this.vertices = aVertices;   // vertices of the object
        this.vertexBufferId = null;  // reference to the vertex positions for the square in the gl context
    }

    // gl - webgl context
    initialize(gl) {
        // Step A: Create a buffer on the WebGL context for our vertex positions
        this.vertexBufferId = gl.createBuffer();

        // Step B: Activate vertex buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBufferId);

        // Step C: Loads vertices into the vertex buffer
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
    }

    getId() { return this.vertexBufferId; }
}
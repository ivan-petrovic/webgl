export default class {
    constructor(shader, vertexBuffer) {
        this.shader = shader;               // the shader for shading this object
        this.vertexBuffer = vertexBuffer;   // the vertex buffer id for this object
        this.color = [1.0, 1.0, 1.0, 1.0];  // Color for fragment shader

        // Variables used for animation (update function)
        this.time = 0.0;
        this.distance = 0.0;
    }

    getColor() { return this.color; }
    setColor(newColor) { this.color = newColor; }

    update() {
        let MIN_DISTANCE = 10.0;
        let AMPLITUDE = 50.0;

        // Triangle wave with period 2 and amplitude from 0 to 1
        this.time += 0.005;
        let wave = 2 * Math.abs(Math.round(0.5 * this.time) - 0.5 * this.time);
        this.distance = MIN_DISTANCE + AMPLITUDE * wave;
    }

    draw(gl) {
        // Activates the vertex buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);

        // Describe the characteristic of the vertex position attribute
        gl.vertexAttribPointer(this.shader.getPositionLocation(),
            3,              // each element is a 3-float (x,y,z)
            gl.FLOAT,       // data type is FLOAT
            false,          // if the content is normalized vectors
            0,              // number of bytes to skip in between elements
            0);             // offsets to the first element

        gl.enableVertexAttribArray(this.shader.getPositionLocation());
        gl.uniform1f(this.shader.getDistanceLocation(), this.distance);
        // this.shader.activate();

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };
}
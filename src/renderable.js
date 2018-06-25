export default class {
    constructor(shader, vertexBuffer) {
        this.shader = shader;               // the shader for shading this object
        this.vertexBuffer = vertexBuffer;   // the vertex buffer ?id? for this object
        this.color = [1.0, 1.0, 1.0, 1.0];  // Color for fragment shader
        this.distance = 10.0;
    }

    getColor() { return this.color; }
    setColor(newColor) { this.color = newColor; }

    draw(gl) {
        // this.shader.activateShader(this.color);
        // maybe in activate shader

        // Step E: Activates the vertex buffer loaded in EngineCore_VertexBuffer.js
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);

        // Step F: Describe the characteristic of the vertex position attribute
        gl.vertexAttribPointer(this.shader.getPositionLocation(),
            3,              // each element is a 3-float (x,y.z)
            gl.FLOAT,       // data type is FLOAT
            false,          // if the content is normalized vectors
            0,              // number of bytes to skip in between elements
            0);             // offsets to the first element

        // gl.enableVertexAttribArray(this.shader.getPositionLocation());
        gl.uniform1f(this.shader.getDistanceLocation(), this.distance);
        this.distance += 0.25;
        if (this.distance > 100.0) {
            this.distance = 10.0;
        }
        //gl.uniform1f(this.shader.getDistanceLocation(), 50.0);

        this.shader.activate();
        // gl.enableVertexAttribArray(this.shader.getPositionLocation());

        // gl.drawArrays(gl.TRIANGLES, 0, 6);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };
}
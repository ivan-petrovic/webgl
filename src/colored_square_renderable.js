"use strict";

import Renderable from './engine/renderable';
import VertexBuffer from './engine/buffer';

// Next property is shared by all instances of class (static property)
let _vertexBuffer = null;   // the vertex buffer for this object

export default class ColoredSquare extends Renderable {
    constructor(engine, center_x, center_y, width, height) {
        super(engine, 'shaders/basicVS.glsl', 'shaders/basicFS.glsl');

        this.center_x = center_x;
        this.center_y = center_y;
        this.width = width;
        this.height = height;
        this.color = [1.0, 0.0, 0.0, 1.0]; // default red color
    }

    static get vertexBuffer() { return _vertexBuffer; }
    static set vertexBuffer(value) { _vertexBuffer = value; }
    
    setColor(color) { this.color = color; }
    getColor() { return this.color; }
    
    initialize() {
        super.initialize();
        
        if(ColoredSquare.vertexBuffer === null) {
            let verticesOfSquare = [
                0.5, 0.5, 0.0,
                -0.5, 0.5, 0.0,
                0.5, -0.5, 0.0,
                -0.5, -0.5, 0.0
            ];
            ColoredSquare.vertexBuffer = new VertexBuffer(verticesOfSquare);
            ColoredSquare.vertexBuffer.initialize(this.engine.webgl_context);
        }
    }

    draw(gl) {
        let camera = this.engine.camera;
        let pvmMatrix = mat4.create();
        let modelMatrix = mat4.create(); // Creates a blank identity matrix
        
        // modelMatrix = mat4.fromTranslation(this.modelMatrix, [this.center_x, this.center_y, 0.0]);
        
        // Step A: compute translation, for now z is always at 0.0
        mat4.translate(modelMatrix, modelMatrix, vec3.fromValues(this.center_x, this.center_y, 0.0));
        // Step B: concatenate with rotation.
        // mat4.rotateZ(matrix, matrix, this.getRotationInRad());
        // Step C: concatenate with scaling
        mat4.scale(modelMatrix, modelMatrix, vec3.fromValues(this.width, this.height, 1.0));

        mat4.multiply(pvmMatrix, camera.getPVMatrix(), modelMatrix);
        this._shader_program.activate(gl);
        // ColoredSquare.shader.activate(gl);
        // Activates the vertex buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, ColoredSquare.vertexBuffer.getId());

        // Describe the characteristic of the vertex position attribute
        gl.vertexAttribPointer(this._shader_program.attributes.a_position, // this.positionLocation,
            3,              // each element is a 3-float (x,y,z)
            gl.FLOAT,       // data type is FLOAT
            false,          // if the content is normalized vectors
            0,              // number of bytes to skip in between elements
            0);             // offsets to the first element

        gl.enableVertexAttribArray(this._shader_program.attributes.a_position);
        gl.uniformMatrix4fv(this._shader_program.uniforms.u_PVM_transform, false, pvmMatrix);
        gl.uniform4fv(this._shader_program.uniforms.u_PixelColor, this.color);
        // gl.uniform1f(ColoredSquare.shader.getDistanceLocation(), this.distance);
        // gl.uniform4fv(ColoredSquare.shader.getPointsLocation(), [this.p1x,this.p1y,this.p2x,this.p2y]);
        // ColoredSquare.shader.activate();

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
}

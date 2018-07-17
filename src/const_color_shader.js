"use strict";

import Shader from './shader';

export default class extends Shader {
    constructor(vertexShaderId, fragmentShaderId) {
        super(vertexShaderId, fragmentShaderId);

        // Specific locations for this shader
        this.positionLocation = null;
        this.PVMTransformLocation = null;
        this.colorLocation = null;
    }

    getLocations(gl) {
        this.positionLocation = gl.getAttribLocation(this.program, "a_position");
        this.PVMTransformLocation = gl.getUniformLocation(this.program, "u_PVMTransform");
        this.colorLocation = gl.getUniformLocation(this.program, "u_PixelColor");
    }

    getPositionLocation() { return this.positionLocation; }
    getPVMTransformLocation() { return this.PVMTransformLocation; }
    getColorLocation() { return this.colorLocation; }
}

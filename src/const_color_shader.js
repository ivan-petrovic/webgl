"use strict";

import Shader from './shader';

export default class extends Shader {
    constructor(vertexShaderId, fragmentShaderId) {
        super(vertexShaderId, fragmentShaderId);

        // Specific locations for this shader
        this.positionLocation = null;
        this.modelTransform = null;
    }

    getLocations(gl) {
        this.positionLocation = gl.getAttribLocation(this.program, "a_position");
        this.modelTransform = gl.getUniformLocation(this.program, "u_ModelTransform");
    }

    getPositionLocation() { return this.positionLocation; }
    getModelTransformLocation() { return this.modelTransform; }
}

"use strict";

import Shader from './shader';

export default class extends Shader {
    constructor(vertexShaderId, fragmentShaderId) {
        super(vertexShaderId, fragmentShaderId);

        // Specific locations for this shader
        this.positionLocation = null;
        this.distanceLocation = null;
        this.viewportLocation = null;
    }

    getLocations(gl) {
        this.positionLocation = gl.getAttribLocation(this.program, "a_position");
        this.distanceLocation = gl.getUniformLocation(this.program, "uDistance");
        this.viewportLocation = gl.getUniformLocation(this.program, "uViewport");
    }

    getPositionLocation() { return this.positionLocation; }
    getDistanceLocation() { return this.distanceLocation; }
    getViewportLocation() { return this.viewportLocation; }
}

"use strict";

export default class {
    constructor() {
        this._direction = [0.0, 0.0, -1.0];  // vec3
        this._ambient = [0.1,0.1,0.1,1.0];    // vec4
        this._diffuse = [0.8,0.8,0.8,1.0];    // vec4
        this._specular = [1.0,1.0,1.0,1.0];   // vec4
    }

    get direction() { return this._direction; }
    set direction(direction) { this._direction = direction; }

    get ambient() { return this._ambient; }
    set ambient(color) { this._ambient = color; }

    get diffuse() { return this._diffuse; }
    set diffuse(color) { this._diffuse = color; }

    get specular() { return this._specular; }
    set specular(color) { this._specular = color; }
}

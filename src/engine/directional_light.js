"use strict";

export default class {
    constructor() {
        this._shininess = 5;        // float
        this._light_direction = [0.0, 0.0, -1.0];  // vec3
        this._light_ambient = [0.1,0.1,0.1,1.0];    // vec4
        this._light_diffuse = [0.8,0.8,0.8,1.0];    // vec4
        this._light_specular = [1.0,1.0,1.0,1.0];   // vec4
    }

    get shininess() { return this._shininess; }
    set shininess(coeficient) { this._shininess = coeficient; }

    get direction() { return this._light_direction; }
    set direction(direction) { this._light_direction = direction; }

    get ambient() { return this._light_ambient; }
    set ambient(color) { this._light_ambient = color; }

    get diffuse() { return this._light_diffuse; }
    set diffuse(color) { this._light_diffuse = color; }

    get specular() { return this._light_specular; }
    set specular(color) { this._light_specular = color; }
}

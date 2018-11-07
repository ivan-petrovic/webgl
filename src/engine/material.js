"use strict";

export default class {
    constructor() {
        this._shininess = 10.0;
        this._ambient = [0.1, 0.1, 0.1, 1.0];
        this._diffuse = [0.8, 0.8, 0.8, 1.0];
        this._specular = [1.0, 1.0, 1.0, 1.0];
    }

    get shininess() { return this._shininess; }
    set shininess(coeficient) { this._shininess = coeficient; }

    get ambient() { return this._ambient; }
    set ambient(color) { this._ambient = color; }

    get diffuse() { return this._diffuse; }
    set diffuse(color) { this._diffuse = color; }

    get specular() { return this._specular; }
    set specular(color) { this._specular = color; }
}

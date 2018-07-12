"use strict";

// Defines interface for renderable objects
export default class {
    constructor(engine) {
        this.engine = engine;                   // engine used for rendering
    }

    // 1. loadResources is called by engine to load necessery assets
    //    for given renderable object (e.g. shader files, images for texture,...)
    loadResources() {
    }

    // 2. initialize is called by engine after resources are loaded
    initialize() {
    }

    // 3. update is called every frame to update state of renderable object
    update() {
    }

    // 4. draw is called every frame to draw renderable on screen
    draw() {
    }
}
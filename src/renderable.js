"use strict";

// import Shader from './shader';
// import VertexBuffer from './buffer';

export default class {
    constructor(engine, vertexShader, fragmentShader) {
        this.engine = engine;                   // engine used for rendering
        this.vertexShader = vertexShader;       // the shader for shading this object
        this.fragmentShader = fragmentShader;   // the shader for shading this object
        this.shader = null;                     // the shader for shading this object
        this.vertexBuffer = null;               // the vertex buffer for this object
    }

    // Define interface for Renderable class:

    // 1. loadResources is called by engine to load necessery assets
    //    for given renderable object (e.g. shader files, images for texture,...)
    //    By default it loads shader files needed for rendering of renderable.
    loadResources() {
        // Load necessery shader files asynchroniously
        let textFileLoader = this.engine.getTextFileLoader();
        textFileLoader.loadTextFile(this.vertexShader, textFileLoader.eTextFileType.eTextFile);
        textFileLoader.loadTextFile(this.fragmentShader, textFileLoader.eTextFileType.eTextFile);
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
"use strict";

// Defines interface for renderable objects
export default class {
    constructor(engine, vertex_shader_name, fragment_shader_name) {
        this.engine = engine;                   // engine used for rendering
        this.vertex_shader_name = vertex_shader_name;
        this.fragment_shader_name = fragment_shader_name;
        this._shader_program = null;         // the shader for shading this object

        this.behaviours = [];
    }

    // 1. loadResources is called by engine to load necessery assets
    //    for given renderable object (e.g. shader files, images for texture,...)
    load_resources() {
        let textFileLoader = this.engine.getTextFileLoader();
        textFileLoader.loadTextFile(this.vertex_shader_name, textFileLoader.eTextFileType.eTextFile);
        textFileLoader.loadTextFile(this.fragment_shader_name, textFileLoader.eTextFileType.eTextFile);
    }

    // 2. initialize is called by engine after resources are loaded
    initialize() {
        this._shader_program = this.engine.getShadersLibrary().retrieve_shader(this.vertex_shader_name, this.fragment_shader_name);
    }

    // 3. update is called every frame to update state of renderable object
    update(input) {
        for (let behaviour of this.behaviours) {
            behaviour.update(input);
        }
    }

    // 4. draw is called every frame to draw renderable on screen
    draw() {
    }

    add_behaviour(behaviour) {
        this.behaviours.push(behaviour);
    }
}
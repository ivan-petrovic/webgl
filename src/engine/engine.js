"use strict";

import ResourceMap from './resources/resource_map';
import TextureLoader from './resources/texture_loader';
import TextFileLoader from './resources/text_file_loader';
import ShaderLibrary from './resources/shader_library';
import Input from './input';

export default class {
    constructor() {
        this.canvas = document.getElementById('glscreen');
        this.gl     = this.canvas.getContext('webgl', {alpha: false}) || this.canvas.getContext('experimental-webgl', {alpha: false});
        this.width  = this.gl.drawingBufferWidth;
        this.height = this.gl.drawingBufferHeight;

        this.time = null;

        this.camera = null;
        this.renderables = [];

        this.resources = new ResourceMap();  // should be singleton (for now that is not implemented)
        this.shaders = new ShaderLibrary(this.resources, this.gl);

        this.textFileLoader = new TextFileLoader(this.resources);
        this.textureLoader = new TextureLoader(this.gl, this.resources);
        
        this.input = new Input(this.canvas);
    }

    getCanvasElement() { return this.canvas; }
    getCanvasWidth() { return this.width; }
    getCanvasHeight() { return this.height; }
    getWebGLContext() { return this.gl; }
    getInput() { return this.input; }
    getResources() { return this.resources; }
    getShadersLibrary() { return this.shaders; }
    getTextFileLoader() { return this.textFileLoader; }
    getTextureLoader() { return this.textureLoader; }
    getCamera() { return this.camera; }
    setCamera(camera) { this.camera = camera; }

    initialize() {
        let gl = this.gl;

        this.input.initialize();
    
        // gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
        // gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        // gl.blendFunc(gl.SRC_COLOR,gl.ONE_MINUS_SRC_COLOR);
        // gl.enable(gl.BLEND);
        gl.enable(gl.DEPTH_TEST);
    }

    addRenderable(renderable) {
        this.renderables.push(renderable);
    }

    loadResourcesAndStart() {
        for (let renderable of this.renderables) {
            renderable.load_resources();
        }
        this.resources.setLoadCompleteCallback( () => this.start() );
    }

    start() {
        this.initialize();
        for (let renderable of this.renderables) {
            renderable.initialize();
        }
        window.requestAnimationFrame((now) => this.render(now));
    }

    render(now) {
        window.requestAnimationFrame((now) => this.render(now));
    
        let dt = now - (this.time || now);
        this.time = now;

        // Update
        this.input.update();
        if(this.camera !== null) {
            this.camera.update(this.input);
        }
        for (let renderable of this.renderables) {
            renderable.update(this.input);
        }

        // Clear screen and draw scene
        let gl = this.gl;

        if(this.camera !== null) {
            this.camera.setupProjectionViewMatrix(gl);
        } else {
            gl.clearColor(0.0, 0.0, 0.0, 1.0);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        }
        for (let renderable of this.renderables) {
            renderable.draw(gl);
        }
    }
}

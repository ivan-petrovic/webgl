"use strict";

import ResourceMap from './resources/resource_map';
import TextFileLoader from './resources/text_file_loader';
import Input from './input';

export default class {
    constructor() {
        this.canvas = document.getElementById('glscreen');
        this.gl     = this.canvas.getContext('webgl', {alpha: false})  || this.canvas.getContext('experimental-webgl', {alpha: false});
        this.width  = this.gl.drawingBufferWidth;
        this.height = this.gl.drawingBufferHeight;

        this.time = null;

        this.renderables = [];

        this.resources = new ResourceMap();  // should be singleton (for now that is not implemented)
        this.textFileLoader = new TextFileLoader(this.resources);
        
        this.input = new Input();
    }

    getWebGLContext() { return this.gl; }
    getInput() { return this.input; }
    getResources() { return this.resources; }
    getTextFileLoader() { return this.textFileLoader; }

    initialize() {
        let gl = this.gl;

        this.input.initialize();
    
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
        // gl.blendFunc(gl.SRC_COLOR,gl.ONE_MINUS_SRC_COLOR);
        // gl.enable(gl.BLEND);
    }

    addRenderable(renderable) {
        this.renderables.push(renderable);
    }

    loadResourcesAndStart() {
        for (let renderable of this.renderables) {
            renderable.loadResources();
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
        for (let renderable of this.renderables) {
            renderable.update();
        }

        // Draw

        // 1. Clear screen
        let gl = this.gl;
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        // 2. Draw scene
        for (let renderable of this.renderables) {
            renderable.draw(this.gl);
        }
    }
}

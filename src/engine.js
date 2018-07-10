"use strict";

import ResourceMap from './resources/resource_map';
import TextFileLoader from './resources/text_file_loader';
import Input from './input';

export default class {
    constructor() {
        this.canvas        = document.getElementById('glscreen');
        this.gl            = this.canvas.getContext('webgl');
        // this.canvas.width  = 640;
        // this.canvas.height = 480;

        this.i = 0;
        this.time = null;

        this.renderable = null;

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
        // console.log('gl.drawingBufferWidth: ', gl.drawingBufferWidth);
        // console.log('gl.drawingBufferHeight: ', gl.drawingBufferHeight);
    }

    addRenderable(renderable) {
        this.renderable = renderable;
    }

    loadResourcesAndStart() {
        if (this.renderable !== null) {
            this.renderable.loadResources();
        }
        this.resources.setLoadCompleteCallback( () => this.start() );
    }

    start() {
        this.initialize();
        if (this.renderable !== null) {
            this.renderable.initialize();
        }
        window.requestAnimationFrame((now) => this.render(now));
    }

    render(now) {
        window.requestAnimationFrame((now) => this.render(now));
    
        let dt = now - (this.time || now);
        this.time = now;
    
        // if(this.i++ < 10) {
        //     console.log(this.i, ': ', now, dt);
        // }
    
        if (this.renderable !== null) {
            this.input.update();
            this.renderable.update();

            if (this.input.isKeyPressed(this.input.Keys.Right)) {
                console.log('Pressed right');
            }
            if (this.input.isKeyClicked(this.input.Keys.Left)) {
                console.log('Clicked left');
            }
        }

        let gl = this.gl;
        gl.clearColor(1.0, 0.5, 0.5, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
    
        if (this.renderable !== null) {
            this.renderable.draw(gl);
        }
    }
}

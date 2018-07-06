"use strict";

export default class {
    constructor() {
        this.canvas        = document.getElementById('glscreen');
        this.gl            = this.canvas.getContext('webgl');
        // this.canvas.width  = 640;
        // this.canvas.height = 480;
        this.i = 0;
        this.time = null;
        this.renderable = null;
    }

    init() {
        let gl = this.gl;
    
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    }

    addRenderable(renderable) {
        this.renderable = renderable;
    }

    start() {
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
            this.renderable.update();
        }

        let gl = this.gl;
        gl.clearColor(1.0, 0.5, 0.5, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
    
        if (this.renderable !== null) {
            this.renderable.draw(gl);
        }
    }
}

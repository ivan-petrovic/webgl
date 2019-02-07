"use strict";

import IScene from './scene';

export default class DefaultScene extends IScene {
    constructor() {
        super();
        this._renderables = [];
    }

    add_renderable(renderable) {
        this._renderables.push(renderable);
    }

    load_resources() {
        for (let renderable of this._renderables) {
            renderable.load_resources();
        }
    }

    initialize() {
        for (let renderable of this._renderables) {
            renderable.initialize();
        }
    }

    update(input) {
        for (let renderable of this._renderables) {
            renderable.update(input);
        }
    }

    draw(gl) {
        for (let renderable of this._renderables) {
            renderable.draw(gl);
        }
    }

    before_draw(gl) {
        // gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);

        // let ext = gl.getExtension('EXT_blend_minmax');
        // gl.blendEquation(ext.MIN_EXT);
        // gl.blendEquation(ext.MAX_EXT);
        // gl.blendColor(1.0, 1.0, 1.0, 0.5);
        // gl.blendFunc(gl.ONE, gl.ONE);
        // gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        // gl.blendFunc(gl.SRC_COLOR, gl.ONE)
        // gl.enable(gl.BLEND);
        // gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA); // for transparent texture
        // gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clearColor(1.0, 0.7, 0.7, 1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.enable(gl.DEPTH_TEST);
    }

    clear(gl) {
        gl.clearColor(1.0, 0.7, 0.7, 1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }
}
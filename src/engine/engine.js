"use strict";

import ResourceMap from './resources/resource_map';
import TextureLoader from './resources/texture_loader';
import TextFileLoader from './resources/text_file_loader';
import ShaderLibrary from './resources/shader_library';
import VBOLibrary from './resources/vbo_library';
import Input from './input';

export default class {
    constructor() {
        this.canvas = document.getElementById('glscreen');
        this.gl     = this.canvas.getContext('webgl', {alpha: false}) || this.canvas.getContext('experimental-webgl', {alpha: false});
        this.width  = this.gl.drawingBufferWidth;
        this.height = this.gl.drawingBufferHeight;

        this.time = null;

        this._camera = null;
        this._renderables = [];
        this._light = null;

        this._resources = new ResourceMap();  // should be singleton (for now that is not implemented)
        this._shaders = new ShaderLibrary();
        this._vbos = new VBOLibrary();

        this._text_file_loader = new TextFileLoader(this._resources);
        this._texture_loader = new TextureLoader(this.gl, this._resources);
        
        this._input = new Input(this.canvas);
    }

    get canvas_element() { return this.canvas; }
    get webgl_context() { return this.gl; }
    get canvas_width() { return this.width; }
    get canvas_height() { return this.height; }

    get input() { return this._input; }
    get resources() { return this._resources; }
    get shaders_library() { return this._shaders; }
    get vbos_library() { return this._vbos; }
    get text_file_loader() { return this._text_file_loader; }
    get texture_file_loader() { return this._texture_loader; }

    get camera() { return this._camera; }
    set camera(camera) { this._camera = camera; }

    get light() { return this._light; }

    retrieve_shader(vertex_shader_file, fragment_shader_file) {
        return this._shaders.retrieve_shader(vertex_shader_file, fragment_shader_file, this._resources, this.gl);
    }
    
    retrieve_vbo(vbo_name) {
        return this._vbos.retrieve_vbo(vbo_name);
    }

    initialize() {
        let gl = this.gl;

        this._input.initialize();
        this._vbos.initialize(gl);
    
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
        gl.enable(gl.DEPTH_TEST);
    }

    add_renderable(renderable) {
        this._renderables.push(renderable);
    }

    add_light(light_source) {
        this._light = light_source;
    }

    load_resources_and_start() {
        for (let renderable of this._renderables) {
            renderable.load_resources();
        }
        this._resources.setLoadCompleteCallback( () => this.start() );
    }

    start() {
        this.initialize();
        for (let renderable of this._renderables) {
            renderable.initialize();
        }
        window.requestAnimationFrame((now) => this.render(now));
    }

    render(now) {
        // window.requestAnimationFrame((now) => this.render(now));
    
        let dt = now - (this.time || now);
        this.time = now;

        // Update
        this._input.update();
        if(this._camera !== null) {
            this._camera.update(this._input);
        }
        for (let renderable of this._renderables) {
            renderable.update(this._input);
        }

        // Clear screen and draw scene
        let gl = this.gl;

        if(this._camera !== null) {
            this._camera.setupProjectionViewMatrix(gl);
        } else {
            gl.clearColor(0.0, 0.0, 0.0, 1.0);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        }
        for (let renderable of this._renderables) {
            renderable.draw(gl);
        }
    }
}

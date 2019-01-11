"use strict";

import ResourceMap from './resources/resource_map';
import TextureLoader from './resources/texture_loader';
import TextFileLoader from './resources/text_file_loader';
import ShaderLibrary from './resources/shader_library';
import VBOLibrary from './resources/vbo_library';
import Input from './input';
import DefaultScene from './scene';

export default class {
    constructor() {
        this.canvas = document.getElementById('glscreen');
        this.gl     = this.canvas.getContext('webgl', {alpha: false}) || this.canvas.getContext('experimental-webgl', {alpha: false});
        this.width  = this.gl.drawingBufferWidth;
        this.height = this.gl.drawingBufferHeight;

        this.time = null;
        this.animation_loop = true;

        this._camera = null;
        this._light = null;
        this._scene = new DefaultScene();

        this._resources = new ResourceMap();  // should be singleton (for now that is not implemented)
        this._shaders = new ShaderLibrary();
        this._vbos = new VBOLibrary(this.gl);

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

    get scene() { return this._scene; }
    set scene(scene) { this._scene = scene; }

    get light() { return this._light; }

    retrieve_shader(vertex_shader_file, fragment_shader_file) {
        return this._shaders.retrieve_shader(vertex_shader_file, fragment_shader_file, this._resources, this.gl);
    }
    
    retrieve_vbo(vbo_name) {
        return this._vbos.retrieve_vbo(vbo_name);
    }

    initialize() {
        this._input.initialize();
        this._vbos.initialize();
        this.scene.initialize();
        this.scene.before_draw(this.gl);
    }

    add_light(light_source) {
        this._light = light_source;
    }

    load_resources_and_start() {
        this.scene.load_resources();
        this._resources.setLoadCompleteCallback( () => this.start() );
    }

    start() {
        this.initialize();
        window.requestAnimationFrame((now) => this.render(now));
    }

    render(now) {
        if (this.animation_loop) window.requestAnimationFrame((now) => this.render(now));
    
        let dt = now - (this.time || now);
        this.time = now;

        // Update
        this._input.update();
        if(this._camera !== null) {
            this._camera.update(this._input);
        }
        this.scene.update(this._input);

        // Clear screen and draw scene
        if(this._camera !== null) {
            this._camera.setupProjectionViewMatrix(this.gl);
        }
        this.scene.draw(this.gl);
    }
}

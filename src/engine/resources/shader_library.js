"use strict";

import Shader from './shader';

export default class {
    constructor() {
        this.shaders_map = {};
    }

    /**
     * @param {string} vertex_shader_file Name of the file which contains vertex shader code
     * @param {string} fragment_shader_file Name of the file which contains fragment shader code
     * 
     * @returns {Shader} Shader object
     */
    retrieve_shader(vertex_shader_file, fragment_shader_file, resources, gl) {
        let combined_name = vertex_shader_file + fragment_shader_file;
        let shader = null;

        if (combined_name in this.shaders_map) {
            shader = this.shaders_map[combined_name];
        } else {
            let vertex_shader_source = resources.retrieveAsset(vertex_shader_file);
            let fragment_shader_source = resources.retrieveAsset(fragment_shader_file);

            shader = new Shader();
            shader.create(vertex_shader_source, fragment_shader_source, gl);
            this.shaders_map[combined_name] = shader;
        }
        return shader;
    }
}

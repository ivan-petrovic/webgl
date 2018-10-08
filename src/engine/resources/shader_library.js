"use strict";

/**
 * Shader class encapsulates WebGL shader program
 * It contains helper methods for compiling and linking shader program
 */
class Shader {
    constructor() {
        this.vertex_shader_id = null;
        this.fragment_shader_id = null;
        this.program_id = null;
    }

    create(vertex_shader_source, fragment_shader_source, gl) {
        this.vertex_shader_id = this._compileShader(vertex_shader_source, gl.VERTEX_SHADER, gl);
        this.fragment_shader_id = this._compileShader(fragment_shader_source, gl.FRAGMENT_SHADER, gl);

        this.program_id = this._linkProgram(this.vertex_shader_id, this.fragment_shader_id, gl);
        gl.useProgram(this.program_id);
    }

    activate(gl) {
        gl.useProgram(this.program_id);
    }

    _compileShader(shader_source, shader_type, gl) {
        let shader_id = null;

        shader_id = gl.createShader(shader_type);
        gl.shaderSource(shader_id, shader_source);
        gl.compileShader(shader_id);
        
        // Check for errors and return results (null if error)
        // The log info is how shader compilation errors are typically displayed.
        // This is useful for debugging the shaders.
        if (!gl.getShaderParameter(shader_id, gl.COMPILE_STATUS)) {
            console.log('A shader compiling error occurred: ' + gl.getShaderInfoLog(shader_id));
        }
        return shader_id;
    }

    _linkProgram(vertex_shader_id, fragment_shader_id, gl) {
        let program_id = null;

        program_id = gl.createProgram();
        gl.attachShader(program_id, vertex_shader_id);
        gl.attachShader(program_id, fragment_shader_id);
        gl.linkProgram(program_id);
        
        // Check for error
        if (!gl.getProgramParameter(program_id, gl.LINK_STATUS)) {
            console.log('Error linking shader');
        }
        gl.useProgram(program_id);
        
        return program_id;
    }
}

export default class {
    constructor(resources, webgl_context) {
        // resources to get source code for shaders
        this.resources = resources;
        this.gl = webgl_context;
        this.shaders_map = {};
    }

    /**
     * @param {string} vertex_shader_file Name of file which contains vertex shader code
     * @param {string} fragment_shader_file Name of file which contains fragment shader code
     * 
     * @returns {Shader} Shader object
     */
    retrieveShader(vertex_shader_file, fragment_shader_file) {
        let combined_name = vertex_shader_file + fragment_shader_file;
        let shader = null;
        
        if (combined_name in this.shaders_map) {
            shader = this.shaders_map[combined_name];
            console.log('here');
        } else {
            let vertex_shader_source = this.resources.retrieveAsset(vertex_shader_file);
            let fragment_shader_source = this.resources.retrieveAsset(fragment_shader_file);
            console.log('vertex_shader_source ' + vertex_shader_source);
            console.log('fragment_shader_source ' + fragment_shader_source);
            // compile and link shader
            shader = new Shader();
            shader.create(vertex_shader_source, fragment_shader_source, this.gl);
            this.shaders_map[combined_name] = shader;
        }
        return shader;
    }
}
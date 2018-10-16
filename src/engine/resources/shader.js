"use strict";

/**
 * Shader class encapsulates WebGL shader program
 * It contains helper methods for compiling and linking shader program
 */
export default class {
    constructor() {
        this.vertex_shader_id = null;
        this.fragment_shader_id = null;
        this.program_id = null;

        this.attributes = {};
        this.uniforms = {};
    }

    create(vertex_shader_source, fragment_shader_source, gl) {
        this.vertex_shader_id = this._compileShader(vertex_shader_source, gl.VERTEX_SHADER, gl);
        this.fragment_shader_id = this._compileShader(fragment_shader_source, gl.FRAGMENT_SHADER, gl);

        this.program_id = this._linkProgram(this.vertex_shader_id, this.fragment_shader_id, gl);

        this._get_locations(vertex_shader_source, gl);
        this._get_locations(fragment_shader_source, gl);
    }

    activate(gl) {
        gl.useProgram(this.program_id);
    }

    _get_locations(shader_source, gl) {
        let lines = shader_source.split("\n");

        lines.forEach(line => {
            let tokens = line.split(" ");

            if (tokens[0] === "attribute") {
                let name = tokens[2].slice(0, -1);   // trim ';'
                let name_without_prefix = tokens[2].slice(2, -1);   // trim 'a_' in beginning and ';' at end
                this.attributes[name_without_prefix] = gl.getAttribLocation(this.program_id, name);
            }

            if (tokens[0] === "uniform") {
                let name = tokens[2].slice(0, -1);   // trim ';'
                let name_without_prefix = tokens[2].slice(2, -1);   // trim 'u_' in beginning and ';' at end
                this.uniforms[name_without_prefix] = gl.getUniformLocation(this.program_id, name);
            }
        });
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

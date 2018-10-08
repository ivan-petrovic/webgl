"use strict";

export default class {
    constructor(vertex_shader_name, fragment_shader_name) {
        this.vertex_shader_name = vertex_shader_name;
        this.fragment_shader_name = fragment_shader_name;
        this.program = null;
    }

    initialize(resources, gl) {
        let vertexShaderId;
        let fragmentShaderId;
    
        vertexShaderId = this._compileShader(this.vertex_shader_name, gl.VERTEX_SHADER, resources, gl);
        fragmentShaderId = this._compileShader(this.fragment_shader_name, gl.FRAGMENT_SHADER, resources, gl);

        this.program = this._linkProgram(vertexShaderId, fragmentShaderId, gl);
    }

    activate(gl) {
        gl.useProgram(this.program);
    }

    _compileShader(shaderId, shaderType, resources, gl) {
        let shaderSource;
        let shader = null;

        shaderSource = resources.retrieveAsset(shaderId)
        shader = gl.createShader(shaderType);
        gl.shaderSource(shader, shaderSource);
        gl.compileShader(shader);
        
        // Check for errors and return results (null if error)
        // The log info is how shader compilation errors are typically displayed.
        // This is useful for debugging the shaders.
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.log('A shader compiling error occurred: ' + gl.getShaderInfoLog(shader));
        }
        return shader;
    }

    _linkProgram(vertexShader, fragmentShader, gl) {
        let program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        
        // Check for error
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.log('Error linking shader');
        }
        gl.useProgram(program);
        
        return program;
    }
}

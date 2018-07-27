"use strict";

export default class {
    constructor(vertexShaderId, fragmentShaderId) {
        this.vertexShaderId = vertexShaderId;
        this.fragmetShaderId = fragmentShaderId;
        this.program = null;
    }

    initialize(resources, gl) {
        let vertexShader;
        let fragmentShader;
    
        vertexShader = this._compileShader(this.vertexShaderId, gl.VERTEX_SHADER, resources, gl);
        fragmentShader = this._compileShader(this.fragmetShaderId, gl.FRAGMENT_SHADER, resources, gl);

        this.program = this._linkProgram(vertexShader, fragmentShader, gl);
        
        this.getLocations(gl);
    }

    // Should be implemented by subclasses of this parent shader class.
    getLocations(gl) {
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

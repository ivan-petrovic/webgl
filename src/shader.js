"use strict";

export default class {
    constructor(vertexShaderId, fragmentShaderId, resources, gl) {
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
        // gl.enableVertexAttribArray(this.positionLocation);
        // gl.uniform1f(this.distanceLocation, 100.0);
        // gl.uniform4fv(this.mPixelColor, pixelColor);
    };

    _compileShader(shaderId, shaderType, resources, gl) {
        let shaderSource;
        let shader;

        shaderSource = resources.retrieveAsset(shaderId)
        shader = gl.createShader(shaderType);
        gl.shaderSource(shader, shaderSource);
        gl.compileShader(shader);
        
        return shader;
    }

    _linkProgram(vertexShader, fragmentShader, gl) {
        let program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);	
        gl.useProgram(program);
        
        return program;
    }
}

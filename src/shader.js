export default class {
    constructor(vertexShaderId, fragmentShaderId, gl) {
        this.vertexShaderId = vertexShaderId;
        this.fragmetShaderId = fragmentShaderId;
        this.gl = gl;
        this.program = null;
        this.positionLocation = null;
    }

    init() {
        let gl = this.gl;
        let shaderScript;
        let shaderSource;
        let vertexShader;
        let fragmentShader;
    
        vertexShader = this._compileShader(this.vertexShaderId, gl.VERTEX_SHADER);
        fragmentShader = this._compileShader(this.fragmetShaderId, gl.FRAGMENT_SHADER);

        this.program = this._linkProgram(vertexShader, fragmentShader);
        this.positionLocation = gl.getAttribLocation(this.program, "a_position");
        // this.mPixelColor = gl.getUniformLocation(this.mCompiledShader, "uPixelColor");
    }

    getPositionLocation() { return this.positionLocation; }

    activate() {
        let gl = this.gl;
        gl.useProgram(this.program);
        gl.enableVertexAttribArray(this.positionLocation);
        // gl.uniform4fv(this.mPixelColor, pixelColor);
    };

    _compileShader(shaderId, shaderType) {
        let gl = this.gl;
        let shaderScript;
        let shaderSource;
        let shader;

        shaderScript = document.getElementById(shaderId);
        shaderSource = shaderScript.text;
        shader = gl.createShader(shaderType);
        gl.shaderSource(shader, shaderSource);
        gl.compileShader(shader);
        
        return shader;
    }

    _linkProgram(vertexShader, fragmentShader) {
        let gl = this.gl;
        let program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);	
        gl.useProgram(program);
        
        return program;
    }
}

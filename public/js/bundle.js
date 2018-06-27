(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Mn = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _class = function () {
    function _class(aVertices, gl) {
        _classCallCheck(this, _class);

        this.vertices = aVertices; // the shader for shading this object
        this.gl = gl; // webgl context, passed from engine
        var vertexBufferId = null; // reference to the vertex positions for the square in the gl context
    }

    _createClass(_class, [{
        key: "initialize",
        value: function initialize() {
            var gl = this.gl;

            // Step A: Create a buffer on the WebGL context for our vertex positions
            this.vertexBufferId = gl.createBuffer();

            // Step B: Activate vertex buffer
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBufferId);

            // Step C: Loads vertices into the vertex buffer
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
        }
    }, {
        key: "getVertexBufferId",
        value: function getVertexBufferId() {
            return this.vertexBufferId;
        }
    }]);

    return _class;
}();

exports.default = _class;
},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _class = function () {
    function _class() {
        _classCallCheck(this, _class);

        this.canvas = document.getElementById('glscreen');
        this.gl = this.canvas.getContext('webgl');
        // this.canvas.width  = 640;
        // this.canvas.height = 480;
        this.i = 0;
        this.time = null;
        this.renderable = null;
    }

    _createClass(_class, [{
        key: 'init',
        value: function init() {
            var gl = this.gl;

            gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
        }
    }, {
        key: 'addRenderable',
        value: function addRenderable(renderable) {
            this.renderable = renderable;
        }
    }, {
        key: 'start',
        value: function start() {
            var _this = this;

            window.requestAnimationFrame(function (now) {
                return _this.render(now);
            });
        }
    }, {
        key: 'render',
        value: function render(now) {
            var _this2 = this;

            window.requestAnimationFrame(function (now) {
                return _this2.render(now);
            });

            var dt = now - (this.time || now);
            this.time = now;

            if (this.i++ < 10) {
                console.log(this.i);
                console.log(now, dt);
            }

            var gl = this.gl;
            gl.clearColor(1.0, 0.5, 0.5, 1.0);
            gl.clear(gl.COLOR_BUFFER_BIT);

            if (this.renderable !== null) {
                this.renderable.draw(gl);
            }
        }
    }]);

    return _class;
}();

exports.default = _class;
},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.start = start;

var _engine = require('./engine');

var _engine2 = _interopRequireDefault(_engine);

var _shader = require('./shader');

var _shader2 = _interopRequireDefault(_shader);

var _buffer = require('./buffer');

var _buffer2 = _interopRequireDefault(_buffer);

var _renderable = require('./renderable');

var _renderable2 = _interopRequireDefault(_renderable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function start() {
    var engine = new _engine2.default();
    engine.init();

    var shader = new _shader2.default("2d-vertex-shader", "2d-fragment-shader", engine.gl);
    shader.init();

    var verticesOfSquare = [1.0, 1.0, 0.0, -1.0, 1.0, 0.0, 1.0, -1.0, 0.0, -1.0, -1.0, 0.0];
    var vb = new _buffer2.default(verticesOfSquare, engine.gl);
    vb.initialize();

    var square = new _renderable2.default(shader, vb.getVertexBufferId());

    // square.draw(engine.gl);
    engine.addRenderable(square);
    engine.start();
}
},{"./buffer":1,"./engine":2,"./renderable":4,"./shader":5}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _class = function () {
    function _class(shader, vertexBuffer) {
        _classCallCheck(this, _class);

        this.shader = shader; // the shader for shading this object
        this.vertexBuffer = vertexBuffer; // the vertex buffer ?id? for this object
        this.color = [1.0, 1.0, 1.0, 1.0]; // Color for fragment shader
        this.distance = 10.0;
    }

    _createClass(_class, [{
        key: "getColor",
        value: function getColor() {
            return this.color;
        }
    }, {
        key: "setColor",
        value: function setColor(newColor) {
            this.color = newColor;
        }
    }, {
        key: "draw",
        value: function draw(gl) {
            // this.shader.activateShader(this.color);
            // maybe in activate shader

            // Step E: Activates the vertex buffer loaded in EngineCore_VertexBuffer.js
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);

            // Step F: Describe the characteristic of the vertex position attribute
            gl.vertexAttribPointer(this.shader.getPositionLocation(), 3, // each element is a 3-float (x,y.z)
            gl.FLOAT, // data type is FLOAT
            false, // if the content is normalized vectors
            0, // number of bytes to skip in between elements
            0); // offsets to the first element

            // gl.enableVertexAttribArray(this.shader.getPositionLocation());
            gl.uniform1f(this.shader.getDistanceLocation(), this.distance);
            this.distance += 0.25;
            if (this.distance > 100.0) {
                this.distance = 10.0;
            }
            //gl.uniform1f(this.shader.getDistanceLocation(), 50.0);

            this.shader.activate();
            // gl.enableVertexAttribArray(this.shader.getPositionLocation());

            // gl.drawArrays(gl.TRIANGLES, 0, 6);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        }
    }]);

    return _class;
}();

exports.default = _class;
},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _class = function () {
    function _class(vertexShaderId, fragmentShaderId, gl) {
        _classCallCheck(this, _class);

        this.vertexShaderId = vertexShaderId;
        this.fragmetShaderId = fragmentShaderId;
        this.gl = gl;
        this.program = null;
        this.positionLocation = null;
    }

    _createClass(_class, [{
        key: "init",
        value: function init() {
            var gl = this.gl;
            var shaderScript = void 0;
            var shaderSource = void 0;
            var vertexShader = void 0;
            var fragmentShader = void 0;

            vertexShader = this._compileShader(this.vertexShaderId, gl.VERTEX_SHADER);
            fragmentShader = this._compileShader(this.fragmetShaderId, gl.FRAGMENT_SHADER);

            this.program = this._linkProgram(vertexShader, fragmentShader);
            gl.useProgram(this.program);
            this.positionLocation = gl.getAttribLocation(this.program, "a_position");
            this.distanceLocation = gl.getUniformLocation(this.program, "uDistance");
            // this.mPixelColor = gl.getUniformLocation(this.mCompiledShader, "uPixelColor");
        }
    }, {
        key: "getPositionLocation",
        value: function getPositionLocation() {
            return this.positionLocation;
        }
    }, {
        key: "getDistanceLocation",
        value: function getDistanceLocation() {
            return this.distanceLocation;
        }
    }, {
        key: "activate",
        value: function activate() {
            var gl = this.gl;
            // gl.useProgram(this.program);
            gl.enableVertexAttribArray(this.positionLocation);
            // gl.uniform1f(this.distanceLocation, 100.0);
            // gl.uniform4fv(this.mPixelColor, pixelColor);
        }
    }, {
        key: "_compileShader",
        value: function _compileShader(shaderId, shaderType) {
            var gl = this.gl;
            var shaderScript = void 0;
            var shaderSource = void 0;
            var shader = void 0;

            shaderScript = document.getElementById(shaderId);
            shaderSource = shaderScript.text;
            shader = gl.createShader(shaderType);
            gl.shaderSource(shader, shaderSource);
            gl.compileShader(shader);

            return shader;
        }
    }, {
        key: "_linkProgram",
        value: function _linkProgram(vertexShader, fragmentShader) {
            var gl = this.gl;
            var program = gl.createProgram();
            gl.attachShader(program, vertexShader);
            gl.attachShader(program, fragmentShader);
            gl.linkProgram(program);
            gl.useProgram(program);

            return program;
        }
    }]);

    return _class;
}();

exports.default = _class;
},{}]},{},[3])(3)
});

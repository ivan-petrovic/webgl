"use strict";

import Renderable from './engine/renderable';
import ConstColorShader from './const_color_shader';
import VertexBuffer from './engine/buffer';

const X = .525731112119133606;
const Z = .850650808352039932;

// Next two properties are shared by all instances of class (static properties)
let _shader = null;         // the shader for shading this object
let _vertexBuffer = null;   // the vertex buffer for this object

export default class Icosahedron extends Renderable {
    constructor(engine, radius, depth) {
        super(engine);

        this.radius = radius;
        this.depth = depth;
        this.color = [1.0, 0.0, 0.0, 1.0]; // default red color

        this.vertices = [];

        // 12 vertices of icosahedron
        this.baseVertices = [
            vec3.fromValues(-X, 0.0, Z), vec3.fromValues(X, 0.0, Z), vec3.fromValues(-X, 0.0, -Z), 
            vec3.fromValues(X, 0.0, -Z), vec3.fromValues(0.0, Z, X), vec3.fromValues(0.0, Z, -X),
            vec3.fromValues(0.0, -Z, X), vec3.fromValues(0.0, -Z, -X), vec3.fromValues(Z, X, 0.0),
            vec3.fromValues(-Z, X, 0.0), vec3.fromValues(Z, -X, 0.0), vec3.fromValues(-Z, -X, 0.0)
        ];
      
         // indices of vertics, grouped by 3
         // that is, every 3 indices mark 1 triangle
         this.indices = [
            1, 4, 0, 4, 9, 0, 4, 5, 9, 8, 5, 4, 1, 8, 4,
            1, 10, 8, 10, 3, 8, 8, 3, 5, 3, 2, 5, 3, 7, 2,
            3, 10, 7, 10, 6, 7, 6, 11, 7, 6, 0, 11, 6, 1, 0,
            10, 1, 6, 11, 0, 9, 2, 11, 9, 5, 2, 9, 11, 2, 7
         ];
    }

    static get vertexShaderName() { return 'shaders/basicVS.glsl'; }
    static get fragmentShaderName() { return 'shaders/basicFS.glsl'; }
    static get shader() { return _shader; }
    static set shader(value) { _shader = value; }
    static get vertexBuffer() { return _vertexBuffer; }
    static set vertexBuffer(value) { _vertexBuffer = value; }
    
    setColor(color) { this.color = color; }
    getColor() { return this.color; }
    
    loadResources() {
        // Load necessery shader files asynchroniously
        let textFileLoader = this.engine.text_file_loader;

        textFileLoader.loadTextFile(Icosahedron.vertexShaderName, textFileLoader.eTextFileType.eTextFile);
        textFileLoader.loadTextFile(Icosahedron.fragmentShaderName, textFileLoader.eTextFileType.eTextFile);
    }

    initialize() {
        if(Icosahedron.shader === null) {
            Icosahedron.shader = new ConstColorShader(Icosahedron.vertexShaderName, Icosahedron.fragmentShaderName);
            Icosahedron.shader.initialize(this.engine.resources, this.engine.webgl_context);
        }

        if(Icosahedron.vertexBuffer === null) {
            // For each face of icosahedron (20 faces * 3 vertices per face)
            for (let i = 0; i < 60; i += 3) {
                // let i = 0;
                this.subdivide(
                    this.baseVertices[this.indices[i + 0]],
                    this.baseVertices[this.indices[i + 1]],
                    this.baseVertices[this.indices[i + 2]],
                    this.depth
                );
            }
            console.log('this.vertices.length', this.vertices.length);          
            Icosahedron.vertexBuffer = new VertexBuffer(this.vertices, null);
            Icosahedron.vertexBuffer.initialize(this.engine.webgl_context);
        }
    }

    subdivide(v1,v2,v3, depth) {
        let v12 = vec3.fromValues(0.0, 0.0, 0.0);
        let v23 = vec3.fromValues(0.0, 0.0, 0.0);
        let v31 = vec3.fromValues(0.0, 0.0, 0.0);
        // console.log('depth: ', depth);
        if (depth === 0) {
            // console.log('v1: ', vec3.str(v1));
            // console.log('v2: ', vec3.str(v2));
            // console.log('v3: ', vec3.str(v3));
            this.vertices.push(v1[0], v1[1], v1[2], v2[0], v2[1], v2[2], v3[0], v3[1], v3[2]);
            // console.log(this.vertices);
            return;
        }
        // console.log('didn\'t get here');
        // for(let i = 0; i < 3; i += 1) {
            // console.log(vec3.str(v12));
            vec3.add(v12, v1, v2); 
            // console.log(vec3.str(v12));
            vec3.scale(v12, v12, 0.5);
            // console.log(vec3.str(v12));
            
            vec3.add(v23, v2, v3); vec3.scale(v23, v23, 0.5);
            
            vec3.add(v31, v3, v1); vec3.scale(v31, v31, 0.5);
            // v12 = ((v1 + v2) / 2.0);
            // v23 = ((v2 + v3) / 2.0);
            // v31 = ((v3 + v1) / 2.0);
        // }

        vec3.normalize(v12, v12);
        vec3.normalize(v23, v23);
        vec3.normalize(v31, v31);
        // v12.Normalize();
        // v23.Normalize();
        // v31.Normalize();

        // vec3.scale(v12, v12, this.radius);
        // vec3.scale(v23, v23, this.radius);
        // vec3.scale(v31, v31, this.radius);
        // v12 *= radius;
        // v23 *= radius;
        // v31 *= radius;

        this.subdivide(v1, v12, v31, depth-1);
        this.subdivide(v2, v23, v12, depth-1);
        this.subdivide(v3, v31, v23, depth-1);
        this.subdivide(v12, v23, v31, depth-1);
    }

    draw(gl) {
        let camera = this.engine.camera;
        let pvmMatrix = mat4.create();
        let modelMatrix = mat4.create(); // Creates a blank identity matrix
        
        // modelMatrix = mat4.fromTranslation(this.modelMatrix, [this.centerX, this.centerY, 0.0]);
        
        // Step A: compute translation, for now z is always at 0.0
        // mat4.translate(modelMatrix, modelMatrix, vec3.fromValues(this.centerX, this.centerY, 0.0));
        // Step B: concatenate with rotation.
        // mat4.rotateZ(matrix, matrix, this.getRotationInRad());
        // Step C: concatenate with scaling
        // mat4.scale(modelMatrix, modelMatrix, vec3.fromValues(this.width, this.height, 1.0));

        mat4.multiply(pvmMatrix, camera.getPVMatrix(), modelMatrix);
        Icosahedron.shader.activate(gl);
        
        // Activates the vertex buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, Icosahedron.vertexBuffer.getVertexBufferId());

        // Describe the characteristic of the vertex position attribute
        gl.vertexAttribPointer(Icosahedron.shader.positionLocation,
            3,              // each element is a 3-float (x,y,z)
            gl.FLOAT,       // data type is FLOAT
            false,          // if the content is normalized vectors
            0,              // number of bytes to skip in between elements
            0);             // offsets to the first element

        gl.enableVertexAttribArray(Icosahedron.shader.positionLocation);

        gl.uniformMatrix4fv(Icosahedron.shader.PVMTransformLocation, false, pvmMatrix);
        gl.uniform4fv(Icosahedron.shader.colorLocation, this.color);

        for(let i = 0; i < this.vertices.length / 3; i += 3) {
            gl.drawArrays(gl.LINE_LOOP, i, 3);
        }
        // gl.drawArrays(gl.TRIANGLES, 0, this.vertices.length / 3);
        // gl.drawElements(gl.TRIANGLES, 60, gl.UNSIGNED_BYTE, 0);
    }
}

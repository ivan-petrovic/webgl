"use strict";

import Renderable from './engine/renderable';

const X = .525731112119133606;
const Z = .850650808352039932;

export default class Icosahedron extends Renderable {
    constructor(engine, radius, depth) {
        // super(engine, 'basic_vs.glsl', 'basic_fs.glsl');
        super(engine, 'goraud_phong_vs.glsl', 'goraud_phong_fs.glsl');

        this.radius = radius;
        this.depth = depth;
        this._color = [1.0, 0.0, 0.0, 1.0];  // default red color
        this._position = [0.0, 0.0, 0.0];
        this._scale = 1.0;

        this.vertex_buffer_id = null;
        this.normals_buffer_id = null;

        this.vertices = [];
        this.normals = [];
        this.vertices_count = Math.pow(4, this.depth) * 20 * 9; // why 9? 3 cordinates for each vertex of triangle 3 * 3 = 9

        // 12 vertices of icosahedron
        this.base_vertices = [
            vec3.fromValues(-X, 0.0, Z), vec3.fromValues(X, 0.0, Z), vec3.fromValues(-X, 0.0, -Z), 
            vec3.fromValues(X, 0.0, -Z), vec3.fromValues(0.0, Z, X), vec3.fromValues(0.0, Z, -X),
            vec3.fromValues(0.0, -Z, X), vec3.fromValues(0.0, -Z, -X), vec3.fromValues(Z, X, 0.0),
            vec3.fromValues(-Z, X, 0.0), vec3.fromValues(Z, -X, 0.0), vec3.fromValues(-Z, -X, 0.0)
        ];
      
         // indices of vertices, grouped by 3
         // that is, every 3 indices mark 1 triangle
         this.indices = [
            1, 4, 0, 4, 9, 0, 4, 5, 9, 8, 5, 4, 1, 8, 4,
            1, 10, 8, 10, 3, 8, 8, 3, 5, 3, 2, 5, 3, 7, 2,
            3, 10, 7, 10, 6, 7, 6, 11, 7, 6, 0, 11, 6, 1, 0,
            10, 1, 6, 11, 0, 9, 2, 11, 9, 5, 2, 9, 11, 2, 7
         ];
    }
   
    set color(color) { this._color = color; }
    get color() { return this._color; }

    set position(position) { this._position = position; }
    get position() { return this._position; }

    set scale(scale) { this._scale = scale; }
    get scale() { return this._scale; }

    initialize() {
        super.initialize();

        this.vertex_buffer_id = this.engine.retrieve_vbo('ICOSAHEDRON');
        this.normals_buffer_id = this.engine.retrieve_vbo('ICOSAHEDRON_NORMALS');

        if(this.vertex_buffer_id === null) {
            // For each face of icosahedron (20 faces * 3 vertices per face)
            for (let i = 0; i < 60; i += 3) {
                this.subdivide(
                    this.base_vertices[this.indices[i + 0]],
                    this.base_vertices[this.indices[i + 1]],
                    this.base_vertices[this.indices[i + 2]],
                    this.depth
                );
            }
            
            let gl = this.engine.webgl_context;
            this.engine.vbos_library.add_vbo('ICOSAHEDRON', new Float32Array(this.vertices), gl.ARRAY_BUFFER, gl);
            this.engine.vbos_library.add_vbo('ICOSAHEDRON_NORMALS', new Float32Array(this.normals), gl.ARRAY_BUFFER, gl);
            
            this.vertex_buffer_id = this.engine.retrieve_vbo('ICOSAHEDRON');
            this.normals_buffer_id = this.engine.retrieve_vbo('ICOSAHEDRON_NORMALS');
        }
    }

    subdivide(v1,v2,v3, depth) {
        let v12 = vec3.fromValues(0.0, 0.0, 0.0);
        let v23 = vec3.fromValues(0.0, 0.0, 0.0);
        let v31 = vec3.fromValues(0.0, 0.0, 0.0);

        if (depth === 0) {
            this.vertices.push(v1[0], v1[1], v1[2], v2[0], v2[1], v2[2], v3[0], v3[1], v3[2]);
            
            let normal = vec3.create();
            vec3.normalize(normal, v1);
            this.normals.push(normal[0], normal[1], normal[2]);
            vec3.normalize(normal, v2);
            this.normals.push(normal[0], normal[1], normal[2]);
            vec3.normalize(normal, v3);
            this.normals.push(normal[0], normal[1], normal[2]);
            return;
        }
        
        vec3.add(v12, v1, v2); vec3.scale(v12, v12, 0.5);
        vec3.add(v23, v2, v3); vec3.scale(v23, v23, 0.5);
        vec3.add(v31, v3, v1); vec3.scale(v31, v31, 0.5);

        vec3.normalize(v12, v12);
        vec3.normalize(v23, v23);
        vec3.normalize(v31, v31);

        // vec3.scale(v12, v12, this.radius);
        // vec3.scale(v23, v23, this.radius);
        // vec3.scale(v31, v31, this.radius);

        this.subdivide(v1, v12, v31, depth-1);
        this.subdivide(v2, v23, v12, depth-1);
        this.subdivide(v3, v31, v23, depth-1);
        this.subdivide(v12, v23, v31, depth-1);
    }

    draw(gl) {
        // if (this.engine.input.isKeyPressed(this.engine.input.Keys.A)) {
        //     console.log('ico position: ' + this.position);
        //     console.log('ico color:    ' + this.color);
        //     console.log('depth:    ' + this.depth);
        //     console.log('length:    ' + this.vertices.length);
        // }

        let camera = this.engine.camera;
        let light = this.engine.light;
        
        // let pvm_matrix = mat4.create();
        let normal_matrix = mat3.create();
        let model_matrix = mat4.create(); // Creates a blank identity matrix
        let view_model_matrix = mat4.create(); // Creates a blank identity matrix
        
        // Step A: compute translation, for now z is always at 0.0
        mat4.translate(model_matrix, model_matrix, vec3.fromValues(this._position[0], this._position[1], this._position[2]));
        // Step B: concatenate with rotation.
        // mat4.rotateZ(matrix, matrix, this.getRotationInRad());
        // Step C: concatenate with scaling
        mat4.scale(model_matrix, model_matrix, vec3.fromValues(this.scale, this.scale, this.scale));

        // mat4.multiply(pvm_matrix, camera.getPVMatrix(), model_matrix);
        mat4.multiply(view_model_matrix, camera.view_matrix, model_matrix);

        // mat4.identity(normal_matrix);
        // mat4.set(normal_matrix, view_model_matrix);
        // mat4.invert(normal_matrix, view_model_matrix);
        // mat4.transpose(normal_matrix, normal_matrix);
        mat3.normalFromMat4(normal_matrix, view_model_matrix);

        this.shader.activate(gl);
        
        // Activates the vertex buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertex_buffer_id);

        // Describe the characteristic of the vertex position attribute
        gl.vertexAttribPointer(this.shader.attributes.position,
            3,              // each element is a 3-float (x,y,z)
            gl.FLOAT,       // data type is FLOAT
            false,          // if the content is normalized vectors
            0,              // number of bytes to skip in between elements
            0);             // offsets to the first element

        gl.enableVertexAttribArray(this.shader.attributes.position);

        // Activates the normals buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normals_buffer_id);

        // Describe the characteristic of the vertex position attribute
        gl.vertexAttribPointer(this.shader.attributes.normal,
            3,              // each element is a 3-float (x,y,z)
            gl.FLOAT,       // data type is FLOAT
            false,          // if the content is normalized vectors
            0,              // number of bytes to skip in between elements
            0);             // offsets to the first element

        gl.enableVertexAttribArray(this.shader.attributes.normal);
        
        // uniform mat4 u_VM_transform;
        // uniform mat4 u_P_transform;
        // uniform mat4 u_N_transform;
        gl.uniformMatrix4fv(this.shader.uniforms.VM_transform, false, view_model_matrix);
        gl.uniformMatrix4fv(this.shader.uniforms.P_transform, false, camera.projection_matrix);
        gl.uniformMatrix3fv(this.shader.uniforms.N_transform, false, normal_matrix);

        gl.uniform3fv(this.shader.uniforms.light_direction, light.direction);
        gl.uniform4fv(this.shader.uniforms.light_ambient, light.ambient);
        gl.uniform4fv(this.shader.uniforms.light_diffuse, light.diffuse);
        gl.uniform4fv(this.shader.uniforms.light_specular, light.specular);
        gl.uniform1f(this.shader.uniforms.shininess, light.shininess);

        // gl.uniform4fv(this.shader.uniforms.material_ambient, [0.1,0.5,0.8,1.0]);
        // gl.uniform4fv(this.shader.uniforms.material_diffuse, [0.1,0.5,0.8,1.0]);
        // gl.uniform4fv(this.shader.uniforms.material_specular, [1.0,1.0,1.0,1.0]);

        gl.uniform4fv(this.shader.uniforms.material_ambient, this.color);
        gl.uniform4fv(this.shader.uniforms.material_diffuse, this.color);
        gl.uniform4fv(this.shader.uniforms.material_specular, [1.0,1.0,1.0,1.0]);

        // for(let i = 0; i < this.vertices_count / 3; i += 3) {
        //     gl.drawArrays(gl.LINE_LOOP, i, 3);
        // }
        gl.drawArrays(gl.TRIANGLES, 0, this.vertices_count / 3);
        // gl.drawElements(gl.TRIANGLES, 60, gl.UNSIGNED_BYTE, 0);
    }
}

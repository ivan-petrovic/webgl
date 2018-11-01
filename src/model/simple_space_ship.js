"use strict";

import Renderable from '../engine/renderable';

export default class SimpleSpaceShip extends Renderable {
    constructor(engine) {
        // super(engine, 'basic_vs.glsl', 'basic_fs.glsl');
        super(engine, 'goraud_phong_vs.glsl', 'goraud_phong_fs.glsl');

        this._color = [0.0, 0.0, 1.0, 1.0];
        this._position = [0.0, 0.0, 0.0];
        this._scale = 1.0;

        this.vertex_buffer_id = null;
        this.normals_buffer_id = null;

        this.vertices = [];
        this.normals = [];
        this.vertices_count = 6 * 3; // why 6 triangles, 3 vertices each
    }
   
    set color(color) { this._color = color; }
    get color() { return this._color; }

    set position(position) { this._position = position; }
    get position() { return this._position; }

    set scale(scale) { this._scale = scale; }
    get scale() { return this._scale; }

    initialize() {
        super.initialize();

        this.vertex_buffer_id = this.engine.retrieve_vbo('SIMPLE_SPACE_SHIP');
        this.normals_buffer_id = this.engine.retrieve_vbo('SIMPLE_SPACE_SHIP_NORMALS');

        if(this.vertex_buffer_id === null) {
            this._generate_vertices();
            
            let gl = this.engine.webgl_context;
            this.vertex_buffer_id = this.engine.vbos_library.add_vbo('SIMPLE_SPACE_SHIP', new Float32Array(this.vertices), gl.ARRAY_BUFFER, gl);
            this.normals_buffer_id = this.engine.vbos_library.add_vbo('SIMPLE_SPACE_SHIP_NORMALS', new Float32Array(this.normals), gl.ARRAY_BUFFER, gl);
        }
    }

    _generate_vertices() {
        // v1 -0.5, 0.0, 0.5
        // v2  0.0, 0.0, 0.0
        // v3  0.5, 0.0, 0.5
        // v4  0.0, 0.0,-1.0
        // v5  0.0, 0.5, 0.0

        // t1 1 2 4
        // t2 2 3 4
        // t3 1 2 5
        // t4 2 3 5
        // t5 1 5 4
        // t6 3 4 5

        this.vertices.push(-0.5, 0.0, 0.5, 0.0, 0.0, 0.0, 0.0, 0.0,-1.0);   // t1
        this.vertices.push( 0.0, 0.0, 0.0, 0.5, 0.0, 0.5, 0.0, 0.0,-1.0);   // t2
        this.vertices.push(-0.5, 0.0, 0.5, 0.0, 0.0, 0.0, 0.0, 0.5, 0.0);   // t3
        this.vertices.push( 0.0, 0.0, 0.0, 0.5, 0.0, 0.5, 0.0, 0.5, 0.0);   // t4
        this.vertices.push(-0.5, 0.0, 0.5, 0.0, 0.5, 0.0, 0.0, 0.0,-1.0);   // t5
        this.vertices.push( 0.5, 0.0, 0.5, 0.0, 0.0,-1.0, 0.0, 0.5, 0.0);   // t6
            
        this.normals.push( 0.0,-1.0, 0.0, 0.0,-1.0, 0.0, 0.0,-1.0, 0.0);   // normals for 3 vertices of t1
        this.normals.push( 0.0,-1.0, 0.0, 0.0,-1.0, 0.0, 0.0,-1.0, 0.0);   // normals for 3 vertices of t2
        this.normals.push( 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0);   // normals for 3 vertices of t3
        this.normals.push(-1.0, 0.0, 1.0,-1.0, 0.0, 1.0,-1.0, 0.0, 1.0);   // normals for 3 vertices of t3
        this.normals.push(-1.0, 1.0,-1.0,-1.0, 1.0,-1.0,-1.0, 1.0,-1.0);   // normals for 3 vertices of t3
        this.normals.push( 1.0, 1.0,-1.0, 1.0, 1.0,-1.0, 1.0, 1.0,-1.0);   // normals for 3 vertices of t3
    }

    draw(gl) {
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
        
        gl.uniformMatrix4fv(this.shader.uniforms.VM_transform, false, view_model_matrix);
        gl.uniformMatrix4fv(this.shader.uniforms.P_transform, false, camera.projection_matrix);
        gl.uniformMatrix3fv(this.shader.uniforms.N_transform, false, normal_matrix);

        gl.uniform3fv(this.shader.uniforms.light_direction, light.direction);
        gl.uniform4fv(this.shader.uniforms.light_ambient, light.ambient);
        gl.uniform4fv(this.shader.uniforms.light_diffuse, light.diffuse);
        gl.uniform4fv(this.shader.uniforms.light_specular, light.specular);
        gl.uniform1f(this.shader.uniforms.shininess, light.shininess);

        gl.uniform4fv(this.shader.uniforms.material_ambient, this.color);
        gl.uniform4fv(this.shader.uniforms.material_diffuse, this.color);
        gl.uniform4fv(this.shader.uniforms.material_specular, [1.0,1.0,1.0,1.0]);

        gl.drawArrays(gl.TRIANGLES, 0, this.vertices_count);
    }
}

"use strict";

import Renderable from '../engine/renderable';

export default class Line extends Renderable {
    constructor(engine, start_point, end_point) {
        super(engine, 'basic_vs.glsl', 'basic_fs.glsl');
        this.vertex_buffer = null;
        this.offset = 0;    // offset in buffer

        this.color = [1.0, 0.0, 0.0, 1.0];
        this.normal_color = [0.0, 0.0, 1.0, 1.0];
        this.show_normal = true;

        // line segment from p to q
        this.p = start_point;   // type vec2
        this.q = end_point;     // type vec2

        // parametric equation of line:
        // l(t) = p + tv, v = q - p
        this.v = vec2.subtract(vec2.create(), this.q, this.p);

        // implicit equation ax + by + c = 0,
        // normal an = [a1, a2],
        // a = a1, b = a2, c = -a1p1 - a2p2
        // v = q - p = [v1, v2] => a = [-v2, v1]
        this.an = vec2.fromValues(-this.v[1], this.v[0]);
        this.n = vec2.normalize(vec2.create(), this.an); // unit normal

        // implicit koeficients
        this.a = this.an[0];
        this.b = this.an[1];
        this.c = -this.an[0] * this.p[0] - this.an[1] * this.p[1];

        // implicit koeficients in point normal form
        this.length_of_a = vec2.length(this.an);
        this.anf = this.a / this.length_of_a;
        this.bnf = this.b / this.length_of_a;
        this.cnf = this.c / this.length_of_a;
    }

    distance(r) {
        // d = dot(a, (r - p)) / |a|, if |a| = 1 => point normal form
        // or d = anf * r1 + bnf * r2 + cnf
        return this.anf * r[0] + this.bnf * r[1] + this.cnf;
    }

    foot(r) {
        // foot of point t = dot(v, w) / |v|^2, w = r - p
        let w = vec2.subtract(vec2.create(), r, this.p);
        console.log("w: " + vec2.str(w));
        console.log("v: " + vec2.str(this.v));
        let t = vec2.dot(this.v, w) / vec2.squaredLength(this.v);
        console.log("vec2.dot(this.v, w) " + vec2.dot(this.v, w));
        console.log("vec2.squaredLength(this.v) " + vec2.squaredLength(this.v));
        console.log("t: " + t);
        let ret = vec2.scaleAndAdd(vec2.create(), this.p, this.v, t)
        console.log("foot: " + vec2.str(ret));
        return ret;
    }

    intersection(l) {
        // check if denominator is zero
        let t = (-l.c - l.a * this.p[0] - l.b * this.p[1]) / (l.a * this.v[0] + l.b * this.v[1]);
        console.log(t);
        let ret = vec2.scaleAndAdd(vec2.create(), this.p, this.v, t)
        console.log("intersection: " + vec2.str(ret));
        return ret;
    }

    print() {
        console.log("p: " + vec2.str(this.p));
        console.log("q: " + vec2.str(this.q));
        console.log("v: " + vec2.str(this.v));
        console.log("a: " + vec2.str(this.an));
        console.log("|a|: " + this.length_of_a);
        console.log("n: " + vec2.str(this.n));
        console.log("(a,b,c): " + this.a + ", "  + this.b + ", "  + this.c);
        console.log("(anf,bnf,cnf): " + this.anf + ", "  + this.bnf + ", "  + this.cnf);
    }

    initialize() {
        super.initialize();

        let gl = this.engine.webgl_context;
        this.vertex_buffer = this.engine.vbos_library.get_vbo('SET_OF_LINES');

        if (this.vertex_buffer === null) {
            this.vertex_buffer = this.engine.vbos_library.create_vbo('SET_OF_LINES', 1024, gl.ARRAY_BUFFER, gl);
        }

        let points = new Float32Array([
            this.p[0],this.p[1],0.0,
            this.q[0],this.q[1],0.0
        ]);
        // console.log(this.start_position);
        // console.log(this.end_position);
        // console.log(points);
        this.offset = this.vertex_buffer.load_data(points, gl);
        // this.vertex_buffer.load_data(new Float32Array(this.start_position), gl);
        // this.vertex_buffer.load_data(new Float32Array(this.end_position), gl);

        if(this.show_normal) {
            let normal_points = new Float32Array([
                this.q[0],this.q[1],0.0,
                this.q[0] + this.n[0],this.q[1] + this.n[1],0.0
            ]);
            this.vertex_buffer.load_data(normal_points, gl);
        }
    }

    draw(gl) {
        let camera = this.engine.camera;
        let pvmMatrix = mat4.create();
        // let modelMatrix = mat4.create(); // Creates a blank identity matrix

        mat4.multiply(pvmMatrix, camera.getPVMatrix(), pvmMatrix);
        
        this.shader.activate(gl);

        // Activates the vertex buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertex_buffer.id);

        // Describe the characteristic of the vertex position attribute
        gl.vertexAttribPointer(this.shader.attributes.position,
            3,              // each element is a 3-float (x,y,z)
            gl.FLOAT,       // data type is FLOAT
            false,          // if the content is normalized vectors
            0,              // number of bytes to skip in between elements
            0);             // offsets to the first element
        gl.enableVertexAttribArray(this.shader.attributes.position);

        gl.uniformMatrix4fv(this.shader.uniforms.PVM_transform, false, pvmMatrix);
        gl.uniform4fv(this.shader.uniforms.pixel_color, this.color);
        // console.log("offset: " + Math.floor(this.offset / 12));
        gl.drawArrays(gl.LINES, this.offset / 12, 2);

        if(this.show_normal) {
            gl.uniform4fv(this.shader.uniforms.pixel_color, this.normal_color);
            gl.drawArrays(gl.LINES, this.offset / 12 + 2, 2);
        }
    }
}

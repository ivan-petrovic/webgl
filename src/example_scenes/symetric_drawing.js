"use strict";

import IScene from '../engine/scene';

export default class extends IScene {

    constructor(engine) {
        super();
        this.engine = engine;

        this.last_point = null;
        this.symmetry = 4;
        this.angle = (360 / this.symmetry) * Math.PI / 180.0; // in radians
        this.drawing_mode = false;
        this.points_cnt = 0;
        this.color = [0.0, 0.0, 1.0, 1.0];

        this.shader = null;
        this.vertex_shader_name = 'basic_vs.glsl';
        this.fragment_shader_name = 'basic_fs.glsl';
        this.vertex_buffer_id = null;
        this.offset = null;

        this.bgColor = [0.8, 0.8, 0.8, 1]; // RGB and Alpha
        this.just_once = false;
    }

    load_resources() {
        let textFileLoader = this.engine.text_file_loader;
        textFileLoader.loadTextFile(this.vertex_shader_name, textFileLoader.eTextFileType.eTextFile);
        textFileLoader.loadTextFile(this.fragment_shader_name, textFileLoader.eTextFileType.eTextFile);
    }

    initialize() {
        this.vertex_buffer_id = this.engine.vbos_library.get_vbo_id('VBO_POSITION');
        this.shader = this.engine.retrieve_shader(this.vertex_shader_name, this.fragment_shader_name);
    }

    update(input) {
        if(input.isButtonPressed(input.MouseButton.Left)) {
            this.drawing_mode = true;
        } else {
            this.drawing_mode = false;
        }

        if(this.drawing_mode) {
            let curr_point = input.get_pos(40, 30);
            let temp_point = vec2.create();
            let origin = vec2.fromValues(0.0, 0.0);

            if(this.last_point !== null) {
                let distance = vec2.distance(curr_point, this.last_point);
                if(distance > 2.0) {
                    this.add_point_to_vbo(curr_point);
                    this.points_cnt += 1;
                    this.last_point = curr_point;
                    console.log("this.points_cnt: " + this.points_cnt);

                    for(let i = 1; i < this.symmetry; i += 1) {
                        vec2.rotate(temp_point, curr_point, origin, this.angle * i);
                        this.add_point_to_vbo(temp_point);
                    }
                }
            } else {
                console.log("adding first point to VBO");

                if(this.offset === null) {
                    this.offset = this.add_point_to_vbo(curr_point);    // first click, remember offset
                } else {
                    this.engine.vbos_library.reset_offset('VBO_POSITION', this.offset);
                    this.add_point_to_vbo(curr_point);    // first click, remember offset
                }
                
                this.points_cnt += 1;
                this.last_point = curr_point;
                console.log("this.points_cnt: " + this.points_cnt);
                console.log("this.offset: " + this.offset);

                for(let i = 1; i < this.symmetry; i += 1) {
                    vec2.rotate(temp_point, curr_point, origin, this.angle * i);
                    this.add_point_to_vbo(temp_point);
                }
            }
        } else {
            // finished drawing
            if(this.last_point !== null) {
                this.last_point = null;
                this.points_cnt = 0;

                // let curr_point = input.get_pos(40, 30);
                // let temp_point = vec2.create();
                // let origin = vec2.fromValues(0.0, 0.0);
    
                // this.add_point_to_vbo(curr_point);
                // this.points_cnt += 1;

                // for(let i = 1; i < this.symmetry; i += 1) {
                //     vec2.rotate(temp_point, curr_point, origin, this.angle * i);
                //     this.add_point_to_vbo(temp_point);
                // }
            }

            if (input.isKeyClicked(input.Keys.Right)) {
                this.symmetry += 1;
                if(this.symmetry > 16) this.symmetry = 16;
                if(this.symmetry < 1) this.symmetry = 1;
                this.angle = (360 / this.symmetry) * Math.PI / 180.0; // in radians
                console.log("this.symmetry: " + this.symmetry);
            }
            if (input.isKeyClicked(input.Keys.Left)) {
                this.symmetry -= 1;
                if(this.symmetry > 16) this.symmetry = 16;
                if(this.symmetry < 1) this.symmetry = 1;
                this.angle = (360 / this.symmetry) * Math.PI / 180.0; // in radians
                console.log("this.symmetry: " + this.symmetry);
            }
            if (input.isKeyClicked(input.Keys.D)) {
                console.log("this.color D");
                this.color = [0.0, 0.0, 1.0, 1.0];
            }
            if (input.isKeyClicked(input.Keys.R)) {
                console.log("this.color R");
                this.color = [1.0, 0.0, 0.0, 1.0];
            }
            if (input.isKeyClicked(input.Keys.G)) {
                console.log("this.color G");
                this.color = [0.0, 1.0, 0.0, 1.0];
            }
        }
    }

    add_point_to_vbo(point) {
        let coords = new Float32Array([
            point[0], point[1], 0.0
        ]);

        let offset = this.engine.vbos_library.load_data_in_vbo('VBO_POSITION', coords);
        
        // console.log("adding to VBO: " + vec2.str(point));

        return offset;
    }

    draw(gl) {
        // if (!this.drawing_mode) return;
        if (this.points_cnt < 2) return;
        // gl.clearColor(1.0, 0.0, 0.0, 1.0);
        // gl.clear(gl.COLOR_BUFFER_BIT);

        // console.log("draw");

        let pvmMatrix = this.engine.camera.getPVMatrix();

        this.shader.activate(gl);

        // Activates the vertex buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertex_buffer_id);

        for(let i = 0; i < this.symmetry; i += 1) {
            // Describe the characteristic of the vertex position attribute
            gl.vertexAttribPointer(this.shader.attributes.position,
                3,              // each element is a 3-float (x,y,z)
                gl.FLOAT,       // data type is FLOAT
                false,          // if the content is normalized vectors
                this.symmetry * 3 * 4,              // number of bytes to skip in between elements
                this.offset + i * 3 * 4);             // offsets to the first element
            gl.enableVertexAttribArray(this.shader.attributes.position);

            gl.uniformMatrix4fv(this.shader.uniforms.PVM_transform, false, pvmMatrix);
            gl.uniform4fv(this.shader.uniforms.pixel_color, this.color);
            // console.log("offset: " + Math.floor(this.offset / 12));
            // gl.drawArrays(gl.LINE_STRIP, this.offset / 12, this.points_cnt);
            gl.drawArrays(gl.LINE_STRIP, 0, this.points_cnt);
        }
    }

    before_draw(gl) {
        console.log("my scene before draw");
        gl.clearColor(0.8, 0.8, 0.8, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
    }

    // clear(gl) {
    //     if(this.just_once) return;
    //     console.log("my scene clear");
    //     gl.clearColor(this.bgColor[0], this.bgColor[1], this.bgColor[2], this.bgColor[3]);
    //     gl.clear(gl.COLOR_BUFFER_BIT);
    //     // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    //     this.just_once = true;
    // }
}

"use strict";

import Renderable from '../engine/renderable';

// the expected texture cooridnate array is an array of 8 floats where:
// [0] [1]: is u/v cooridnate of Top-Right
// [2] [3]: is u/v coordinate of Top-Left
// [4] [5]: is u/v coordinate of Bottom-Right
// [6] [7]: is u/v coordinate of Bottom-Left
const eTexCoordArray = Object.freeze({
    eLeft: 2,
    eRight: 0,
    eTop: 1,
    eBottom: 5
});

export default class Sprite extends Renderable {
    constructor(engine, position, width, height, texture_name) {
        super(engine, 'texture_vs.glsl', 'texture_fs.glsl');

        // Center and width of square
        this.position = position;
        this.width = width;
        this.height = height;
        this.color = [1.0, 0.0, 0.0, 0.0]; // default color

        this.vertex_buffer_id = null;
        this.texture_buffer_id = null;

        this.texture_name = texture_name;

        this.mTexLeft = 0.0;    // bounds of texture coord (0 is left, 1 is right)
        this.mTexRight = 1.0;
        this.mTexTop = 1.0;     // 1 is top and 0 is bottom of image
        this.mTexBottom = 0.0;

        this.left1 = 0;
        this.right1 = 0;
        this.bottom1 = 0;
        this.top1 = 0;

        // these two instance variables are to cache texture information
        // for supporting per-pixel accurate collision
        this.mTextureInfo = null;
        this.mColorArray = null;
        // defined for subclass to override
        this.mTexWidth = 0;
        this.mTexHeight = 0;
        this.mTexLeftIndex = 0;
        this.mTexBottomIndex = 0;
    }

    setColor(color) { this.color = color; }
    getColor() { return this.color; }

    load_resources() {
        super.load_resources();
        this.engine.texture_file_loader.loadTexture(this.texture_name);
    }

    initialize() {
        super.initialize();

        this.vertex_buffer_id = this.engine.retrieve_vbo('UNIT_SQUARE');
        this.texture_buffer_id = this.engine.retrieve_vbo('SPRITE_TEXTURE_COORDS');

        if (this.vertex_buffer_id === null) {
            let verticesOfSquare = [
                0.5, 0.5, 0.0,
                -0.5, 0.5, 0.0,
                0.5, -0.5, 0.0,
                -0.5, -0.5, 0.0
            ];

            let gl = this.engine.webgl_context;
            this.vertex_buffer_id = this.engine.vbos_library.add_vbo('UNIT_SQUARE', new Float32Array(verticesOfSquare), gl.ARRAY_BUFFER, gl);
        }

        this.initTexture();     // texture for this object, cannot be a "null"

        this.set_element_pixel_positions(this.left1, this.right1, this.bottom1, this.top1);

        // console.log(this.get_element_UV_coordinate_array());
    }

    set_element_UV_coordinate(left, right, bottom, top) {
        this.mTexLeft = left;
        this.mTexRight = right;
        this.mTexBottom = bottom;
        this.mTexTop = top;
    }

    set_element_pixel_positions1(left, right, bottom, top) {
        this.left1 = left;
        this.right1 = right;
        this.bottom1 = bottom;
        this.top1 = top;
    }

    set_element_pixel_positions(left, right, bottom, top) {
        let tex_info = this.engine.resources.retrieveAsset(this.texture_name);
        // entire image width, height
        var imageW = tex_info.mWidth;
        var imageH = tex_info.mHeight;
        this.mTexLeft = left / imageW;
        this.mTexRight = right / imageW;
        this.mTexBottom = bottom / imageH;
        this.mTexTop = top / imageH;
    }

    get_element_UV_coordinate_array = function() {
        return [
            this.mTexRight, this.mTexTop, // x,y of top-right
            this.mTexLeft, this.mTexTop,
            this.mTexRight, this.mTexBottom,
            this.mTexLeft, this.mTexBottom
        ];
    }

    set_texture_coordinate(texCoord) {
        let buffer = this.engine.vbos_library.get_vbo('SPRITE_TEXTURE_COORDS');
        // console.log(buffer);
        buffer.update(texCoord, this.engine.gl);
    };

    initTexture() {
        // these two instance variables are to cache texture information
        // for supporting per-pixel accurate collision
        // console.log('init texture');
        this.mTextureInfo = this.engine.texture_file_loader.getTextureInfo(this.texture_name);
        // console.log('mTextureInfo.name ' + this.mTextureInfo.mName);
        this.mColorArray = null;
        // defined for subclass to override
        this.mTexWidth = this.mTextureInfo.mWidth;
        this.mTexHeight = this.mTextureInfo.mHeight;
        // console.log(this.mTexWidth, this.mTexHeight);
        this.mTexLeftIndex = 0;
        this.mTexBottomIndex = 0;
    }

    draw(gl) {
        let camera = this.engine.camera;
        let pvmMatrix = mat4.create();
        let modelMatrix = mat4.create(); // Creates a blank identity matrix
        
        // Step A: compute translation, for now z is always at 0.0
        mat4.translate(modelMatrix, modelMatrix, this.position);
        // Step B: concatenate with rotation.
        // mat4.rotateZ(matrix, matrix, this.getRotationInRad());
        // Step C: concatenate with scaling
        mat4.scale(modelMatrix, modelMatrix, vec3.fromValues(this.width, this.height, 1.0));

        mat4.multiply(pvmMatrix, camera.getPVMatrix(), modelMatrix);

        this.shader.activate(gl);
        this.set_texture_coordinate(this.get_element_UV_coordinate_array());

        this.engine.texture_file_loader.activateTexture(this.texture_name);
        
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

        gl.bindBuffer(gl.ARRAY_BUFFER, this.texture_buffer_id);
        gl.enableVertexAttribArray(this.shader.attributes.texture_coordinate);
        gl.vertexAttribPointer(this.shader.attributes.texture_coordinate, 2, gl.FLOAT, false, 0, 0);

        gl.uniformMatrix4fv(this.shader.uniforms.PVM_transform, false, pvmMatrix);
        gl.uniform4fv(this.shader.uniforms.pixel_color, this.color);
        gl.uniform1i(this.shader.uniforms.sampler, 0);

        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA); // for transparent texture

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

        gl.disable(gl.BLEND);
    }
}

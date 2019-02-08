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

// Assumption: first sprite in an animation is always the left-most element.
const eAnimationType = Object.freeze({
    eAnimateRight: 0,   // Animate from left to right, then restart to left
    eAnimateLeft: 1,    // Animate from right to left, then restart to right
    eAnimateSwing: 2    // Animate first left to right, then animates backwards
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

        this.topPixel1 = 0;
        this.rightPixel1 = 0;
        this.elmWidthInPixel1 = 0;
        this.elmHeightInPixel1 = 0;
        this.numElements1 = 0;
        this.wPaddingInPixel1 = 0;

        // All coordinates are in texture coordinate (UV between 0 to 1)
        // Information on the sprite element
        this.mFirstElmLeft = 0.0;   // 0.0 is left corner of image
        this.mElmTop = 1.0;         // 1.0 is top corner of image
        this.mElmWidth = 1.0;       // default sprite element size is the entire image
        this.mElmHeight = 1.0;
        this.mWidthPadding = 0.0;
        this.mNumElems = 1;         // number of elements in an animation
        // per animation settings
        this.mAnimationType = eAnimationType.eAnimateRight;
        this.mUpdateInterval = 1;   // how often to advance
        // current animation state
        this.mCurrentAnimAdvance = -1;
        this.mCurrentElm = 0;
        this._init_animation();

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

        // this.set_element_pixel_positions(this.left1, this.right1, this.bottom1, this.top1);
        this.set_sprite_sequence(
            this.topPixel1,
            this.rightPixel1,
            this.elmWidthInPixel1,
            this.elmHeightInPixel1,
            this.numElements1,
            this.wPaddingInPixel1 // left/right padding
        );

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

    _init_animation() {
        // Currently running animation
        this.mCurrentTick = 0;
        switch (this.mAnimationType) {
            case eAnimationType.eAnimateRight:
                this.mCurrentElm = 0;
                this.mCurrentAnimAdvance = 1; // either 1 or -1
                break;
            case eAnimationType.eAnimateSwing:
                this.mCurrentAnimAdvance = -1 * this.mCurrentAnimAdvance;
                this.mCurrentElm += 2 * this.mCurrentAnimAdvance;
                break;
            case eAnimationType.eAnimateLeft:
                this.mCurrentElm = this.mNumElems - 1;
                this.mCurrentAnimAdvance = -1; // either 1 or -1
                break;
        }
        this._set_sprite_element();
    }

    _set_sprite_element() {
        let left = this.mFirstElmLeft + (this.mCurrentElm * (this.mElmWidth + this.mWidthPadding));

        this.set_element_UV_coordinate(
            left,
            left + this.mElmWidth,
            this.mElmTop - this.mElmHeight,
            this.mElmTop
        );
    }

    set_sprite_sequence1(
        topPixel, // offset from top-left
        rightPixel, // offset from top-left
        elmWidthInPixel,
        elmHeightInPixel,
        numElements, // number of elements in sequence
        wPaddingInPixel // left/right padding
    ) {
        this.topPixel1 = topPixel;
        this.rightPixel1 = rightPixel;
        this.elmWidthInPixel1 = elmWidthInPixel;
        this.elmHeightInPixel1 = elmHeightInPixel;
        this.numElements1 = numElements;
        this.wPaddingInPixel1 = wPaddingInPixel;
    }

    // Always set the right-most element to be the first
    set_sprite_sequence(
        topPixel, // offset from top-left
        rightPixel, // offset from top-left
        elmWidthInPixel,
        elmHeightInPixel,
        numElements, // number of elements in sequence
        wPaddingInPixel // left/right padding
    ) {
        let texInfo = this.engine.resources.retrieveAsset(this.texture_name);
        // entire image width, height
        var imageW = texInfo.mWidth;
        var imageH = texInfo.mHeight;
    
        this.mNumElems = numElements; // number of elements in animation
        this.mFirstElmLeft = rightPixel / imageW;
        this.mElmTop = topPixel / imageH;
        this.mElmWidth = elmWidthInPixel / imageW;
        this.mElmHeight = elmHeightInPixel / imageH;
        this.mWidthPadding = wPaddingInPixel / imageW;
        
        this._init_animation();
    };

    set_animation_speed(tickInterval) {
        // number of update calls before advancing animation
        this.mUpdateInterval = tickInterval; // how often to advance
    };
    
    inc_animation_speed(deltaInterval) {
        // number of update calls before advancing animation
        this.mUpdateInterval += deltaInterval; // how often to advance
    };

    updateAnimation() {
        this.mCurrentTick++;
        if (this.mCurrentTick >= this.mUpdateInterval) {
            this.mCurrentTick = 0;
            this.mCurrentElm += this.mCurrentAnimAdvance;
            if ((this.mCurrentElm >= 0) && (this.mCurrentElm < this.mNumElems))
                this._set_sprite_element();
            else
                this._init_animation();
        }
    };

    update(input) {
        this.updateAnimation();

        // Animate left on the sprite sheet
        if (input.isKeyClicked(input.Keys.One)) {
            this.set_animation_type(eAnimationType.eAnimateLeft);
        }
        
        // swing animation
        if (input.isKeyClicked(input.Keys.Two)) {
            this.set_animation_type(eAnimationType.eAnimateSwing);
        }
        
        // Animate right on the sprite sheet
        if (input.isKeyClicked(input.Keys.Three)) {
            this.set_animation_type(eAnimationType.eAnimateRight);
        }
        
        // decrease the duration of showing sprite elements,
        // speeding up the animation
        if (input.isKeyClicked(input.Keys.Four)) {
            this.inc_animation_speed(-2);
            console.log("animation speed: " + this.mUpdateInterval);
        }
        
        // increase the duration of showing sprite elements,
        // slowing down the animation
        if (input.isKeyClicked(input.Keys.Five)) {
            this.inc_animation_speed(2);
            console.log("animation speed: " + this.mUpdateInterval);
        }
    }

    set_animation_type(animationType) {
        this.mAnimationType = animationType;
        this.mCurrentAnimAdvance = -1;
        this.mCurrentElm = 0;
        this._init_animation();
    };

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

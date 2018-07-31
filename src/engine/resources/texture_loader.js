/*
 * Provides support for loading and unloading of textures (images)
 */

"use strict";

class TextureInfo {
    constructor(name, w, h, id) {
        this.mName = name;
        this.mWidth = w;
        this.mHeight = h;
        this.mGLTexID = id;
        this.mColorArray = null;
    }
}

export default class {
    constructor(glContext, resourceMap) {
        this.glContext = glContext;
        this.resourceMap = resourceMap;
    }

    /*
     * This converts an image to the webGL texture format. 
     * This should only be called once the texture is loaded.
     */
    _processLoadedImage(textureName, image) {
        let gl = this.glContext;

        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis ////////

        // Generate a texture reference to the webGL context
        let textureID = gl.createTexture();

        // gl.activeTexture(gl.TEXTURE0); ////////

        // bind the texture reference with the current texture functionality in the webGL
        gl.bindTexture(gl.TEXTURE_2D, textureID);

        // Load the texture into the texture data structure with descriptive info.
        // Parameters:
        //  1: Which "binding point" or target the texture is being loaded to.
        //  2: Level of detail. Used for mipmapping. 0 is base texture level.
        //  3: Internal format. The composition of each element. i.e. pixels.
        //  4: Format of texel data. Must match internal format.
        //  5: The data type of the texel data.
        //  6: Texture Data.
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

        // Creates a mipmap for this texture.
        gl.generateMipmap(gl.TEXTURE_2D);

        // Tells WebGL that we are done manipulating data at the mGL.TEXTURE_2D target.
        gl.bindTexture(gl.TEXTURE_2D, null);

        let texInfo = new TextureInfo(textureName, image.naturalWidth, image.naturalHeight, textureID);
        this.resourceMap.asyncLoadCompleted(textureName, texInfo);
    }

    // function loadTexture(gl, n, texture, u_Sampler, image){ <- (Part5)
    //     128 gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
    //     129 // Enable the texture unit 0
    //     130 gl.activeTexture(gl.TEXTURE0);
    //     131 // Bind the texture object to the target
    //     132 gl.bindTexture(gl.TEXTURE_2D, texture);
    //     133
    //     134 // Set the texture parameters
    //     135 gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    //     136 // Set the texture image
    //     137 gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    //     138
    //     139 // Set the texture unit 0 to the sampler
    //     140 gl.uniform1i(u_Sampler, 0);

    // Loads an texture so that it can be drawn.
    // If already in the map, will do nothing.
    loadTexture(textureName) {
        if (!(this.resourceMap.isAssetLoaded(textureName))) {
            // Create new Texture object.
            let img = new Image();

            // Update resources in loading counter.
            this.resourceMap.asyncLoadRequested(textureName);

            // When the texture loads, convert it to the WebGL format then put
            // it back into the mTextureMap.
            img.onload = () => {
                this._processLoadedImage(textureName, img);
            };
            img.src = textureName;
        } else {
            this.resourceMap.incAssetRefCount(textureName);
        }
    }

    // Remove the reference to allow associated memory 
    // be available for subsequent garbage collection
    unloadTexture(textureName) {
        let gl = this.glContext;
        let texInfo = this.resourceMap.retrieveAsset(textureName);
        gl.deleteTexture(texInfo.mGLTexID);
        this.resourceMap.unloadAsset(textureName);
    }

    activateTexture(textureName) {
        let gl = this.glContext;
        let texInfo = this.resourceMap.retrieveAsset(textureName);

        // Binds our texture reference to the current webGL texture functionality
        gl.bindTexture(gl.TEXTURE_2D, texInfo.mGLTexID);
        
        // To prevent texture wrappings
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

        // Handles how magnification and minimization filters will work.
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);

        // For pixel-graphics where you want the texture to look "sharp" do the following:
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    }

    deactivateTexture() {
        let gl = this.glContext;
        gl.bindTexture(gl.TEXTURE_2D, null);
    }

    getTextureInfo(textureName) {
        return this.resourceMap.retrieveAsset(textureName);
    }

    getColorArray(textureName) {
        let texInfo = getTextureInfo(textureName);
        if (texInfo.mColorArray === null) {
            // create a framebuffer bind it to the texture, and read the color content
            // Hint from: http://stackoverflow.com/questions/13626606/read-pixels-from-a-webgl-texture 
            let gl = this.glContext;
            let fb = gl.createFramebuffer();
            gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texInfo.mGLTexID, 0);
            if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE) {
                var pixels = new Uint8Array(texInfo.mWidth * texInfo.mHeight * 4);
                gl.readPixels(0, 0, texInfo.mWidth, texInfo.mHeight, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
                texInfo.mColorArray = pixels;
            } else {
                console.log("WARNING: Engine.Textures.getColorArray() failed!");
            }
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            gl.deleteFramebuffer(fb);
        }
        return texInfo.mColorArray;
    }
}
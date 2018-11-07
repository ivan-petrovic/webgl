"use strict";

/* 
 * Encapsulates the user define WC and Viewport functionality
 */
export default class {
    // position: camera position, vec3
    // lookAt: where the camera is looking at, vec3
    // width: is the width of the user defined WC
    //      Height of the user defined WC is implicitly defined by the viewport aspect ratio
    //      Please refer to the following
    // viewportArray: an array of 4 elements
    //      [0] [1]: (x,y) position of lower left corner on the canvas (in pixel)
    //      [2]: width of viewport
    //      [3]: height of viewport
    //      
    //  height = width * viewport[3]/viewport[2]
    //
    constructor(position, lookAt, width, viewportArray) {
        // WC and viewport position and size
        this.position = position;
        this.lookAt = lookAt;
        this.width = width;
        this.viewportArray = viewportArray;  // [x, y, width, height]
        this.nearPlane = 0.0;
        this.farPlane = 1000.0;

        // transformation matrices
        this.viewMatrix = mat4.create();
        this.projMatrix = mat4.create();
        this.PVMatrix = mat4.create();

        // background color
        this.bgColor = [0.8, 0.8, 0.8, 1]; // RGB and Alpha
    }

    // Getters and setters
    setPosition(xPos, yPos) {
        this.position[0] = xPos;
        this.position[1] = yPos;
    }
    getposition() { return this.position; }

    setWidth(width) { this.width = width; }

    setViewport(viewportArray) { this.viewportArray = viewportArray; }
    getViewport() { return this.viewportArray; }

    setBackgroundColor(newColor) { this.bgColor = newColor; }
    getBackgroundColor() { return this.bgColor; }

    // Getter for the Projection-View transform operator
    getPVMatrix() { return this.PVMatrix; }

    // Initializes the camera to begin drawing
    setupProjectionViewMatrix(gl) {
        // Set up and clear the Viewport
        gl.viewport(this.viewportArray[0],  // x position of bottom-left corner of the area to be drawn
                    this.viewportArray[1],  // y position of bottom-left corner of the area to be drawn
                    this.viewportArray[2],  // width of the area to be drawn
                    this.viewportArray[3]); // height of the area to be drawn

        // set the color to be cleared
        gl.clearColor(this.bgColor[0], this.bgColor[1], this.bgColor[2], this.bgColor[3]);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // Set up the Projection-View transform operator
        // Define the view matrix
        mat4.lookAt(
            this.viewMatrix,
            this.position,
            this.lookAt,
            [0, 1.0, 0]     // up direction (orientation)
        );

        // Define the projection matrix
        let halfWCWidth = 0.5 * this.width;
        let halfWCHeight = halfWCWidth * this.viewportArray[3] / this.viewportArray[2]; // viewportH/viewportW
        mat4.ortho(
            this.projMatrix,
            -halfWCWidth,     // distance to left of WC
            halfWCWidth,      // distance to right of WC
            -halfWCHeight,    // distance to bottom of WC
            halfWCHeight,     // distance to top of WC
            this.nearPlane,  // z-distance to near plane 
            this.farPlane    // z-distance to far plane 
        );

        // Concatenate project and view matrices
        mat4.multiply(this.PVMatrix, this.projMatrix, this.viewMatrix);
    }

    update(input) {}
}

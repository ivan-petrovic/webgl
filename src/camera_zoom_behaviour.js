"use strict";

/**
 * This behaviour assumes existence of position property on camera object.
 */
export default class  {
    constructor(camera, zoom_factor = 0.975) {
        this.camera = camera;
        this.zoom_factor = zoom_factor;
    }

    update(input) {
        // Zoom in
        if (input.isKeyPressed(input.Keys.Z)) {
            this.camera.position[2] *= this.zoom_factor;
        }

        // Zoom out
        if (input.isKeyPressed(input.Keys.X)) {
            this.camera.position[2] /= this.zoom_factor;
        }
    }
}

"use strict";

// function to_degrees(angle) { return angle * (180 / Math.PI); }

function to_radians(angle) { return angle * (Math.PI / 180); }

/**
 * This behaviour assumes existence of position property on object.
 */
export default class  {
    constructor(object, zoom_factor = 0.975) {
        this.object = object;

        this.zoom_factor = zoom_factor;
        this.distance = 5.0;
        
        this.tetha = 0.0;
        this.phi = 0.0;
        this.rotation_speed = 0.50;
        this.rotating_right = false;
        this.rotating_left = false;
        this.rotating_up = false;
        this.rotating_down = false;
    }

    is_rotating() {
        return this.rotating_left || this.rotating_right || this.rotating_up || this.rotating_down;
    }

    update(input) {
        if (input.isKeyPressed(input.Keys.Right)) {
            if(!this.is_rotating()) {
                this.rotating_right = true;
            }
        }

        if (input.isKeyPressed(input.Keys.Left)) {
            if(!this.is_rotating()) {
                this.rotating_left = true;
            }
        }

        if (input.isKeyPressed(input.Keys.Up)) {
            if(!this.is_rotating()) {
                this.rotating_up = true;
            }
        }

        if (input.isKeyPressed(input.Keys.Down)) {
            if(!this.is_rotating()) {
                this.rotating_down = true;
            }
        }

        if(this.rotating_right) {
            this.tetha += this.rotation_speed;
            if (this.tetha > 360.0) this.tetha -= 360.0;
            this.rotating_right = false;
            console.log('tetha: ' + this.tetha + ', phi: ' + this.phi);
        }

        if(this.rotating_left) {
            this.tetha -= this.rotation_speed;
            if (this.tetha < 0.0) this.tetha += 360.0;
            this.rotating_left = false;
            console.log('tetha: ' + this.tetha + ', phi: ' + this.phi);
        }

        if(this.rotating_up) {
            this.phi += this.rotation_speed;
            if (this.phi > 360.0) this.phi -= 360.0;
            this.rotating_up = false;
            console.log('tetha: ' + this.tetha + ', phi: ' + this.phi);
        }

        if(this.rotating_down) {
            this.phi -= this.rotation_speed;
            if (this.phi < 0.0) this.phi += 360.0;
            this.rotating_down = false;
            console.log('tetha: ' + this.tetha + ', phi: ' + this.phi);
        }

        // // Zoom in
        // if (input.isKeyPressed(input.Keys.Z)) {
        //     this.distance *= this.zoom_factor;
        // }

        // // Zoom out
        // if (input.isKeyPressed(input.Keys.X)) {
        //     this.distance /= this.zoom_factor;
        // }

        // let position = vec3.fromValues(this.distance, 0.0, 0.0);
        // vec3.rotateZ(position, position, vec3.create(), this.phi);
        // vec3.rotateY(position, position, vec3.create(), this.tetha);
        
        let x = this.distance * Math.sin(to_radians(this.tetha)) * Math.cos(to_radians(this.phi));
        let y = this.distance * Math.sin(to_radians(this.phi));
        let z = this.distance * Math.cos(to_radians(this.tetha)) * Math.cos(to_radians(this.phi));

        this.object.position = vec3.fromValues(x, y, z);
    }
}

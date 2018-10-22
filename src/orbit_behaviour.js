"use strict";

// function to_degrees(angle) { return angle * (180 / Math.PI); }

function to_radians(angle) { return angle * (Math.PI / 180); }

/**
 * This behaviour assumes existence of position property on object.
 */
export default class  {
    constructor(object, key_mappings = {}) {
        this.object = object;

        this._zoom_factor = 0.975;
        this._distance = 1.0;
        this._rotation_speed = 0.50;
        this.tetha = 0.0;
        this.phi = 0.0;

        this.key_right = 39;        // right
        this.key_left = 37;         // left
        this.key_up = 38;           // up
        this.key_down = 40;         // down
        this.key_zoom_out = 88;     // X
        this.key_zoom_in = 90;      // Z

        if(!(Object.keys(key_mappings).length === 0 && key_mappings.constructor === Object)) {
            this._set_key_mappings(key_mappings);
        }

        this.rotating_right = false;
        this.rotating_left = false;
        this.rotating_up = false;
        this.rotating_down = false;
    }

    get zoom_factor() { return this._zoom_factor; }
    set zoom_factor(zoom_factor) { this._zoom_factor = zoom_factor; }

    get distance() { return this._distance; }
    set distance(distance) { this._distance = distance; }

    get rotation_speed() { return this._rotation_speed; }
    set rotation_speed(rotation_speed) { this._rotation_speed = rotation_speed; }

    _set_key_mappings(key_mappings) {
        if (key_mappings.hasOwnProperty('right')) {
            this.key_right = key_mappings['right'];
        }
        if (key_mappings.hasOwnProperty('left')) {
            this.key_left = key_mappings['left'];
        }
        if (key_mappings.hasOwnProperty('up')) {
            this.key_up = key_mappings['up'];
        }
        if (key_mappings.hasOwnProperty('down')) {
            this.key_down = key_mappings['down'];
        }
        if (key_mappings.hasOwnProperty('zoom_out')) {
            this.key_zoom_out = key_mappings['zoom_out'];
        }
        if (key_mappings.hasOwnProperty('zoom_in')) {
            this.key_zoom_in = key_mappings['zoom_in'];
        }
    }

    is_rotating() {
        return this.rotating_left || this.rotating_right || this.rotating_up || this.rotating_down;
    }

    update(input) {
        if (input.isKeyPressed(this.key_right)) {
            if(!this.is_rotating()) {
                this.rotating_right = true;
            }
        }

        if (input.isKeyPressed(this.key_left)) {
            if(!this.is_rotating()) {
                this.rotating_left = true;
            }
        }

        if (input.isKeyPressed(this.key_up)) {
            if(!this.is_rotating()) {
                this.rotating_up = true;
            }
        }

        if (input.isKeyPressed(this.key_down)) {
            if(!this.is_rotating()) {
                this.rotating_down = true;
            }
        }

        if(this.rotating_right) {
            this.tetha += this.rotation_speed;
            if (this.tetha > 360.0) this.tetha -= 360.0;
            this.rotating_right = false;
            // console.log('tetha: ' + this.tetha + ', phi: ' + this.phi);
        }

        if(this.rotating_left) {
            this.tetha -= this.rotation_speed;
            if (this.tetha < 0.0) this.tetha += 360.0;
            this.rotating_left = false;
            // console.log('tetha: ' + this.tetha + ', phi: ' + this.phi);
        }

        if(this.rotating_up) {
            this.phi += this.rotation_speed;
            if (this.phi > 360.0) this.phi -= 360.0;
            this.rotating_up = false;
            // console.log('tetha: ' + this.tetha + ', phi: ' + this.phi);
        }

        if(this.rotating_down) {
            this.phi -= this.rotation_speed;
            if (this.phi < 0.0) this.phi += 360.0;
            this.rotating_down = false;
            // console.log('tetha: ' + this.tetha + ', phi: ' + this.phi);
        }

        if (input.isKeyPressed(this.key_zoom_in)) {
            this.distance *= this.zoom_factor;
        }

        if (input.isKeyPressed(this.key_zoom_out)) {
            this.distance /= this.zoom_factor;
        }

        // let position = vec3.fromValues(this.distance, 0.0, 0.0);
        // vec3.rotateZ(position, position, vec3.create(), this.phi);
        // vec3.rotateY(position, position, vec3.create(), this.tetha);
        
        let x = this.distance * Math.sin(to_radians(this.tetha)) * Math.cos(to_radians(this.phi));
        let y = this.distance * Math.sin(to_radians(this.phi));
        let z = this.distance * Math.cos(to_radians(this.tetha)) * Math.cos(to_radians(this.phi));

        this.object.position = vec3.fromValues(x, y, z);
    }
}

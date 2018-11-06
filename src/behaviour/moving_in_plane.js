"use strict";
/**
 * This behaviour assumes existence of position property of object,
 * which is vec3 type.
 */
export default class  {
    constructor(object, angle, key_mappings = {}) {
        this.object = object;

        this._moving_right = false;
        this._moving_left = false;
        this._moving_up = false;
        this._moving_down = false;

        this._speed = 0.1;
        this._rotation_speed = 1.0;
        this._angle = angle;

        this.key_right = 39;        // right arrow
        this.key_left = 37;         // left arrow
        this.key_up = 38;           // up arrow
        this.key_down = 40;         // down arrow

        if(!(Object.keys(key_mappings).length === 0 && key_mappings.constructor === Object)) {
            this._set_key_mappings(key_mappings);
        }
    }

    get speed() { return this._speed; }
    set speed(speed) { this._speed = speed; }

    get rotation_speed() { return this._rotation_speed; }
    set rotation_speed(rotation_speed) { this._rotation_speed = rotation_speed; }

    get angle() { return this._angle; }
    set angle(angle) { this._angle = angle; }

    is_moving() {
        return this._moving_left || this._moving_right || this._moving_up || this._moving_down;
    }

    update(input) {
        if (input.isKeyPressed(this.key_right)) {
            if(!this.is_moving()) {
                this._moving_right = true;
            }
        }

        if (input.isKeyPressed(this.key_left)) {
            if(!this.is_moving()) {
                this._moving_left = true;
            }
        }

        if (input.isKeyPressed(this.key_up)) {
            if(!this.is_moving()) {
                this._moving_up = true;
            }
        }

        if (input.isKeyPressed(this.key_down)) {
            if(!this.is_moving()) {
                this._moving_down = true;
            }
        }

        if(this._moving_right) {
            this.angle -= this.rotation_speed;
            this._moving_right = false;
        }

        if(this._moving_left) {
            this.angle += this.rotation_speed;
            this._moving_left = false;
        }

        this.angle %= 360;

        if(this._moving_up) {
            vec3.scaleAndAdd(this.object.position, this.object.position, this.get_direction(), this.speed);
            this._moving_up = false;
        }

        if(this._moving_down) {
            vec3.scaleAndAdd(this.object.position, this.object.position, this.get_reverse_direction(), this.speed);
            this._moving_down = false;
        }
    }

    get_direction() {
        return vec3.fromValues(
            Math.sin(this.angle * Math.PI / 180),
            0.0,
            Math.cos(this.angle * Math.PI / 180),
        );
    }

    get_reverse_direction() {
        let direction = vec3.fromValues(
            Math.sin(this.angle * Math.PI / 180),
            0.0,
            Math.cos(this.angle * Math.PI / 180),
        );
        vec3.negate(direction, direction);
        return direction;
    }

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
    }
}
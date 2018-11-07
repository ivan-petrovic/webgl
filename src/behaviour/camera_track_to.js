"use strict";

// function to_degrees(angle) { return angle * (180 / Math.PI); }

function to_radians(angle) { return angle * (Math.PI / 180); }

/**
 * This behaviour assumes existence of position and direction property on object_to_track.
 */
export default class  {
    constructor(object, object_to_track) {
        this.object = object;
        this.object_to_track = object_to_track;

        this._distance = 10.0;
        this._elevation = 30.0;
    }

    get distance() { return this._distance; }
    set distance(distance) { this._distance = distance; }

    get elevation() { return this._elevation; }
    set elevation(elevation) { this._elevation = elevation; }

    update(input) {
        let new_position = vec3.create();
        let d = this.distance * Math.cos(to_radians(this.elevation));
        let h = this.distance * Math.sin(to_radians(this.elevation));

        vec3.scaleAndAdd(new_position, this.object_to_track.position, this.object_to_track.get_direction(), d);
        new_position[1] = h;
        
        this.object.position = new_position;
        this.object.lookAt = this.object_to_track.position;
    }
}

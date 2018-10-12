"use strict";
/**
 * This behaviour assumes existence of center_x and center_y properties on object.
 */
export default class  {
    constructor(object, speed = 0.4) {
        this.object = object;

        this.moving_right = false;
        this.moving_left = false;
        this.moving_up = false;
        this.moving_down = false;

        this.speed = speed;
    }

    is_moving() {
        return this.moving_left || this.moving_right || this.moving_up || this.moving_down;
    }

    update(input) {
        if (input.isKeyPressed(input.Keys.Right)) {
            if(!this.is_moving()) {
                this.moving_right = true;
            }
        }

        if (input.isKeyPressed(input.Keys.Left)) {
            if(!this.is_moving()) {
                this.moving_left = true;
            }
        }

        if (input.isKeyPressed(input.Keys.Up)) {
            if(!this.is_moving()) {
                this.moving_up = true;
            }
        }

        if (input.isKeyPressed(input.Keys.Down)) {
            if(!this.is_moving()) {
                this.moving_down = true;
            }
        }

        if(this.moving_right) {
            this.object.center_x += this.speed;
            // if(this.centerX > this.goalPosition[0]) {
            //     this.centerX = this.goalPosition[0];
                this.moving_right = false;
            // }
        }

        if(this.moving_left) {
            this.object.center_x -= this.speed;
            // if(this.centerX < this.goalPosition[0]) {
            //     this.centerX = this.goalPosition[0];
                this.moving_left = false;
            // }
        }

        if(this.moving_up) {
            this.object.center_y += this.speed;
            // if(this.centerY > this.goalPosition[1]) {
            //     this.centerY = this.goalPosition[1];
                this.moving_up = false;
            // }
        }

        if(this.moving_down) {
            this.object.center_y -= this.speed;
            // if(this.centerY < this.goalPosition[1]) {
            //     this.centerY = this.goalPosition[1];
                this.moving_down = false;
            // }
        }
    }
}
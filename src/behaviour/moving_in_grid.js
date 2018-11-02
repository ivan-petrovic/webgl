"use strict";


export default class  {
    constructor() {
        this.grid = null;
        this.row = 0;
        this.column = 0;

        this.movingRight = false;
        this.movingLeft = false;
        this.movingUp = false;
        this.movingDown = false;
        this.goalPosition = null;
    }

    setGrid(grid) { this.grid = grid; this.getPositionOnGrid(); }
    setPositionOnGrid(row, column) {
        this.row = row;
        this.column = column;
        this.getPositionOnGrid();
    }
    getPositionOnGrid() {
        let position = this.grid.getCellCenter(this.row, this.column);
        this.centerX = position[0];
        this.centerY = position[1];
    }

    isMoving() {
        return this.movingLeft || this.movingRight || this.movingUp || this.movingDown;
    }

    update() {
        let input = this.engine.input;
        let speed = 0.4;

        if (input.isKeyPressed(input.Keys.Right)) {
            if(!this.isMoving()) {
                this.movingRight = true;
                this.column = this.grid.getNextRight(this.row, this.column);
                // console.log('right' + this.column);
                this.goalPosition = this.grid.getCellCenter(this.row, this.column);
            }
        }

        if (input.isKeyPressed(input.Keys.Left)) {
            if(!this.isMoving()) {
                this.movingLeft = true;
                this.column = this.grid.getNextLeft(this.row, this.column);
                // console.log('left' + this.column);
                this.goalPosition = this.grid.getCellCenter(this.row, this.column);
            }
        }

        if (input.isKeyPressed(input.Keys.Up)) {
            if(!this.isMoving()) {
                this.movingUp = true;
                this.row = this.grid.getNextUp(this.row, this.column);
                // console.log('up' + this.row);
                this.goalPosition = this.grid.getCellCenter(this.row, this.column);
            }
        }

        if (input.isKeyPressed(input.Keys.Down)) {
            if(!this.isMoving()) {
                this.movingDown = true;
                this.row = this.grid.getNextDown(this.row, this.column);
                // console.log('down' + this.row);
                this.goalPosition = this.grid.getCellCenter(this.row, this.column);
            }
        }

        if(this.movingRight) {
            this.centerX += speed;
            if(this.centerX > this.goalPosition[0]) {
                this.centerX = this.goalPosition[0];
                this.movingRight = false;
            }
        }

        if(this.movingLeft) {
            this.centerX -= speed;
            if(this.centerX < this.goalPosition[0]) {
                this.centerX = this.goalPosition[0];
                this.movingLeft = false;
            }
        }

        if(this.movingUp) {
            this.centerY += speed;
            if(this.centerY > this.goalPosition[1]) {
                this.centerY = this.goalPosition[1];
                this.movingUp = false;
            }
        }

        if(this.movingDown) {
            this.centerY -= speed;
            if(this.centerY < this.goalPosition[1]) {
                this.centerY = this.goalPosition[1];
                this.movingDown = false;
            }
        }

        /*
        if (input.isKeyClicked(input.Keys.Right)) {
            this.column = this.grid.getNextRight(this.column);
        }
        if (input.isKeyClicked(input.Keys.Left)) {
            this.column = this.grid.getNextLeft(this.column);
        }
        if (input.isKeyClicked(input.Keys.Up)) {
            this.row = this.grid.getNextUp(this.row);
        }
        if (input.isKeyClicked(input.Keys.Down)) {
            this.row = this.grid.getNextDown(this.row);
        }
        this.getPositionOnGrid();
        */
    }
}
"use strict"; 

/*
 * Provides input support
 */
export default class {
    constructor(canvasElement) {
        // Key code constants
        this.Keys = {
            // arrows
            Left: 37,
            Up: 38,
            Right: 39,
            Down: 40,

            // space bar
            Space: 32,

            // numbers 
            Zero: 48,
            One: 49,
            Two: 50,
            Three: 51,
            Four: 52,
            Five : 53,
            Six : 54,
            Seven : 55,
            Eight : 56,
            Nine : 57,

            // Alphabets
            A : 65,
            D : 68,
            E : 69,
            F : 70,
            G : 71,
            I : 73,
            J : 74,
            K : 75,
            L : 76,
            R : 82,
            S : 83,
            W : 87,
            X : 88,
            Z : 90,

            LastKeyCode: 222
        };

        this.MouseButton = {
            Left: 0,
            Middle: 1,
            Right: 2
        };

        // Previous key state
        this.keyPreviousState = [];
        // The pressed keys.
        this.keyPressed = [];
        // Click events: once an event is set, it will remain there until polled
        this.keyClicked = [];

        // Support mouse
        this.canvasElement = canvasElement;
        this.buttonPreviousState = [];
        this.buttonPressed = [];
        this.buttonClicked = [];
        this.mouse = {x: -1, y: -1 /*, event: null*/};

        this._body_scrollLeft = 0;
        this._element_scrollLeft = 0;
        this._body_scrollTop = 0;
        this._element_scrollTop = 0;
        this._offsetLeft = 0;
        this._offsetTop = 0;
        this.canvas_width = this.canvasElement.width;
        this.canvas_half_width = this.canvasElement.width / 2;
        this.canvas_height = this.canvasElement.height;
        this.canvas_half_height = this.canvasElement.height / 2;
        // console.log("this.canvas_width: " + this.canvas_width);
        // console.log("this.canvas_half_width: " + this.canvas_half_width);
        // console.log("this.canvas_height: " + this.canvas_height);
        // console.log("this.canvas_half_height: " + this.canvas_half_height);
    }

    initialize() {
        let i;
        for (i = 0; i < this.Keys.LastKeyCode; i += 1) {
            this.keyPressed[i] = false;
            this.keyPreviousState[i] = false;
            this.keyClicked[i] = false;
        }

        for (i = 0; i < 3; i++) {
            this.buttonPreviousState[i] = false;
            this.buttonPressed[i] = false;
            this.buttonClicked[i] = false;
        }

        this._body_scrollLeft = document.body.scrollLeft;
        this._element_scrollLeft = document.documentElement.scrollLeft;
        this._body_scrollTop = document.body.scrollTop;
        this._element_scrollTop = document.documentElement.scrollTop;
        this._offsetLeft = this.canvasElement.offsetLeft;
        this._offsetTop = this.canvasElement.offsetTop;

        // register handlers for keyboard events
        window.addEventListener('keyup', evt => this._onKeyUp(evt));
        window.addEventListener('keydown', evt => this._onKeyDown(evt));

        // register handlers for mouse events
        this.canvasElement.addEventListener('mousedown', evt => this._onMouseDown(evt));
        this.canvasElement.addEventListener('mouseup', evt => this._onMouseUp(evt));
        this.canvasElement.addEventListener('mousemove', evt => this._onMouseMove(evt));
        // canvas.addEventListener('click', onMouseEvent, false);
        // canvas.addEventListener('dblclick', onMouseEvent, false);
        // canvas.addEventListener('mousewheel', onMouseEvent, false);
        // canvas.addEventListener('mouseover', onMouseEvent, false);
        // canvas.addEventListener('mouseout', onMouseEvent, false);
    }

    update() {
        let i;
        for (i = 0; i < this.Keys.LastKeyCode; i += 1) {
            this.keyClicked[i] = (!this.keyPreviousState[i]) && this.keyPressed[i];
            this.keyPreviousState[i] = this.keyPressed[i];
        }
        for (i = 0; i < 3; i += 1) {
            this.buttonClicked[i] = (!this.buttonPreviousState[i]) && this.buttonPressed[i];
            this.buttonPreviousState[i] = this.buttonPressed[i];
        }
    }

    // Function for GameEngine programmer to test if a key is pressed down
    isKeyPressed(keyCode) {
        return this.keyPressed[keyCode];
    }

    isKeyClicked(keyCode) {
        return this.keyClicked[keyCode];
    }

    isButtonPressed(button) {
        return this.buttonPressed[button];
    }

    isButtonClicked(button) {
        return this.buttonClicked[button];
    }

    getMouse() { return this.mouse; }
    getMousePosX() { return this.mouse.x; }
    getMousePosY() { return this.mouse.y; }
    get_pos(width, height) {
        // let pos = vec2.create();
        // let coord_system = vec2.fromValues(width, height);
        // let coords_in_canvas = vec2.fromValues(this.mouse.x, this.mouse.y);
        let x = (this.mouse.x - this.canvas_half_width) / this.canvas_half_width;
        let y = (this.mouse.y - this.canvas_half_height) / this.canvas_half_height;
        // console.log("x * 40 " + x * 40);
        // console.log("y * 30 " + y * 30);
        return vec2.fromValues(x * width, y * height);
    }

    // Event handler functions
    _onKeyDown(event) {
        this.keyPressed[event.keyCode] = true;
    }

    _onKeyUp(event) {
        this.keyPressed[event.keyCode] = false;
    }

    _onMouseDown(event) {
        // this._onMouseMove(event);
        this.buttonPressed[event.button] = true;
    }

    _onMouseUp(event) {
        // this._onMouseMove(event);
        this.buttonPressed[event.button] = false;
    }

    _onMouseMove(event) {
        let x, y;

        if (event.pageX || event.pageY) {
            // newer browsers have these properties
            x = event.pageX;
            y = event.pageY;
        } else {
            x = event.clientX + this._body_scrollLeft + this._element_scrollLeft;
            y = event.clientY + this._body_scrollTop + this._element_scrollTop;
        }
        x -= this._offsetLeft;
        y -= this._offsetTop;

        this.mouse.x = x;
        this.mouse.y = this.canvas_height - y - 1;
    }
}

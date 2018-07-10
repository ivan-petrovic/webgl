"use strict"; 

/*
 * Provides input support
 */
export default class {
    constructor() {
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

            LastKeyCode: 222
        };

        // Previous key state
        this.keyPreviousState = [];
        // The pressed keys.
        this.keyPressed = [];
        // Click events: once an event is set, it will remain there until polled
        this.keyClicked = [];
    }

    // Event handler functions
    _onKeyDown(event) {
        this.keyPressed[event.keyCode] = true;
    }

    _onKeyUp(event) {
        this.keyPressed[event.keyCode] = false;
    }

    initialize() {
        let i;
        for (i = 0; i < this.Keys.LastKeyCode; i += 1) {
            this.keyPressed[i] = false;
            this.keyPreviousState[i] = false;
            this.keyClicked[i] = false;
        }

        // register handlers 
        window.addEventListener('keyup', evt => this._onKeyUp(evt));
        window.addEventListener('keydown', evt => this._onKeyDown(evt));
    }

    update() {
        let i;
        for (i = 0; i < this.Keys.LastKeyCode; i += 1) {
            this.keyClicked[i] = (!this.keyPreviousState[i]) && this.keyPressed[i];
            this.keyPreviousState[i] = this.keyPressed[i];
        }
    }

    // Function for GameEngine programmer to test if a key is pressed down
    isKeyPressed(keyCode) {
        return this.keyPressed[keyCode];
    }

    isKeyClicked(keyCode) {
        return this.keyClicked[keyCode];
    }
}
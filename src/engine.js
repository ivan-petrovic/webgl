export default class {
    constructor() {
        this.canvas        = document.getElementById('glscreen');
        this.gl            = this.canvas.getContext('webgl');
        // this.canvas.width  = 640;
        // this.canvas.height = 480;
        this.i = 0;
        this.time = null;
    }

    init() {
        let gl = this.gl;
    
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    }

    start() {
        window.requestAnimationFrame((now) => this.render(now));
    }

    render(now) {
        window.requestAnimationFrame((now) => this.render(now));
    
        let dt = now - (this.time || now);
        this.time = now;
    
        if(this.i++ < 10) {
            console.log(this.i);
            console.log(now, dt);
        }
    
        let gl = this.gl;
        gl.clearColor(1.0, 0.5, 0.5, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
    
    }
}

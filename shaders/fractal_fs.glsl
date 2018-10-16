#define NUM_STEPS 100

#ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
#else
    precision mediump float;
#endif
precision mediump int;

uniform vec2 u_canvas_size;
uniform vec2 u_offset;
uniform float u_scale;

// mandelbrot fractal
vec4 calculateColor(vec2 tex_coord) {
    float x = 0.0;
    float y = 0.0;
    vec4 color = vec4(0,0,0,1);

    for (int iteration = 0; iteration < NUM_STEPS; iteration += 1) {
        float xtemp = x*x - y*y + tex_coord.x;
        y = 2.0*x*y + tex_coord.y;
        x = xtemp;
    
        if ( (x*x + y*y) >= 8.0) {
            float d = float(iteration) / float(NUM_STEPS);
            // color = vec4(1,d,0,1); // yellow redish
            color = vec4(d,d,d,1); // gray scale
            break;
        }
    }
    return color;
}

void main() {
    // Screen coordinates mapped to [-1,1] range, both in x and y direction
    // For example if canvas size is 640 x 480:
    // 480 -------------------         //   1 -------------------
    //     |                 |                |                 |
    //     |                 |    ==>         |                 |
    //     |                 |                |                 |
    //     |                 |                |                 |
    //   0 -------------------             -1 -------------------
    //     0                640              -1                 1
    vec2 tex_coord = (gl_FragCoord.xy / u_canvas_size.xy) * 2.0 - vec2(1.0,1.0);

    // Correct aspect ratio, or change canvas size to square
    float aspect = u_canvas_size.x / u_canvas_size.y;
    tex_coord.x *= aspect;

    // Applied scale and offset
    // For example if scale = 2 and offset (-0.5,0)
    //   1 -------------------         //   2 -------------------
    //     |                 |                |                 |
    //     |                 |    ==>         |                 |
    //     |                 |                |                 |
    //     |                 |                |                 |
    //  -1 -------------------             -2 -------------------
    //    -1                 1              -2.5               1.5
    tex_coord = tex_coord * u_scale + u_offset;

    // Calculate collor for given coordinate
    gl_FragColor = calculateColor(tex_coord);
}

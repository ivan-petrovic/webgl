#define NUM_STEPS 100

#ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
#else
    precision mediump float;
#endif
precision mediump int;

uniform vec2 uCanvasSize;
uniform vec2 uOffset;
uniform float uScale;

vec4 calculateColor(vec2 texCoord) {
    float x = 0.0;
    float y = 0.0;
    vec4 color = vec4(0,0,0,1);

    for (int iteration = 0; iteration < NUM_STEPS; iteration += 1) {
        float xtemp = x*x - y*y + texCoord.x;
        y = 2.0*x*y + texCoord.y;
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
    vec2 texCoord = (gl_FragCoord.xy / uCanvasSize.xy) * 2.0 - vec2(1.0,1.0);

    // Correct aspect ratio, or change canvas size to square
    float aspect = uCanvasSize.x / uCanvasSize.y;
    texCoord.x *= aspect;

    // Applied scale and offset
    // For example if scale = 2 and offset (-0.5,0)
    //   1 -------------------         //   2 -------------------
    //     |                 |                |                 |
    //     |                 |    ==>         |                 |
    //     |                 |                |                 |
    //     |                 |                |                 |
    //  -1 -------------------             -2 -------------------
    //    -1                 1              -2.5               1.5
    texCoord = texCoord * uScale + uOffset;

    // Calculate collor for given coordinate
    gl_FragColor = calculateColor(texCoord);
}

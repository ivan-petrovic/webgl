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

    for (int iteration = 0; iteration < 100; iteration += 1) {
        float xtemp = x*x - y*y + texCoord.x;
        y = 2.0*x*y + texCoord.y;
        x = xtemp;
    
        if ( (x*x + y*y) >= 8.0) {
            // float d = float(iteration) / float(NUM_STEPS);
            color = vec4(0.5,1,0,1);
            break;
        }
    }
    return color;
}

// vec4 calculateColor(vec2 texCoord) {
//     vec2 z;
//     float x,y;
//     // int steps;
//     vec4 color = vec4(0.0, 0.0, 0.0, 1.0);
//     // float normalizedX = (gl_FragCoord.x - 320.0) / 640.0 * uScale * (640.0 / 480.0) + uOffset.x;
//     // float normalizedY = (gl_FragCoord.y - 240.0) / 480.0 * uScale;

//     z.x = texCoord.x;
//     z.y = texCoord.y;

//     for (int i = 0; i < NUM_STEPS; i += 1) {

//         // steps = i;

//         x = (z.x * z.x - z.y * z.y) + texCoord.x;
//         y = (z.y * z.x + z.x * z.y) + texCoord.y;

//         if((x * x + y * y) > 4.0) {
//             // color = vec4(1.0, float(i) / float(NUM_STEPS), 0.0, 1.0);
//             color = vec4(1.0, 0.0, 0.0, 1.0);
//             break;
//         }

//         z.x = x;
//         z.y = y;
//     }

//     // if (steps == NUM_STEPS-1) {
//     //     gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
//     // } else {
//     //     float float_steps = float(steps);
//     //     float float_num_steps = float(NUM_STEPS);
//     //     gl_FragColor = vec4(1.0, float_steps / float_num_steps, 0.0, 1.0);
//     // }
//     return color;
// }

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

    // Applied scale and offset
    // For example if scale = 2 and offset (-0.5,0)
    //   1 -------------------         //   2 -------------------
    //     |                 |                |                 |
    //     |                 |    ==>         |                 |
    //     |                 |                |                 |
    //     |                 |                |                 |
    //  -1 -------------------             -2 -------------------
    //    -1                 1              -2.5               1.5
    texCoord = texCoord * uScale; // + uOffset;

    // Calculate collor for given coordinate
    gl_FragColor = calculateColor(texCoord);
}

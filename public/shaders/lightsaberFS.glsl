#ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
#else
    precision mediump float;
#endif

uniform float uDistance;

void main() {
    float DISTANCE = uDistance;
    
    float redIntensity = 0.0;
    float distance = 0.0;

    vec2 x1 = vec2(100.0, 100.0);
    vec2 x2 = vec2(500.0, 400.0);
    vec2 normalizedX1 = vec2(x1.x - 320.0, x1.y - 240.0);
    vec2 normalizedX2 = vec2(x2.x - 320.0, x2.y - 240.0);
    vec2 p = normalize(normalizedX2 - normalizedX1);
    float lengthOfSegment = length(normalizedX2 - normalizedX1);

    vec2 normalizedX = vec2(gl_FragCoord.x - 320.0, gl_FragCoord.y - 240.0);
    vec2 x = normalizedX - normalizedX1;

    float projectionOnP = dot(p, x);
    vec2 closestPointOnLine = normalizedX1 + projectionOnP * p;

    distance = length(closestPointOnLine - normalizedX);

    if (distance < DISTANCE && projectionOnP > 0.0 && projectionOnP < lengthOfSegment) {
        redIntensity = 1.0 - distance / DISTANCE;
    }
    else if (length(x) < DISTANCE) {
        redIntensity = 1.0 - length(x) / DISTANCE;
    }
    else if (length(normalizedX - normalizedX2) < DISTANCE) {
        redIntensity = 1.0 - length(normalizedX - normalizedX2) / DISTANCE;
    }
    gl_FragColor = vec4(redIntensity, 0.0, 0.0, 1.0);
}

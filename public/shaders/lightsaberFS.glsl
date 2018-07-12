#ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
#else
    precision mediump float;
#endif

uniform float uDistance;
uniform vec4 uPoints;
// uniform vec4 uViewport; // vec4(0, 0, 640, 480);

vec2 normalizeFragCoord() {
    // float viewportOriginX = uViewport[0];
    // float viewportOriginY = uViewport[1];
    // float viewportWidth = uViewport[2];
    // float viewportHeight = uViewport[3];
    
    // return vec2(gl_FragCoord.x - uViewport[0] - uViewport[2] / 2.0, gl_FragCoord.y - uViewport[1] - uViewport[3] / 2.0);
    return vec2(gl_FragCoord.x - 640.0 / 2.0, gl_FragCoord.y - 480.0 / 2.0);
}

void main() {
    /*
    float redIntensity = 0.0;
    vec2 point1 = vec2(30.0, 30.0);
    // vec2 normalizedP = vec2(gl_FragCoord.x, gl_FragCoord.y);
    // vec2 normalizedP = normalizeFragCoord(vec2(gl_FragCoord.x, gl_FragCoord.y));
    vec2 normalizedP = normalizeFragCoord();
    float distance = length(point1 - normalizedP);
    if (distance < 30.0) {
        redIntensity = 1.0 - distance / 30.0;
    }
    gl_FragColor = vec4(redIntensity, 0.0, 0.0, 1.0);
    */
    float DISTANCE = uDistance;
    vec2 point1 = vec2(uPoints[0], uPoints[1]);
    vec2 point2 = vec2(uPoints[2], uPoints[3]);
    
    float redIntensity = 0.0;
    float distance = 0.0;

    vec2 directionP1toP2 = normalize(point2 - point1);
    float lengthOfLineSegment = length(point2 - point1);

    vec2 normalizedP = normalizeFragCoord();
    vec2 P = normalizedP - point1;

    float projectionOnLine = dot(directionP1toP2, P);
    vec2 closestPointOnLine = point1 + projectionOnLine * directionP1toP2;

    distance = length(closestPointOnLine - normalizedP);

    if (distance < DISTANCE && projectionOnLine > 0.0 && projectionOnLine < lengthOfLineSegment) {
        redIntensity = 1.0 - distance / DISTANCE;
    }
    else if (length(P) < DISTANCE) {
        redIntensity = 1.0 - length(P) / DISTANCE;
    }
    else if (length(normalizedP - point2) < DISTANCE) {
        redIntensity = 1.0 - length(normalizedP - point2) / DISTANCE;
    }
    if (redIntensity == 0.0) discard; 
    gl_FragColor = vec4(redIntensity, 0.0, 0.0, 1.0);
}

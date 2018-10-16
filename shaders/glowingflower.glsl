#ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
#else
    precision mediump float;
#endif

void main() {
    const float RADIUS = 150.0;
    float redIntensity1 = 0.0;
    float redIntensity2 = 0.0;
    float angle;
    float normalizedX = gl_FragCoord.x - 320.0;
    float normalizedY = gl_FragCoord.y - 240.0;
    float distance = sqrt(normalizedX * normalizedX + normalizedY * normalizedY);

    if (distance < RADIUS) {
        redIntensity1 = 1.0 - distance / RADIUS;
        if( abs(normalizedX) > 0.0) {
            angle = atan(normalizedY, normalizedX);
        } else {
                angle = 0.0;
        }
        redIntensity2 = abs(cos(2.5 * angle)) * (1.1 - distance / RADIUS);
    }
    gl_FragColor = vec4(max(redIntensity1, redIntensity2), 0.0, 0.0, 1.0);
}

#ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
#else
    precision mediump float;
#endif

// Color of pixel
uniform vec4 u_PixelColor;

void main() {
    gl_FragColor = u_PixelColor;
}

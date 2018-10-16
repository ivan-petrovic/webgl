#ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
#else
    precision mediump float;
#endif

uniform vec4 u_pixel_color;

void main() {
    gl_FragColor = u_pixel_color;
}

#ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
#else
    precision mediump float;
#endif

varying vec4 v_final_color;

void main() {
    gl_FragColor = v_final_color;
}

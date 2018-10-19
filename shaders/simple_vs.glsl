attribute vec3 a_position;

uniform mat4 u_PVM_transform;

void main() {
    gl_Position = u_PVM_transform * vec4(a_position, 1.0);
}

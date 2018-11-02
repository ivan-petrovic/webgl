attribute vec3 a_position;
attribute vec3 a_normal;

uniform mat4 u_VM_transform;
uniform mat4 u_P_transform;
uniform mat3 u_N_transform;

varying vec3 v_normal;
varying vec3 v_eye_vec;

void main() {
    vec4 vertex = u_VM_transform * vec4(a_position, 1.0);
    v_normal = normalize(u_N_transform * a_normal);
    v_eye_vec = -vec3(vertex.xyz);
    
    // gl_Position = u_P_transform * u_VM_transform * vec4(a_position, 1.0);
    gl_Position = u_P_transform * vertex;
}

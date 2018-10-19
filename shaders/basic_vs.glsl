attribute vec3 a_position;

uniform mat4 u_PVM_transform;
// uniform mat4 u_proj_transform;
// uniform mat4 u_view_transform;
// uniform mat4 u_model_transform;

void main() {
    gl_Position = u_PVM_transform * vec4(a_position, 1.0);
}

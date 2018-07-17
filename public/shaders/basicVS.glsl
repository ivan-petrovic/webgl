// Vertex shader expects one vertex position
attribute vec3 a_position;

// Transform the vertex position
uniform mat4 u_PVMTransform;
// uniform mat4 u_ViewTransform;
// uniform mat4 u_ProjTransform;
// uniform mat4 u_PVM_Transform;

void main() {
    gl_Position = u_PVMTransform * vec4(a_position, 1.0);
}

attribute vec3 a_position;     // Vertex shader expects one vertex position
attribute vec2 a_texture_coordinate;  // This is the texture coordinate attribute

// texture coordinate that maps image to the square
varying vec2 v_texture_coordinate;

// to transform the vertex position
// uniform mat4 uModelTransform;
// uniform mat4 uViewProjTransform;
uniform mat4 u_PVM_transform;

void main() { 
    // Convert the vec3 into vec4 for scan conversion and
    // transform by uModelTransform and uViewProjTransform before
    // assign to gl_Position to pass the vertex to the fragment shader
    // gl_Position = uViewProjTransform * uModelTransform * vec4(aSquareVertexPosition, 1.0); 
    gl_Position = u_PVM_transform * vec4(a_position, 1.0); 
    
    // pass the texture coordinate to the fragment shader
    v_texture_coordinate = a_texture_coordinate;
}

precision mediump float; 
// sets the precision for floating point computation

// The object that fetches data from texture.
// Must be set outside the shader.
uniform sampler2D u_sampler;

// Color of pixel
uniform vec4 u_pixel_color;  

// The "varying" keyword is for signifying that the texture coordinate will be
// interpolated and thus varies. 
varying vec2 v_texture_coordinate;

void main() {
    // texel color look up based on interpolated UV value in v_texture_coordinate
    vec4 c = texture2D(u_sampler, v_texture_coordinate);
    // 
    
    // different options:
    // e.g.  tint the transparent area also
    // vec4 result = c * (1.0-u_pixel_color.a) + u_pixel_color * u_pixel_color.a;
    
    // or: tint the textured area, and leave transparent area as defined by the texture
    // vec3 r = vec3(c) * (1.0-u_pixel_color.a) + vec3(u_pixel_color) * u_pixel_color.a;
    // vec4 result = vec4(r, c.a);
    
    // or: ignore pixel tinting ...
    vec4 result = c;

    // or: simply multiply pixel color with texture color
    // vec4 result = c * u_pixel_color;

    gl_FragColor = result;
}

attribute vec3 a_position;
attribute vec3 a_normal;

uniform mat4 u_VM_transform;
uniform mat4 u_P_transform;
uniform mat4 u_N_transform;

uniform float u_shininess;
uniform vec3 u_light_direction;
uniform vec4 u_light_ambient;
uniform vec4 u_light_diffuse;
uniform vec4 u_light_specular;

uniform vec4 u_material_ambient;
uniform vec4 u_material_diffuse;
uniform vec4 u_material_specular;

varying vec4 v_final_color;

void main(void) {
    vec4 vertex = u_VM_transform * vec4(a_position, 1.0);
    vec3 N = vec3(u_N_transform * vec4(a_normal, 1.0));
    vec4 light = u_VM_transform * vec4(u_light_direction, 0.0);
    // vec3 L = normalize(u_light_direction);
    vec3 L = normalize(light.xyz);

    float lambertTerm = clamp(dot(N,-L),0.0,1.0);
    vec4 Ia = u_light_ambient * u_material_ambient;
    vec4 Id = vec4(0.0,0.0,0.0,1.0);
    vec4 Is = vec4(0.0,0.0,0.0,1.0);
    
    Id = u_light_diffuse * u_material_diffuse * lambertTerm;
    
    vec3 eyeVec = -vec3(vertex.xyz);
    vec3 E = normalize(eyeVec);
    vec3 R = reflect(L, N);
    
    float specular = pow(max(dot(R, E), 0.0), u_shininess );
    Is = u_light_specular * u_material_specular * specular;
    
    v_final_color = Ia + Id + Is;
    v_final_color.a = 1.0;
    
    gl_Position = u_P_transform * vertex;
}

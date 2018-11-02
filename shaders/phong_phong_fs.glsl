#ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
#else
    precision mediump float;
#endif

uniform vec3 u_light_direction;
uniform vec4 u_light_ambient;
uniform vec4 u_light_diffuse;
uniform vec4 u_light_specular;

uniform vec4 u_material_ambient;
uniform vec4 u_material_diffuse;
uniform vec4 u_material_specular;
uniform float u_shininess;

varying vec3 v_normal;
varying vec3 v_eye_vec;

void main() {
    vec3 L = normalize(u_light_direction);
    vec3 N = normalize(v_normal);
    float lambertTerm = dot(N,-L);
    vec4 Ia = u_light_ambient * u_material_ambient;
    vec4 Id = vec4(0.0,0.0,0.0,1.0);
    vec4 Is = vec4(0.0,0.0,0.0,1.0);
    
    if(lambertTerm > 0.0) {
        Id = u_light_diffuse * u_material_diffuse * lambertTerm;
        vec3 E = normalize(v_eye_vec);
        vec3 R = reflect(L, N);
        float specular = pow( max(dot(R, E), 0.0), u_shininess);
        Is = u_light_specular * u_material_specular * specular;
    }

    vec4 finalColor = Ia + Id + Is;
    finalColor.a = 1.0;
    gl_FragColor = finalColor;
}

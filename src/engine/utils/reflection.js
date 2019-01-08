/**
 * @param {vec2} v vector to reflect (going into line l)
 * @param {vec2} n normal unit vector around which to reflect
 *       \      /
 *        \v   /v'
 *         \|n/
 *  ----------------l
 * v' = v - 2 * dot(v, n) * n, if v enters point of reflection (out chosen convention)
 * (v' = 2 * dot(v, n) * n - v, if v leaves point of reflection)
 * 
 * @returns {vec2} v' reflected vector (going out of line l)
 */
export default function(v, n) {
    let v1 = vec2.create();
    v1 = vec2.scale(v1, n, 2 * vec2.dot(v, n));
    v1 = vec2.subtract(v1, v, v1);
    return v1;
}

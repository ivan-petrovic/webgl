"use strict";

import VertexBuffer from '../buffer';

export default class {
    constructor() {
        this.vbos_map = {};
    }

    /**
     * @param {string} vbo_name Name of the VBO
     * 
     * @returns {number} id of vbo in webgl context
     */
    retrieve_vbo(vbo_name) {
        let id = null;

        if (vbo_name in this.vbos_map) {
            id = this.vbos_map[vbo_name].id;
        }
        
        return id;
    }

    initialize(gl) {
        let verticesOfSquare = [
            1.0, 1.0, 0.0,
            -1.0, 1.0, 0.0,
            1.0, -1.0, 0.0,
            -1.0, -1.0, 0.0
        ];
        let vertexBuffer = new VertexBuffer(verticesOfSquare);
        vertexBuffer.initialize(gl);
        this.vbos_map['WHOLE_CANVAS'] = vertexBuffer;
    }
}

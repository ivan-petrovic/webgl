"use strict";

import Buffer from '../buffer';
import VBO from '../vbo';

export default class {
    /**
     * @param {WebGLContext} gl webgl context of canvas element
     */
    constructor(gl) {
        this.gl = gl;
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

    /**
     * @param {string} vbo_name Name of the VBO
     * 
     * @returns {number} id of vbo in webgl context
     */
    get_vbo(vbo_name) {
        let vbo = null;

        if (vbo_name in this.vbos_map) {
            vbo = this.vbos_map[vbo_name];
        }
        
        return vbo;
    }

    /**
     * @param {string} vbo_name Name of the VBO
     * 
     * @returns {number} id of vbo in webgl context
     */
    get_vbo_id(vbo_name) {
        let vbo = null;

        if (vbo_name in this.vbos_map) {
            vbo = this.vbos_map[vbo_name].id;
        }
        
        return vbo;
    }

    /**
     * @param {string} vbo_name Name of the VBO
     * 
     * @returns {number} id of vbo in webgl context
     */
    add_vbo(vbo_name, data, type) {

        if (vbo_name in this.vbos_map) {
            return this.vbos_map[vbo_name].id;
        }

        let vertexBuffer = new Buffer(data, type);
        vertexBuffer.initialize(this.gl);
        this.vbos_map[vbo_name] = vertexBuffer;

        return vertexBuffer.id;
    }

    /**
     * @param {string} vbo_name Name of the VBO
     * 
     * @returns {number} id of vbo in webgl context
     */
    create_vbo(vbo_name, size, type) {

        if (vbo_name in this.vbos_map) {
            // return this.vbos_map[vbo_name];
            console.log("VBO with name " + vbo_name + " allready exists.");
        }

        let vertexBuffer = new VBO(size, type);
        vertexBuffer.initialize(this.gl);
        this.vbos_map[vbo_name] = vertexBuffer;

        return vertexBuffer;
    }

    load_data_in_vbo(vbo_name, data) {
        let buffer = this.get_vbo(vbo_name);

        if(buffer === null) {
            console.log("VBO with name " + vbo_name + " does not exists.");
            return;
        }

        return buffer.load_data(data, this.gl); // returns offset in buffer where data is stored
    }


    initialize() {
        let verticesOfSquare = [
            1.0, 1.0, 0.0,
            -1.0, 1.0, 0.0,
            1.0, -1.0, 0.0,
            -1.0, -1.0, 0.0
        ];
        let vertexBuffer = new Buffer(new Float32Array(verticesOfSquare), this.gl.ARRAY_BUFFER);
        vertexBuffer.initialize(this.gl);
        this.vbos_map['WHOLE_CANVAS'] = vertexBuffer;

        let size_in_bytes = 10240;
        this.create_vbo('VBO_POSITION', size_in_bytes, this.gl.ARRAY_BUFFER);
    }
}

"use strict";

import ResourceMap from './resources/resource_map';
import TextFileLoader from './resources/text_file_loader';

export default class {
    constructor() {
        this.simpleVS = "shaders/simpleVS.glsl";  // Path to the VertexShader 
        this.simpleFS = "shaders/simpleFS.glsl";  // Path to the simple FragmentShader
    
        this.constColorShader = null;

        this.resourceMap = new ResourceMap();
        this.textFileLoader = new TextFileLoader(this.resourceMap);
    };

    // Simple Shader
    getConstColorShader() { return this.constColorShader; }

    _createShaders(callBackFunction) {
        this.constColorShader = new SimpleShader(kSimpleVS, kSimpleFS);
        callBackFunction();
    }

    initialize(callBackFunction) {
        // constant color shader: SimpleVS, and SimpleFS
        this.textFileLoader.loadTextFile(this.simpleVS, this.textFileLoader.eTextFileType.eTextFile);
        this.textFileLoader.loadTextFile(this.simpleFS, this.textFileLoader.eTextFileType.eTextFile);

        this.resourceMap.setLoadCompleteCallback(function () { this._createShaders(callBackFunction); });
    }
}
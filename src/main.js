import MnEngine from './engine';
import ResourceMap from './resources/resource_map';
import TextFileLoader from './resources/text_file_loader';
import Shader from './shader';
import VertexBuffer from './buffer';
import Renderable from './renderable';

export function init() {
    let engine = new MnEngine();
    engine.init();

    let resources = new ResourceMap();  // should be singleton (for now that is not implemented)
    let textFileLoader = new TextFileLoader(resources);

    // Load necessery shader files asynchroniously
    // When loading completes call start function
    textFileLoader.loadTextFile("shaders/simpleVS.glsl", textFileLoader.eTextFileType.eTextFile);
    textFileLoader.loadTextFile("shaders/lightsaberFS.glsl", textFileLoader.eTextFileType.eTextFile);
    resources.setLoadCompleteCallback(function () { start(engine, resources); });
}

function start(engine, resources) {
    let shader = new Shader("shaders/simpleVS.glsl", "shaders/lightsaberFS.glsl", resources, engine.gl);
    shader.init();

    let verticesOfSquare = [
        1.0, 1.0, 0.0,
        -1.0, 1.0, 0.0,
        1.0, -1.0, 0.0,
        -1.0, -1.0, 0.0
    ];
    let vb = new VertexBuffer(verticesOfSquare, engine.gl);
    vb.initialize();
    
    let square = new Renderable(shader, vb.getVertexBufferId());
    
    engine.addRenderable(square);
    engine.start();
}

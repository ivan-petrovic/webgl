import MnEngine from './engine';
import Shader from './shader';
import VertexBuffer from './buffer';
import Renderable from './renderable';

export function start() {
    let engine = new MnEngine();
    engine.init();

    let shader = new Shader("2d-vertex-shader", "2d-fragment-shader", engine.gl);
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
    
    // square.draw(engine.gl);
    engine.addRenderable(square);
    engine.start();
}

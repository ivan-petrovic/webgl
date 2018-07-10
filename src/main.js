import MnEngine from './engine';
import LightSaber from './light_saber_renderable';

export function main() {
    let engine = new MnEngine();
    let saber = new LightSaber(engine, "shaders/simpleVS.glsl", "shaders/lightsaberFS.glsl");

    engine.addRenderable(saber);

    engine.loadResourcesAndStart();
}

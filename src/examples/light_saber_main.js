"use strict";

import MnEngine from './engine/engine';
import LightSaber from './model/light_saber';

export function main() {
    let engine = new MnEngine();
    let saber1 = new LightSaber(engine, -100.0, -100.0, 200.0, 200.0);
    let saber2 = new LightSaber(engine, -100.0, 100.0, 200.0, -200.0);
    let saber3= new LightSaber(engine, 0.0, 100.0, 100.0, 0.0);

    engine.scene.add_renderable(saber1);
    engine.scene.add_renderable(saber2);
    engine.scene.add_renderable(saber3);

    engine.load_resources_and_start();
}

// Should be called:
// gl.blendFunc(gl.SRC_COLOR, gl.ONE)
// gl.enable(gl.BLEND);

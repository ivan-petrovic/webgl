"use strict";

import MnEngine from './engine/engine';
import LightSaber from './light_saber_renderable';

export function main() {
    let engine = new MnEngine();
    let saber1 = new LightSaber(engine, -100.0, -100.0, 200.0, 200.0);
    let saber2 = new LightSaber(engine, 200.0, 0.0, 100.0, -200.0);

    engine.add_renderable(saber1);
    engine.add_renderable(saber2);

    engine.load_resources_and_start();
}

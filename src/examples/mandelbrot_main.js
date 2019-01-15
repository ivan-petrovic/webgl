"use strict";

import MnEngine from './engine/engine';
import Mandelbrot from './model/mandelbrot';

export function main() {
    let engine = new MnEngine();
    let fractal = new Mandelbrot(engine);

    engine.scene.add_renderable(fractal);
    engine.load_resources_and_start();
}

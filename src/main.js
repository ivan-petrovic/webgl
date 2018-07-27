"use strict";

import MnEngine from './engine/engine';
import Mandelbrot from './mandelbrot';

export function main() {
    let engine = new MnEngine();
    let fractal = new Mandelbrot(engine);

    engine.addRenderable(fractal);
    engine.loadResourcesAndStart();
}

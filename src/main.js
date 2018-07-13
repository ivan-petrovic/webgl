"use strict";

import MnEngine from './engine';
import ColoredSquare from './colored_square_renderable';

export function main() {
    let engine = new MnEngine();
    let square1 = new ColoredSquare(engine, -0.1, -0.1, 20.0);
    let square2 = new ColoredSquare(engine, 0.2, 0.0, 40.0);

    engine.addRenderable(square1);
    engine.addRenderable(square2);

    engine.loadResourcesAndStart();
}

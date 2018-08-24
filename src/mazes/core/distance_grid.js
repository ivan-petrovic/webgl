"use strict";

import Grid from './grid';

export default class DistanceGrid extends Grid {
    constructor(rows, columns, engine) {
        super(rows, columns, engine);
        this.distances = null;
        this.maximum = null;
    }

    contents_of(cell) {
        if (this.distances && this.distances.exists(cell)) {
            return ("  " + this.distances.distance_of(cell)).slice(-3);
        } else {
            return super.contents_of(cell);
        }
    }

    set_distances(distances) {
        this.distances = distances;
        let [farthest, maximum] = distances.max();
        this.maximum = maximum;
        // console.log('maximum ' + maximum);
    }

    backgroundColorForCell(cell) {
        let distance = this.distances.distance_of(cell);
        // console.log('distance ' + distance);
        let intensity = (this.maximum - distance) / this.maximum;
        let dark = Math.round(255 * intensity);
        let bright = 128 + Math.round(127 * intensity);
        return [dark / 256, bright / 256, dark / 256, 1.0];
    }
}


// class ColoredGrid < Grid
//     def distances=(distances)
//         @distances = distances
//         farthest, @maximum = distances.max
//     end

//     def background_color_for(cell)
//         distance = @distances[cell] or return nil
//         intensity = (@maximum - distance).to_f / @maximum
//         dark = (255 * intensity).round
//         bright = 128 + (127 * intensity).round
//         ChunkyPNG::Color.rgb(dark, bright, dark)
//     end
// end
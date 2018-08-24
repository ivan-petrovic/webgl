"use strict";

import select from '../util/array_helper';

export default class {
    static on(grid) {
        grid.for_each_cell((cell) => {
            let neighbors = [];
            if(cell.north) neighbors.push(cell.north);
            if(cell.east) neighbors.push(cell.east);
            let neighbor = select.random_element_of(neighbors);
            if (neighbor) cell.link(neighbor);
        });

        return grid;
    }
}

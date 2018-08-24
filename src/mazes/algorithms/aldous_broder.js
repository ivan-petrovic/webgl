"use strict";

class AldousBroder {

    static on(grid) {
        let cell = grid.random_cell;
        let unvisited = grid.size - 1;

        while (unvisited > 0) {
            let neighbor = cell.sample_neighbor;

            if (neighbor.empty_links) {
                cell.link(neighbor);
                unvisited -= 1;
            }

            cell = neighbor;
        }

        return grid;
    }

}

module.exports = AldousBroder;

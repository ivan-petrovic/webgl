"use strict";

import Distances from './distances';

export default class {
    constructor(row, column) {
        this.row = row;
        this.column = column;
        this.links = {};

        this.north = null;
        this.south = null;
        this.east = null;
        this.west = null;
    }

    link(cell, bidi = true) {
        this.links[cell._hash()] = cell;
        if (bidi) {
            cell.link(this, false);
        }
    }

    unlink(cell, bidi = true) {
        delete this.links[cell._hash()];
        if (bidi) {
            cell.unlink(this, false);
        }
    }

    is_linked(cell) {
        if (cell) return this.links.hasOwnProperty(cell._hash());
        return false;
    }

    get linked_cells() {
        return Object.values(this.links);
    }

    get num_of_links() {
        return Object.keys(this.links).length;
    }

    get empty_links() {
        return Object.keys(this.links).length === 0 && this.links.constructor === Object;
    }

    get neighbors() {
        let list = [];

        if(this.north) { list.push(this.north); }
        if(this.south) { list.push(this.south); }
        if(this.east) { list.push(this.east); }
        if(this.west) { list.push(this.west); }
        
        return list;
    }

    get sample_neighbor() {
        let neighbors = this.neighbors;
        let random_index = Math.floor(Math.random() * neighbors.length);

        return neighbors.length > 0 ? neighbors[random_index] : null;
    }

    get unvisited_neighbors() {
        return this.neighbors.filter((neighbor) => neighbor.empty_links );
    }

    get visited_neighbors() {
        return this.neighbors.filter((neighbor) => neighbor.num_of_links > 0 );
    } 

    print() {
        console.log('cell: (' + this.row + ', ' + this.column + ') ');
    }

    distances() {
        let distances = new Distances(this);
        let frontier = [ this ];
        
        while (frontier.length > 0) {
            let new_frontier = [];
            
            frontier.forEach(cell => {
                cell.linked_cells.forEach((linked_cell) => {
                    if (distances.exists(linked_cell)) return;
                    distances.store(linked_cell, distances.distance_of(cell) + 1);
                    new_frontier.push(linked_cell);
                });
            });

            frontier = new_frontier
        }
        
        return distances;
    }

    _hash() {
        return this.row * 1000 + this.column + 1;
    }

}

"use strict";

const select = require('../util/array_helper');

class HuntAndKill {
    static on(grid) {
        let current = grid.random_cell;

        while (current) {
            let unvisited_neighbors = current.unvisited_neighbors;

            if (unvisited_neighbors.length > 0) {
                // let index = Math.floor(Math.random() * unvisited_neighbors.length);
                // let neighbor = unvisited_neighbors[index];
                let neighbor = select.random_element_of(unvisited_neighbors);
                current.link(neighbor);
                current = neighbor;
            } else {
                current = null;
                let done = false;

                grid.for_each_cell((cell) => {
                    if (done) return;
                    let visited_neighbors = cell.visited_neighbors;
                    if (cell.empty_links && visited_neighbors.length > 0) {
                        current = cell;

                        // let index = Math.floor(Math.random() * visited_neighbors.length);
                        // let neighbor = visited_neighbors[index];
                        let neighbor = select.random_element_of(visited_neighbors);
                        current.link(neighbor);

                        done = true; // break
                    }
                });
            }
        }
    
        return grid;
    }
}

module.exports = HuntAndKill;

// class HuntAndKill
//     def self.on(grid)
//         current = grid.random_cell

//         while current
//             unvisited_neighbors = current.neighbors.select { |n| n.links.empty? }

//             if unvisited_neighbors.any?
//                 neighbor = unvisited_neighbors.sample
//                 current.link(neighbor)
//                 current = neighbor
//             else
//                 current = nil

//                 grid.each_cell do |cell|
//                     visited_neighbors = cell.neighbors.select { |n| n.links.any? }
//                     if cell.links.empty? && visited_neighbors.any?
//                         current = cell

//                         neighbor = visited_neighbors.sample
//                         current.link(neighbor)

//                         break
//                     end
//                 end
//             end
//         end
    
//         grid
//     end
// end
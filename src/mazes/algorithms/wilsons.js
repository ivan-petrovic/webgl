"use strict";

const select = require('../util/array_helper');

class Wilsons {

    static on(grid) {
        let unvisited = [];
        grid.for_each_cell(cell => unvisited.push(cell));

        // let index = Math.floor(Math.random() * unvisited.length);
        unvisited.splice(select.random_index_of(unvisited), 1);

        while (unvisited.length > 0) {
            // index = Math.floor(Math.random() * unvisited.length);
            // let cell = unvisited[index];
            let cell = select.random_element_of(unvisited);
            let path = [cell];

            while (unvisited.includes(cell)) {
                cell = cell.sample_neighbor;
                let position = path.indexOf(cell);
                if (position > -1) {
                    path.splice(position + 1);
                } else {
                    path.push(cell);
                }
            }

            for (let index = 0; index < path.length - 1; index += 1) {
                path[index].link(path[index + 1]);
                let delIndex = unvisited.indexOf(path[index]);
                unvisited.splice(delIndex, 1);
            }
        }

        return grid;
    }
}

module.exports = Wilsons;

// class Wilsons

//     def self.on(grid)
//         unvisited = []
//         grid.each_cell { |cell| unvisited << cell }

//         first = unvisited.sample
//         unvisited.delete(first)

//         while unvisited.any?
//             cell = unvisited.sample
//             path = [cell]

//             while unvisited.include?(cell)
//                 cell = cell.neighbors.sample
//                 position = path.index(cell)
//                 if position
//                     path = path[0..position]
//                 else
//                     path << cell
//                 end
//             end

//             0.upto(path.length-2) do |index|
//                 path[index].link(path[index + 1])
//                 unvisited.delete(path[index])
//             end
//         end

//         grid
//     end
// end
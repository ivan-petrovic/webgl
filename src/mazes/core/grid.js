"use strict";

import Cell from './cell';
import Renderable from '../../engine/renderable';
import ConstColorShader from '../../const_color_shader';
import VertexBuffer from '../../engine/buffer';

// Next property is shared by all instances of class (static property)
let _shader = null;     // the shader for shading this object
let CELL_SIZE = 10;

export default class Grid extends Renderable {
    constructor(rows, columns, engine) {
        // for drawing
        super(engine);
        this.originX = 0;
        this.originY = 0;
        this.color = [0.0, 0.0, 0.0, 1.0]; // default black color
        this.vertexBuffer = null;
        this.backgroundVertexBuffer = null;
        this.num_lines = 0;
        this.num_triangles = 0;
        this.colors = [];

        this.rows = rows;
        this.columns = columns;

        this.grid = this._prepare_grid();
        this._configure_cells();
    }

    _prepare_grid() {
        return Array.apply(null, new Array(this.rows)).map((currElement, row) => {
            return Array.apply(null, new Array(this.columns)).map((currElement, column) => {
                return new Cell(row, column);
            });
        });
    }

    _configure_cells() {
        let cells = this.each_cell();
        let value, done;
        
        while({value, done} = cells.next(), !done) {
            let cell = value;
            let row = cell.row;
            let col = cell.column;
            cell.north = this.cell_at(row + 1, col);
            cell.south = this.cell_at(row - 1, col);
            cell.west = this.cell_at(row, col - 1);
            cell.east = this.cell_at(row, col + 1);
        }
    }

    cell_at(row, column) {
        if (row < 0 || row > this.rows - 1) return null;
        if (column < 0 || column > this.grid[row].length - 1) return null;
        return this.grid[row][column];
    }

    get random_cell() {
        let row = Math.floor(Math.random() * this.rows);
        let column = Math.floor(Math.random() * this.grid[row].length);
        return this.grid[row][column];
    }

    get size() {
        return this.rows * this.columns;
    }

    * each_row() {
        yield* this.grid;
    }
    
    * each_cell() {
        let rows = this.each_row();
        let value, done;
    
        while({value, done} = rows.next(), !done) {
            if (value) yield* value;
        }
    }

    for_each_cell(func) {
        let cells = this.each_cell();
        let value, done;
        
        while({value, done} = cells.next(), !done) {
            func(value);    // value is next cell in grid
        }
    }

    for_each_row(func) {
        let rows = this.each_row();
        let value, done;
        
        while({value, done} = rows.next(), !done) {
            func(value);    // value is next row in grid
        }
    }

    toString() {
        let output = "+" + "---+".repeat(this.columns) + "\n";

        for (let k = this.grid.length - 1; k > -1; k -= 1) {
            let row = this.grid[k];

            let top = "|";
            let bottom = "+";
            
            row.forEach(cell => {
                if (!cell) cell = new Cell(-1, -1);

                let body = this.contents_of(cell);
                let east_boundary = (cell.is_linked(cell.east) ? " " : "|");
                top += body + east_boundary;
                
                // three spaces below, too >>----------------->> >...<
                let south_boundary = (cell.is_linked(cell.south) ? "   " : "---");
                let corner = "+";
                bottom += south_boundary + corner;
            });

            output += top + "\n";
            output += bottom + "\n";
         }

         return output;
    }

    contents_of(cell) {
        return "   "; // <-- that's THREE (3) spaces!
    }

    get deadends() {
        let list = [];
        this.for_each_cell((cell) => {
            if (cell.num_of_links == 1) list.push(cell);
        });
        return list;
    }

    print() {
        let cells = this.each_cell();
        let value, done;
        
        while({value, done} = cells.next(), !done) {
            value.print();
        }
    }

    static get vertexShaderName() { return 'shaders/basicVS.glsl'; }
    static get fragmentShaderName() { return 'shaders/basicFS.glsl'; }
    static get shader() { return _shader; }
    static set shader(value) { _shader = value; }

    loadResources() {
        // Load necessery shader files asynchroniously
        let textFileLoader = this.engine.text_file_loader;
        textFileLoader.loadTextFile(Grid.vertexShaderName, textFileLoader.eTextFileType.eTextFile);
        textFileLoader.loadTextFile(Grid.fragmentShaderName, textFileLoader.eTextFileType.eTextFile);
    }

    initialize() {
        if(Grid.shader === null) {
            Grid.shader = new ConstColorShader(Grid.vertexShaderName, Grid.fragmentShaderName);
            Grid.shader.initialize(this.engine.resources, this.engine.webgl_context);
        }

        let verticesOfGrid = [];
        let verticesOfBackground = [];

        this.for_each_cell((cell) => {
            let x1 = cell.column * CELL_SIZE;
            let y1 = cell.row * CELL_SIZE;
            let x2 = (cell.column + 1) * CELL_SIZE;
            let y2 = (cell.row + 1) * CELL_SIZE;
    
            // img.line(x1, y1, x2, y1, wall) unless cell.north
            if (cell.north === null) { verticesOfGrid.push(x1, y2, 0.0, x2, y2, 0.0); this.num_lines += 1; } // top row
            // img.line(x1, y1, x1, y2, wall) unless cell.west
            if (cell.west === null) { verticesOfGrid.push(x1, y1, 0.0, x1, y2, 0.0); this.num_lines += 1; }  // left row
            // img.line(x2, y1, x2, y2, wall) unless cell.linked?(cell.east)
            if (!cell.is_linked(cell.east)) { verticesOfGrid.push(x2, y1, 0.0, x2, y2, 0.0); this.num_lines += 1; } // east
            // img.line(x1, y2, x2, y2, wall) unless cell.linked?(cell.south)
            if (!cell.is_linked(cell.south)) { verticesOfGrid.push(x1, y1, 0.0, x2, y1, 0.0); this.num_lines += 1; } // south

            let color = this.backgroundColorForCell(cell);
            // console.log('color ' + color);
            verticesOfBackground.push(x1, y1, 0.0);
            verticesOfBackground.push(x2, y1, 0.0);
            verticesOfBackground.push(x1, y2, 0.0);
            this.num_triangles += 1;
            this.colors.push(color);
            // verticesOfBackground.push(color[0], color[1], color[2]);

            verticesOfBackground.push(x2, y1, 0.0);
            verticesOfBackground.push(x2, y2, 0.0);
            verticesOfBackground.push(x1, y2, 0.0);
            this.num_triangles += 1;
            this.colors.push(color);
            // verticesOfBackground.push(color[0], color[1], color[2]);
        });
        // console.log(this.colors);
        this.vertexBuffer = new VertexBuffer(verticesOfGrid);
        this.vertexBuffer.initialize(this.engine.webgl_context);

        this.backgroundVertexBuffer = new VertexBuffer(verticesOfBackground);
        this.backgroundVertexBuffer.initialize(this.engine.webgl_context);
    }
    
    backgroundColorForCell(cell) {
        return [1.0, 1.0, 1.0, 1.0];
    }

    getCellCenter(row, column) {
        let x = this.originX + (column * CELL_SIZE + CELL_SIZE / 2.0);
        let y = this.originY + (row * CELL_SIZE + CELL_SIZE / 2.0)
        return vec3.fromValues(x, y, 0);
    }

    // def to_png(cell_size: 10)
    //     img_width = cell_size * columns
    //     img_height = cell_size * rows
    
    //     background = ChunkyPNG::Color::WHITE
    //     wall = ChunkyPNG::Color::BLACK
    
    //     img = ChunkyPNG::Image.new(img_width + 1, img_height + 1, background)
    
    //     each_cell do |cell|
    //         x1 = cell.column * cell_size
    //         y1 = cell.row * cell_size
    //         x2 = (cell.column + 1) * cell_size
    //         y2 = (cell.row + 1) * cell_size
    
    //         img.line(x1, y1, x2, y1, wall) unless cell.north
    //         img.line(x1, y1, x1, y2, wall) unless cell.west
    
    //         img.line(x2, y1, x2, y2, wall) unless cell.linked?(cell.east)
    //         img.line(x1, y2, x2, y2, wall) unless cell.linked?(cell.south)
    //     end
        
    //     img
    // end
    
    draw(gl) {
        let camera = this.engine.camera;
        let pvmMatrix = mat4.create();
        let modelMatrix = mat4.create(); // Creates a blank identity matrix
        
        // Step A: compute translation, for now z is always at 0.0
        mat4.translate(modelMatrix, modelMatrix, vec3.fromValues(this.originX, this.originY, 0.0));
        // Step B: concatenate with rotation.
        // mat4.rotateZ(matrix, matrix, this.getRotationInRad());
        // Step C: concatenate with scaling
        // mat4.scale(modelMatrix, modelMatrix, vec3.fromValues(this.width, this.height, 1.0));

        mat4.multiply(pvmMatrix, camera.getPVMatrix(), modelMatrix);

        // Activates the vertex buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer.getId());

        Grid.shader.activate(gl);
        // Describe the characteristic of the vertex position attribute
        gl.vertexAttribPointer(Grid.shader.getPositionLocation(),
            3,              // each element is a 3-float (x,y,z)
            gl.FLOAT,       // data type is FLOAT
            false,          // if the content is normalized vectors
            0,              // number of bytes to skip in between elements
            0);             // offsets to the first element

        gl.enableVertexAttribArray(Grid.shader.getPositionLocation());
        gl.uniformMatrix4fv(Grid.shader.getPVMTransformLocation(), false, pvmMatrix);
        gl.uniform4fv(Grid.shader.getColorLocation(), this.color);
        // Grid.shader.activate();

        gl.drawArrays(gl.LINES, 0, this.num_lines * 2);

        // Activates the vertex buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, this.backgroundVertexBuffer.getId());
        gl.vertexAttribPointer(Grid.shader.getPositionLocation(),
            3,              // each element is a 3-float (x,y,z)
            gl.FLOAT,       // data type is FLOAT
            false,          // if the content is normalized vectors
            0,              // number of bytes to skip in between elements
            0);             // offsets to the first element

        gl.enableVertexAttribArray(Grid.shader.getPositionLocation());
        gl.uniformMatrix4fv(Grid.shader.getPVMTransformLocation(), false, pvmMatrix);

        // gl.uniform4fv(Grid.shader.getColorLocation(), [0.0, 0.5, 0.0, 1.0]);
        // gl.drawArrays(gl.TRIANGLES, 0, 36);

        for(let i = 0; i < this.num_triangles; i += 1) {
            gl.uniform4fv(Grid.shader.getColorLocation(), this.colors[i]);
            // console.log(this.colors[i]);
            // if (i % 2 == 0) {
            //     gl.uniform4fv(Grid.shader.getColorLocation(), [0.0, i / this.num_triangles, 0.0, 1.0]);
            // } else {
            //     gl.uniform4fv(Grid.shader.getColorLocation(), [0.0, 0.0,  i / this.num_triangles, 1.0]);
            // }
            
            gl.drawArrays(gl.TRIANGLES, i * 3, 3);
        }
    }

    getNextRight(row, column) {
        // console.log('in next right: ' + column + '-' + this.columns);
        if (column < this.columns - 1) {
            let cell = this.cell_at(row, column);
            // console.log('get next right' + cell.column);
            if (cell.is_linked(cell.east)) return column + 1;
        }
        return column;
    }
    getNextLeft(row, column) {
        if (column > 0) {
            let cell = this.cell_at(row, column);
            // console.log('get next left' + cell.column);
            if (cell.is_linked(cell.west)) return column - 1;
        }
        return column;
    }
    getNextUp(row, column) {
        if (row < this.rows - 1) {
            let cell = this.cell_at(row, column);
            if (cell.is_linked(cell.north)) return row + 1;
        }
        return row;
    }
    getNextDown(row, column) {
        if (row > 0) {
            let cell = this.cell_at(row, column);
            if (cell.is_linked(cell.south)) return row - 1;
        }
        return row;
    }
}

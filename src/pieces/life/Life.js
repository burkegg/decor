import {useEffect, useRef} from "react";
import * as p5 from "p5";
const makeGrid = (rows, cols) => {
  let outer = Array(rows);
  for (let i = 0; i < outer.length; i++) {
    let inner = Array(cols);
    for (let j = 0; j < inner.length; j++) {
      let n = Math.random();
      if (n < 0.7) {
        n = 0;
      } else {
        n = 1;
      }
      inner[j] = { status: n, lives: n };
    }
    outer[i] = inner;
  }
  return outer;
}

let resolution = 10;


const newSquare = (nextState, data) => {
  return { status: nextState, lives: data.lives + nextState };
};

const Life = () => {
  const sketchRef = useRef();
  const Sketch = p => {
    let count = 0;
    p.canvas = null;
    p.canvasWidth = window.innerWidth;
    p.canvasHeight = window.innerHeight;
    let rows = Math.floor(p.canvasHeight / resolution);
    let cols = Math.floor(p.canvasWidth / resolution);
    let grid = makeGrid(rows, cols);

    const countNeighbors = (grid, x, y) => {
      let sum = 0;
      for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
          let col = (x + i + cols) % cols;
          let row = (y + j + rows) % rows;
          sum += grid[row][col].status;
        }
      }
      sum -= grid[x][y].status;
      return sum;
    }

    p.setup = () => {
      p.canvas = p.createCanvas(p.canvasWidth, p.canvasHeight);
      p.background(0);
      p.frameRate(5)
    }

    p.draw = () => {
      // show(grid)
      for (let i = 0 ; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          let x = resolution * i;
          let y = resolution * j;
          if (grid[i][j].status) {
            p.fill(200 - grid[i][j].lives * 5, grid[i][j].lives * 10, grid[i][j].lives * 10);
            p.noStroke()
            p.rect(x, y, resolution, resolution);
          } else {
            p.fill(0, 0, 0);
            p.rect(x, y, resolution, resolution);
          }

          let numNeighbors = countNeighbors(grid, i, j);
          if (grid[i][j].status === 1 && (numNeighbors < 2 || numNeighbors > 3)) {
            grid[i][j] = newSquare(0, grid[i][j]);
          }
          if (numNeighbors === 3) {
            grid[i][j] = newSquare(1, grid[i][j]);
          }
        }
      }
      // grid = nextMove(grid);
      count++;
      console.log('count', count);

      if (count > 60) {
        grid = makeGrid(rows, cols);
        count = 0;
      }
    }
  };
  useEffect(() => {
    new p5(Sketch, sketchRef.current);
  }, []);

  return <div ref={sketchRef} />;
};

export default Life;

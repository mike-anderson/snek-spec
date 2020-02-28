import { Directions, IBoard, ICoordinate, ISnake, Matrix } from './Types';
import PF = require('pathfinding');

const SAFE = 0;
const NOPE = 1;

/**
 * A pathfinding class.
 *
 * Instantiated with the board state and the array of snakes.
 * @param {IBoard} - the board state
 * @param {ISnake[]} - the sneks
 *
 * Has the following functions:
 *  getFullPath - @returns {Matrix} the full path from a start point to a target
 *  getStep - @returns {Direction} the next step to move toward a target
 *  TODO: Add a 'printGameState' function that logs a visual representation of the board
 *  and the game state for use in debugging
 */
export default class Pathfinder {
  private grid: Matrix;

  public constructor(board: IBoard, snakes: ISnake[]) {
    // Create a representation of the board for use in pathfinding
    this.grid = this.createGrid(board);
    this.grid = this.addSnakesToGrid(this.grid, snakes);
  }

  /**
   * Get the next step toward a target. Returns null if
   * there is no valid path or the pathfinding has failed.
   * @param {ICoordinate} start - The starting coordinates
   * @param {ICoordinate} target - The target coordinates
   * @returns {string} - the direction to move
   */
  public getStep(start: ICoordinate, target: ICoordinate): Directions {
    try {
      const fullPath: Matrix = this.getFullPath(start, target);
      const nextMove: ICoordinate = this.getNextMove(fullPath);
      const direction: Directions = this.getDirection(nextMove, start);
      return direction;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  /**
   * Get the full path to a target.
   * @param {ICoordinate} start - the starting coordinates for pathfinding
   * @param {ICoordinate} target - the end coordinates for pathfinding
   * @returns {Matrix} - the full path
   */
  public getFullPath(start: ICoordinate, target: ICoordinate): Matrix | [] {
    // Instantiate the pathfinding grid and A* pathfinder
    const pfGrid = new PF.Grid(this.grid);
    const finder = new PF.AStarFinder();
    // Set our head and target as walkable, because if they
    // are part of a snake's body, they will be unwalkable by default
    pfGrid.setWalkableAt(start.x, start.y, true);
    pfGrid.setWalkableAt(target.x, target.y, true);

    // finder.findPath returns a matrix of paired coordinate values
    // eg. [ [ 1, 2 ], [ 1, 1 ], [ 2, 1 ], [ 3, 1 ], [ 3, 2 ] ]
    const path: Matrix = finder.findPath(
      start.x,
      start.y,
      target.x,
      target.y,
      pfGrid
    );

    // If a path is found, return it
    if (path && path.length) {
      return path;
    }

    // If not, return an empty array
    return [];
  }

  /**
   * Takes the board state and creates a matrix of 0s
   * e.g.
   * [
   *   [0,0,0],
   *   [0,0,0],
   *   [0,0,0],
   * ]
   * @param {IBoard} board - the board state
   * @returns {Matrix} - a multidimensional array
   */
  private createGrid(board: IBoard): Matrix {
    let row: number[];
    const grid: Matrix = [];

    // Add arrays to the grid until we reach the prescribed height
    while (grid.length < board.height) {
      row = [];

      // Add 0s to each array until we reach the prescribed width
      while (row.length < board.width) {
        row.push(SAFE);
      }

      grid[grid.length] = row;
    }

    return grid;
  }

  /**
   * Add snakes to the grid
   * @param {Matrix} grid - the matrix representing the empty board
   * @param {ISnake[]} snakes - the array of sneks to add
   * @returns {Matrix} - a new matrix with unwalkable spaces marked
   */
  private addSnakesToGrid(grid: Matrix, snakes: ISnake[]): Matrix {
    // Make a copy of the grid to preserve the original
    const newGrid: Matrix = [...grid];

    // For each snake, iterate over its segments,
    // marking the coordinates as unwalkable
    snakes.forEach((snake: ISnake): void => {
      snake.body.forEach((segment: ICoordinate): void => {
        newGrid[segment.y][segment.x] = NOPE;
      });
    });

    return newGrid;
  }

  /**
   * Convert coordinates to a string of either
   * 'left', 'right', 'up', or 'down'
   * @param {ICoordinate} move - the coordinates we are moving to
   * @param {ICoordinate} start - the coordinates we are starting at
   * @returns {Directions} - an orthogonal direction
   */
  private getDirection(move: ICoordinate, start: ICoordinate): Directions {
    if (!move) {
      return null;
    }

    // Calculate the difference between start and finish
    const delta: ICoordinate = {
      x: start.x - move.x,
      y: start.y - move.y,
    };

    // We should only ever be traversing one node at a time,
    // so if the absolute value of either delta is greater than
    // 1, something has gone horribly wrong
    if (Math.abs(delta.x) > 1 || Math.abs(delta.y) > 1) {
      return null;
    }

    if ((delta.x = -1)) {
      return Directions.LEFT;
    }

    if ((delta.x = 1)) {
      return Directions.RIGHT;
    }

    if ((delta.y = -1)) {
      return Directions.UP;
    }

    return Directions.DOWN;
  }

  /**
   * Get the next move from a PF path
   * @param {Matrix} path - paired coordinates, eg. [ [ 1, 2 ], [ 1, 1 ] ]
   * @returns {ICoordinate} - the coordinates to move to
   */
  private getNextMove(path: Matrix): ICoordinate {
    return path && path.length ? { x: path[0][0], y: path[0][1] } : null;
  }
}

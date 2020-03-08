import { manhattanDistance, isEquivalent } from '../helpers';
import { ISnake, ICoordinate, Matrix } from '../Types';

const visited = new Set();

/**
 * Recursively traverse the board
 * @param grid - the game board
 * @param x - the x coordinate of the current node
 * @param y - the y coordinate of the current node
 * @param region - the region to expand upon
 */
function traverse(
  grid: Matrix,
  x: number,
  y: number,
  region: string[] = []
): string[] {
  // If we're going off the board, return
  if (x < 0 || y < 0 || x > grid.length - 1 || y > grid[0].length - 1) {
    return;
  }

  // If we've already looked at this node,
  // or it is unwalkable, return
  if (grid[y][x] !== 0 || visited.has(`${x},${y}`)) {
    return;
  }

  // If the space is walkable, add it to the
  // path array and the visited set
  region.push(`${x},${y}`);
  visited.add(`${x},${y}`);

  // Recursively traverse each neighbouring node
  traverse(grid, x, y + 1, region);
  traverse(grid, x, y - 1, region);
  traverse(grid, x - 1, y, region);
  traverse(grid, x + 1, y, region);

  // Return the array
  return region;
}

/**
 * Find all of the discreet walkable regions on
 * the board
 * @param grid - the board
 */
function findWalkableRegions(grid: Matrix): ICoordinate[][] {
  const walkableRegions: string[][] = [];

  // Iterate over the rows and columns
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      // If the node is in the set, continue
      if (visited.has(`${x},${y}`)) {
        continue;
      }

      // If the node is not in the set,
      // kick off a traversal
      const region: string[] = traverse(grid, x, y);

      if (region) {
        walkableRegions.push(region);
      }
    }
  }

  const coordinateArrays: ICoordinate[][] = [];

  // For each walkable region
  walkableRegions.forEach((area: string[]): void => {
    // Map the coordinate strings to an ICoordinate[]
    const coordinateArray: ICoordinate[] = area.map((coordString: string) => {
      const coords = coordString.split(',');
      return {
        x: Number(coords[0]),
        y: Number(coords[1]),
      };
    });

    coordinateArrays.push(coordinateArray);
  });

  // Return the coordinate array for each
  // distinct walkable region on the board
  return coordinateArrays;
}

/**
 * From all of the walkable regions on the board,
 * find the largest one that we are able to move in to
 * @param us - us
 * @param walkableRegions - the regions
 */
function findLargestAdjacentRegion(
  us: ISnake,
  walkableRegions: ICoordinate[][]
): ICoordinate[] {
  const ourHead = us.body[0];
  const adjacentRegions: ICoordinate[][] = [];

  // For each region, determine if it
  // is accessible to us
  for (const region of walkableRegions) {
    for (const coordinate of region) {
      if (manhattanDistance(coordinate, ourHead) === 1) {
        adjacentRegions.push(region);
        break;
      }
    }
  }

  // If no regions are accessible, we're friggin' DEAD!
  if (adjacentRegions.length === 0) {
    return null;
  }

  // Reduce to the largest region
  return adjacentRegions.reduce((a, b) => (a.length > b.length ? a : b), []);
}

/**
 * Create arrays containing coordinate paths
 * for each direction we can travel in
 * @param region - the board
 * @param current - the current node
 * @param path - the path to take
 */
function getPaths(
  region: ICoordinate[],
  current: ICoordinate,
  path: ICoordinate[],
  visitedNodes: Set<string> = new Set()
): void {
  // Add the current node to the path
  path.push(current);
  // Add the current node to the set of visited nodes
  visitedNodes.add(JSON.stringify(current));
  // Create an array of the possible coordinates to move into
  const left = { x: current.x - 1, y: current.y };
  const right = { x: current.x + 1, y: current.y };
  const up = { x: current.x, y: current.y - 1 };
  const down = { x: current.x, y: current.y + 1 };
  // eslint-disable-next-line
  const moves = [left, right, up, down];

  for (const move of moves) {
    for (const node of region) {
      // Have we been here before? Time is a flat circle
      if (isEquivalent(node, move) && !visitedNodes.has(JSON.stringify(move))) {
        getPaths(region, move, path, visitedNodes);
        return;
      }
    }
  }

  return;
}

/**
 * Noah's ark, man
 * @param grid - the board
 * @param us - us
 */
export function floodFill(grid: Matrix, us: ISnake): ICoordinate {
  // Find all walkable regions
  const regions = findWalkableRegions(grid);
  // Determine which is the largest
  const bestRegion = findLargestAdjacentRegion(us, regions);
  // If we're not adjacent to any regions, we're dead. Game over, man.
  if (!bestRegion) {
    return null;
  }

  // Our longest possible path
  let bestPath: ICoordinate[] = [];

  const left: ICoordinate[] = [];
  const right: ICoordinate[] = [];
  const up: ICoordinate[] = [];
  const down: ICoordinate[] = [];
  // eslint-disable-next-line
  const paths = [left, right, up, down];

  const ourHead = us.body[0];

  // Try to get a path in each starting direction,
  // pushing to the coordinate arrays defined above
  getPaths([...bestRegion], ourHead, left);
  getPaths([...bestRegion], ourHead, right);
  getPaths([...bestRegion], ourHead, up);
  getPaths([...bestRegion], ourHead, down);

  // Pick the longest path
  paths.forEach(path => {
    if (path.length > bestPath.length) {
      bestPath = path;
    }
  });

  // Return the first move from the best path
  return bestPath.length > 1 ? bestPath[1] : null;
}

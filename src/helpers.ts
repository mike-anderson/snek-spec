import { ICoordinate, ISnake, Matrix } from './Types';
import Pathfinder from './Pathfinder';

/**
 * Get our enemy from the array of snakes
 * @param {ISnake} us - this instance of Echosnek
 * @param {ISnake[]} snakes - all the snakes
 */
export function getNemesis(us: ISnake, snakes: ISnake[]): ISnake {
  // There should only ever be 1 snake that has a different name
  return snakes.find(snake => snake.name !== us.name);
}

/**
 * Are we currently equal in length or longer than the enemy?
 * @param {ISnake} us - this instance of Echosnek
 * @param {ISnake[]} snakes - all the snakes
 */
export function canKillNemesis(us: ISnake, snakes: ISnake[]): boolean {
  const nemesis: ISnake = getNemesis(us, snakes);
  return us.body.length >= nemesis.body.length;
}

/**
 * Get any snake that isn't this instance of the Echosnek
 * @param {ISnake} us - this instance of Echosnek
 * @param {ISnake[]} snakes - all the snakes
 */
export function getOtherSnakes(us: ISnake, snakes: ISnake[]): ISnake[] {
  return snakes.filter(snake => snake.id !== us.id);
}

/**
 * Are we sure to get to a given food item before any other snakes?
 * @param {ISnake} us - this instance of Echosnek
 * @param {ISnake[]} snakes - all the snakes
 * @param {ICoordinate} food - the food in question
 * @param {Pathfinder} pf - the Pathinder instance
 * @returns {boolean} - are we?
 */
export function firstToFood(
  us: ISnake,
  snakes: ISnake[],
  food: ICoordinate,
  pf: Pathfinder
): boolean {
  const ourHead: ICoordinate = us.body[0];
  const otherSneks: ISnake[] = getOtherSnakes(us, snakes);
  const ourPath: Matrix = pf.getFullPath(ourHead, food);

  if (!ourPath) {
    return;
  }

  // For each other snake,
  // check if they have a shorter path, returning false
  // if they do
  for (const snek of otherSneks) {
    const enemyPath: Matrix = pf.getFullPath(snek.body[0], food);

    if (enemyPath && enemyPath.length < ourPath.length) {
      return false;
    }
  }

  // If no snake has a shorter path, return true
  return true;
}

/**
 * Calculate the manhattan distance between to coordinates
 * @param {ICoordinate} a - coordinate a
 * @param {ICoordinate} b - coordinate b
 */
export function manhattanDistance(a: ICoordinate, b: ICoordinate): number {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

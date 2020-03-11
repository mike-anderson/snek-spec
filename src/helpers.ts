import { ICoordinate, ISnake, Matrix } from './Types';
import Pathfinder from './Pathfinder';

/**
 * Calculate the manhattan distance between two coordinates
 * @param {ICoordinate} a - coordinate a
 * @param {ICoordinate} b - coordinate b
 */
export function manhattanDistance(a: ICoordinate, b: ICoordinate): number {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

/**
 * Get our enemy from the array of snakes
 * @param {ISnake} us - this instance of Echosnek
 * @param {ISnake[]} snakes - all the snakes
 */
export function getNemesis(us: ISnake, snakes: ISnake[]): ISnake {
  // There should only ever be 1 snake that has a different name
  // TODO: find out why 'us' doesn't exist in some tests
  if (snakes.length === 1 || !us) {
    return null;
  }

  return snakes.find(snake => snake.name !== us.name);
}

/**
 * Are we currently longer than the enemy?
 * @param {ISnake} us - this instance of Echosnek
 * @param {ISnake[]} snakes - all the snakes
 */
export function canKillNemesis(us: ISnake, nemesis: ISnake): boolean {
  return nemesis && us.body.length > nemesis.body.length;
}

/**
 * We only want to attack the enemy if we are longer than it and we
 * are more than one space away (otherwise we'll run into its neck)
 * @param {ISnake} us - this instance of Echosnek
 * @param {ISnake[]} snakes - the snake we don't like
 */
export function shouldKillNemesis(us: ISnake, snakes: ISnake[]): boolean {
  const nemesis: ISnake = getNemesis(us, snakes);

  return (
    canKillNemesis(us, nemesis) &&
    manhattanDistance(us.body[0], nemesis.body[0]) > 1
  );
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
 * @param {Pathfinder} PF - the Pathinder instance
 * @returns {boolean} - are we?
 */
export function firstToFood(
  us: ISnake,
  snakes: ISnake[],
  food: ICoordinate,
  PF: Pathfinder
): boolean {
  const ourHead: ICoordinate = us.body[0];
  const otherSneks: ISnake[] = getOtherSnakes(us, snakes);
  const ourPath: Matrix = PF.getFullPath(ourHead, food);

  if (!ourPath) {
    return;
  }

  // For each other snake,
  // check if they have a shorter path, returning false
  // if they do
  for (const snek of otherSneks) {
    const enemyPath: Matrix = PF.getFullPath(snek.body[0], food);

    if (enemyPath && enemyPath.length <= ourPath.length) {
      return false;
    }
  }

  // If no snake has a shorter path, return true
  return true;
}

/**
 * Did the snake just eat?
 * @param snake - did this snake just eat?
 */
export function theSnakeJustAteAndWeAreCloseToItsButt(
  us: ISnake,
  snake: ISnake
): boolean {
  const butt = snake.body[snake.body.length - 1];
  const almostButt = snake.body[snake.body.length - 2];
  // If the snakes butt and its penultimate segment are in
  // the same spot, we should not chase its tail
  return (
    butt.x === almostButt.x &&
    butt.y === almostButt.y &&
    manhattanDistance(us.body[0], butt) === 1
  );
}

/**
 * Should we chase our own tail?
 * Not if we're just gonna turn around and
 * whack right into it like an idiot.
 * @param us - we are just one snake
 */
export function shouldChaseOurTail(us: ISnake): boolean {
  return us.body.length > 2 && !theSnakeJustAteAndWeAreCloseToItsButt(us, us);
}

/**
 * Determine if 2 objects are equivalent
 * @param a - one object
 * @param b - another object
 */
export function isEquivalent(a: {}, b: {}): boolean {
  // Create arrays of property names
  const aProps = Object.getOwnPropertyNames(a);
  const bProps = Object.getOwnPropertyNames(b);

  // If the number of properties is different,
  // the objects are not equivalent
  if (aProps.length !== bProps.length) {
    return false;
  }

  // If each property is not the same,
  // the objects are not equivalent
  for (const prop of aProps) {
    if (a[prop] !== b[prop]) {
      return false;
    }
  }

  // If we made it this far, the objects
  // are equivalent
  return true;
}

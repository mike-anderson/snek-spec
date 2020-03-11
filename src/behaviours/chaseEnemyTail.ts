import { ISnake, ICoordinate, Directions } from '../Types';
import Pathfinder from '../Pathfinder';
import {
  manhattanDistance,
  getOtherSnakes,
  theSnakeJustAteAndWeAreCloseToItsButt,
} from '../helpers';

/**
 * @param {Pathfinder} PF - Pathfinder class initialized with game state
 * @param {ISnake[]} snakes - Array of all snakes on the board
 * @param {ISnake} us - our snake
 * @returns {Directions} returns the next direction
 */
export const chaseEnemyTail = (
  PF: Pathfinder,
  us: ISnake,
  snakes: ISnake[]
): Directions => {
  let others = getOtherSnakes(us, snakes);

  // If we are right next to the enemy's tail, and it just ate,
  // we should not chase it, or we'll run into it
  others = others.filter(
    snake => !theSnakeJustAteAndWeAreCloseToItsButt(us, snake)
  );

  if (others.length === 0) {
    return null;
  }

  const tails: ICoordinate[] = others.map((snake: ISnake) => {
    return snake.body[snake.body.length - 1];
  });

  const head: ICoordinate = us.body[0];
  let enemyTail = tails[0];
  let minDist = manhattanDistance(head, tails[0]);

  tails.forEach((tail: ICoordinate) => {
    const currDist = manhattanDistance(head, tail);
    minDist = currDist < minDist ? currDist : minDist;
    enemyTail = currDist === minDist ? tail : enemyTail;
  });

  return PF.getStep(head, enemyTail);
};

export default chaseEnemyTail;

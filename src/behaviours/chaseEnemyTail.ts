import { ISnake, ICoordinate, Directions } from '../Types';
import Pathfinder from '../Pathfinder';
import { manhattanDistance, getOtherSnakes } from '../helpers';

/**
 * @param {Pathfinder} PF - Pathfinder class initialized with game state
 * @param {ISnake[]} snakes - Array of all snakes on the board
 * @param {ISnake} us - our snake
 * @returns {Directions} returns the next direction
 */
export const chaseEnemyTail = (
  PF: Pathfinder,
  snakes: ISnake[],
  us: ISnake
): Directions => {
  const tails: ICoordinate[] = getOtherSnakes(us, snakes).map(
    (snake: ISnake) => {
      return snake.body[snake.body.length - 1];
    }
  );

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

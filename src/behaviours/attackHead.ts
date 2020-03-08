import { ISnake, Directions, ICoordinate } from '../Types';
import Pathfinder from '../Pathfinder';

/**
 * Snek attack!
 *
 * @param {IBoard} board - the board state
 * @param {ISnake} us - our snake
 * @returns {Directions} - returns the next direction
 */
export const attackHead = (
  PF: Pathfinder,
  us: ISnake,
  enemySnake: ISnake
): Directions => {
  if (!enemySnake) {
    return null;
  }

  const ourHead: ICoordinate = us.body[0];
  const enemyHead: ICoordinate = enemySnake.body[0];

  return PF.getStep(ourHead, enemyHead);
};

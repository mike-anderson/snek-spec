import { ISnake, ICoordinate, Directions } from '../Types';
import Pathfinder from '../Pathfinder';

/**
 * Turtle cower!
 *
 * @param {IBoard} board - the board state
 * @param {ISnake} us - our snake
 * @returns {Directions} - returns the next direction
 */
export const turtle = (PF: Pathfinder, us: ISnake): Directions => {
  const head: ICoordinate = us.body[0];
  const neck: ICoordinate = us.body[1];

  return PF.getStep(head, neck);
};

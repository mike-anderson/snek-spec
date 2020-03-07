import { ISnake, ICoordinate, Directions } from '../Types';
import Pathfinder from '../Pathfinder';

/**
 * @param {Pathfinder} PF - Pathfinder class initialized with game state
 * @param {ISnake} us - our snake
 * @returns {Directions} returns the next direction
 */
export const chaseTail = (PF: Pathfinder, us: ISnake): Directions => {
  const head: ICoordinate = us.body[0];
  const tail: ICoordinate = us.body[us.body.length - 1];

  return PF.getStep(head, tail);
};

export default chaseTail;

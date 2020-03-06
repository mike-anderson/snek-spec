import { ISnake, IBoard, ICoordinate, Directions } from '../Types';
import Pathfinder from '../Pathfinder';

/**
 * @param {IBoard} board - the board state
 * @param {ISnake} us - our snake
 * @returns {Directions} returns the next direction
 */
export const chaseTail = (board: IBoard, us: ISnake): Directions => {
  const snakes: ISnake[] = board.snakes;
  const PF = new Pathfinder(board, snakes);

  const head: ICoordinate = us.body[0];
  const tail: ICoordinate = us.body[us.body.length - 1];

  return PF.getStep(head, tail);
};

export default chaseTail;

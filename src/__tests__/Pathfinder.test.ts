import Pathfinder from '../Pathfinder';
import { gameState, us } from './fixtures/Gamestate';

const PF = new Pathfinder(gameState.board, gameState.board.snakes);

describe('Pathfinder', () => {
  test('should accept a board and a snake on instantiation', () => {
    const move = PF.getStep(us.body[0], { x: 4, y: 8 });

    expect(move).toBe('left');
  });
});

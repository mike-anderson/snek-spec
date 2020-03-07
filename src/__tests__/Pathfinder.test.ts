import Pathfinder from '../Pathfinder';
import { gameState, us } from './fixtures/Gamestate';
import { Directions } from '../Types';

const PF = new Pathfinder(gameState.board, gameState.board.snakes);

describe('Pathfinder', () => {
  test('should accept a board and a snake on instantiation', () => {
    const move = PF.getStep(us.body[0], { x: 4, y: 8 });

    expect(move).toBe('left');
  });
});

describe('getDirection', () => {
  test('should provide the correct direction string given a move and start coordinate', () => {
    const directionRight = PF.getDirection({ x: 0, y: 0 }, { x: 1, y: 0 });
    const directionLeft = PF.getDirection({ x: 1, y: 0 }, { x: 0, y: 0 });
    const directionDown = PF.getDirection({ x: 0, y: 0 }, { x: 0, y: 1 });
    const directionUp = PF.getDirection({ x: 0, y: 1 }, { x: 0, y: 0 });
    expect(directionRight).toBe(Directions.RIGHT);
    expect(directionLeft).toBe(Directions.LEFT);
    expect(directionDown).toBe(Directions.DOWN);
    expect(directionUp).toBe(Directions.UP);
  });
});

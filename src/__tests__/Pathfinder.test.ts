import { ISnake } from '../Types';
import Pathfinder from '../Pathfinder';

const us: ISnake = {
  id: 'echosnek',
  name: 'Echosnek5000',
  health: 90,
  body: [
    { x: 6, y: 8 },
    { x: 7, y: 8 },
    { x: 8, y: 8 },
  ],
};

const gameState = {
  game: {
    id: 'game-id-string',
  },
  turn: 4,
  board: {
    height: 15,
    width: 15,
    food: [{ x: 5, y: 5 }],
    snakes: [
      us,
      {
        id: 'enemy',
        name: 'Nemesis',
        health: 100,
        body: [
          { x: 1, y: 1 },
          { x: 1, y: 2 },
        ],
      },
    ],
  },
  you: us,
};

const PF = new Pathfinder(gameState.board, gameState.board.snakes);

describe('Pathfinder', () => {
  test('should accept a board and a snake on instantiation', () => {
    const move = PF.getStep(us.body[0], { x: 4, y: 8 });

    expect(move).toBe('left');
  });
});

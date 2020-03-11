import { ISnake } from '../../Types';

export const us: ISnake = {
  id: 'echosnek',
  name: 'Echosnek5000',
  health: 90,
  body: [
    { x: 6, y: 8 },
    { x: 7, y: 8 },
    { x: 8, y: 8 },
  ],
  shout: 'snekking good',
};

export const gameState = {
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
        shout: 'boo!',
      },
      {
        id: 'echosnek-instance-2',
        name: 'Echosnek5000',
        health: 50,
        body: [
          { x: 9, y: 8 },
          { x: 10, y: 8 },
        ],
        shout: 'snekking good too',
      },
    ],
  },
  you: us,
};

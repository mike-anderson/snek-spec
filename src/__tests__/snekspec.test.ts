import {
  candidateSnakesAndFoodFromMock,
  isAdjacent,
  untangleSnake,
  getGameStateFromMock,
} from '../snekspec';

import {
  snakesAndFood1,
  singleHeadSnake,
  headAndTailSnake1,
  headAndTailSnake2,
  curlySnake,
} from './snekspec.scenarios';

describe('snake scenario parsing and game state generation tests', (): void => {
  it('should parse the scenario and generate food', (): void => {
    const candidateSnakesAndFood = candidateSnakesAndFoodFromMock(
      snakesAndFood1,
      11,
      11
    );
    const expectedFood = [
      { x: 3, y: 1 },
      { x: 9, y: 3 },
      { x: 7, y: 5 },
      { x: 3, y: 8 },
    ];
    expect(candidateSnakesAndFood.food).toEqual(
      expect.arrayContaining(expectedFood)
    );
    expect(candidateSnakesAndFood.food.length).toEqual(expectedFood.length);
  });

  it('should parse the scenario and generate snake candidates', (): void => {
    const candidateSnakesAndFood = candidateSnakesAndFoodFromMock(
      snakesAndFood1,
      11,
      11
    );
    const expectedSnakes = {
      s: [
        { x: 3, y: 4 },
        { x: 3, y: 5 },
        { x: 2, y: 5 },
        { x: 2, y: 4 },
        { x: 2, y: 3 },
      ],
      u: [
        { x: 8, y: 7 },
        { x: 8, y: 8 },
        { x: 8, y: 9 },
        { x: 7, y: 9 },
        { x: 6, y: 9 },
        { x: 5, y: 9 },
      ],
    };
    expect(candidateSnakesAndFood.snakes).toEqual(
      expect.objectContaining({
        s: expect.arrayContaining(expectedSnakes.s),
        u: expect.arrayContaining(expectedSnakes.u),
      })
    );
    expect(candidateSnakesAndFood.snakes.s[0]).toEqual(expectedSnakes.s[0]);
    expect(candidateSnakesAndFood.snakes.s[4]).toEqual(expectedSnakes.s[4]);
    expect(candidateSnakesAndFood.snakes.u[0]).toEqual(expectedSnakes.u[0]);
    expect(candidateSnakesAndFood.snakes.u[5]).toEqual(expectedSnakes.u[5]);
  });
});

describe('snakes get untaggled', (): void => {
  it('should test adjacency', (): void => {
    expect(isAdjacent({ x: 8, y: 7 }, { x: 8, y: 7 })).toBe(false);
    expect(isAdjacent({ x: 8, y: 7 }, { x: 7, y: 7 })).toBe(true);
    expect(isAdjacent({ x: 8, y: 7 }, { x: 7, y: 8 })).toBe(false);
    expect(isAdjacent({ x: 8, y: 7 }, { x: 8, y: 8 })).toBe(true);
    expect(isAdjacent({ x: 8, y: 8 }, { x: 8, y: 7 })).toBe(true);
  });

  it('should untangle multiple snake paths', (): void => {
    const candidateSnakesAndFood = candidateSnakesAndFoodFromMock(
      snakesAndFood1,
      11,
      11
    );
    const untangledSnakeS = untangleSnake(candidateSnakesAndFood.snakes.s);
    const untangledSnakeU = untangleSnake(candidateSnakesAndFood.snakes.u);
    expect(untangledSnakeS).toEqual([
      { x: 3, y: 4 },
      { x: 3, y: 5 },
      { x: 2, y: 5 },
      { x: 2, y: 4 },
      { x: 2, y: 3 },
    ]);
    expect(untangledSnakeU).toEqual([
      { x: 8, y: 7 },
      { x: 8, y: 8 },
      { x: 8, y: 9 },
      { x: 7, y: 9 },
      { x: 6, y: 9 },
      { x: 5, y: 9 },
    ]);
  });

  it('should untangle a curly snake', (): void => {
    const candidateSnakesAndFood = candidateSnakesAndFoodFromMock(
      curlySnake,
      11,
      11
    );
    const untangledSnakeS = untangleSnake(candidateSnakesAndFood.snakes.s);
    expect(untangledSnakeS).toEqual([
      { x: 3, y: 6 },
      { x: 3, y: 7 },
      { x: 4, y: 7 },
      { x: 5, y: 7 },
      { x: 6, y: 7 },
      { x: 6, y: 6 },
      { x: 6, y: 5 },
      { x: 7, y: 5 },
      { x: 7, y: 6 },
      { x: 7, y: 7 },
    ]);
  });
  /*
  it('should do its best to handle a flood-fill snake efficiently', (): void => {
    const candidateSnakesAndFood = candidateSnakesAndFoodFromMock(
      floodFillSnake,
      11,
      11
    );
    const untangledSnakeS = untangleSnake(candidateSnakesAndFood.snakes.s);
    expect(untangledSnakeS).toEqual([
      { x: 10, y: 3 },
      { x: 10, y: 2 },
      { x: 9, y: 2 },
      { x: 8, y: 2 },
      { x: 7, y: 2 },
      { x: 6, y: 2 },
      { x: 5, y: 2 },
      { x: 4, y: 2 },
      { x: 3, y: 2 },
      { x: 2, y: 2 },
      { x: 1, y: 2 },
      { x: 0, y: 2 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 2, y: 1 },
      { x: 3, y: 1 },
      { x: 4, y: 1 },
      { x: 5, y: 1 },
      { x: 6, y: 1 },
      { x: 7, y: 1 },
      { x: 8, y: 1 },
      { x: 9, y: 1 },
      { x: 10, y: 1 },
      { x: 10, y: 0 },
      { x: 9, y: 0 },
      { x: 8, y: 0 },
      { x: 7, y: 0 },
      { x: 6, y: 0 },
      { x: 5, y: 0 },
      { x: 4, y: 0 },
      { x: 3, y: 0 },
      { x: 2, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: 0 },
    ]);
  });*/
});

describe('generate a game state from a scenario', (): void => {
  it('should generate a valid game state', (): void => {
    const gameState = getGameStateFromMock(snakesAndFood1);
    expect(gameState).toEqual({
      game: {
        id: 'generated-scenario',
      },
      turn: 1,
      board: {
        height: 11,
        width: 11,
        food: [
          { x: 3, y: 1 },
          { x: 9, y: 3 },
          { x: 7, y: 5 },
          { x: 3, y: 8 },
        ],
        snakes: [
          {
            id: 's',
            name: 's',
            health: 90,
            body: [
              { x: 3, y: 4 },
              { x: 3, y: 5 },
              { x: 2, y: 5 },
              { x: 2, y: 4 },
              { x: 2, y: 3 },
            ],
            shout: 'boo!',
          },
          {
            id: 'u',
            name: 'u',
            health: 90,
            body: [
              { x: 8, y: 7 },
              { x: 8, y: 8 },
              { x: 8, y: 9 },
              { x: 7, y: 9 },
              { x: 6, y: 9 },
              { x: 5, y: 9 },
            ],
            shout: 'boo!',
          },
        ],
      },
      you: {
        id: 's',
        name: 's',
        health: 90,
        body: [
          { x: 3, y: 4 },
          { x: 3, y: 5 },
          { x: 2, y: 5 },
          { x: 2, y: 4 },
          { x: 2, y: 3 },
        ],
        shout: 'boo!',
      },
    });
  });

  it('should generate a single snake', (): void => {
    const gameState = getGameStateFromMock(singleHeadSnake);
    expect(gameState).toEqual({
      game: {
        id: 'generated-scenario',
      },
      turn: 1,
      board: {
        height: 11,
        width: 11,
        food: [],
        snakes: [
          {
            id: 's',
            name: 's',
            health: 90,
            body: [{ x: 4, y: 4 }],
            shout: 'boo!',
          },
        ],
      },
      you: {
        id: 's',
        name: 's',
        health: 90,
        body: [{ x: 4, y: 4 }],
        shout: 'boo!',
      },
    });
  });

  it('should generate a head/tail snake', (): void => {
    const gameState = getGameStateFromMock(headAndTailSnake1);
    expect(gameState).toEqual({
      game: {
        id: 'generated-scenario',
      },
      turn: 1,
      board: {
        height: 11,
        width: 11,
        food: [],
        snakes: [
          {
            id: 's',
            name: 's',
            health: 90,
            body: [
              { x: 4, y: 4 },
              { x: 4, y: 5 },
            ],
            shout: 'boo!',
          },
        ],
      },
      you: {
        id: 's',
        name: 's',
        health: 90,
        body: [
          { x: 4, y: 4 },
          { x: 4, y: 5 },
        ],
        shout: 'boo!',
      },
    });
  });
  it('should generate a head/tail snake upside down', (): void => {
    const gameState = getGameStateFromMock(headAndTailSnake2);
    expect(gameState).toEqual({
      game: {
        id: 'generated-scenario',
      },
      turn: 1,
      board: {
        height: 11,
        width: 11,
        food: [],
        snakes: [
          {
            id: 's',
            name: 's',
            health: 90,
            body: [
              { x: 4, y: 5 },
              { x: 4, y: 4 },
            ],
            shout: 'boo!',
          },
        ],
      },
      you: {
        id: 's',
        name: 's',
        health: 90,
        body: [
          { x: 4, y: 5 },
          { x: 4, y: 4 },
        ],
        shout: 'boo!',
      },
    });
  });
});

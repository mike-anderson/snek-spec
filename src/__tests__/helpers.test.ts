import * as helpers from '../helpers';
import { gameState, us } from './fixtures/Gamestate';
import Pathfinder from '../Pathfinder';

const pf = new Pathfinder(gameState.board, gameState.board.snakes);

describe('getNemesis', () => {
  test('should isolate our enemy from an array', () => {
    const nemesis = helpers.getNemesis(us, gameState.board.snakes);

    expect(nemesis.name).toBe('Nemesis');
  });
});

describe('canKillNemesis', () => {
  test('should return true if we are longer than our nemesis', () => {
    const shouldMurder = helpers.canKillNemesis(us, gameState.board.snakes);

    expect(shouldMurder).toBe(true);
  });

  test('should return false if we are shorter than our nemesis', () => {
    const bodyDouble = { ...us };
    bodyDouble.body = [
      {
        x: 0,
        y: 0,
      },
    ];
    const shouldMurder = helpers.canKillNemesis(
      bodyDouble,
      gameState.board.snakes
    );

    expect(shouldMurder).toBe(false);
  });
});

describe('getOtherSnakes', () => {
  test('should return an array containing all other snakes', () => {
    const snakes = helpers.getOtherSnakes(us, gameState.board.snakes);

    expect(snakes.length).toBe(2);
    expect(snakes[0].id).toBe('enemy');
    expect(snakes[1].id).toBe('echosnek-instance-2');
  });
});

describe('firstToFood', () => {
  test('should return true if we are closest to food', () => {
    const weWin = helpers.firstToFood(
      us,
      gameState.board.snakes,
      { x: 4, y: 8 },
      pf
    );

    expect(weWin).toBe(true);
  });

  test('should return false if we are not closest to food', () => {
    const weWin = helpers.firstToFood(
      us,
      gameState.board.snakes,
      { x: 9, y: 9 },
      pf
    );

    expect(weWin).toBe(false);
  });
});

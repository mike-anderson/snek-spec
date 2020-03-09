import * as helpers from '../helpers';
import { gameState, us } from './fixtures/Gamestate';
import Pathfinder from '../Pathfinder';

const PF = new Pathfinder(
  gameState.board,
  gameState.board.snakes,
  gameState.you
);

describe('getNemesis', () => {
  test('should isolate our enemy from an array', () => {
    const nemesis = helpers.getNemesis(us, gameState.board.snakes);

    expect(nemesis.name).toBe('Nemesis');
  });
});

describe('canKillNemesis', () => {
  test('should return true if we are longer than our nemesis', () => {
    const nemesis = helpers.getNemesis(us, gameState.board.snakes);
    const canMurder = helpers.canKillNemesis(us, nemesis);

    expect(canMurder).toBe(true);
  });

  test('should return false if we are shorter than our nemesis', () => {
    const nemesis = helpers.getNemesis(us, gameState.board.snakes);
    const bodyDouble = { ...us };
    bodyDouble.body = [
      {
        x: 0,
        y: 0,
      },
    ];
    const canMurder = helpers.canKillNemesis(bodyDouble, nemesis);

    expect(canMurder).toBe(false);
  });
});

describe('shouldKillNemesis', () => {
  test('should return true if we should aim for the head', () => {
    const shouldMurder = helpers.shouldKillNemesis(us, gameState.board.snakes);

    expect(shouldMurder).toBe(true);
  });

  test('should return false if we should not attack the head', () => {
    const bodyDouble = { ...us };
    bodyDouble.body = [
      {
        x: 0,
        y: 0,
      },
    ];
    const shouldMurder = helpers.shouldKillNemesis(
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
      PF
    );

    expect(weWin).toBe(true);
  });

  test('should return false if we are not closest to food', () => {
    const weWin = helpers.firstToFood(
      us,
      gameState.board.snakes,
      { x: 9, y: 9 },
      PF
    );

    expect(weWin).toBe(false);
  });
});

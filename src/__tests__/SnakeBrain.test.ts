import {
  headAndTailSnake1,
  snakesAndFood1,
} from '../../util/__tests__/snekspec.scenarios';
import getGameStateFromMock from '../../util/snekspec';
import SnakeBrain from '../SnakeBrain';
import { Directions } from './../Types';

let exploit = false;

describe('GameState Class Tests', () => {
  test('Class creation from mock and default move', () => {
    // Arrange & Act
    const mockGameStateObject = getGameStateFromMock(headAndTailSnake1, {
      turn: 1,
    });
    const direction = new SnakeBrain(mockGameStateObject, exploit)
      .decide()
      .act();
    // Assert
    expect(direction).toBe(Directions.LEFT);
  });

  // TODO: update this when we get the eat() function going
  test('First move, you down?', () => {
    // Arrange & Act
    const mockGameStateObject = getGameStateFromMock(headAndTailSnake1, {
      turn: 1,
    });
    const direction = new SnakeBrain(mockGameStateObject, exploit)
      .decide()
      .act();
    // Assert
    expect(direction).toBe(Directions.LEFT);
  });

  test('Shout, shout, let it all out', () => {
    // Arrange & Act
    const mockGameStateObject = getGameStateFromMock(snakesAndFood1, {
      turn: 2,
    });
    exploit = true;

    const direction = new SnakeBrain(mockGameStateObject, exploit)
      .decide()
      .act();
    // Assert
    expect(direction).toBe(Directions.DOWN);
  });
});

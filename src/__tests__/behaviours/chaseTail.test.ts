import { ISnake, IBoard, Directions } from '../../Types';
import { chaseTail } from '../../behaviours/chaseTail';
import { gameState } from '../fixtures/Gamestate';

describe('Chase tail behaviour', () => {
  test('should return a direction for the shortest path to our own tail', () => {
    // Arrange
    const board: IBoard = gameState.board;
    const us: ISnake = gameState.board.snakes[0];
    const expectedDirection: string = Directions.LEFT;

    // Act
    const actualDirection = chaseTail(board, us);

    expect(actualDirection).toBe(expectedDirection);
  });
});

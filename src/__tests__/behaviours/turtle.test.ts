import { ISnake, IBoard, Directions } from '../../Types';
import { turtle } from '../../behaviours/turtle';
import { gameState } from '../fixtures/Gamestate';

describe('Shouting', () => {
  test('should cause our snake to self-destruct', () => {
    // Arrange
    const board: IBoard = gameState.board;
    const us: ISnake = gameState.board.snakes[0];
    const nextMove: string = Directions.LEFT;

    // Act
    const mockShout = turtle(board, us);

    expect(mockShout).toBe(nextMove);
  });
});

import { ISnake, IBoard, Directions } from '../../Types';
import { attackHead } from '../../behaviours/attackHead';
import { gameState } from '../fixtures/Gamestate';

describe('Attacking', () => {
  test("should make a move to attack the enemy snake's head", () => {
    // Arrange
    const board: IBoard = gameState.board;
    const us: ISnake = gameState.board.snakes[0];
    const nextMove: string = Directions.UP;

    // Act
    const mockAttack = attackHead(board, us);

    // Assert
    expect(mockAttack).toBe(nextMove);
  });
});

import { ISnake, IBoard, Directions } from '../../Types';
import { turtle } from '../../behaviours/turtle';
import { gameState } from '../fixtures/Gamestate';
import Pathfinder from '../../Pathfinder';

describe('Turtling', () => {
  test('should cause our snake to self-destruct', () => {
    // Arrange
    const board: IBoard = gameState.board;
    const us: ISnake = gameState.board.snakes[0];
    const snakes: ISnake[] = board.snakes;
    const PF = new Pathfinder(board, snakes, gameState.you);
    const nextMove: string = Directions.RIGHT;

    // Act
    const mockShout = turtle(PF, us);

    // Assert
    expect(mockShout).toBe(nextMove);
  });
});

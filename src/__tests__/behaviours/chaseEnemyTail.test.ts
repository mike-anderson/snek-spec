import { ISnake, IBoard, Directions } from '../../Types';
import { chaseEnemyTail } from '../../behaviours/chaseEnemyTail';
import { gameState } from '../fixtures/Gamestate';
import Pathfinder from '../../Pathfinder';

describe('Chase enemy tail behaviour', () => {
  test('should return a direction for the shortest path to the closest enemy tail', () => {
    // Arrange
    const board: IBoard = gameState.board;
    const snakes: ISnake[] = board.snakes;
    const PF = new Pathfinder(board, snakes);
    const us: ISnake = gameState.board.snakes[0];
    const expectedDirection: string = Directions.UP;

    // Act
    const actualDirection = chaseEnemyTail(PF, us, snakes);

    expect(actualDirection).toBe(expectedDirection);
  });
});

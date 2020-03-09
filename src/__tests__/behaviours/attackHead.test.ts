import { ISnake, IBoard, Directions } from '../../Types';
import { attackHead } from '../../behaviours/attackHead';
import { gameState } from '../fixtures/Gamestate';
import Pathfinder from '../../Pathfinder';
import { getNemesis } from '../../helpers';

describe('Attacking', () => {
  test("should make a move to attack the enemy snake's head", () => {
    // Arrange
    const board: IBoard = gameState.board;
    const us: ISnake = gameState.board.snakes[0];
    const nextMove: string = Directions.UP;
    const snakes: ISnake[] = board.snakes;
    const nemesis = getNemesis(us, snakes);
    const PF = new Pathfinder(board, snakes, gameState.you);

    // Act
    const mockAttack = attackHead(PF, us, nemesis);

    // Assert
    expect(mockAttack).toBe(nextMove);
  });
});

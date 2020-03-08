import { ISnake } from '../../Types';
import { floodFill } from '../../behaviours/floodFill';
import { gameState } from '../fixtures/Gamestate';

describe('floodFill', () => {
  test('should hopefully return some sort of path', () => {
    // Arrange
    const us: ISnake = gameState.board.snakes[0];
    us.body = [
      {
        x: 2,
        y: 4,
      },
    ];

    /* eslint-disable */
    var arr = [
      [1, 1, 0, 1, 0],
      [1, 1, 0, 1, 0],
      [0, 1, 0, 0, 0],
      [0, 1, 0, 0, 0],
      [0, 0, 1, 1, 1],
    ];
    /* eslint-enable */

    // Act
    const floodPath = floodFill(arr, us);

    // floodFill finds the following path,
    //  starting at our head:
    // [
    //   { x: 2, y: 4 },
    //   { x: 2, y: 3 },
    //   { x: 3, y: 3 },
    //   { x: 4, y: 3 },
    //   { x: 4, y: 2 },
    //   { x: 3, y: 2 },
    //   { x: 2, y: 2 },
    //   { x: 2, y: 1 },
    //   { x: 2, y: 0 }
    // ]
    // and returns the first move ({ x: 2, y: 3})

    expect(floodPath).toMatchObject({ x: 2, y: 3 });
  });
});

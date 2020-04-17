import { strict as assert } from 'assert';
import { ICoordinate, IGameState, ISnake } from './Types';

interface ISnakesAndFood {
  snakes: Record<string, Array<ICoordinate>>;
  food: Array<ICoordinate>;
}

/*
 * Example Mock
 * ------------
 * ---0--------
 * ------------
 * --T------0--
 * --tS--------
 * --tt---0----
 * ------------
 * --------U---
 * ---0----v---
 * -----Vvvv---
 * ------------
 */

/**
 * Parses the ASCII mock into an array of food and array
 * of snake body candidates that may need to be untangled
 *
 * Snakes are represented by a uppercase letter for their head
 * followed by the next lowercase letter in the alphabet for
 * the rest of their body. The tail of that snake is then the
 * uppercase of that next letter.
 *
 * Food is represented by a 0
 *
 * Empty space is represented by a -
 *
 * @param mock
 * @param height
 * @param width
 */
function candidateSnakesAndFoodFromMock(
  mock: string,
  height: number,
  width: number
): ISnakesAndFood {
  const expectedLength = height * (width + 1) - 1;
  const letterBodies = {};
  const candidateSnakeBodies = {};
  const food = [];
  let i = 0;

  assert(
    mock.length === expectedLength,
    `Mock string incorrect length, expected ${expectedLength}, got ${mock.length}`
  );

  for (let y = 0; y < height; y++) {
    for (let x = 0; x <= width; x++) {
      const c = mock.charAt(i);
      if (x === width) {
        assert(
          c === '\n' || c === '',
          `Mock is missing expected newline at ${i}`
        );
      } else {
        assert(
          RegExp('[A-Ya-y-0]').test(c),
          `Mock has unexpected character ${c} at ${i}`
        );
        if (RegExp('0').test(c)) {
          food.push({ x, y });
        }
        if (RegExp('[A-Ya-y]').test(c)) {
          if (!(c.toLowerCase() in letterBodies)) {
            letterBodies[c.toLowerCase()] = [];
          }
          if (c.toUpperCase() === c) {
            letterBodies[c.toLowerCase()].push({ x, y });
          } else {
            letterBodies[c].unshift({ x, y });
          }
        }
      }
      i = i + 1;
    }
  }

  const snakeHeads = Object.keys(letterBodies)
    .filter(key => letterBodies[key].length === 1)
    .sort();
  snakeHeads.forEach(head => {
    const nextLetter = String.fromCharCode(head.charCodeAt(0) + 1);
    const nextLetterSnakeBody = letterBodies[nextLetter] || [];
    candidateSnakeBodies[head] = [
      ...letterBodies[head],
      ...nextLetterSnakeBody,
    ];
    // for the edge case that there's no body, just a head and a tail (eg two heads)
    const index = snakeHeads.findIndex(e => e === nextLetter);
    if (index >= 0) {
      delete snakeHeads[index];
    }
  });

  return {
    snakes: candidateSnakeBodies,
    food: food,
  };
}

/**
 * Are two points adjacent? (diagonal is not adjacent)
 * @param a
 * @param b
 */
function isAdjacent(a: ICoordinate, b: ICoordinate): boolean {
  const dx = Math.abs(a.x - b.x);
  const dy = Math.abs(a.y - b.y);
  return dx + dy === 1;
}

/**
 * Compute the path from head to tail from the scanned collection
 * of snake body coordinates
 * @param snake
 */
function untangleSnake(snake: Array<ICoordinate>): Array<ICoordinate> {
  // if it's just a head and maybe one body and one tail,
  // just return, no untangling needed
  if (snake.length <= 3) {
    return snake;
  }

  // otherwise, create adjacency matrix
  const adj = new Array(snake.length);
  for (let i = 0; i < adj.length; i++) {
    adj[i] = new Array(snake.length);
  }
  for (let i = 0; i < snake.length; i++) {
    for (let j = 0; j < snake.length; j++) {
      adj[i][j] = isAdjacent(snake[i], snake[j]);
    }
  }

  // do Breadth First Search visiting every node once from head to tail
  // because of the parsing step, src is always 0, dest is always length-1
  const src = 0;
  const dest = snake.length - 1;
  const queue = [];
  const pathsFound = [];
  let path = [src];

  queue.push(path);

  while (queue.length) {
    path = queue.shift();
    const vertex = path[path.length - 1];
    // if the latest vertex is dest and all nodes are used, return path
    if (vertex === dest) {
      pathsFound.unshift(path);
    }
    // traverse all the nodes connected to the current vertex
    // and push new path to the queue
    for (let i = 0; i < snake.length; i++) {
      if (adj[vertex][i] == true && !path.includes(i)) {
        queue.unshift([...path, i]); // eslint-disable-line array-element-newline
      }
    }
  }

  let longestPathLength = -1;
  let longestPathIndex = 0;
  for (let i = 0; i < pathsFound.length; i++) {
    if (pathsFound[i].length > longestPathLength) {
      longestPathLength = pathsFound[i].length;
      longestPathIndex = i;
    }
  }
  assert(
    longestPathLength === snake.length,
    `No valid path was found to untangle the snake ${snake}`
  );

  // return snake based on the final path
  return pathsFound[longestPathIndex].map((i: number) => snake[i]);
}

function getGameStateFromMock(
  mock: string,
  options?: {
    height?: number;
    width?: number;
    you?: string;
    health?: number;
    turn?: number;
  }
): IGameState {
  const { height, width, you, health, turn } = {
    height: 11,
    width: 11,
    you: 's',
    health: 90,
    turn: 1,
    ...options,
  };
  const candidateBoard = candidateSnakesAndFoodFromMock(
    mock.replace(/[ \t]/g, ''),
    height,
    width
  );
  Object.keys(candidateBoard.snakes).forEach(key => {
    candidateBoard.snakes[key] = untangleSnake(candidateBoard.snakes[key]);
  });

  const gameState: IGameState = {
    game: {
      id: 'generated-scenario',
    },
    turn,
    board: {
      height,
      width,
      food: candidateBoard.food,
      snakes: Object.entries(candidateBoard.snakes).map(
        // eslint-disable-next-line array-element-newline
        <ISnake>([key, snake]) => ({
          id: key,
          name: key,
          health,
          body: untangleSnake(snake),
          shout: 'boo!',
        })
      ),
    },
    you: {} as ISnake,
  };
  gameState.you = gameState.board.snakes.find(snake => snake.id == you);

  return gameState;
}

export {
  candidateSnakesAndFoodFromMock,
  isAdjacent,
  untangleSnake,
  getGameStateFromMock,
  getGameStateFromMock as default,
};

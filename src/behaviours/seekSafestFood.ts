import { ISnake, IBoard, ICoordinate, Directions, Matrix } from '../Types';
import Pathfinder from '../Pathfinder';
import { firstToFood } from '../helpers';
import { chaseEnemyTail } from './chaseEnemyTail';
import chaseTail from './chaseTail';

/**
 * To check where our body will be, should we dine.
 * @param {Pathfinder} - PF - our pathfinder class.
 * @param {ISnake[]} snakes - dastardly foes.
 * @param {ISnake} futureUs - will i be pretty, will i be rich?
 * @returns {Directions} returns the next direction
 */
function checkPostNibbleOption(
  PF: Pathfinder,
  futureUs: ISnake,
  snakes: ISnake[]
): boolean {
  console.log(futureUs);
  const pathToEnemyTail = chaseEnemyTail(PF, futureUs, snakes);
  const pathToOurTail = chaseTail(PF, futureUs);

  return pathToEnemyTail || pathToOurTail ? true : false;
}

/**
 * Here we shift our snake as though it has moved to the
 * food and check whether it has a safe path away from there.
 * Not perfect, because we don't move the other snakes,
 * but whatever. It is mostly just annoying to watch a snake
 * eat food and crash directly into a wall the next turn.
 * @param pathToSnack - the path to food
 * @param us - us!
 * @param board - the game board
 */
function canWeGetAway(pathToSnack: Matrix, us: ISnake, board: IBoard): boolean {
  // This is us after we hit our fitness goals
  const futureBody = [];
  // Map where our body will be when we eat food.
  for (const coordinate of pathToSnack) {
    futureBody.push({ x: coordinate[0], y: coordinate[1] });
  }

  // Get the index of our snake in the snake array
  const indexOfUs = board.snakes.findIndex(snake => snake.id === us.id);

  // Predict the future wooooOOOOOooooOOOOOooo
  const futureUs = { ...us, body: futureBody };
  const futureSnakes = [...board.snakes];
  futureSnakes[indexOfUs] = futureUs;
  const futureBoard = {
    ...board,
    us: futureUs,
    snakes: futureSnakes,
  };

  // We need to instantiate the Pathfinder,
  // with our snake shifted to its future position
  const PF = new Pathfinder(futureBoard, futureSnakes, futureUs);
  // Make sure we have somewhere to go after eating. We will check if there is a snake tail to chase.
  return checkPostNibbleOption(PF, futureUs, futureSnakes);
}

/**
 * This behaviour seeks out safe food. We will only move to food if
 * there is a safe path away from it.
 * @param {Pathfinder} PF - Pathfinder class initialized with game state
 * @param {IBoard} board - the board state
 * @param {ISnake} us - our snake
 * @returns {Directions} returns the next direction
 */
export const seekSafestFood = (
  PF: Pathfinder,
  board: IBoard,
  us: ISnake
): Directions => {
  try {
    const snakes: ISnake[] = board.snakes;
    const head: ICoordinate = us.body[0];
    const { food: foodArray } = board;

    let pathToSafestFood: Matrix = [];
    let safestFood: ICoordinate = null;
    // For each food item we check:
    // 1. Are we closer than any other snake.
    // 2. After we eat the food do we have a path to another snakes tail (escape route)
    // If so, we chonk.
    foodArray.forEach(snakeSnack => {
      const winnerWinnerChickenDinner = firstToFood(us, snakes, snakeSnack, PF);
      const pathToSnack = PF.getFullPath(head, snakeSnack);
      const noDeadEnds = canWeGetAway(pathToSnack, us, board);

      if (
        (pathToSafestFood.length === 0 ||
          pathToSnack.length < pathToSafestFood.length) &&
        winnerWinnerChickenDinner &&
        noDeadEnds
      ) {
        pathToSafestFood = pathToSnack;
        safestFood = snakeSnack;
      }
    });

    if (safestFood) {
      return PF.getStep(head, safestFood);
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
  }
};

export default seekSafestFood;

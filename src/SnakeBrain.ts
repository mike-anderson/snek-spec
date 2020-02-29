import { IGameState, ISnake, IBoard, IGame, Directions } from './Types';
// I hate writing "this." all the time.
let game: IGame;
let turn: number;
let board: IBoard;
let us: ISnake;

export default class SnakeBrain {
  private action: Directions;

  constructor(gameStateResponse: IGameState) {
    game = gameStateResponse.game;
    turn = gameStateResponse.turn;
    board = gameStateResponse.board;
    us = gameStateResponse.you;
  }

  /**
   * Where a whole lot of IF/ELSE is going to happen.
   * This function will determine what behaviours to act upon depending on game state.
   *
   * @returns {SnakeBrain}
   */
  public decide(): SnakeBrain {
    // Logic for start of game.
    // eslint-disable-next-line array-element-newline
    console.log([turn, game, board, us]);

    if (turn === 0) {
      // Eat something, you look hungry.
      this.action = Directions.DOWN;
    }

    // Default action
    this.action = Directions.LEFT;
    return this;
  }

  /**
   * The direction this snake will take in its short but exciting life.
   *
   * @returns {Directions}
   */
  public act(): Directions {
    return this.action;
  }
}

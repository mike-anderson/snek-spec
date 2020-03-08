import { IGameState, ISnake, IBoard, IGame, Directions } from './Types';
import { turtle } from './behaviours/turtle';
import {
  canKillNemesis,
  getPartners,
  getNemesis,
  shouldChaseOurTail,
  firstToFood,
} from './helpers';
import { attackHead } from './behaviours/attackHead';
import { chaseTail } from './behaviours/chaseTail';
import { chaseEnemyTail } from './behaviours/chaseEnemyTail';
import Pathfinder from './Pathfinder';
import { floodFill } from './behaviours/floodFill';
import seekSafestFood from './behaviours/seekSafestFood';
import { collaborate } from './collaborate';

// I hate writing "this." all the time.
let game: IGame;
let turn: number;
let board: IBoard;
let selfDestruct: boolean;
let us: ISnake;
let partners: ISnake[];
let nemesis: ISnake;
let everybody: ISnake[];

export default class SnakeBrain {
  private action: Directions;

  constructor(gameStateResponse: IGameState, exploited: boolean) {
    game = gameStateResponse.game;
    turn = gameStateResponse.turn;
    board = gameStateResponse.board;
    // Not sure why we left this in here?
    // TODO: remove self-destruct
    selfDestruct = exploited;
    us = gameStateResponse.you;
    everybody = board.snakes;
    partners = getPartners(us, everybody);
    nemesis = getNemesis(us, everybody);
  }

  /**
   * This function will determine what behaviours to act upon depending on game state.
   *
   * @returns {SnakeBrain}
   */
  public decide(): SnakeBrain {
    // Logic for start of game.
    console.log({ turn, game, board, us });

    // Instantiate Pathfinder with board and snakes
    const PF = new Pathfinder(board, everybody);

    // Try some moves out, see what feels good
    const cower = turtle(PF, us);
    const headbutt = collaborate(
      attackHead,
      [PF, us, nemesis],
      new Pathfinder(board, everybody),
      us,
      partners
    );
    const goingInCircles = chaseTail(PF, us);
    const hangry = collaborate(
      seekSafestFood,
      [PF, board, us],
      new Pathfinder(board, everybody),
      us,
      partners
    );
    const ridingCoattails = chaseEnemyTail(PF, us, everybody);

    if (selfDestruct) {
      // OH NO! We've been hacked!
      console.log('AHHHHHH');
      this.action = cower;
    } else if (canKillNemesis(us, everybody) && headbutt) {
      console.log('*THUNK*');
      this.action = headbutt;
    } else if (firstToFood && hangry) {
      console.log('CHONK');
      this.action = hangry;
    } else if (goingInCircles && shouldChaseOurTail(us, turn)) {
      console.log('Follow our butt');
      this.action = goingInCircles;
    } else if (ridingCoattails) {
      console.log('Follow your butt');
      this.action = ridingCoattails;
    } else {
      console.log('Feeling aimless');
      // floodFill is costly, so only calculating when we need it
      this.action = PF.getDirection(us.body[0], floodFill(PF.grid, us));
    }

    // Default action
    this.action = this.action || Directions.LEFT;
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

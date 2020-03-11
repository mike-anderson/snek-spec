import { IGameState, ISnake, IBoard, Directions } from './Types';
import { turtle } from './behaviours/turtle';
import { getNemesis, shouldChaseOurTail, shouldKillNemesis } from './helpers';
import { attackHead } from './behaviours/attackHead';
import { chaseTail } from './behaviours/chaseTail';
import { chaseEnemyTail } from './behaviours/chaseEnemyTail';
import Pathfinder from './Pathfinder';
import { floodFill } from './behaviours/floodFill';
import seekSafestFood from './behaviours/seekSafestFood';
import { logger } from './logger';

// I hate writing "this." all the time.
let turn: number;
let board: IBoard;
let selfDestruct: boolean;
let us: ISnake;
let nemesis: ISnake;
let everybody: ISnake[];

export default class SnakeBrain {
  private action: Directions;

  constructor(gameStateResponse: IGameState, exploited: boolean) {
    turn = gameStateResponse.turn;
    board = gameStateResponse.board;
    // Not sure why we left this in here?
    // TODO: remove self-destruct
    selfDestruct = exploited;
    us = gameStateResponse.you;
    everybody = board.snakes;
    nemesis = getNemesis(us, everybody);
  }

  /**
   * This function will determine what behaviours to act upon depending on game state.
   *
   * @returns {SnakeBrain}
   */
  public decide(): SnakeBrain {
    // Instantiate Pathfinder with board and snakes
    const PF = new Pathfinder(board, everybody, us);

    // Try some moves out, see what feels good
    const cower = turtle(PF, us);
    const headbutt = attackHead(PF, us, nemesis);
    const goingInCircles = chaseTail(PF, us);
    const hangry = seekSafestFood(PF, board, us);
    const ridingCoattails = chaseEnemyTail(PF, us, everybody);

    logger.debug(`${turn}`);
    if (selfDestruct) {
      // OH NO! We've been hacked!
      logger.debug('AHHHHHH');
      this.action = cower;
    } else if (shouldKillNemesis(us, everybody) && headbutt) {
      logger.debug('*THUNK*');
      this.action = headbutt;
    } else if (hangry) {
      logger.debug('CHONK');
      this.action = hangry;
    } else if (shouldChaseOurTail(us) && goingInCircles) {
      logger.debug('Follow our butt');
      this.action = goingInCircles;
    } else if (ridingCoattails) {
      logger.debug('Follow your butt');
      this.action = ridingCoattails;
    } else {
      logger.debug('Feeling aimless');
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

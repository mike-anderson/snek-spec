export interface ICoordinate {
  x: number;
  y: number;
}

export interface ISnake {
  id: string;
  name: string;
  health: number;
  body: ICoordinate[];
  shout: string;
}

export interface IBoard {
  height: number;
  width: number;
  food: ICoordinate[];
  snakes: ISnake[];
}

export interface IGame {
  id: string;
}

export interface IGameState {
  game: IGame;
  turn: number;
  board: IBoard;
  you: ISnake;
}

export type Matrix = number[][];

export enum Directions {
  LEFT = 'left',
  RIGHT = 'right',
  UP = 'up',
  DOWN = 'down',
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Behavior = (...args: any[]) => Directions;

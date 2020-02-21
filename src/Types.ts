export interface ICoordinate {
  x: number;
  y: number;
}

export interface ISnake {
  id: string;
  name: string;
  health: number;
  body: ICoordinate[];
}

export interface IBoard {
  height: number;
  width: number;
  food: ICoordinate[];
  snakes: ISnake[];
}

export type Matrix = number[][];

export enum Directions {
  LEFT = 'left',
  RIGHT = 'right',
  UP = 'up',
  DOWN = 'down'
}

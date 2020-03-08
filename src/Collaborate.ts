import { Behavior, Directions, ISnake } from './Types';
import Pathfinder from './Pathfinder';

export function collaborate(
  action: Behavior, // eslint-disable-next-line @typescript-eslint/no-explicit-any
  actionArguments: Array<any>,
  pathfinder: Pathfinder,
  us: ISnake,
  partners: ISnake[]
): Directions {
  const collaborateArguments = actionArguments.map(arg =>
    arg instanceof Pathfinder ? pathfinder : arg
  );
  partners.forEach(snake => {
    const snakeArgs = collaborateArguments.map(arg =>
      arg === us ? snake : arg
    );
    const direction = action(...snakeArgs);
    const nonWalkableCoordinate = snake.body[0];
    switch (direction) {
      case Directions.UP:
        nonWalkableCoordinate.y -= 1;
      case Directions.DOWN:
        nonWalkableCoordinate.y += 1;
      case Directions.LEFT:
        nonWalkableCoordinate.x -= 1;
      case Directions.RIGHT:
        nonWalkableCoordinate.x += 1;
    }
    pathfinder.grid[nonWalkableCoordinate.x][nonWalkableCoordinate.y] = 1;
  });
  return action(...collaborateArguments);
}

import { Behavior, Directions, ISnake } from './Types';
import Pathfinder from './Pathfinder';

export function collaborate(
  action: Behavior, // eslint-disable-next-line @typescript-eslint/no-explicit-any
  actionArguments: Array<any>,
  us: ISnake,
  partners: ISnake[]
): Directions {
  const pathfinder = actionArguments.find(arg => arg instanceof Pathfinder);
  partners = partners
    .sort((s1, s2) => (s1.id > s2.id ? 1 : -1))
    .filter(s1 => s1.id < us.id);
  partners.forEach(snake => {
    const snakeArgs = actionArguments.map(arg => (arg === us ? snake : arg));
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
  return action(...actionArguments);
}

import fs from 'fs';
import { getGameStateFromMock } from './snekspec';

if (process.argv.length < 3) {
  console.log('you must specify a text file to generate a game state');
  process.exit(1);
}

fs.readFile(process.argv[2], 'utf8', function(err, data) {
  if (err) throw err;

  const gamestate = getGameStateFromMock(data);
  const gamestateJSON = JSON.stringify(gamestate);

  console.log(gamestateJSON);
});


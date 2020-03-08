import bodyParser from 'body-parser';
import express from 'express';
import logger from 'morgan';
import {
  fallbackHandler,
  genericErrorHandler,
  poweredByHandler,
} from './handlers';
import { getNemesis } from './helpers';
import SnakeBrain from '../src/SnakeBrain';
import { IGameState } from '../src/Types';
import redis from 'redis';

const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const REDIS_PORT = process.env.REDIS_PORT || 6379;
const client = redis.createClient(REDIS_PORT, REDIS_HOST);

client.on('connect', () => {
  console.log('Redis connected');
});

client.on('error', err => {
  console.error(err);
});

const app = express();

// For deployment to Heroku, the port needs to be set using ENV, so
// we check for the port number in process.env
app.set('port', process.env.PORT || 9001);

app.enable('verbose errors');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(poweredByHandler);
const urlencodedParser = bodyParser.urlencoded({ extended: true });

// Not sure if this is the best idea! 👀
let giveUp = false;

// --- SNAKE LOGIC GOES BELOW THIS LINE ---

// Handle POST request to '/start'
app.post('/start', (request, response) => {
  // Reset giveUp whenever a new game starts
  giveUp = false;

  // Let's see who we're dealing with.
  const gameState: IGameState = request.body;
  const enemy = getNemesis(gameState.you, gameState.board.snakes);

  // That's it! You're on the list.
  client.smembers('enemyNames', (err, reply) => {
    giveUp = reply.includes(enemy.name);
  });

  // Response data
  const data = {
    color: Math.round(Math.random()) === 1 ? '#1A2F4B' : '#EB7963',
  };

  return response.json(data);
});

// Handle POST request to '/move'
app.post('/move', (request, response) => {
  // Pass current game state and whether it's quittin time
  const currentGameState: IGameState = request.body;
  const brain = new SnakeBrain(currentGameState, giveUp);

  brain.decide();

  const direction = brain.act();
  // Response data
  const data = {
    move: direction, // one of: ['up','down','left','right']
  };

  return response.json(data);
});

app.post('/end', (request, response) => {
  console.log(request.body);

  // NOTE: Any cleanup when a game is complete.
  return response.json({});
});

app.post('/ping', (request, response) => {
  console.log(request.body);

  // Used for checking if this snake is still alive.
  return response.json({});
});

app.get('/version', (_, response) => {
  response.status(200);
  return response.send(process.env.VERSION || 'undefined');
});

app.post('/enemy', urlencodedParser, (request, response) => {
  let data = "Didn't quite get that. Come again?";

  // Parse curl for enemy name, add it to redis
  if (request.body.name) {
    client.sadd('enemyNames', request.body.name);
    data = 'Turtle cower! 🐢 🐢 🐢 ';
  }

  return response.json(data);
});

// --- SNAKE LOGIC GOES ABOVE THIS LINE ---

app.use('*', fallbackHandler);
app.use(genericErrorHandler);

app.listen(app.get('port'), () => {
  console.log(`Server listening on port ${app.get('port')}`);
});

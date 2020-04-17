# Snek-Spec

By Echosec

## Plain Text Mocks for Battlesnake Game States

Snek-Spec is a tool that generates [Battle Snake](https://play.battlesnake.com/) [Game States](https://docs.battlesnake.com/snake-api#tag/endpoints/paths/~1move/post) from plain text depictions of the game board. It was developed by the Echosec Bounty Snake team to support test driven development of snake behaviors. We were able to rapidly develop and verify new behaviors by [mocking](https://circleci.com/blog/how-to-test-software-part-i-mocking-stubbing-and-contract-testing/) specific requests that would normally come from the battlesnake arena. It also helped us realize when changes to our code changed the snake behaviour in unexpected ways.

### GameState Mock

```
-----------
---0-------
-----------
--T------0-
--tS-------
--tt---0---
-----------
--------U--
---0----v--
-----Vvvv--
-----------
```

Open spaces in the game board are represented by `-`'s, food is represented by `0`'s and snakes are represented by letters. Two letters are needed to represent a snake. A snake always begins and ends with capital letter, with the middle segments represented by lower case letters . By default Snek-Spec assumes your snake is the snake starting with `S` (for snake) and ending in `T` (for tail).

```
<- Head Tail ->
       S     // single segment snake
      ST     // 2 segment snake
      StT    // 3 segment snake
      ...
     StttT   // 5 segment snake
```

## How to Use

To run directly from this repo, first clone and install the dependencies, you will need [Node.JS 12.2.0](https://nodejs.org/en/) or later

```
git clone https://github.com/mike-anderson/snek-spec.git
cd snek-spec
npm install
```

### Run as a command

```
npm run snek-spec -- yourBoard.txt
```

Save game states to files

```
npm run snek-spec -- yourBoard.txt > gamestate1.json
```

Or even test directly against your own snake

```
curl -X POST --header "Content-Type: application/json"  -d "$(npm run snek-spec -- yourBoard.txt)" http://yoursnakeserver/move
```

### Call directly in any Typescript project

If you are writing a snake in typescript, you can include snekspec.ts and call the following function (you can find some examples in snekspec.test.ts):

```
import { getGameStateFromMock } from 'snekspec';
const gameState = getGameStateFromMock(yourBoardAsAMultiLineString);
```

#### Optional Parameters

| Name    | Description                           | Default Value  |
| ------- |------------------------------------------------- | --- |
| height  | game board height                                | 11  |
| width   | game board width                                 | 11  |
| you     | the letter corresponding to your snake head      | 's' |
| health  | your health                                      | 90  |
| turn    | the turn number of the game                      | 1   |

### Generated Game State Object

The spec above will generate the following mock battlesnake game state which you can use in place of a `/move` request from the battlesnake API for testing.

```
      game: {
        id: 'generated-scenario',
      },
      turn: 1,
      board: {
        height: 11,
        width: 11,
        food: [
          { x: 3, y: 1 },{ x: 9, y: 3 },{ x: 7, y: 5 },{ x: 3, y: 8 },
        ],
        snakes: [
          {
            id: 's',
            name: 's',
            health: 90,
            body: [
              { x: 3, y: 4 },{ x: 3, y: 5 },{ x: 2, y: 5 },{ x: 2, y: 4 },{ x: 2, y: 3 },
            ],
            shout: 'boo!',
          },
          {
            id: 'u',
            name: 'u',
            health: 90,
            body: [{ x: 8, y: 7 },{ x: 8, y: 8 },{ x: 8, y: 9 },{ x: 7, y: 9 },{ x: 6, y: 9 },{ x: 5, y: 9 },
            ],
            shout: 'boo!',
          },
        ],
      },
      you: {
        id: 's',
        name: 's',
        health: 90,
        body: [
          { x: 3, y: 4 },{ x: 3, y: 5 },{ x: 2, y: 5 },{ x: 2, y: 4 },{ x: 2, y: 3 }
        ],
        shout: 'boo!',
      },
    });
  });
  ```

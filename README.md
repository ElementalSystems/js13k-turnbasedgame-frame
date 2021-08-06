# js13kgames.com Two player online Lobby Demo Game Server

Some code showing how to build a Game server for the [js13kGames Competition](http://js13kgames.com/).

## Install

Extract the files and install the third party libraries with `npm`.

    npm install

## Running

You can run the server locally with the following command:

    npm run start:dev

You can reach the test server at [http://localhost:3000](http://localhost:3000)

To build a minimal version use:
    npm run build-rel

If you are developing you can watch the src directory (and automatically rebuild without compression) with
    npm run watch


## What it does
It allows players on the cloud to enter a nickname and level of ability and enter
 a lobby area which displays other players waiting to play.
You can select a player to play with and launch a (trivial) game.

The system is intended for a two player turn based game.

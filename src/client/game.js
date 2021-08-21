let isLead = 0;


function startGameMulti(lead, gamemsg, gameend) {
  let gb = document.getElementById("game");
  gb.classList.toggle('gone', false);
  isLead = lead ? 1 : 0;

  if (lead) {
    //init game
    gameState.turn = 1;
    gameState.initTime = +new Date();
    gamemsg(gameState);
    updateBoard();
  }
}

function msgGame(data) {}

function endGame() {}

function updateBoard() {}


function startGame() {

  let _gs = 9;

  ge_gone('game', false);

  //make the game state
  //let gs = m_gs(9,true,[23,21,26],[3, 6, 12, 5, 11, 7, 5, 10, 14, 15, 15, 13, 3, 6, 9, 12,7,5])
  //let gs = m_gs(7,true,[19],[3, 6, 12, 5, 11, 7, 5, 10, 14, 15, 15, 13, 3, 6, 9, 12,7,5])
  let gs = m_gs(11,true,[31,23,21,26],[3, 6, 12, 5, 11, 7, 5, 10, 14, 15, 15, 13, 3, 6, 9, 12,7,5])
  let gsh=h_gs(gs)

  let bd=mk_brd(gs);


  let doTurn = () => {
    bd.update();
    let pn = gs.tn % 2; //which player
    let ntl = gs.ft[pn][0]; //the current top tile

    //calculate legal moves
    gs.tls.forEach((t, i) => {
      if (gsh.canPlay(i, ntl, pn))
        bd.setT(i, ntl, -1, true);
    })

    //now set up for that players turn
    bd.setClk((i) => {
      //make the move
      gsh.add(i,ntl,-1);
      gs.tn += 1;
      gs.ft[pn].shift(); //use up the tile
      doTurn();
    });

  }

  doTurn();


}

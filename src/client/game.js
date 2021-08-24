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


function startGame(gs) {

  ge_gone('game', false);
  let gsh=h_gs(gs)
  let bd=mk_brd(gs);

  bd.setB("Starting Game...",3000);

  let doTurn = () => {
    bd.update();

    //maybe someone won
    if (gs.winner>=0) {
      bd.setB(gs.p[gs.winner].n+" WON!",5000);
      return;
    }

    //okay lets set up the turn
    let pn = gs.tn % 2; //which player
    let ntl = gs.p[pn].ft[0]; //the current top tile
    bd.setB(gs.p[pn].n+"'s turn");


    selTurn(gsh,bd,pn,gs.p[pn],ntl,(i)=>{
      pubTurn(gsh, bd, pn, gs.p[pn?0:1], i, ntl)//inform the opponent
      bd.setClk(null);//kill any click handler on our board
      bd.update();
      if (i<0) {
        bd.setB(gs.p[pn].n+": Forced to Discarded");
        gs.dCnt=+1;
      } else {
        gs.dCnt=0;
        bd.setB(gs.p[pn].n+": played");
        bd.setT(i,ntl,-1,true);
        gsh.add(i,ntl,-1);
      }
      gs.tn += 1; 
      gs.p[pn].ft.shift(); //use up the tile
      bd.flat();
      setTimeout(doTurn,1000);
    })

  }

  doTurn();


}

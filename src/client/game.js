function startGame(gs) {
  document.body.classList.toggle('ms',false);
  let gsh = h_gs(gs)
  let bd = mk_brd(gs);

  bd.flat(false);
  bd.update();

  bd.setB("Starting Game...", 500);

  let doTurn = () => {
    bd.update();
    //wait to allow board to grow out
    setTimeout(() => {
      //maybe someone won
      if (gs.winner >= 0) {
        bd.setB(gs.p[gs.winner].n + " WON!", 50000);
        setTimeout(()=>{
          lobby.gamedone();
        },5000)
        return;
      }
      bd.flat(true);
      //okay lets set up the turn
      let pn = gs.tn % 2; //which player
      let ntl = gs.p[pn].ft[0]; //the current top tile
      bd.setB(gs.p[pn].n + "'s turn");

      selTurnSoon(gsh, bd, pn, gs.p[pn], ntl, (i) => {
        pubTurn(gsh, bd, pn, gs.p[pn ? 0 : 1], i, ntl) //inform the opponent
        bd.setClk(null); //kill any click handler on our board
        bd.flat(false);
        bd.update();
        if (i < 0)
          bd.setB(gs.p[pn].n + "was forced to discard ("+(gs.dCnt+1)+")");
        else
          bd.setB(gs.p[pn].n + " played");
        bd.animateM(pn, i)
        gsh.move(i); //change the board status
        setTimeout(doTurn, 2000);
      })
    }, 3000);
  }
  doTurn();
}

function startGameD(bt,p1,p2)
{
  let gs = m_gs(bt.bs,bt.bs%2,bt.it,bt.dt,p1,p2);
  startGame(gs);
}

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
  let grid_c = null;

  let _gs = 9;

  ge_gone('game', false);

  //make the game state
  let gs = m_gs(_gs,[11, 7, 5, 10, 14, 15, 15, 13, 3, 6, 9, 12,7,5])
  let gsh=h_gs(gs)

  let setTile = (t, b, c, ht) => {
    for (i = 0; i < 5; i += 1)
      t.classList.toggle('l' + i,b & (1 << i));
    t.classList.toggle('p1', c == 0);
    t.classList.toggle('p2', c == 1);
    t.classList.toggle('ht', !!ht);
  }

  let posTile = (t, i) => {
    let x = (i % gs.s),
      y = Math.floor(i / gs.s)
    if (y == gs.s) x = -1.5;
    if (y == (gs.s + 1)) x = gs.s + .5;
    if (y >= gs.s) y = (i % gs.s) * 1.2 + .3;
    t.style.left = (x * 100 / gs.s) + "%";
    t.style.top = (y * 100 / gs.s) + "%";
    t.style.width = t.style.height = (100 / gs.s) + "%";
    return t;
  }


  //make the game grid
  let gg = new Array(gs.s * (gs.s + 2)).fill(0).map((d, i) => {
    let t = clone('gamebrd', 'tile')
    posTile(t, i);
    t.onclick = () => {
      if (grid_c) grid_c(i);
    }
    return t;
  });

  let updateBoard = () => { //set up grid
    gg.forEach((t, i) => {
      if (i < gs.s * gs.s)
        setTile(t, gs.tls[i], gs.own[i]); //main rack
      else if (i - gs.s < gs.s * gs.s) {
        setTile(t, gs.ft[0][i - gs.s * gs.s], -1); //p1 side
      } else {
        setTile(t, gs.ft[1][i - gs.s * gs.s - gs.s], -1); //p2 side
      }
    });
  }



  let doTurn = () => {
    updateBoard();
    let pn = gs.tn % 2; //which player
    let ntl = gs.ft[pn][0]; //the current top tile
    gecl('gamebrd', 'p1', pn);

    //calculate legal moves
    gs.tls.forEach((t, i) => {
      if (gsh.canPlay(i, ntl, pn))
        setTile(gg[i], ntl, -1, true);
    })

    //now set up for that players turn
    grid_c = (i) => {
      //make the move
      gsh.add(i,ntl,-1);
      gs.tn += 1;
      gs.ft[pn].shift(); //use up the tile
      doTurn();
    }

  }

  doTurn();


}

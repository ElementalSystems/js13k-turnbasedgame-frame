/*
   Contains all the abstarction about how to make a turn.
*/

function selTurn(gsh, bd, pn, p, ntl, mm) {
  let lm = gsh.legalM(ntl, pn);
  if (p.t == 'l') { //for a local  player
    if (lm.length == 0) //forced to discard
      mm(-2);
    lm.forEach(i => bd.setT(i, ntl, -1, true)); //show the legal moves
    bd.setClk((i) => mm(i)); //set a click handler for each board member
  }

  if (p.t == 'r') { //for a remote player wait for a message
    console.log("waiting for next turn")
    lobby.waitMsg((m) => mm(m.move)); //wait for remote player to pub that turn.
  }

}

function pubTurn(gsh, bd, pn, op, i, t) {
  if (op.t == 'r') { //for a remote opponent send a message
    lobby.msg({
      move: i,
    });
  }
}

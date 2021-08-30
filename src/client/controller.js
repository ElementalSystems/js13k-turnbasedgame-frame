/*
   Contains all the abstarction about how to make a turn.
*/

function selTurn(gsh, bd, pn, p, ntl, mm) {
  let lm = gsh.legalM(ntl, pn);
  if (p.t == 'l') { //for a local  player
    if (lm.length == 0) //forced to discard
      mm(-2);
    lm.forEach(i => bd.setT(i, ntl, -1, true)); //show the legal moves
    bd.setB("Select tile to crack",2000);
    bd.setClk((i) => mm(i)); //set a click handler for each board member
  }

  if (p.t == 'r') { //for a remote player wait for a message
    bd.setB("Waiting for "+p.n+" to play...",60000);
    lobby.waitMsg((m) => mm(m.move)); //wait for remote player to pub that turn.
  }
  if (p.t == 'a') { //for a ai player
    if (lm.length == 0) //forced to discard
      mm(-2);
    else {
      let moves=lm.map((i)=>({ //value the legal moves
        m: i,
        sc: ai_eval_mv(gsh.gs,p,i),
      }))
      .sort((a,b)=>b.sc-a.sc); //sort our options
      //wait for a bit and then play the bext move
      setTimeout(()=>mm(moves[0].m),1000+Math.random()*1000)
    }

  }
}

function ai_eval_mv(gs,p,i)
{
  let pn=gs.tn%2;
  let opn=pn^1; //opponent player number
  let h=h_gsc(gs); //we make a virtual board
  h.move(i);  //and make this move
  let res=h.gs.p[pn].tsc*2-h.gs.p[opn].tsc;
  //console.log("move "+i+" val "+res+" --  ");
  return res+Math.random();
}


function pubTurn(gsh, bd, pn, op, i, t) {
  if (op.t == 'r') { //for a remote opponent send a message
    lobby.msg({
      move: i,
    });
  }
}

/*
   Contains all the abstarction about how to make a turn.
*/

function selTurnSoon(gsh, bd, pn, p, ntl, mm) {
  setTimeout(()=>selTurn(gsh, bd, pn, p, ntl, mm),1000);
}

function selTurn(gsh, bd, pn, p, ntl, mm) {
  let lm = gsh.legalM(ntl, pn);
  if (p.t == 'l') { //for a local  player
    if (lm.length == 0) {//forced to discard
      mm(-2);
      return;
    }
    bd.setClk((i) => mm(i)); //set a click handler for board
    lm.forEach(i => bd.setT(i, ntl, -1, true)); //show the legal moves
    bd.setB("Select tile to crack",2000);
    bd.setClk((i) => mm(i)); //set a click handler for board
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
  //based on score
  let res=h.gs.p[pn].tsc*2-h.gs.p[opn].tsc;
  //based on winning
  if (gs.winner==pn) res+=10000;
  if (gs.winner==opn) res-=10000;

  let eps=gs.tls.reduce((a,t,i)=>{ //analyse end points by colour and place them
    if (gs.tls[i] != 0) return a; //already something there
    let res=h.playOutcome(i,-1,-1);
    if (res>=-1) a[res].push(i);//is an endpoint
    return a;
  },{'-1':[],'0':[],'1':[]});

  let minD=(op,p)=>{ //calc minimum metric distance between i and array of pts
    return p.reduce((a,t,i)=>{
      let d=Math.abs((op%gs.s)-(i%gs.s))+Math.abs((op/gs.s)-(i/gs.s));
      return Math.min(d,a);
    },gs.s*2);
  }

  let posA=[0,0];//minimum distance to open squares
  eps[-1].forEach(i=>{
    posA[0]+=gs.s-minD(i,eps[0]);
    posA[1]+=gs.s-minD(i,eps[1]);
  });
  //add positional advantages
  res+=(posA[pn]-posA[opn]);
  //we like to have oppertunity
  res+=eps[pn].length;
  return res+Math.random();
}


function pubTurn(gsh, bd, pn, op, i, t) {
  if (op.t == 'r') { //for a remote opponent send a message
    lobby.msg({
      move: i,
    });
  }
}

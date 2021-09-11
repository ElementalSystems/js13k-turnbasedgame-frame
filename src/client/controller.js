/*
   Contains all the abstarction about how to make a turn.
*/

function selTurnSoon(gsh, bd, pn, p, ntl, mm) {
  setTimeout(()=>selTurn(gsh, bd, pn, p, ntl, mm),1000);
}

function selTurn(gsh, bd, pn, p, ntl, mm) {
  if (p.t == 'l') { //for a local  player
    let lm = gsh.legalM();
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
    setTimeout(()=>mm(bestM(gsh,p.pp)),500+Math.random()*1000);
  }
}


function bestM(gsh,pp)
{
  let lm = gsh.legalM();
  if (lm.length == 0) //forced to discard
    return -2;
  else {
    let moves=lm.map((i)=>({ //value the legal moves
      m: i,
      sc: ai_eval_mv(gsh.gs,pp,i),
    }))
    .sort((a,b)=>b.sc-a.sc); //sort our options
    return moves[0].m; //return the best move
 }
}

function ai_eval_mv(gs,pp,i)
{
  let pn=gs.tn%2;
  let opn=pn^1; //opponent player number
  let h=h_gsc(gs); //we make a virtual board
  h.move(i);  //and make this move
  //based on score
  let sres=h.gs.p[pn].tsc*2-h.gs.p[opn].tsc;
  //based on winning
  if (h.gs.winner==pn) sres+=10000;
  if (h.gs.winner==opn) sres-=10000;

  let eps=h.gs.tls.reduce((a,t,i)=>{ //analyse end points by colour and place them
    if (h.gs.tls[i] != 0) return a; //already something there
    let res=h.playOutcome(i,-1,0);
    if (res>=-1) a[res].push(i);//is an endpoint
    return a;
  },{'-1':[],'0':[],'1':[]});

  let minD=(op,p)=>{ //calc minimum metric distance between i and array of pts
    return p.reduce((a,t,i)=>{
      let d=Math.abs((op%gs.s)-(i%gs.s))+Math.abs((op/gs.s)-(i/gs.s));
      return Math.min(d,a);
    },gs.s*2);
  }
  let ores=(eps[pn].length<2)?-10:eps[pn].length*2; //oppurtunity to play is good, none is BAD!

  let pres=0;
  eps[-1].forEach(i=>{
    let mD=minD(i,eps[pn]);
    let oD=minD(i,eps[opn]);
    if (mD<=oD) pres+=(mD<3)?3:1; //we are closer
    else pres-=(oD<3)?3:1; //they are closer
  });
  let rres=Math.random();
  console.log(i,sres,ores,pres,rres);
  return sres*pp.s+ores*pp.o+pres*pp.p+rres*pp.r;
}


function pubTurn(gsh, bd, pn, op, i, t) {
  if (op.t == 'r') { //for a remote opponent send a message
    lobby.msg({
      move: i,
    });
  }
}

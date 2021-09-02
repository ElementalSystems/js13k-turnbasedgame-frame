function m_gs(s, cen, ex, bs, p0, p1) {
  let flip = (n) => { //utility to mirror a tile code
    x = ((n >> 1) ^ (n >> 3)) & 1;
    y = ((n >> 0) ^ (n >> 2)) & 1;
    return n ^ ((x << 1) | (x << 3)) ^ ((y << 0) | (y << 2));
  }
  let ts = new Array(5).fill(bs).flat().sort(() => (Math.random() - .5))
  let gs = {
    tn: 0, //turn number
    s: s,
    winner: -1, //currently unowned
    tls: new Array(s * s).fill(0), //tiles that are the current board
    own: new Array(s * s).fill(-1), //ownership of board
    tg: new Array(s * s).fill(0), //tile growth
    txt: new Array(s * s).fill(''),
    p: [{
      ...p0,
      ft: ts
    }, {
      ...p1,
      ft: ts.map(n => flip(n))
    }]
  }


  let h = h_gs(gs);

  let add_r = (t, start) => { //tool to add a random symetric site of tiles
    let i;
    do {
      //choose a random tile
      i = Math.floor(Math.random() * gs.s * gs.s);
      if (start) i = Math.floor(i / gs.s) * gs.s; //if start force it to the left most column
    } while (!h.canPlace(i, t)) //check if it's legal if not restart
    h.add(i, t, start ? 0 : -1,-1); //add the tile
    h.add(gs.s * gs.s - 1 - i, flip(t), start ? 1 : -1,-1); //okay generate the mathcing fliped tile in the sq - position
  }


  if (cen==='intro') {
    let at=(si,s)=>{
      s.forEach((c,i)=>{
        if (c===(+c)) {
          gs.tls[i+si]=c;
        } else
          gs.txt[i+si]=c;
      })
    }

    at(0,['A',6,10]);
    at(8,[3,12]);
    at(15,[10,9,...'PACE']);
    at(21,[...'IN']);
    at(28,[...'THE',6,10]);
    at(38,[3,12]);
    at(45,[10,9,...'UN']);
    gs.isI=true;
  } else {
    if (cen) h.add(Math.floor((gs.s * gs.s) / 2), 31, -1,-1);
    ex.forEach((t,ind) => add_r(t,ind==0)); //first one is a start peice
  }
  return gs;
}

function h_gsc(gso) { //same as h_gs except it makes a independant clone of the game state
  //so make a shallow clone with some deeper clone overwrites
  return h_gs({
    ...gso,
    tls: [...gso.tls],
    own: [...gso.own],
    tg: [...gso.tg],
    p: [{
        ...gso.p[0],
        ft: [...gso.p[0].ft]
      },
      {
        ...gso.p[1],
        ft: [...gso.p[1].ft]
      }
    ],
  });
}

function h_gs(gs) { //makes a game state handler for changing the game state

  let checkOwn = (i,o) => {
    if (gs.own[i] >= 0) return; //we already have a colour
    gs.own[i]=playOutcome(i,gs.tls[i],o);
    if (gs.own[i]>=0) { //now we have colour it might spread so check around us
       [0,1,2,3].forEach(d=>{
         let ni=getTD(i,d).i;
         if (ni>=0) //is a real tile
          checkOwn(ni,o);
       })
    }
  }


  let calcS = () => {
    let tot = gs.s*gs.s*2
    let calc_sc = (p) => gs.tls.reduce((a, t, i) => a + ((gs.own[i] == p) ? (gs.tg[i]) : 0), 0)
    let calc_tsc = (p) => gs.tls.reduce((a, t, i) => a + ((gs.own[i] == p) ? ((t&16)?5:2) : 0), 0)

    gs.p[0].sc = Math.round(calc_sc(0) * 100 / tot);
    gs.p[1].sc = Math.round(calc_sc(1) * 100 / tot);
    gs.p[0].tsc = Math.round(calc_tsc(0) * 100 / tot);
    gs.p[1].tsc = Math.round(calc_tsc(1) * 100 / tot);
    if (gs.p[0].sc > 50) gs.winner = 0;
    if (gs.p[1].sc > 50) gs.winner = 1;
    if (gs.dCnt > 4) gs.winner = (gs.p[0].sc > gs.p[1].sc) ? 0 : 1; //if we all discard 5 times the leader wins

  }

  let add = (i, t, o, op) => {
    gs.tls[i] = t;
    gs.own[i] = o;
    if (o!=-1) gs.tg[i]=1; //if we add it owned then its planted.
    checkOwn(i,op);
    calcS();
  };



  let getTD=(i,d)=>{  //get tile in direction d from i
    let xp = i % gs.s + [0,1,0,-1][d],
        yp = Math.floor(i / gs.s) + [-1,0,1,0][d];
    if ((xp < 0) || (xp >= gs.s) || (yp < 0) || (yp >= gs.s)) return {t:0, o:-1, i:-1};
    let ni=yp*gs.s+xp;
    return {
      i: ni,
      t:gs.tls[ni],
      o:gs.own[ni]
    }
  }
 /*
   play outcomes "if I played this tile here what would be the outcome"
   and returns -999 if illegal; or -1,0 or 1 to reflect the tiles destined ownership
   passing a -1 for t will assume the tile 'fits' perfectly and calculate the outcome
 */
  let playOutcome=(i,t,o)=>{ //index, tile and owner playing
    //for each direction
    let r=[0,1,2,3].map(d=>{
       let db=(1<<d),
           rdb=(1<<((d+2)%4)), //reverse direction bit
           tt=getTD(i,d); //returns the type and owner of the tile at d from i
       if (tt.t==0) return -2; //allowed!
       if (t==-1) {//special case for wildcard tile matches anyone
         return (tt.t&rdb)?tt.o:-1;
       }
       //check we match paths
       if ((tt.t>0)&&((!!(tt.t&rdb))!=(!!(t&db)))) return -999; //doesn't match the points
       return (t&db)?tt.o:-1; //if we do have a connection then we'll get that colour
    });
    if (r.includes(-999)) return -999; //a bad connection is a bad tile
    if (r.includes(o)) return o; //if it could be ours it will be
    if (r.includes(o^1)) return o^1; //otherwise the opponents
    if (r.includes(-1)) return -1; //at least one unknown tile is linked
    return -2;  //must be all empty breakables to return -2
  }

  let canPlay = (i, t, o) => {
    if (gs.tls[i] != 0) return false; //already something there
    return [-1,-2,o].includes(playOutcome(i,t,o)) //if it's ours or unowned then we can play
  }

  let canPlace = (i, t) => {
    if (gs.tls[i] != 0) return false; //already something there
    let po=playOutcome(i,t,0);
    return [-2].includes(po) //if it's ours or unowned then we can play
  }

  let legalM = (ntl, pn) =>
    gs.tls.map((t, i) => canPlay(i, ntl, pn) ? i : -1).filter(i => (i >= 0));

  let move = (i) => {
    let pn = gs.tn % 2; //which player
    let ntl = gs.p[pn].ft.shift(); //use up the tile
    //okay play the board
    if (i < 0)
      gs.dCnt += 1;
    else {
      gs.dCnt = 0;
      add(i, ntl, -1,pn);
    }
    gs.tn += 1;

    //growth time
    gs.tg.forEach((g,i)=>{
      if (gs.own[i]<0) return;
      gs.tg[i]=Math.min(g+1,(gs.tls[i]&16)?5:2); //up to 5 for a pot otherwise 1
    })
    calcS();
  }

  return {
    add,
    canPlay,
    legalM,
    canPlace,
    move,
    gs,
    playOutcome,
  }
}

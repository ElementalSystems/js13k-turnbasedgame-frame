function m_gs(s, cen, ex, bs,p0,p1) {
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
    } while (!h.canPlace(i, t, start ? 0 : -1)) //check if it's legal if not restart
    h.add(i, t, start ? 0 : -1); //add the tile
    h.add(gs.s * gs.s - 1 - i, flip(t), start ? 1 : -1); //okay generate the mathcing fliped tile in the sq - position
  }


  if (cen) h.add(Math.floor((gs.s * gs.s) / 2), 31, -1);
  add_r(23, true);
  ex.forEach(t => add_r(t));

  return gs;
}

function h_gsc(gso) {
  //so make a shallow clone
  gs={...gso};
  //are reclone some dynamic bits deeper
  gs.tls=[...gso.tls];
  gs.own=[...gso.own];
  gs.p[0].ft=[...gso.p[0].ft];
  gs.p[1].ft=[...gso.p[1].ft];
  return h_gs(gs);
}

function h_gs(gs) {

  let checkOwn = (i) => {
    if (gs.own[i] >= 0) return; //we already have a colour
    cq = [];
    let cs = (j) => {
      if (gs.tls[j] == 0) return; //doesn't matter
      if (gs.own[j] >= 0)
        gs.own[i] = gs.own[j]; //we found one colour me for him
      else //this might change things for another area
        cq.push(j);
    }
    let t = gs.tls[i];
    if (t & 1) cs(i - gs.s);
    if (t & 2) cs(i + 1);
    if (t & 4) cs(i + gs.s);
    if (t & 8) cs(i - 1);
    if (gs.own[i] >= 0) cq.forEach(d => checkOwn(d)); //we are alive now recursively check surrounds
  }


  let calcS=() => {
    let tot = gs.tls.reduce((a, t) => a+((t & 16) ? 2 : 2), 0);
    let calc = (p) => gs.tls.reduce((a, t, i) => a+((gs.own[i] == p) ? ((t & 16) ? 10 : 2) : 0), 0)

    gs.p[0].sc = Math.round(calc(0) * 100 / tot);
    gs.p[1].sc = Math.round(calc(1) * 100 / tot);
    if (gs.p[0].sc>50) gs.winner=0;
    if (gs.p[1].sc>50) gs.winner=1;
    if (gs.dCnt>4) gs.winner=(gs.p[0].sc>gs.p[1].sc)?0:1; //if we all discard 5 times the leader wins

  }

  let add = (i, t, o) => {
    gs.tls[i] = t;
    gs.own[i] = o;
    checkOwn(i);
    calcS();
  };


  let checkTile = (i, xo, yo, path, bit, own) => { //return +1 if tile is okay; -10 if tile is impossible or 0 if tile is open
    let xp = i % gs.s + xo,
      yp = Math.floor(i / gs.s) + yo;
    if ((xp < 0) || (xp >= gs.s) || (yp < 0) || (yp >= gs.s)) return path ? -10 : 0;
    let t = gs.tls[i + xo + yo * gs.s];
    if (!t) return 0; //complete tiles don't hold space either way
    let o = gs.own[i + xo + yo * gs.s];
    if (path && (o != own) && (o >= 0)) return -10; //it's owned by my enemy
    let isP = (t & bit);
    return ((!!isP) == (!!path)) ? 1 : -10;
  }


  let canPlay = (i, t, o) => {
    if (gs.tls[i] != 0) return false; //already something there
    //check if I can play
    return (checkTile(i, 0, -1, t & 1, 4, o) + checkTile(i, 0, 1, t & 4, 1, o) + checkTile(i, 1, 0, t & 2, 8, o) + checkTile(i, -1, 0, t & 8, 2, o)) >= 0;
  }
  let canPlace = (i, t, o) => {
    if (gs.tls[i] != 0) return false; //already something there
    //check if I can place here
    return (checkTile(i, 0, -1, t & 1, 4, o) + checkTile(i, 0, 1, t & 4, 1, o) + checkTile(i, 1, 0, t & 2, 8, o) + checkTile(i, -1, 0, t & 8, 2, o)) >= 0;
  }

  let legalM=(ntl,pn)=>
      gs.tls.map((t, i) => canPlay(i, ntl, pn)?i:-1).filter(i=>(i>=0));

  return {
    add,
    canPlay,
    legalM,
    canPlace,
    checkOwn,
    gs,
  }
}

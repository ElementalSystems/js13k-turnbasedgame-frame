function m_gs(s, bs) {
  let flip=(n)=>{ //utility to mirror a tile code
    x = ((n >> 1) ^ (n >> 3)) & 1;
    y = ((n >> 0) ^ (n >> 2)) & 1;
    return n ^ ((x << 1) | (x << 3))^ ((y << 0) | (y << 2));
  }
  let ts = bs.sort(() => (Math.random() - .5))
  let gs = {
    tn: 0, //turn number
    s: s,
    tls: new Array(s * s).fill(0), //tiles that are the current board
    own: new Array(s * s).fill(-1), //ownership of board
    ft: [ts, ts.map(n => flip(n))], //upcoming list of tiles for two players invert one player list
  }

  let h=h_gs(gs);
  h.add(40,31,-1);
  h.add(27,23,0);
  h.add(53-18,29,1);
  return gs;
}

function h_gs(gs) {

  let checkOwn=(i)=>{
    if (gs.own[i]>=0) return; //we already have a colour
    cq=[];
    let cs=(j)=> {
      if (gs.tls[j]==0) return; //doesn't matter
      if (gs.own[j]>=0)
        gs.own[i]=gs.own[j]; //we found one colour me for him
      else //this might change things for another area
        cq.push(j);
    }
    let t=gs.tls[i];
    if (t&1) cs(i-gs.s);
    if (t&2) cs(i+1);
    if (t&4) cs(i+gs.s);
    if (t&8) cs(i-1);
    if (gs.own[i]>=0) cq.forEach(d => checkOwn(d)); //we are alive now recursively check surrounds
  }

  let add=(i, t, o) => {
    gs.tls[i] = t;
    gs.own[i] = o;
    checkOwn(i);
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
    return (checkTile(i, 0, -1, t & 1, 4, o) + checkTile(i, 0, 1, t & 4, 1, o) + checkTile(i, 1, 0, t & 2, 8, o) + checkTile(i, -1, 0, t & 8, 2, o)) > 0;
  }

  return {
    add,
    canPlay,
    checkOwn,
  }
}

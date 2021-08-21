function mk_brd(gs) {
  let grid_c = null;

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

  let update = () => { //set up grid
    gecl('gamebrd', 'p1', gs.tn%2);

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


  //make the game grid
  let gg = new Array(gs.s * (gs.s + 2)).fill(0).map((d, i) => {
    let t = clone('gamebrd', 'tile')
    posTile(t, i);
    t.onclick = () => {
      if (grid_c) grid_c(i);
    }
    return t;
  });



  return {
    setT:(i,t,o,ht)=>setTile(gg[i],t,o,ht),
    setClk: (f)=>{grid_c=f},
    update,
  }
}

function brd(gs) {
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

  return {
    posTile,
    setTile,
  }
}

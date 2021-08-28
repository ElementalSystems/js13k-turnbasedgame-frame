function mk_brd(gs) {
  let grid_c = null;

  let setTile = (t, b, c, ht, g) => {
    for (i = 0; i < 5; i += 1) {
      t.classList.toggle('l' + i, b & (1 << i));
      t.classList.toggle('g' + i, g >= i);
    }
    t.classList.toggle('p0', c == 0);
    t.classList.toggle('p1', c == 1);
    t.classList.toggle('ht', !!ht);
  }

  let posTile = (t, i) => {
    let x = (i % gs.s),
      y = Math.floor(i / gs.s)
    if (y >= gs.s) {
      t.classList.toggle('pq' + x, true);
      t.classList.toggle('pq', true);
      t.style.transform = 'translateZ(' + ((x ? 0 : 10) - x * x) + 'vh)';
      t.style.opacity = x?.5:1;

      if (y == gs.s) x = -1.5;
      if (y == (gs.s + 1)) x = gs.s + .5;
      y = (i % gs.s) * 1.1 + 2;

    }
    t.style.left = (x * 100 / gs.s) + "%";
    t.style.top = (y * 100 / gs.s) + "%";
    t.style.width = t.style.height = (100 / gs.s) + "%";

    return t;
  }

  let update = () => { //set up grid
    gecl('gamebrd', 'p1', gs.tn % 2);
    gecl('gamebrd', 'p0', !(gs.tn % 2));

    gs.p.forEach((p, i) => {
      ge_qs('p' + i, 'h2').textContent = p.n;
      ge_qs('p' + i, 'h3').textContent = p.sc + "%";
    })


    gg.forEach((t, i) => {
      posTile(t,i);
      if (i < gs.s * gs.s)
        setTile(t, gs.tls[i], gs.own[i]); //main rack
      else if (i - gs.s < gs.s * gs.s) {
        setTile(t, gs.p[0].ft[i - gs.s * gs.s], -1); //p1 side
      } else {
        setTile(t, gs.p[1].ft[i - gs.s * gs.s - gs.s], -1); //p2 side
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

  let _sb = null;
  let setB = (t, tm) => {
    ge('gban').textContent = t;
    ge_gone('gban', false);
    clearTimeout(_sb);
    _sb = setTimeout(() => ge_gone('gban', 'true'), tm ? tm : 1000)
  }

  let animateM=(pn,i)=>{
    let si=gs.s * (gs.s + pn); //get the starting index
    gecl('gamebrd','slow', true); //set the transitions slow

    //reposition the all the tiles
    for (let c=0;c<gs.s;c+=1)
       posTile(gg[si+c],(c==0)?i:si+c-1);
    //wait for that
    setTimeout(()=>{
      //reset bam the tile down
      gg[si].style.transform = 'translateZ(-1vh)';
      setTimeout(()=>gecl('gamebrd','slow', false),1000); //go back to fast play
    },1000)

  }

  return {
    setT: (i, t, o, ht) => setTile(gg[i], t, o, ht),
    setClk: (f) => {
      grid_c = f
    },
    setB,
    flat: () => {
      gecl('gamebrd', 'p0', false);
      gecl('gamebrd', 'p1', false);
    },
    update,
    animateM,
  }
}

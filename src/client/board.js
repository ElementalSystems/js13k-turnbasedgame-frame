function mk_brd(gs) {
  let grid_c = null;

  let setTile = (t, b, c, ht, g) => {
    t.classList.toggle('ub', b == 0);    //unbroken
    t.classList.toggle('p0', c == 0);
    t.classList.toggle('p1', c == 1);
    t.classList.toggle('ht', !!ht);
    for (i = 0; i < 5; i += 1) {
      t.classList.toggle('l' + i, b & (1 << i));
    }
    //we may have to add some growth
    if (g>0&&(!t.g_lev)) {
      //add some leaves
      for (i = 0; i < 5; i += 1) {
        if (b&(1<<i)) {//we have this peice
          if (i==4) { //make a tree
            cloneM(t,'llev',4,'xx','ll').forEach((rig,i)=>{
              let l=rig.querySelector('svg');
              l.style.transform="rotateZ("+(i*90+Math.random()*30-15)+"deg) rotateX(-90deg)";
              //now add me some leaves to this branch
              cloneM(rig,'leaf',5,'p','hl').forEach((lf,i)=>{
                lf.style.transform="translateZ("+(Math.random()*50/gs.s)+"vh) rotateZ("+(Math.random()*360)+"deg)";
              });
            });
          } else //add three leaves
            cloneM(t,'leaf',3,'p','l'+i).forEach(lg=>{
              let l=lg.querySelector('svg');
              l.style.transform="translateY("+(-Math.random()*40)+"%) rotateZ("+(Math.random()*90-45)+"deg) rotateX("+(-Math.random()*45-10)+"deg)"
            });
        }
      }
      t.g_lev=g;
    }
    setTimeout(()=>{ //in a moment set the growth
      for (i = 0; i < 6; i += 1)
        t.classList.toggle('g' + i, g >= i);
    },10);
  }

  let posTile = (t, i) => {
    let x = (i % gs.s),
        y = Math.floor(i / gs.s);
    if (y >= gs.s) {
      t.classList.toggle('pq', true);
      t.classList.toggle('pq'+((y>gs.s)?'1':'0'), true);
      t.style.transform = 'translateZ(' + ((x ? 2 : 120/gs.s) - x) + 'vh)';
      t.style.opacity = x?.5:1;

      if (y == gs.s) x = -1.2;
      if (y == (gs.s + 1)) x = gs.s + .2;
      y = (i % gs.s) * 1.1 + 2;
    }
    if (i<0) {//discard move
      x=gs.s/2;
      y=+20;
    }
    t.style.left = (x * 100 / gs.s) + "%";
    t.style.top = (y * 100 / gs.s) + "%";
    t.style.width = t.style.height = (100 / gs.s) + "%";
    return t;
  }

  let update = () => { //set up grid

    gs.p.forEach((p, i) => {
      ge_qs('p' + i, 'h2').textContent = p.n;
      ge_qs('p' + i, 'h3').textContent = p.sc + "%";
    })

    gg.forEach((t, i) => {
      posTile(t,i);
      if (i < gs.s * gs.s)
        setTile(t, gs.tls[i], gs.own[i],false,gs.tg[i]); //main rack
      else if (i - gs.s < gs.s * gs.s) {
        setTile(t, gs.p[0].ft[i - gs.s * gs.s], -1); //p1 side
      } else {
        setTile(t, gs.p[1].ft[i - gs.s * gs.s - gs.s], -1); //p2 side
      }
    });
  }


  //make the game grid
  ge('gamebrd').innerHTML='';
  let gg = new Array(gs.s * (gs.s + 2)).fill(0).map((d, i) => {
    let t = clone('gamebrd', 'tile');
    if (gs.txt[i]) t.querySelector('span').textContent=gs.txt[i];
    t.style.transform="rotateY("+(Math.random()*4-2)+"deg) rotateX("+(Math.random()*4-2)+"deg) rotateZ("+(Math.random()*4-2)+"deg)";
    cloneM(t,['crack1','crack2'],4,'l','ex')
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
    ae.slide();
    //reposition the all the tiles
    for (let c=0;c<gs.s;c+=1)
       posTile(gg[si+c],(c==0)?i:si+c-1);
    //wait for that
    setTimeout(()=>{
      //bam the tile down
      gg[si].style.transform = 'translateZ(.5vh)';
      ae.crack();
      setTimeout(()=>gecl('gamebrd','slow', false),1000); //go back to fast play
    },1000)

  }

  let flat=(p)=> {
    p?ae.flt_out():ae.flt_in();
    gecl('game', 'isI', !!gs.isI);
    gecl('game', 'p1', p&&(gs.tn % 2));
    gecl('game', 'p0', p&&(!(gs.tn % 2)));
  };

  return {
    setT: (i, t, o, ht) => setTile(gg[i], t, o, ht),
    setClk: (f) => {
      grid_c = f
    },
    setB,
    flat,
    update,
    animateM,
  }
}

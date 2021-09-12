function _init_lobby() {
  let mp_bt = null;

  let _msgT = null;
  let waitMsg = (f) => {
    _msgT = f;
  }

  let socket = null
  try {
    socket = io({
        upgrade: false,
        transports: ["websocket"]
      });
    socket.on("connect", () => {});
    socket.on("lobby", (data) => {
      let op_m = data.available.filter(u => (u.nick != ge('nick').value))
        .map(u => ({
          t: 'Play with ' + u.nick,
          lt: u.level,
          u,
          em: '🔗',
        }));
      menu("Player vs Player Online: Select Opponent", true, op_m, (op, i) => {
        socket.emit("reqstart", {
          opponent: op.u.id
        })
      })
    });

    socket.on("disconnect", () => {});

    socket.on("gm", (msg) => {
      let t = _msgT;
      _msgT = null; //clear this listener
      if (t) t(msg);
    });

    socket.on("playstart", (d) => {
      let op = {
        n: d.op,
        t: 'r',
      }
      let tp = {
        n: ge('nick').value,
        t: 'l',
      }

      if (d.lead) { //if d.lead init your game
        let gs = m_gs(mp_bt.bs, mp_bt.bs % 2, mp_bt.it, mp_bt.dt, tp, op);
        msg(gs);
        startGame(gs);
      } else {
        waitMsg(gs => { //we expect to get a game state first
          gs.p[0].t = 'r'; //overwrite the players in reverse and play our side
          gs.p[1].t = 'l';
          startGame(gs)
        })
      }

    });

    socket.on("playend", () => {
      gamedone();
    });

    socket.on("error", () => {});
  } catch (e) {
    //no socket no problem we don't do multi player
  }


  let msg = (m) => {
    socket.emit("gm", m)
  }

  geclk("bck", () => {
    ae.discard();
    leave_mp();

  });


  menu = (title, showB, ops, act) => {
    ge('menu').innerHTML = '';
    ge_qs('bot', 'legend').textContent = title;
    ops.forEach((op, i) => {
      let b = clone('menu', 'menui');
      qs_txt(b, 'h1', op.em);
      qs_txt(b, 'h2', op.t);
      qs_txt(b, 'h3', op.lt);
      b.onclick = () => {
        ae.clk(); //audio click
        act(op, i);
      };
    })
    ge_gone('bck', !showB)

  }

  let enter_mp = (bt) => {
    mp_bt = bt;
    socket.emit("el", {
      nick: ge('nick').value,
      level: bt.t,
    });
    ge_no('top', true);
  }

  leave_mp = () => {
    if (mp_bt) socket.emit("ll", {})
    mp_bt = null;
    reset();
  }

  gamedone = () => {
    if (mp_bt) socket.emit("reqend");
    document.body.classList.toggle('ms', true);
  }

  reset = () => {
    document.body.classList.toggle('ms', true);
    ge_gone('top', false);
    menu("Select Game Type", false, m_main, (mi, go) => {
      switch (go) {
        case 0:
          startGame(m_gs(5,true,[23,21,26],[3, 6, 12, 5, 11, 7, 5, 10, 14, 15, 15, 13, 3, 6, 9, 12,7,5],
             { n: ge('nick').value,  t: 'l'},{  n: "Teacher",t: "a", hlp:1, pp: { s:0, o:0, p:-2, r:1, d:0 }}));
          break;
        case 1:
          menu("Player vs Computer: Board Type", true, m_gt, (bt, i) => {
            menu("Player vs Computer: Opponent", true, m_ais, (ai, i) => {
              p1 = {
                n: ge('nick').value,
                t: 'l'
              };
              p2 = {
                n: ai.t,
                t: 'a',
                pp: ai.pp,
              };
              startGameD(bt, p1, p2);
            })
          })
          break;
        case 2:
          menu("Player vs Player Local: Board Type", true, m_gt, (bt, i) => {
            p1 = {
              n: ge('nick').value,
              t: 'l'
            };
            p2 = {
              n: 'Player 2',
              t: 'l'
            };
            startGameD(bt, p1, p2);
          })
          break;
        case 3:
          menu("Player vs Player Online: Board Type", true, m_gt, (bt, i) => {
            enter_mp(bt);
          })
          break;
      }
    })


  }



  return {
    waitMsg,
    msg,
    menu,
    enter_mp,
    reset,
    gamedone,
  }
};

var lobby = null;

function start_lobby() {
  if (!lobby)
    lobby = _init_lobby();

  ge('nick').value =  oneof(['Ficus','Bigno','Loni','Wist','Hede'])+oneof(['cena','spernum','viren','teria','ra'])+' '+
                       oneof(['Tricus','Radin','Mader','Iber','Rom'])+oneof(['ika','canna','bea'])+(+(new Date()) % 100);

  //set up the intro board
  let ig=m_gs(7,'intro');
  let ib=mk_brd(ig);
  ib.update();
  ib.flat(false);


  lobby.menu("Welcome to A Space in the Sun", false, [{
    t: "GROW",
    lt: "Tap here to begin",
    em: '🌱'
  }], () => {
    if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen();
    if (document.documentElement.webkitRequestFullscreen) document.documentElement.webkitRequestFullscreen();

    ig.own.forEach((_,i)=>{
      ig.own[i]=(i<20)?0:1;
      ig.tg[i]=1;
    })
    setTimeout(()=>{
      ib.update();
      ib.flat(true);
      setTimeout(()=>{
        ig.own.forEach((_,i)=>{
          ig.tg[i]=2;
        })
        ib.update();
      },500);
    },500);

    lobby.reset();
  });


}

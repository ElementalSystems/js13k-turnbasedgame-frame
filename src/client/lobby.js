function _init_lobby() {

  let mp_bt=null;

  let socket = io({
      upgrade: false,
      transports: ["websocket"]
    }),
    board = document.getElementById("board");

  socket.on("connect", () => {});
  socket.on("lobby", (data) => {
    let op_m=data.available.filter(u=>(u.nick != ge('nick').value))
                           .map(u=>({
                             t: 'Play with ' + u.nick,
                             lt: u.level,
                             u,
                             em: '🔗',
                           }));
     menu("Player vs Player Online: Select Opponent",op_m,(op,i)=>{
       socket.emit("reqstart", { opponent: op.u.id  })
     })
  });


  socket.on("disconnect", () => {});

  let _msgT = null;

  socket.on("gm", (msg) => {
    let t=_msgT;
    _msgT=null; //clear this listener
    if (t) t(msg);
  });


  let waitMsg = (f) => {
    _msgT = f;
  }


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
      let gs=m_gs(mp_bt.bs,mp_bt.bs%2,mp_bt.it,mp_bt.dt,tp,op);
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
    ge_gone('lobby', false);
    endGame();
  });


  socket.on("error", () => {});

  geclk("bck", () => {
    leave_mp();

  });

  let msg = (m) => {
    socket.emit("gm", m)
  }

  menu=(title,ops,act)=>{
    ge('menu').innerHTML = '';
    ge_qs('bot','legend').textContent=title;
    ops.forEach((op,i)=>{
      let b = clone('menu', 'menui');
      qs_txt(b,'h1',op.em);
      qs_txt(b,'h2',op.t);
      qs_txt(b,'h3',op.lt);
      b.onclick = () => { act(op,i);  };
    })

  }

  let enter_mp=(bt)=>
  {
    mp_bt=bt;
    socket.emit("el", {
      nick: ge('nick').value,
      level: bt.t,
    });
    ge_no('top', true);
  }

  leave_mp=()=>{
    if (mp_bt)  socket.emit("ll", {})
    mp_bt=null;
    reset();
  }

  gamedone=()=>{
    if (mp_bt) socket.emit("reqend");
    ge_gone('lobby', false);
    ge_gone('game', true);
  }

  reset=()=>{
    ge_gone('lobby', false);
    menu("Choose your Style",m_main,(mi,go)=>{
      switch (go) {
        case 1:
          menu("Player vs Computer: Board Type",m_gt,(bt,i)=>{
            menu("Player vs Computer: Opponent",m_ais,(ai,i)=>{
              p1={ n: ge('nick').value, t:'l'};
              p2={ n: ai.t , t:'a'};
              startGameD(bt,p1,p2);
            })
          })
          break;
        case 2:
          menu("Player vs Player Local: Board Type",m_gt,(bt,i)=>{
            p1={ n: ge('nick').value, t:'l'};
            p2={ n: 'Player 2', t:'l'};
            startGameD(bt,p1,p2);
          })
          break;
        case 3:
          menu("Player vs Player Online: Board Type",m_gt,(bt,i)=>{
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

  ge('nick').value = "user" + (+(new Date()) % 10000);

  lobby.reset();

}

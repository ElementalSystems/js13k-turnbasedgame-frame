function _init_lobby() {

  let socket = io({
      upgrade: false,
      transports: ["websocket"]
    }),
    board = document.getElementById("board");

  ge('nick').value = "user" + (+(new Date()) % 10000);


  socket.on("connect", () => {});
  socket.on("lobby", (data) => {
    board.innerHTML = '';
    data.available.forEach((u) => {
      if (u.nick == ge('nick').value) return;
      let b = clone('board', 'brde');
      b.textContent = 'Start Game with: ' + u.nick + ' - [' + u.level + ']';
      b.onclick = () => {
        socket.emit("reqstart", {
          opponent: u.id
        })
      };
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
    ge_gone('lobby', true);
    let op = {
      n: d.op,
      t: 'r',
    }
    let tp = {
      n: ge('nick').value,
      t: 'l',
    }

    if (d.lead) { //if d.lead init your game
      let gs = m_gs(9, true, [23, 21, 26], [3, 6, 12, 5, 11, 7, 5, 10, 14, 15, 15, 13, 3, 6, 9, 12, 7, 5], tp, op);
      msg(gs);
      console.log(gs);
      startGame(gs);
    } else {
      waitMsg(gs => { //we expect to get a game state first
        gs.p[0].t = 'r'; //overwrite the players in reverse and play our side
        gs.p[1].t = 'l';
        console.log(gs);
        startGame(gs)
      })
    }

  });

  socket.on("playend", () => {
    ge_gone('lobby', false);
    endGame();
  });




  socket.on("error", () => {});

  geclk("enter", () => {
    socket.emit("el", {
      nick: ge('nick').value,
      level: ge('lev').value
    })
    ge_no('top', true);
    ge_no('bot', false);
  });

  geclk("leave", () => {
    socket.emit("ll", {})
    ge_no('top', false);
    ge_no('bot', true);
  });

  let msg = (m) => {
    console.log(m);
    socket.emit("gm", m)
  }


  return {
    waitMsg,
    msg,
  }
};

var lobby = null;

function start_lobby() {
  if (!lobby)
    lobby = _init_lobby();
  ge_gone('lobby', false);
}

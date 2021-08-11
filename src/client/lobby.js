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
      let b = clone('board','brde');
      b.textContent = 'Start Game with: ' + u.nick + ' - [' + u.level + ']';
      b.onclick = () => {
        socket.emit("reqstart", {
          opponent: u.id
        })
      };
    })
  });


  socket.on("disconnect", () => {});

  socket.on("playstart", (d) => {
    ge_gone('lobby',true);
    startGame(d.lead,
      (msg) => {
        socket.emit("gamemsg", msg);
      },
      (msg) => {
        socket.emit("reqend");
      }
    );
  });

  socket.on("playend", () => {
    ge_gone('lobby',false);
    endGame();
  });

  socket.on("gamemsg", (msg) => {
    msgGame(msg);
  });

  socket.on("error", () => {});

  geclk("enter", () => {
    socket.emit("el", {
      nick: ge('nick').value,
      level: ge('lev').value
    })
    ge_no('top',true);
    ge_no('bot',false);
  });

  geclk("leave", () => {
    socket.emit("ll", {
    })
    ge_no('top',false);
    ge_no('bot',true);
  });

};

var _lobby_up = false;
function start_lobby() {
  if (!_lobby_up)
    _init_lobby();
  _lobby_up = true;
  ge_gone('lobby', false);
}

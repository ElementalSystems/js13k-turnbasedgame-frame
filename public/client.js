let isLead = 0;

let gameState = {
    turn: 1,
    id: "lobby-test"
};

function startGame(lead, gamemsg, gameend) {
    let gb = document.getElementById("game");
    gb.classList.toggle("gone", false);
    isLead = lead ? 1 : 0;
    geclk("next", () => {
        gameState.turn += 1;
        gamemsg(gameState);
        updateBoard();
    });
    geclk("end", () => {
        gameend();
    });
    if (lead) {
        gameState.turn = 1;
        gameState.initTime = +new Date();
        gamemsg(gameState);
        updateBoard();
    }
}

function msgGame(data) {
    gameState = data;
    updateBoard();
}

function endGame() {
    gb = document.getElementById("game").classList.toggle("gone", true);
}

function updateBoard() {
    document.getElementById("gamestatus").textContent = JSON.stringify(gameState);
    document.getElementById("next").disabled = !((gameState.turn + isLead) % 2);
}

function _init_lobby() {
    let socket = io({
        upgrade: false,
        transports: [ "websocket" ]
    }), board = document.getElementById("board");
    ge("nick").value = "user" + +new Date() % 1e4;
    socket.on("connect", () => {});
    socket.on("lobby", data => {
        board.innerHTML = "";
        data.available.forEach(u => {
            if (u.nick == ge("nick").value) return;
            let b = clone("board", "brde");
            b.textContent = "Start Game with: " + u.nick + " - [" + u.level + "]";
            b.onclick = () => {
                socket.emit("reqstart", {
                    opponent: u.id
                });
            };
        });
    });
    socket.on("disconnect", () => {});
    socket.on("playstart", d => {
        ge_gone("lobby", true);
        startGame(d.lead, msg => {
            socket.emit("gamemsg", msg);
        }, msg => {
            socket.emit("reqend");
        });
    });
    socket.on("playend", () => {
        ge_gone("lobby", false);
        endGame();
    });
    socket.on("gamemsg", msg => {
        msgGame(msg);
    });
    socket.on("error", () => {});
    geclk("enter", () => {
        socket.emit("el", {
            nick: ge("nick").value,
            level: ge("lev").value
        });
        ge_no("top", true);
        ge_no("bot", false);
    });
    geclk("leave", () => {
        socket.emit("ll", {});
        ge_no("top", false);
        ge_no("bot", true);
    });
}

var _lobby_up = false;

function start_lobby() {
    if (!_lobby_up) _init_lobby();
    _lobby_up = true;
    ge_gone("lobby", false);
}

function init() {
    start_lobby();
}

let ge = id => document.getElementById(id);

let gecl = (id, c, s) => ge(id).classList.toggle(c, s);

let geclk = (id, f) => ge(id).onclick = f;

let ge_gone = (id, s) => gecl(id, "gone", s);

let ge_no = (id, s) => gecl(id, "no", s);

let clone = (pid, tempid) => {
    console.log(pid, tempid);
    let clone = document.querySelector("#" + tempid).content.firstElementChild.cloneNode(true);
    ge(pid).appendChild(clone);
    return clone;
};
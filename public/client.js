let isLead = 0;

function startGameMulti(lead, gamemsg, gameend) {
    let gb = document.getElementById("game");
    gb.classList.toggle("gone", false);
    isLead = lead ? 1 : 0;
    if (lead) {
        gameState.turn = 1;
        gameState.initTime = +new Date();
        gamemsg(gameState);
        updateBoard();
    }
}

function msgGame(data) {}

function endGame() {}

function updateBoard() {}

function startGame() {
    grid_c = i => {
        console.log("Grid element " + i);
    };
    let _gs = 7;
    let setTile = (t, b, c, ht) => {
        for (i = 0; i < 5; i += 1) {
            if (b & 1 << i) t.classList.add("l" + i);
        }
        t.classList.toggle("p1", c == 0);
        t.classList.toggle("p2", c == 1);
        t.classList.toggle("ht", !!ht);
    };
    let posTile = (t, i) => {
        let x = i % _gs, y = Math.floor(i / _gs);
        if (y == _gs) x = -1.5;
        if (y == _gs + 1) x = _gs + .5;
        if (y >= _gs) y = i % _gs * 1.2 + .3;
        t.style.left = x * 100 / _gs + "%";
        t.style.top = y * 100 / _gs + "%";
        t.style.width = t.style.height = 100 / _gs + "%";
        return t;
    };
    ge_gone("game", false);
    let bs = [ 7, 11, 7, 14, 15, 15, 13, 3, 6, 9 ];
    console.log(bs);
    console.log(bs.map(n => {
        x = (n >> 1 ^ n >> 3) & 1;
        return n ^ (x << 1 | x << 3);
    }));
    let gs = {
        tn: 0,
        tls: new Array(_gs * _gs).fill(0),
        own: new Array(_gs * _gs).fill(-1),
        ft: [ bs, bs.map(n => {
            x = (n >> 1 ^ n >> 3) & 1;
            return n ^ (x << 1 | x << 3);
        }) ]
    };
    gs.tls[40] = 31;
    gs.tls[27] = 23;
    gs.own[27] = 0;
    gs.tls[53 - 18] = 29;
    gs.own[53 - 18] = 1;
    let gg = new Array(_gs * (_gs + 2)).fill(0).map((d, i) => {
        let t = clone("gamebrd", "tile");
        posTile(t, i);
        t.onclick = () => grid_c(i);
        return t;
    });
    gg.forEach((t, i) => {
        if (i < _gs * _gs) setTile(t, gs.tls[i], gs.own[i]); else if (i - _gs < _gs * _gs) {
            setTile(t, gs.ft[0][i - _gs * _gs], -1);
        } else {
            setTile(t, gs.ft[1][i - _gs * _gs - _gs], -1);
        }
    });
    let checkTile = (i, xo, yo, path, bit) => {
        let xp = i % _gs + xo, yp = Math.floor(i / _gs) + yo;
        if (xp < 0 || xp >= _gs || yp < 0 || yp >= _gs) return path ? -10 : 0;
        let t = gs.tls[i + xo + yo * _gs];
        if (!t) return 0;
        let isP = t & bit;
        return !!isP == !!path ? 1 : -10;
    };
    let canPlay = (i, t) => {
        if (gs.tls[i] != 0) return false;
        return checkTile(i, 0, -1, t & 1, 4) + checkTile(i, 0, 1, t & 4, 4) + checkTile(i, 1, 0, t & 2, 8) + checkTile(i, -1, 0, t & 8, 2) > 0;
    };
    let doTurn = () => {
        let pn = gs.tn % 2;
        let ntl = gs.ft[pn][0];
        gecl("gamebrd", "p1", pn);
        gs.tls.forEach((t, i) => {
            if (canPlay(i, ntl)) setTile(gg[i], ntl, -1, true);
        });
    };
    doTurn();
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
    startGame();
}

let ge = id => document.getElementById(id);

let gecl = (id, c, s) => ge(id).classList.toggle(c, s);

let geclk = (id, f) => ge(id).onclick = f;

let ge_gone = (id, s) => gecl(id, "gone", s);

let ge_no = (id, s) => gecl(id, "no", s);

let clone = (pid, tempid) => {
    let clone = document.querySelector("#" + tempid).content.firstElementChild.cloneNode(true);
    ge(pid).appendChild(clone);
    return clone;
};
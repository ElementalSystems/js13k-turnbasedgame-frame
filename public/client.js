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
    let grid_c = null;
    let _gs = 9;
    ge_gone("game", false);
    let gs = m_gs(_gs, [ 11, 7, 5, 10, 14, 15, 15, 13, 3, 6, 9, 12, 7, 5 ]);
    let gsh = h_gs(gs);
    let setTile = (t, b, c, ht) => {
        for (i = 0; i < 5; i += 1) t.classList.toggle("l" + i, b & 1 << i);
        t.classList.toggle("p1", c == 0);
        t.classList.toggle("p2", c == 1);
        t.classList.toggle("ht", !!ht);
    };
    let posTile = (t, i) => {
        let x = i % gs.s, y = Math.floor(i / gs.s);
        if (y == gs.s) x = -1.5;
        if (y == gs.s + 1) x = gs.s + .5;
        if (y >= gs.s) y = i % gs.s * 1.2 + .3;
        t.style.left = x * 100 / gs.s + "%";
        t.style.top = y * 100 / gs.s + "%";
        t.style.width = t.style.height = 100 / gs.s + "%";
        return t;
    };
    let gg = new Array(gs.s * (gs.s + 2)).fill(0).map((d, i) => {
        let t = clone("gamebrd", "tile");
        posTile(t, i);
        t.onclick = () => {
            if (grid_c) grid_c(i);
        };
        return t;
    });
    let updateBoard = () => {
        gg.forEach((t, i) => {
            if (i < gs.s * gs.s) setTile(t, gs.tls[i], gs.own[i]); else if (i - gs.s < gs.s * gs.s) {
                setTile(t, gs.ft[0][i - gs.s * gs.s], -1);
            } else {
                setTile(t, gs.ft[1][i - gs.s * gs.s - gs.s], -1);
            }
        });
    };
    let doTurn = () => {
        updateBoard();
        let pn = gs.tn % 2;
        let ntl = gs.ft[pn][0];
        gecl("gamebrd", "p1", pn);
        gs.tls.forEach((t, i) => {
            if (gsh.canPlay(i, ntl, pn)) setTile(gg[i], ntl, -1, true);
        });
        grid_c = i => {
            gsh.add(i, ntl, -1);
            gs.tn += 1;
            gs.ft[pn].shift();
            doTurn();
        };
    };
    doTurn();
}

function m_gs(s, bs) {
    let flip = n => {
        x = (n >> 1 ^ n >> 3) & 1;
        y = (n >> 0 ^ n >> 2) & 1;
        return n ^ (x << 1 | x << 3) ^ (y << 0 | y << 2);
    };
    let ts = bs.sort(() => Math.random() - .5);
    let gs = {
        tn: 0,
        s: s,
        tls: new Array(s * s).fill(0),
        own: new Array(s * s).fill(-1),
        ft: [ ts, ts.map(n => flip(n)) ]
    };
    let h = h_gs(gs);
    h.add(40, 31, -1);
    h.add(27, 23, 0);
    h.add(53 - 18, 29, 1);
    return gs;
}

function h_gs(gs) {
    let checkOwn = i => {
        if (gs.own[i] >= 0) return;
        cq = [];
        let cs = j => {
            if (gs.tls[j] == 0) return;
            if (gs.own[j] >= 0) gs.own[i] = gs.own[j]; else cq.push(j);
        };
        let t = gs.tls[i];
        if (t & 1) cs(i - gs.s);
        if (t & 2) cs(i + 1);
        if (t & 4) cs(i + gs.s);
        if (t & 8) cs(i - 1);
        if (gs.own[i] >= 0) cq.forEach(d => checkOwn(d));
    };
    let add = (i, t, o) => {
        gs.tls[i] = t;
        gs.own[i] = o;
        checkOwn(i);
    };
    let checkTile = (i, xo, yo, path, bit, own) => {
        let xp = i % gs.s + xo, yp = Math.floor(i / gs.s) + yo;
        if (xp < 0 || xp >= gs.s || yp < 0 || yp >= gs.s) return path ? -10 : 0;
        let t = gs.tls[i + xo + yo * gs.s];
        if (!t) return 0;
        let o = gs.own[i + xo + yo * gs.s];
        if (path && o != own && o >= 0) return -10;
        let isP = t & bit;
        return !!isP == !!path ? 1 : -10;
    };
    let canPlay = (i, t, o) => {
        if (gs.tls[i] != 0) return false;
        return checkTile(i, 0, -1, t & 1, 4, o) + checkTile(i, 0, 1, t & 4, 1, o) + checkTile(i, 1, 0, t & 2, 8, o) + checkTile(i, -1, 0, t & 8, 2, o) > 0;
    };
    return {
        add: add,
        canPlay: canPlay,
        checkOwn: checkOwn
    };
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
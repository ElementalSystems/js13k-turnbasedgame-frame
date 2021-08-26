function mk_brd(gs) {
    let grid_c = null;
    let setTile = (t, b, c, ht) => {
        for (i = 0; i < 5; i += 1) t.classList.toggle("l" + i, b & 1 << i);
        t.classList.toggle("p0", c == 0);
        t.classList.toggle("p1", c == 1);
        t.classList.toggle("ht", !!ht);
    };
    let posTile = (t, i) => {
        let x = i % gs.s, y = Math.floor(i / gs.s);
        if (y == gs.s) x = -1.5;
        if (y == gs.s + 1) x = gs.s + .5;
        if (y >= gs.s) {
            y = i % gs.s * 1.2 + .3;
        }
        t.style.left = x * 100 / gs.s + "%";
        t.style.top = y * 100 / gs.s + "%";
        t.style.width = t.style.height = 100 / gs.s + "%";
        return t;
    };
    let update = () => {
        gecl("gamebrd", "p1", gs.tn % 2);
        gecl("gamebrd", "p0", !(gs.tn % 2));
        gs.p.forEach((p, i) => {
            ge_qs("p" + i, "h2").textContent = p.n;
            ge_qs("p" + i, "h3").textContent = p.sc + "%";
        });
        gg.forEach((t, i) => {
            if (i < gs.s * gs.s) setTile(t, gs.tls[i], gs.own[i]); else if (i - gs.s < gs.s * gs.s) {
                setTile(t, gs.p[0].ft[i - gs.s * gs.s], -1);
            } else {
                setTile(t, gs.p[1].ft[i - gs.s * gs.s - gs.s], -1);
            }
        });
    };
    let gg = new Array(gs.s * (gs.s + 2)).fill(0).map((d, i) => {
        let t = clone("gamebrd", "tile");
        posTile(t, i);
        t.onclick = () => {
            if (grid_c) grid_c(i);
        };
        return t;
    });
    let _sb = null;
    let setB = (t, tm) => {
        ge("gban").textContent = t;
        ge_gone("gban", false);
        clearTimeout(_sb);
        _sb = setTimeout(() => ge_gone("gban", "true"), tm ? tm : 1e3);
    };
    return {
        setT: (i, t, o, ht) => setTile(gg[i], t, o, ht),
        setClk: f => {
            grid_c = f;
        },
        setB: setB,
        flat: () => {
            gecl("gamebrd", "p0", false);
            gecl("gamebrd", "p1", false);
        },
        update: update
    };
}

function selTurn(gsh, bd, pn, p, ntl, mm) {
    let lm = gsh.legalM(ntl, pn);
    if (p.t == "l") {
        if (lm.length == 0) mm(-2);
        lm.forEach(i => bd.setT(i, ntl, -1, true));
        bd.setB("Select tile to crack", 2e3);
        bd.setClk(i => mm(i));
    }
    if (p.t == "r") {
        bd.setB("Waiting for " + p.n + " to play...", 6e4);
        lobby.waitMsg(m => mm(m.move));
    }
    if (p.t == "a") {
        if (lm.length == 0) mm(-2); else {
            let moves = lm.map(i => ({
                m: i,
                sc: ai_eval_mv(gsh.gs, p, i, ntl)
            })).sort((a, b) => a.sc - b.sc);
            setTimeout(() => mm(moves[0].m), 1e3 + Math.random() * 1e3);
        }
    }
}

function ai_eval_mv(gs, pn, p, i, t) {
    return Math.random();
}

function pubTurn(gsh, bd, pn, op, i, t) {
    if (op.t == "r") {
        lobby.msg({
            move: i
        });
    }
}

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

function startGame(gs) {
    ge_gone("game", false);
    let gsh = h_gs(gs);
    let bd = mk_brd(gs);
    bd.setB("Starting Game...", 3e3);
    let doTurn = () => {
        bd.update();
        if (gs.winner >= 0) {
            bd.setB(gs.p[gs.winner].n + " WON!", 5e3);
            return;
        }
        let pn = gs.tn % 2;
        let ntl = gs.p[pn].ft[0];
        bd.setB(gs.p[pn].n + "'s turn");
        selTurn(gsh, bd, pn, gs.p[pn], ntl, i => {
            pubTurn(gsh, bd, pn, gs.p[pn ? 0 : 1], i, ntl);
            bd.setClk(null);
            bd.update();
            if (i < 0) {
                bd.setB(gs.p[pn].n + ": Forced to Discarded");
                gs.dCnt = +1;
            } else {
                gs.dCnt = 0;
                bd.setB(gs.p[pn].n + ": played");
                bd.setT(i, ntl, -1, true);
                gsh.add(i, ntl, -1);
            }
            gs.tn += 1;
            gs.p[pn].ft.shift();
            bd.flat();
            setTimeout(doTurn, 1e3);
        });
    };
    doTurn();
}

function m_gs(s, cen, ex, bs, p0, p1) {
    let flip = n => {
        x = (n >> 1 ^ n >> 3) & 1;
        y = (n >> 0 ^ n >> 2) & 1;
        return n ^ (x << 1 | x << 3) ^ (y << 0 | y << 2);
    };
    let ts = new Array(5).fill(bs).flat().sort(() => Math.random() - .5);
    let gs = {
        tn: 0,
        s: s,
        winner: -1,
        tls: new Array(s * s).fill(0),
        own: new Array(s * s).fill(-1),
        p: [ {
            ...p0,
            ft: ts
        }, {
            ...p1,
            ft: ts.map(n => flip(n))
        } ]
    };
    let h = h_gs(gs);
    let add_r = (t, start) => {
        let i;
        do {
            i = Math.floor(Math.random() * gs.s * gs.s);
            if (start) i = Math.floor(i / gs.s) * gs.s;
        } while (!h.canPlace(i, t, start ? 0 : -1));
        h.add(i, t, start ? 0 : -1);
        h.add(gs.s * gs.s - 1 - i, flip(t), start ? 1 : -1);
    };
    if (cen) h.add(Math.floor(gs.s * gs.s / 2), 31, -1);
    add_r(23, true);
    ex.forEach(t => add_r(t));
    return gs;
}

function h_gsc(gso) {
    gs = {
        ...gso
    };
    gs.tls = [ ...gso.tls ];
    gs.own = [ ...gso.own ];
    gs.p[0].ft = [ ...gso.p[0].ft ];
    gs.p[1].ft = [ ...gso.p[1].ft ];
    return h_gs(gs);
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
    let calcS = () => {
        let tot = gs.tls.reduce((a, t) => a + (t & 16 ? 2 : 2), 0);
        let calc = p => gs.tls.reduce((a, t, i) => a + (gs.own[i] == p ? t & 16 ? 10 : 2 : 0), 0);
        gs.p[0].sc = Math.round(calc(0) * 100 / tot);
        gs.p[1].sc = Math.round(calc(1) * 100 / tot);
        if (gs.p[0].sc > 50) gs.winner = 0;
        if (gs.p[1].sc > 50) gs.winner = 1;
        if (gs.dCnt > 4) gs.winner = gs.p[0].sc > gs.p[1].sc ? 0 : 1;
    };
    let add = (i, t, o) => {
        gs.tls[i] = t;
        gs.own[i] = o;
        checkOwn(i);
        calcS();
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
        return checkTile(i, 0, -1, t & 1, 4, o) + checkTile(i, 0, 1, t & 4, 1, o) + checkTile(i, 1, 0, t & 2, 8, o) + checkTile(i, -1, 0, t & 8, 2, o) >= 0;
    };
    let canPlace = (i, t, o) => {
        if (gs.tls[i] != 0) return false;
        return checkTile(i, 0, -1, t & 1, 4, o) + checkTile(i, 0, 1, t & 4, 1, o) + checkTile(i, 1, 0, t & 2, 8, o) + checkTile(i, -1, 0, t & 8, 2, o) >= 0;
    };
    let legalM = (ntl, pn) => gs.tls.map((t, i) => canPlay(i, ntl, pn) ? i : -1).filter(i => i >= 0);
    return {
        add: add,
        canPlay: canPlay,
        legalM: legalM,
        canPlace: canPlace,
        checkOwn: checkOwn,
        gs: gs
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
    let _msgT = null;
    socket.on("gm", msg => {
        let t = _msgT;
        _msgT = null;
        if (t) t(msg);
    });
    let waitMsg = f => {
        _msgT = f;
    };
    socket.on("playstart", d => {
        ge_gone("lobby", true);
        let op = {
            n: d.op,
            t: "r"
        };
        let tp = {
            n: ge("nick").value,
            t: "l"
        };
        if (d.lead) {
            let gs = m_gs(9, true, [ 23, 21, 26 ], [ 3, 6, 12, 5, 11, 7, 5, 10, 14, 15, 15, 13, 3, 6, 9, 12, 7, 5 ], tp, op);
            msg(gs);
            console.log(gs);
            startGame(gs);
        } else {
            waitMsg(gs => {
                gs.p[0].t = "r";
                gs.p[1].t = "l";
                console.log(gs);
                startGame(gs);
            });
        }
    });
    socket.on("playend", () => {
        ge_gone("lobby", false);
        endGame();
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
    let msg = m => {
        console.log(m);
        socket.emit("gm", m);
    };
    return {
        waitMsg: waitMsg,
        msg: msg
    };
}

var lobby = null;

function start_lobby() {
    if (!lobby) lobby = _init_lobby();
    ge_gone("lobby", false);
}

function init() {
    let p1 = {
        n: "andrew",
        t: "l"
    };
    let p2 = {
        n: "Ran Dom ",
        t: "a"
    };
    let gs = m_gs(9, true, [ 23, 21, 26 ], [ 3, 6, 12, 5, 11, 7, 5, 10, 14, 15, 15, 13, 3, 6, 9, 12, 7, 5 ], p1, p2);
    startGame(gs);
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

let ge_qs = (id, qs) => ge(id).querySelector(qs);
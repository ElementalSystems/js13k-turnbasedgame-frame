function mk_brd(gs) {
    let grid_c = null;
    let setTile = (t, b, c, ht, g) => {
        t.classList.toggle("ub", b == 0);
        t.classList.toggle("p0", c == 0);
        t.classList.toggle("p1", c == 1);
        t.classList.toggle("ht", !!ht);
        for (i = 0; i < 5; i += 1) {
            t.classList.toggle("l" + i, b & 1 << i);
        }
        if (g > 0 && !t.g_lev) {
            for (i = 0; i < 5; i += 1) {
                if (b & 1 << i) {
                    if (i == 4) {
                        cloneM(t, "llev", 4, "xx", "ll").forEach((rig, i) => {
                            let l = rig.querySelector("svg");
                            l.style.transform = "rotateZ(" + (i * 90 + Math.random() * 30 - 15) + "deg) rotateX(-90deg)";
                            cloneM(rig, "leaf", 5, "p", "hl").forEach((lf, i) => {
                                lf.style.transform = "translateZ(" + Math.random() * 50 / gs.s + "vh) rotateZ(" + Math.random() * 360 + "deg)";
                            });
                        });
                    } else cloneM(t, "leaf", 3, "p", "l" + i).forEach(lg => {
                        let l = lg.querySelector("svg");
                        l.style.transform = "translateY(" + -Math.random() * 40 + "%) rotateZ(" + (Math.random() * 90 - 45) + "deg) rotateX(" + (-Math.random() * 45 - 10) + "deg)";
                    });
                }
            }
            t.g_lev = g;
        }
        setTimeout(() => {
            for (i = 0; i < 6; i += 1) t.classList.toggle("g" + i, g >= i);
        }, 10);
    };
    let posTile = (t, i) => {
        let x = i % gs.s, y = Math.floor(i / gs.s);
        if (y >= gs.s) {
            t.classList.toggle("pq" + x, true);
            t.classList.toggle("pq", true);
            t.style.transform = "translateZ(" + ((x ? 2 : 120 / gs.s) - x) + "vh)";
            t.style.opacity = x ? .5 : 1;
            if (y == gs.s) x = -1.5;
            if (y == gs.s + 1) x = gs.s + .5;
            y = i % gs.s * 1.1 + 2;
        }
        if (i < 0) {
            x = gs.s / 2;
            y = -10;
        }
        t.style.left = x * 100 / gs.s + "%";
        t.style.top = y * 100 / gs.s + "%";
        t.style.width = t.style.height = 100 / gs.s + "%";
        return t;
    };
    let update = () => {
        gs.p.forEach((p, i) => {
            ge_qs("p" + i, "h2").textContent = p.n;
            ge_qs("p" + i, "h3").textContent = p.sc + "%";
        });
        gg.forEach((t, i) => {
            posTile(t, i);
            if (i < gs.s * gs.s) setTile(t, gs.tls[i], gs.own[i], false, gs.tg[i]); else if (i - gs.s < gs.s * gs.s) {
                setTile(t, gs.p[0].ft[i - gs.s * gs.s], -1);
            } else {
                setTile(t, gs.p[1].ft[i - gs.s * gs.s - gs.s], -1);
            }
        });
    };
    ge("gamebrd").innerHTML = "";
    let gg = new Array(gs.s * (gs.s + 2)).fill(0).map((d, i) => {
        let t = clone("gamebrd", "tile");
        t.style.transform = "rotateY(" + (Math.random() * 4 - 2) + "deg) rotateX(" + (Math.random() * 4 - 2) + "deg) rotateZ(" + (Math.random() * 4 - 2) + "deg)";
        cloneM(t, [ "crack1", "crack2" ], 4, "l", "ex");
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
    let animateM = (pn, i) => {
        let si = gs.s * (gs.s + pn);
        gecl("gamebrd", "slow", true);
        for (let c = 0; c < gs.s; c += 1) posTile(gg[si + c], c == 0 ? i : si + c - 1);
        setTimeout(() => {
            gg[si].style.transform = "translateZ(.5vh)";
            setTimeout(() => gecl("gamebrd", "slow", false), 1e3);
        }, 1e3);
    };
    let flat = p => {
        gecl("gamebrd", "p1", p && gs.tn % 2);
        gecl("gamebrd", "p0", p && !(gs.tn % 2));
    };
    return {
        setT: (i, t, o, ht) => setTile(gg[i], t, o, ht),
        setClk: f => {
            grid_c = f;
        },
        setB: setB,
        flat: flat,
        update: update,
        animateM: animateM
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
                sc: ai_eval_mv(gsh.gs, p, i)
            })).sort((a, b) => b.sc - a.sc);
            setTimeout(() => mm(moves[0].m), 1e3 + Math.random() * 1e3);
        }
    }
}

function ai_eval_mv(gs, p, i) {
    let pn = gs.tn % 2;
    let opn = pn ^ 1;
    let h = h_gsc(gs);
    h.move(i);
    let res = h.gs.p[pn].tsc * 2 - h.gs.p[opn].tsc;
    return res + Math.random();
}

function pubTurn(gsh, bd, pn, op, i, t) {
    if (op.t == "r") {
        lobby.msg({
            move: i
        });
    }
}

function startGame(gs) {
    ge_gone("lobby", true);
    ge_gone("game", false);
    let gsh = h_gs(gs);
    let bd = mk_brd(gs);
    bd.setB("Starting Game...", 3e3);
    let doTurn = () => {
        bd.flat(false);
        bd.update();
        setTimeout(() => {
            if (gs.winner >= 0) {
                bd.setB(gs.p[gs.winner].n + " WON!", 5e3);
                setTimeout(() => {
                    lobby.gamedone();
                }, 1e4);
                return;
            }
            bd.flat(true);
            let pn = gs.tn % 2;
            let ntl = gs.p[pn].ft[0];
            bd.setB(gs.p[pn].n + "'s turn");
            selTurn(gsh, bd, pn, gs.p[pn], ntl, i => {
                pubTurn(gsh, bd, pn, gs.p[pn ? 0 : 1], i, ntl);
                bd.setClk(null);
                bd.flat(false);
                bd.update();
                if (i < 0) bd.setB(gs.p[pn].n + ": Forced to discard"); else {
                    bd.setB(gs.p[pn].n + ": played");
                    bd.animateM(pn, i);
                }
                gsh.move(i);
                setTimeout(doTurn, 2e3);
            });
        }, 3e3);
    };
    doTurn();
}

function startGameD(bt, p1, p2) {
    let gs = m_gs(bt.bs, bt.bs % 2, bt.it, bt.dt, p1, p2);
    startGame(gs);
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
        tg: new Array(s * s).fill(0),
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
    ex.forEach((t, ind) => add_r(t, ind == 0));
    return gs;
}

function h_gsc(gso) {
    return h_gs({
        ...gso,
        tls: [ ...gso.tls ],
        own: [ ...gso.own ],
        tg: [ ...gso.tg ],
        p: [ {
            ...gso.p[0],
            ft: [ ...gso.p[0].ft ]
        }, {
            ...gso.p[1],
            ft: [ ...gso.p[1].ft ]
        } ]
    });
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
        let tot = gs.s * gs.s * 2;
        let calc_sc = p => gs.tls.reduce((a, t, i) => a + (gs.own[i] == p ? gs.tg[i] : 0), 0);
        let calc_tsc = p => gs.tls.reduce((a, t, i) => a + (gs.own[i] == p ? t & 16 ? 5 : 2 : 0), 0);
        gs.p[0].sc = Math.round(calc_sc(0) * 100 / tot);
        gs.p[1].sc = Math.round(calc_sc(1) * 100 / tot);
        gs.p[0].tsc = Math.round(calc_tsc(0) * 100 / tot);
        gs.p[1].tsc = Math.round(calc_tsc(1) * 100 / tot);
        if (gs.p[0].sc > 50) gs.winner = 0;
        if (gs.p[1].sc > 50) gs.winner = 1;
        if (gs.dCnt > 4) gs.winner = gs.p[0].sc > gs.p[1].sc ? 0 : 1;
    };
    let add = (i, t, o) => {
        gs.tls[i] = t;
        gs.own[i] = o;
        if (o != -1) gs.tg[i] = 1;
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
    let move = i => {
        let pn = gs.tn % 2;
        let ntl = gs.p[pn].ft.shift();
        if (i < 0) gs.dCnt = +1; else {
            gs.dCnt = 0;
            add(i, ntl, -1);
        }
        gs.tn += 1;
        gs.tg.forEach((g, i) => {
            if (gs.own[i] < 0) return;
            gs.tg[i] = Math.min(g + 1, gs.tls[i] & 16 ? 5 : 2);
        });
        calcS();
    };
    return {
        add: add,
        canPlay: canPlay,
        legalM: legalM,
        canPlace: canPlace,
        checkOwn: checkOwn,
        move: move,
        gs: gs
    };
}

function _init_lobby() {
    let mp_bt = null;
    let socket = io({
        upgrade: false,
        transports: [ "websocket" ]
    }), board = document.getElementById("board");
    socket.on("connect", () => {});
    socket.on("lobby", data => {
        let op_m = data.available.filter(u => u.nick != ge("nick").value).map(u => ({
            t: "Play with " + u.nick,
            lt: u.level,
            u: u,
            em: "🔗"
        }));
        menu("Player vs Player Online: Select Opponent", op_m, (op, i) => {
            socket.emit("reqstart", {
                opponent: op.u.id
            });
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
        let op = {
            n: d.op,
            t: "r"
        };
        let tp = {
            n: ge("nick").value,
            t: "l"
        };
        if (d.lead) {
            let gs = m_gs(mp_bt.bs, mp_bt.bs % 2, mp_bt.it, mp_bt.dt, tp, op);
            msg(gs);
            startGame(gs);
        } else {
            waitMsg(gs => {
                gs.p[0].t = "r";
                gs.p[1].t = "l";
                startGame(gs);
            });
        }
    });
    socket.on("playend", () => {
        ge_gone("lobby", false);
        endGame();
    });
    socket.on("error", () => {});
    geclk("bck", () => {
        leave_mp();
    });
    let msg = m => {
        socket.emit("gm", m);
    };
    menu = (title, ops, act) => {
        ge("menu").innerHTML = "";
        ge_qs("bot", "legend").textContent = title;
        ops.forEach((op, i) => {
            let b = clone("menu", "menui");
            qs_txt(b, "h1", op.em);
            qs_txt(b, "h2", op.t);
            qs_txt(b, "h3", op.lt);
            b.onclick = () => {
                act(op, i);
            };
        });
    };
    let enter_mp = bt => {
        mp_bt = bt;
        socket.emit("el", {
            nick: ge("nick").value,
            level: bt.t
        });
        ge_no("top", true);
    };
    leave_mp = () => {
        if (mp_bt) socket.emit("ll", {});
        mp_bt = null;
        reset();
    };
    gamedone = () => {
        if (mp_bt) socket.emit("reqend");
        ge_gone("lobby", false);
        ge_gone("game", true);
    };
    reset = () => {
        ge_gone("lobby", false);
        menu("Choose your Style", m_main, (mi, go) => {
            switch (go) {
              case 1:
                menu("Player vs Computer: Board Type", m_gt, (bt, i) => {
                    menu("Player vs Computer: Opponent", m_ais, (ai, i) => {
                        p1 = {
                            n: ge("nick").value,
                            t: "l"
                        };
                        p2 = {
                            n: ai.t,
                            t: "a"
                        };
                        startGameD(bt, p1, p2);
                    });
                });
                break;

              case 2:
                menu("Player vs Player Local: Board Type", m_gt, (bt, i) => {
                    p1 = {
                        n: ge("nick").value,
                        t: "l"
                    };
                    p2 = {
                        n: "Player 2",
                        t: "l"
                    };
                    startGameD(bt, p1, p2);
                });
                break;

              case 3:
                menu("Player vs Player Online: Board Type", m_gt, (bt, i) => {
                    enter_mp(bt);
                });
                break;
            }
        });
    };
    return {
        waitMsg: waitMsg,
        msg: msg,
        menu: menu,
        enter_mp: enter_mp,
        reset: reset,
        gamedone: gamedone
    };
}

var lobby = null;

function start_lobby() {
    if (!lobby) lobby = _init_lobby();
    ge("nick").value = "user" + +new Date() % 1e4;
    lobby.reset();
}

function init() {
    let p1 = {
        n: "Player 1",
        t: "a"
    };
    let p2 = {
        n: "I. Diot",
        t: "a"
    };
    let gs = m_gs(9, true, [ 23, 21, 26, 19 ], [ 3, 6, 12, 5, 11, 7, 5, 10, 14, 15, 15, 13, 3, 6, 9, 12, 7, 5 ], p1, p2);
    start_lobby();
}

let m_main = [ {
    t: "Learn to Play",
    em: "🎓",
    lt: "Quick tutorials to learn to play"
}, {
    t: "Play vs Computer",
    em: "💻",
    lt: "Play against various AI opponents"
}, {
    t: "Player vs Local Player",
    em: "🎎",
    lt: "Play against a friend on one device"
}, {
    t: "Player vs Online Player",
    em: "🔗",
    lt: "Play against a human online"
} ];

let m_ais = [ {
    t: "I.Diot",
    em: "💻",
    lt: "Not very good"
}, {
    t: "Defensive",
    em: "💻",
    lt: "Not very good"
}, {
    t: "Geni Use",
    em: "💻",
    lt: "Not very good"
} ];

let m_gt = [ {
    t: "7 x 7 Beginners Board",
    em: "🎪",
    bs: 7,
    it: [ 7, 19 ],
    dt: [ 3, 6, 12, 5, 11, 7, 5, 10, 14, 15, 15, 13, 3, 6, 9, 12, 7, 5 ],
    lt: "Small board for a quick game"
}, {
    t: "9 x 9 Standard Board",
    bs: 9,
    em: "🥋",
    lt: "Standard symetric starting",
    it: [ 23, 21, 26, 19 ],
    dt: [ 3, 6, 12, 5, 11, 7, 5, 10, 14, 15, 15, 13, 3, 6, 9, 12, 7, 5 ]
}, {
    t: "6 x 6 Expert Fast Kill",
    bs: 6,
    em: "🎯",
    lt: "Fast and tight quick game",
    it: [ 7, 20, 22 ],
    dt: [ 3, 6, 12, 5, 11, 7, 5, 10, 14, 15, 15, 13, 3, 6, 9, 12, 7, 5 ]
} ];

let ge = id => document.getElementById(id);

let gecl = (id, c, s) => ge(id).classList.toggle(c, s);

let geclk = (id, f) => ge(id).onclick = f;

let ge_gone = (id, s) => gecl(id, "gone", s);

let ge_no = (id, s) => gecl(id, "no", s);

let cloneIn = (par, tempid, q) => {
    let clone = document.querySelector("#" + tempid).content.querySelector(q).cloneNode(true);
    par.appendChild(clone);
    return clone;
};

let clone = (pid, tempid) => {
    return cloneIn(ge(pid), tempid, "*");
};

let ge_qs = (id, qs) => ge(id).querySelector(qs);

let qs_txt = (e, qs, txt) => e.querySelector(qs).textContent = txt;

let oneof = x => {
    if (!Array.isArray(x)) return x;
    return x[Math.floor(Math.random() * x.length)];
};

let cloneM = (par, tempid, n, cp, cls) => {
    return new Array(n).fill(0).map((_, i) => {
        let nn = cloneIn(par, oneof(tempid), "*");
        nn.classList.toggle(cp + i, true);
        nn.classList.toggle(cls, true);
        return nn;
    });
};
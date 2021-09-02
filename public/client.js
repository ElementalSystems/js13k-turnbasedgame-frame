var _audC = new (window.AudioContext || window.webkitAudioContext)();

var _aud_MV = 1;

function tone(length, type) {
    if (!_audC || !_aud_MV) return {
        f: function() {
            return this;
        },
        v: function() {
            return this;
        }
    };
    var current = _audC.currentTime;
    var oscillator = _audC.createOscillator();
    var gain = _audC.createGain();
    if (type) oscillator.type = type;
    oscillator.frequency.value = 0;
    gain.gain.value = 0;
    oscillator.connect(gain);
    gain.connect(_audC.destination);
    oscillator.start(0);
    oscillator.stop(current + length);
    return {
        f: function() {
            if (arguments.length == 1) {
                oscillator.frequency.value = arguments[0];
                return this;
            }
            for (var i = 0; i < arguments.length; i += 1) oscillator.frequency.linearRampToValueAtTime(arguments[i], current + i / (arguments.length - 1) * length);
            return this;
        },
        v: function() {
            if (arguments.length == 1) {
                gain.gain.value = arguments[0] * _aud_MV;
                return this;
            }
            for (var i = 0; i < arguments.length; i += 1) gain.gain.linearRampToValueAtTime(arguments[i] * _aud_MV, current + i / (arguments.length - 1) * length);
            return this;
        }
    };
}

var ae = {
    clk: () => {
        tone(.2, "triangle").f(200, 220, 200).v(.1, .3, 0);
        tone(.2, "triangle").f(220, 200, 220).v(.3, .1, 0);
    },
    crack: () => {
        tone(.1, "square").f(220, 120, 100).v(.5, .6, .3);
        tone(.15, "square").f(120, 80, 100).v(.2, .3, .5, .3);
    },
    flt_in: () => {
        tone(.5).f(150, 220, 150, 250, 150).v(.1, .2, .1, .2, .1, .2, .1, .2, 0);
    },
    flt_out: () => {
        tone(.5).f(150, 220, 150, 250, 150).v(.1, .2, .1, .2, .1, .2, .1, .2, 0);
    },
    bounce: () => {
        tone(.33).f(420, 440).v(.1, .3, .3, .3, .2, .1, 0);
    },
    slide: () => {
        tone(1).f(100, 440).v(.1, .3, .1, .3, .1, .5, .6, 0);
    },
    death: () => {
        tone(2).f(100, 300, 100, 300).v(.3, .5, .1, 0);
        tone(2).f(200, 100, 200, 100).v(.1, .2, .5, 0);
    },
    weird: () => {
        tone(3).f(120, 420).v(0, .3);
        tone(3).f(220, 420).v(0, .3);
        tone(3).f(320, 420).v(0, .3);
    }
};

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
            t.classList.toggle("pq", true);
            t.classList.toggle("pq" + (y > gs.s ? "1" : "0"), true);
            t.style.transform = "translateZ(" + ((x ? 2 : 120 / gs.s) - x) + "vh)";
            t.style.opacity = x ? .5 : 1;
            if (y == gs.s) x = -1.2;
            if (y == gs.s + 1) x = gs.s + .2;
            y = i % gs.s * 1.1 + 2;
        }
        if (i < 0) {
            x = gs.s / 2;
            y = +20;
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
        if (gs.txt[i]) t.querySelector("span").textContent = gs.txt[i];
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
        ae.slide();
        for (let c = 0; c < gs.s; c += 1) posTile(gg[si + c], c == 0 ? i : si + c - 1);
        setTimeout(() => {
            gg[si].style.transform = "translateZ(.5vh)";
            ae.crack();
            setTimeout(() => gecl("gamebrd", "slow", false), 1e3);
        }, 1e3);
    };
    let flat = p => {
        p ? ae.flt_out() : ae.flt_in();
        gecl("game", "isI", !!gs.isI);
        gecl("game", "p1", p && gs.tn % 2);
        gecl("game", "p0", p && !(gs.tn % 2));
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

function selTurnSoon(gsh, bd, pn, p, ntl, mm) {
    setTimeout(() => selTurn(gsh, bd, pn, p, ntl, mm), 1e3);
}

function selTurn(gsh, bd, pn, p, ntl, mm) {
    let lm = gsh.legalM(ntl, pn);
    if (p.t == "l") {
        if (lm.length == 0) {
            mm(-2);
            return;
        }
        bd.setClk(i => mm(i));
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
    if (gs.winner == pn) res += 1e4;
    if (gs.winner == opn) res -= 1e4;
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
    document.body.classList.toggle("ms", false);
    let gsh = h_gs(gs);
    let bd = mk_brd(gs);
    bd.setB("Starting Game...", 3e3);
    let doTurn = () => {
        bd.flat(false);
        bd.update();
        setTimeout(() => {
            if (gs.winner >= 0) {
                bd.setB(gs.p[gs.winner].n + " WON!", 5e4);
                setTimeout(() => {
                    lobby.gamedone();
                }, 5e3);
                return;
            }
            bd.flat(true);
            let pn = gs.tn % 2;
            let ntl = gs.p[pn].ft[0];
            bd.setB(gs.p[pn].n + "'s turn");
            selTurnSoon(gsh, bd, pn, gs.p[pn], ntl, i => {
                pubTurn(gsh, bd, pn, gs.p[pn ? 0 : 1], i, ntl);
                bd.setClk(null);
                bd.flat(false);
                bd.update();
                if (i < 0) bd.setB(gs.p[pn].n + "was forced to discard (" + (gs.dCnt + 1) + ")"); else bd.setB(gs.p[pn].n + " played");
                bd.animateM(pn, i);
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
        txt: new Array(s * s).fill(""),
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
        } while (!h.canPlace(i, t));
        h.add(i, t, start ? 0 : -1, -1);
        h.add(gs.s * gs.s - 1 - i, flip(t), start ? 1 : -1, -1);
    };
    if (cen === "intro") {
        let at = (si, s) => {
            s.forEach((c, i) => {
                if (c === +c) {
                    gs.tls[i + si] = c;
                } else gs.txt[i + si] = c;
            });
        };
        at(0, [ "A", 6, 10 ]);
        at(8, [ 3, 12 ]);
        at(15, [ 10, 9, ..."PACE" ]);
        at(21, [ ..."IN" ]);
        at(28, [ ..."THE", 6, 10 ]);
        at(38, [ 3, 12 ]);
        at(45, [ 10, 9, ..."UN" ]);
        gs.isI = true;
    } else {
        if (cen) h.add(Math.floor(gs.s * gs.s / 2), 31, -1, -1);
        ex.forEach((t, ind) => add_r(t, ind == 0));
    }
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
    let checkOwn = (i, o) => {
        if (gs.own[i] >= 0) return;
        gs.own[i] = playOutcome(i, gs.tls[i], o);
        if (gs.own[i] >= 0) {
            [ 0, 1, 2, 3 ].forEach(d => {
                let ni = getTD(i, d).i;
                if (ni >= 0) checkOwn(ni, o);
            });
        }
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
    let add = (i, t, o, op) => {
        gs.tls[i] = t;
        gs.own[i] = o;
        if (o != -1) gs.tg[i] = 1;
        checkOwn(i, op);
        calcS();
    };
    let getTD = (i, d) => {
        let xp = i % gs.s + [ 0, 1, 0, -1 ][d], yp = Math.floor(i / gs.s) + [ -1, 0, 1, 0 ][d];
        if (xp < 0 || xp >= gs.s || yp < 0 || yp >= gs.s) return {
            t: 0,
            o: -1,
            i: -1
        };
        let ni = yp * gs.s + xp;
        return {
            i: ni,
            t: gs.tls[ni],
            o: gs.own[ni]
        };
    };
    let playOutcome = (i, t, o) => {
        let r = [ 0, 1, 2, 3 ].map(d => {
            let db = 1 << d, rdb = 1 << (d + 2) % 4, tt = getTD(i, d);
            if (tt.t == 0) return -2;
            if (t == -1) {
                return tt.t & rdb ? tt.o : -1;
            }
            if (tt.t > 0 && !!(tt.t & rdb) != !!(t & db)) return -999;
            return t & db ? tt.o : -1;
        });
        if (r.includes(-999)) return -999;
        if (r.includes(o)) return o;
        if (r.includes(o ^ 1)) return o ^ 1;
        if (r.includes(-1)) return -1;
        return -2;
    };
    let canPlay = (i, t, o) => {
        if (gs.tls[i] != 0) return false;
        return [ -1, -2, o ].includes(playOutcome(i, t, o));
    };
    let canPlace = (i, t) => {
        if (gs.tls[i] != 0) return false;
        let po = playOutcome(i, t, 0);
        return [ -2 ].includes(po);
    };
    let legalM = (ntl, pn) => gs.tls.map((t, i) => canPlay(i, ntl, pn) ? i : -1).filter(i => i >= 0);
    let move = i => {
        let pn = gs.tn % 2;
        let ntl = gs.p[pn].ft.shift();
        if (i < 0) gs.dCnt += 1; else {
            gs.dCnt = 0;
            add(i, ntl, -1, pn);
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
        move: move,
        gs: gs,
        playOutcome: playOutcome
    };
}

function _init_lobby() {
    let mp_bt = null;
    let _msgT = null;
    let waitMsg = f => {
        _msgT = f;
    };
    let socket = null;
    try {
        socket = io({
            upgrade: false,
            transports: [ "websocket" ]
        });
        socket.on("connect", () => {});
        socket.on("lobby", data => {
            let op_m = data.available.filter(u => u.nick != ge("nick").value).map(u => ({
                t: "Play with " + u.nick,
                lt: u.level,
                u: u,
                em: "🔗"
            }));
            menu("Player vs Player Online: Select Opponent", true, op_m, (op, i) => {
                socket.emit("reqstart", {
                    opponent: op.u.id
                });
            });
        });
        socket.on("disconnect", () => {});
        socket.on("gm", msg => {
            let t = _msgT;
            _msgT = null;
            if (t) t(msg);
        });
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
            gamedone();
        });
        socket.on("error", () => {});
    } catch (e) {}
    let msg = m => {
        socket.emit("gm", m);
    };
    geclk("bck", () => {
        ae.crack();
        leave_mp();
    });
    menu = (title, showB, ops, act) => {
        ge("menu").innerHTML = "";
        ge_qs("bot", "legend").textContent = title;
        ops.forEach((op, i) => {
            let b = clone("menu", "menui");
            qs_txt(b, "h1", op.em);
            qs_txt(b, "h2", op.t);
            qs_txt(b, "h3", op.lt);
            b.onclick = () => {
                ae.clk();
                act(op, i);
            };
        });
        ge_gone("bck", !showB);
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
        document.body.classList.toggle("ms", true);
    };
    reset = () => {
        document.body.classList.toggle("ms", true);
        ge_gone("top", false);
        menu("Select Game Type", false, m_main, (mi, go) => {
            switch (go) {
              case 1:
                menu("Player vs Computer: Board Type", true, m_gt, (bt, i) => {
                    menu("Player vs Computer: Opponent", true, m_ais, (ai, i) => {
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
                menu("Player vs Player Local: Board Type", true, m_gt, (bt, i) => {
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
                menu("Player vs Player Online: Board Type", true, m_gt, (bt, i) => {
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
    let ig = m_gs(7, "intro");
    let ib = mk_brd(ig);
    ib.update();
    ib.flat(false);
    lobby.menu("Welcome to A Space in the Sun", false, [ {
        t: "GROW",
        lt: "Tap here to begin",
        em: "🌱"
    } ], () => {
        document.documentElement.requestFullscreen();
        ig.own.forEach((_, i) => {
            ig.own[i] = i < 20 ? 0 : 1;
            ig.tg[i] = 1;
        });
        setTimeout(() => {
            ib.update();
            ib.flat(true);
            setTimeout(() => {
                ig.own.forEach((_, i) => {
                    ig.tg[i] = 2;
                });
                ib.update();
            }, 5e3);
        }, 500);
        lobby.reset();
    });
}

function init() {
    let p1 = {
        n: "Player 1",
        t: "l"
    };
    let p2 = {
        n: "I. Diot",
        t: "l"
    };
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
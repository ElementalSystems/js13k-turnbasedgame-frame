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
        tone(.6).f(600, 100).v(.1, 0);
        setTimeout(() => {
            tone(.1, "square").f(220, 120, 100).v(.5, .6, .3);
            tone(.15, "square").f(120, 80, 100).v(.2, .3, .5, .3);
        }, 500);
        setTimeout(() => {
            tone(.5 + Math.random(), "sawtooth").f(80, 60, 30, 20, 100, 80, 50).v(.1, 0, .1, .05, 0, .05, 0, .1);
            tone(.1 + Math.random(), "sawtooth").f(20, 100, 30, 20, 60, 20, 50).v(.03, 0, .02, .05, 0, .05, 0, .05);
        }, 800);
    },
    growth: () => {
        setTimeout(() => {
            tone(2).f(120, 420).v(0, .3);
            tone(2).f(220, 420).v(0, .3);
            tone(2).f(320, 420).v(0, .3);
        }, 1300);
    },
    flt_in: () => {
        tone(.4).f(150, 240, 250).v(.1, .2, .3, 0);
    },
    flt_out: () => {
        tone(.4).f(250, 240, 150).v(.1, .2, .3, 0);
    },
    discard: () => {
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
                        cloneM(t, "llev", 6, "xx", "ll").forEach((rig, i) => {
                            let l = rig.querySelector("svg");
                            l.style.transform = "rotateZ(" + (i * 60 + Math.random() * 20 - 10) + "deg) rotateX(-90deg)";
                            cloneM(rig, "leaf", 5, "p", "hl").forEach((lf, i) => {
                                lf.style.transform = "translateZ(" + Math.random() * 50 / gs.s + "vh) rotateZ(" + Math.floor(Math.random() * 6) * 60 + "deg) rotateX(" + (-20 - Math.random() * 10) + "deg)";
                            });
                        });
                    } else cloneM(t, "leaf", Math.floor(2 + Math.random() * 5), "p", "l" + i).forEach(lg => {
                        let l = lg.querySelector("svg");
                        l.style.transform = "translateY(" + -Math.random() * 30 + "%) rotateZ(" + (Math.random() > .5 ? 60 : -60) + "deg) rotateX(" + -Math.random() * 15 + "deg)";
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
            ge_qs("p" + i, "h3").textContent = p.sc ? p.sc + "%" : "";
        });
        ge_gone("hlp", !(gs.p[1].hlp && hlp[gs.tn]));
        ge("hlp").textContent = hlp[gs.tn];
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
        for (let c = 0; c < gs.s; c += 1) posTile(gg[si + c], c == 0 ? i : si + c - 1);
        setTimeout(() => {
            gg[si].style.transform = "translateZ(-1vh)";
            i != -1 ? ae.crack() : ae.discard();
            if (gs.gt > 1) ae.growth();
            setTimeout(() => gecl("gamebrd", "slow", false), 800);
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
    if (p.t == "l") {
        let lm = gsh.legalM();
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
        setTimeout(() => mm(bestM(gsh, p.pp)), 500 + Math.random() * 1e3);
    }
}

function bestM(gsh, pp) {
    let lm = gsh.legalM();
    if (lm.length == 0) return -2; else {
        let moves = lm.map(i => ({
            m: i,
            sc: ai_eval_mv(gsh.gs, pp, i)
        })).sort((a, b) => b.sc - a.sc);
        return moves[0].m;
    }
}

function ai_eval_mv(gs, pp, i) {
    let pn = gs.tn % 2;
    let opn = pn ^ 1;
    let h = h_gsc(gs);
    h.move(i);
    let sres = h.gs.p[pn].tsc * 2 - h.gs.p[opn].tsc;
    if (h.gs.winner == pn) sres += 1e4;
    if (h.gs.winner == opn) sres -= 1e4;
    let eps = h.gs.tls.reduce((a, t, i) => {
        if (h.gs.tls[i] != 0) return a;
        let res = h.playOutcome(i, -1, 0);
        if (res >= -1) a[res].push(i);
        return a;
    }, {
        "-1": [],
        0: [],
        1: []
    });
    let minD = (op, p) => {
        return p.reduce((a, t, i) => {
            let d = Math.abs(op % gs.s - i % gs.s) + Math.abs(op / gs.s - i / gs.s);
            return Math.min(d, a);
        }, gs.s * 2);
    };
    let ores = eps[pn].length < 2 ? -10 : eps[pn].length * 2;
    let pres = 0;
    eps[-1].forEach(i => {
        let mD = minD(i, eps[pn]);
        let oD = minD(i, eps[opn]);
        if (mD <= oD) pres += mD < 3 ? 3 : 1; else pres -= oD < 3 ? 3 : 1;
    });
    let rres = Math.random();
    console.log(i, sres, ores, pres, rres);
    return sres * pp.s + ores * pp.o + pres * pp.p + rres * pp.r;
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
    bd.flat(false);
    bd.update();
    bd.setB("Starting Game...", 500);
    let doTurn = () => {
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
                if (i < 0) bd.setB(gs.p[pn].n + " was forced to discard (" + (gs.dCnt + 1) + ")"); else bd.setB(gs.p[pn].n + " played");
                gsh.move(i);
                bd.animateM(pn, i);
                setTimeout(doTurn, gs.gt == 0 ? 100 : 2e3);
            });
        }, gs.gt > 1 ? 3e3 : 500);
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
        gt: 0,
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
        let po = playOutcome(i, gs.tls[i], o);
        if (po >= 0) {
            gs.own[i] = po;
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
    let legalM = () => {
        let pn = gs.tn % 2;
        let ntl = gs.p[pn].ft[0];
        return gs.tls.map((t, i) => canPlay(i, ntl, pn) ? i : -1).filter(i => i >= 0);
    };
    let move = i => {
        let pn = gs.tn % 2;
        let ntl = gs.p[pn].ft.shift();
        gs.gt = 0;
        if (i < 0) gs.dCnt += 1; else {
            gs.dCnt = 0;
            add(i, ntl, -1, pn);
            gs.gt = 1;
        }
        gs.tn += 1;
        gs.tg.forEach((g, i) => {
            if (gs.own[i] < 0) return;
            let max = gs.tls[i] & 16 ? 5 : 2;
            if (g < max) {
                gs.tg[i] = g + 1;
                gs.gt = 2;
            }
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

var hlp = [ "Welcome to the Courtyard.\n\nIt's your turn first.\nSelect a tile in the sun to crack to allow your plant to grow.", "Now my turn, I'll select my tile to crack.", "The goal is to grow your plant so try to crack tiles you can grow towards.\n You can see the upcoming crack patterns on the left so you can plan ahead.", "I'm not really trying to win this game, so I'll just keep out of your way.", "If your vine spreads into a open hole it will root and grow upwards increasing your domination", "My turn, seems like you're getting the hang of this.", "The goal is to take all the space in the sun. \nYour domination of the space is shown on the left.\n You win if you can dominate 50% of the space in the sun.", "If niether player can play for two turns the player with the highest domination wins." ];

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
        ae.discard();
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
              case 0:
                startGame(m_gs(5, true, [ 23, 21, 26 ], [ 3, 6, 12, 5, 11, 7, 5, 10, 14, 15, 15, 13, 3, 6, 9, 12, 7, 5 ], {
                    n: ge("nick").value,
                    t: "l"
                }, {
                    n: "Teacher",
                    t: "a",
                    hlp: 1,
                    pp: {
                        s: 0,
                        o: 0,
                        p: -2,
                        r: 1,
                        d: 0
                    }
                }));
                break;

              case 1:
                menu("Player vs Computer: Board Type", true, m_gt, (bt, i) => {
                    menu("Player vs Computer: Opponent", true, m_ais, (ai, i) => {
                        p1 = {
                            n: ge("nick").value,
                            t: "l"
                        };
                        p2 = {
                            n: ai.t,
                            t: "a",
                            pp: ai.pp
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
    ge("nick").value = oneof([ "Ficus", "Bigno", "Loni", "Wist", "Hede" ]) + oneof([ "cena", "spernum", "viren", "teria", "ra" ]) + " " + oneof([ "Tricus", "Radin", "Mader", "Iber", "Rom" ]) + oneof([ "ika", "canna", "bea" ]) + +new Date() % 100;
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
            }, 500);
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
        n: "Clever?",
        t: "a",
        pp: {
            s: 5,
            o: 2,
            p: 1,
            r: 5
        }
    };
    let gs = m_gs(7, true, [ 7, 19, 19, 22 ], [ 3, 6, 12, 5, 11, 7, 5, 10, 14, 15, 15, 13, 3, 6, 9, 12, 7, 5 ], p1, p2);
    startGame(gs);
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
    t: "The Newbetrix Crawler",
    em: "💻",
    lt: "Not very good, tries nobly best to survive",
    pp: {
        s: 2,
        o: 2,
        p: 0,
        r: 5,
        d: 0
    }
}, {
    t: "Westrin Creeper",
    em: "💻",
    lt: "Efficient, opportunistic, aggressive",
    pp: {
        s: 5,
        o: 5,
        p: 2,
        r: 1,
        d: 0
    }
}, {
    t: "The Oxford Ivy",
    em: "💻",
    lt: "Learned; deep thinking; dangerous",
    pp: {
        s: 5,
        o: 2,
        p: 1,
        r: 5
    }
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
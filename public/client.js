"use strict";

(function () {

    let socket,
        message,
        board,
        nick,
        level

    function setMessage(text) {
        message.innerHTML = text;
    }

    function bind() {
        socket.on("connect", () => {
          setMessage("Connected");
        });
        socket.on("lobby", (data) => {
          setMessage("Got lobby data");
          console.log(data);
          board.innerHTML='';
          data.available.forEach((u)=>{
            let b = document.createElement('button');
            b.textContent = 'Play with '+u.nick+' ('+u.level+')';
            if (u.nick==nick.value) b.disabled=true;
            b.addEventListener('click',()=>{
              socket.emit("play", {opponent: u.id })
            });
            board.appendChild(b);
          })

        });


        socket.on("disconnect", () => {
          setMessage("Connection lost!");
        });

        socket.on("playstart", (d) => {
          setMessage("game started; lead:"+d.lead);
          if (d.lead)
             socket.emit("gamemsg",{display:"I'm in charge"})
        });

        socket.on("gamemsg", (d) => {
          setMessage("game:"+d.display);          
        });

        socket.on("error", () => {
          setMessage("Connection error!");
        });

        document.getElementById("enter").addEventListener('click', ()=>{
          socket.emit("enter", {nick: nick.value, level: level.value })
        });
    }

    function init() {
        socket = io({ upgrade: false, transports: ["websocket"] });
        message = document.getElementById("message");
        board = document.getElementById("board");
        nick = document.getElementById("nick");
        level = document.getElementById("lev");
        bind();
    }

    window.addEventListener("load", init, false);

})();

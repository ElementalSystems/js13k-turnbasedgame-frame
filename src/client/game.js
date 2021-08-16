let isLead=0;


function startGameMulti(lead,gamemsg,gameend)
{
  let gb=document.getElementById("game");
  gb.classList.toggle('gone',false);
  isLead=lead?1:0;

  if (lead) {
    //init game
    gameState.turn=1;
    gameState.initTime=+new Date();
    gamemsg(gameState);
    updateBoard();
  }
}

function  msgGame(data)
{
}

function endGame()
{
}

function updateBoard()
{
}


function startGame() {
  grid_c=(i)=>{
    console.log("Grid element "+i);
  }

  let _gs=9;

  let setTile=(t,b)=>
  {
    for (i=0;i<5;i+=1) {
      if (b&(1<<i)) t.classList.add('l'+i);
    }
    t.classList.toggle('p1',(b%3)==1)
    t.classList.toggle('p2',(b%3)==2)
  }

  let posTile=(t,i)=>
  {
    let x=(i%_gs),
        y=Math.floor(i/_gs)
    if (y==_gs) x=-1.5;
    if (y==(_gs+1)) x=_gs+.5;
    if (y>=_gs) y=(i%_gs)*1.2+.3;
    t.style.left=(x*100/_gs)+"%";
    t.style.top=(y*100/_gs)+"%";
    t.style.width=t.style.height=(100/_gs)+"%";
    return t;
  }

  ge_gone('game',false);

  //make the game grid
  let gg=new Array(_gs*(_gs+2)).fill(0).map((d,i)=>{
    let t=clone('gamebrd','tile')
    posTile(t,i);
    setTile(t,i%32);

    t.onclick=()=>grid_c(i);
  })

  setTimeout(()=>gecl('gamebrd','p2',true),2000);
  setTimeout(()=>gecl('gamebrd','p2',false),4000);

}

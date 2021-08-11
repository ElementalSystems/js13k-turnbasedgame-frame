let isLead=0;

let gameState={
  turn:1,
  id: "lobby-test",
}

function startGame(lead,gamemsg,gameend)
{
  let gb=document.getElementById("game");
  gb.classList.toggle('gone',false);
  isLead=lead?1:0;


  geclk("next",()=>{
    gameState.turn+=1;
    gamemsg(gameState);
    updateBoard();
  });
  geclk("end",()=>{
    gameend();
  });

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
  gameState=data;
  updateBoard();
}

function endGame()
{
   gb=document.getElementById("game").classList.toggle("gone",true);
}

function updateBoard()
{

  document.getElementById("gamestatus").textContent=JSON.stringify(gameState);
  document.getElementById("next").disabled=!((gameState.turn+isLead)%2) //is it my turn?
}

function init() {
  let p1={
    n: "Player 1",
    t: "a"
  };
  let p2= {
    n: "I. Diot",
    t: "a"
  }
  //let gs = m_gs(7,true,[7,19],[3, 6, 12, 5, 11, 7, 5, 10, 14, 15, 15, 13, 3, 6, 9, 12,7,5],p1,p2)
  //let gs = m_gs(6,false,[7,20,22],[3, 6, 12, 5, 11, 7, 5, 10, 14, 15, 15, 13, 3, 6, 9, 12,7,5],p1,p2)
  let gs = m_gs(9,true,[23,21,26,19],[3, 6, 12, 5, 11, 7, 5, 10, 14, 15, 15, 13, 3, 6, 9, 12,7,5],p1,p2)
  //let gs = m_gs(11,true,[23,31,23,21,26],[3, 6, 12, 5, 11, 7, 5, 10, 14, 15, 15, 13, 3, 6, 9, 12,7,5],p1,p2)

  //startGame(gs);
  start_lobby();
}

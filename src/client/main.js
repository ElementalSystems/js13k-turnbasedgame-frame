function init() {
  let p1={
    n: "andrew",
    t: "l"
  };
  let p2= {
    n: "Brilly Ant",
    t: "l"
  }
  //let gs = m_gs(7,true,[19],[3, 6, 12, 5, 11, 7, 5, 10, 14, 15, 15, 13, 3, 6, 9, 12,7,5],p1,p2)
  let gs = m_gs(9,true,[23,21,26],[3, 6, 12, 5, 11, 7, 5, 10, 14, 15, 15, 13, 3, 6, 9, 12,7,5],p1,p2)
  //let gs = m_gs(11,true,[31,23,21,26],[3, 6, 12, 5, 11, 7, 5, 10, 14, 15, 15, 13, 3, 6, 9, 12,7,5],p1,p2)

  //startGame(gs);
  start_lobby();
}

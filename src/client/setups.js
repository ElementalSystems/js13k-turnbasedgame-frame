let m_main = [
  {
    t: "Learn to Play",
    em: '🎓',
    lt: "Quick tutorials to learn to play"
  },
  {
    t: "Play vs Computer",
    em: '💻',
    lt: "Play against various AI opponents"
  },
  {
    t: "Player vs Local Player",
    em: '🎎',
    lt: "Play against a friend on one device"
  },
  {
    t: "Player vs Online Player",
    em: '🔗',
    lt: "Play against a human online"
  }
];

let m_ais = [
  {
    t: "The Newbee Crawler",
    em: "💻",
    lt:"Not very good, does it's best to survive.",
    pp: { s:4, o:1, p:0, r:5, d:0 }
  },
  {
    t: "The Trumpet Vine",
    em: "💻",
    lt:"A novice player, good to learn against.",
    pp: { s:5, o:2, p:1, r:5, d:1 }
  },
  {
    t: "Westrin Creeper",
    em: "💻",
    lt: "Efficient, opportunistic, aggressive",
    pp: { s:5, o:5, p:2, r:10, d:2 }
  },
  {
    t: "Honeysuckle",
    em: "💻",
    lt:"Conservative, skilled - hard to beat.",
    pp: { s:5, o:1, p:0, r:0, d:2 }
  },
  {
    t: "The Oxford Ivy",
    em: "💻",
    lt:"Learned; deep thinking; a dangerous opponent",
    pp: { s:5, o:1, p:0, r:0, d:3}
  },
];

let m_gt = [ //corners 3 6 9 12 //three 7 11 13 14 //fw 15 //st 5 10
  {
    t: "7 x 7 Standard Board",
    em: '🎪',
    bs: 7,
    it: [7,19,31],
    dt: [3, 6, 9, 5,10,12, 7, 11, 13, 14, 15, 7, 7,11, 14 , 15, 15, 15],
    lt: 'Standard courtyard for a quick game',
  },
  {
    t: "7 x 7 Sparse Board",
    em: '🏛️',
    bs: 7,
    it: [20,31],
    dt: [3, 6, 9, 5,10,12, 7, 11, 13, 14, 15, 7, 7,11, 14 , 15, 15, 15,7,13,5,10],
    lt: 'A Harsh open space for a gritty fight.',
  },
  {
    t: "6 x 6 Expert Fast Kill",
    bs: 6,
    em: '🎯',
    lt: 'Fast and tight quick game',
    it: [7,21,26,31],
    dt: [3, 6, 9,5,10, 12, 7, 11, 13, 14, 15, 7, 15, 15],
  },
  {
    t: "9 x 9 Large Board",
    bs: 9,
    em: '🥋',
    lt: 'A large busy courtyard for a longer game',
    it: [23,21,21,26,26,19,31,31],
    dt: [3, 6, 9,5,10, 12, 7, 11, 13, 14, 15, 7, 7,11, 14 , 15, 15, 15,7,15,5,5,10,10],
  },

];

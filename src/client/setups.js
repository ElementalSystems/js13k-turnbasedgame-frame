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

let m_gt = [
  {
    t: "7 x 7 Standard Board",
    em: '🎪',
    bs: 7,
    it: [7,19,31],
    dt: [3, 6, 12, 5, 11, 7, 5, 10, 14, 15, 15, 13, 3, 6, 9, 12,7,5],
    lt: 'Standard board for a quick game',
  },
  {
    t: "9 x 9 Large Board",
    bs: 9,
    em: '🥋',
    lt: 'A large sparse courtyard',
    it: [23,21,26,19],
    dt: [3, 6, 12, 5, 11, 7, 5, 10, 14, 15, 15, 13, 3, 6, 9, 12,7,5],
  },
  {
    t: "6 x 6 Expert Fast Kill",
    bs: 6,
    em: '🎯',
    lt: 'Fast and tight quick game',
    it: [7,20,22],
    dt: [3, 6, 12, 5, 11, 7, 5, 10, 14, 15, 15, 13, 3, 6, 9, 12,7,5]
  },
];

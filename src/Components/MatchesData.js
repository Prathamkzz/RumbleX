
// PLE Data
export const pleData = [
  { id: 'ple1', name: 'Backlash', image: '/images/Backlash.jpg', areMatchesAnnounced: true },
  { id: 'ple2', name: 'Money In The Bank', image: '/images/MITB.webp', areMatchesAnnounced: false },
  { id: 'ple3', name: 'SummerSlam', image: '/images/SummerSlam.jpg', areMatchesAnnounced: false },
  { id: 'ple4', name: 'Clash In Paris', image: '/images/CIP.jpg', areMatchesAnnounced: false },
  { id: 'ple5', name: 'Survivor Series', image: '/images/SSERIES.jpg', areMatchesAnnounced: false },
];

// Matches By PLE
export const matchesByPle = {
  ple1: [  // Matches for Backlash
    {
      id: 'match1',
      matchTitle: 'Randy Orton vs John Cena (WWE Undisputed Championship)',
      poster: '/images/wc.jpg',  // Only poster, no 'image'
      prediction: {
        'John Cena': 85,
        'Randy Orton': 15,
      },
      wrestlerImages: {
        'John Cena': '/images/Cena.png',
        'Randy Orton': '/images/Orton.png',
      },
      backstory: `Cena turned heel 😈, stole Cody’s moment 🏆, and got RKO’d into karma by Orton 🐍. Now they're fighting one last time—in Orton’s hometown 🏠—with 31 titles, 20 years of beef 🍖, and one final shot to ruin each other’s legacy 💥👴.

Backlash 2025: Two GOATs. One grudge. No therapy 🧠🔪.`,
    },
    {
      id: 'match2',
      matchTitle: 'Becky Lynch vs Lyra Valkyria (IC Title)',
      poster: '/images/ic.jpg',  // Only poster, no 'image'
      prediction: {
        'Lyra Valkyria': 45,
        'Becky Lynch': 55,
      },
      wrestlerImages: {
        'Lyra Valkyria': '/images/lv.png',
        'Becky Lynch': '/images/bl.png',
      },
      backstory: 'Becky helped Lyra win gold 🏆… then stabbed her in the back 24 hours later 🔪 Turns out, Becky also jumped Bayley weeks ago—because revenge has no expiration date 😤📅.Now she’s calling Lyra a loser 🤡 and challenging her for IC title at Backlash 2025 💥.Mentor vs. mentee. Gold on the line. Therapy recommended 🧠💔'
    },
    {
      id: 'match3',
      matchTitle: 'Gunther vs Pat McAfee',
      poster: '/images/ij.jpg',  // Only poster, no 'image'
      prediction: {
        'Gunther': 95,
        'Pat McAfee': 5,
      },
      wrestlerImages: {
        'Gunther': '/images/GE.png',
        'Pat McAfee': '/images/PAT.png',
      },
      backstory: 'Gunther choked Michael Cole live on RAW 😵. McAfee played hero and got folded like laundry 🧺. Now he’s facing a walking war crime at Backlash ⚰️. Fans call it guts, doctors call it goodbye 👋. May 10: Pat’s last match (and maybe meal) 💀🔥🇩🇪.'
    },
    {
      id: 'match4',
      matchTitle: 'Fatu vs Knight vs McIntyre vs Priest (US Title)',
      poster: '/images/4.jpg',  // Only poster, no 'image'
      prediction: {
        'Fatu': 45,
        'Knight': 20,
        'McIntyre': 25,
        'Priest': 10,
      },
      wrestlerImages: {
        'Fatu': '/images/JA.png',
        'Knight': '/images/LA.png',
        'McIntyre': '/images/MC.png',
        'Priest': '/images/DA.png',
      },
      backstory: 'Jacob Fatu wins a belt 🏆, instantly gets hunted by 3 sweaty dudes with rage issues 😤💀. Solo’s mad, Aldis is stressed, and Backlash is basically WWE’s group therapy session with punches 🧠🩸. Title on the line, sanity not included 🤡🔥.'
    },
  ],

  ple2: [],  // Money in the Bank (empty, can be filled later)
  ple3: [],  // SummerSlam (empty, can be filled later)
  ple4: [],  // Clash in Paris (empty, can be filled later)
  ple5: [],  // Survivor Series (empty, can be filled later)
};

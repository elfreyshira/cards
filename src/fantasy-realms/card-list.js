// −

export default [
  {
    id: "army-celestial-knights",
    suit: "army",
    name: "celestial-knights",
    value: 20,
    penalty: "−8 unless with at least one Leader.",
  },
  {
    id: "army-dwarvish-infantry",
    suit: "army",
    name: "dwarvish-infantry",
    value: 15,
    penalty: "−2 for each other Army.",
  },
  {
    id: "army-elven-archers",
    suit: "army",
    name: "elven-archers",
    value: 10,
    bonus: "+5 if no Weather in hand."
  },
  {
    id: "army-light-calvary",
    suit: "army",
    name: "light-calvary",
    value: 17,
    penalty: "−2 for each Land."
  },
  {
    id: "army-rangers",
    suit: "army",
    name: "rangers",
    value: 5,
    bonus: "+10 for each Land. \n\nCLEARS the word Army from Penalties.",
  },
  {
    id: "artifact-book-of-changes",
    suit: "artifact",
    name: "book-of-changes",
    value: 3,
    bonus: "You may change the suit of one other card. Its name, bonuses, and penalties remain the same."
  },
  {
    id: "artifact-gem-of-order",
    suit: "artifact",
    name: "gem-of-order",
    value: 5,
    bonus: "+10 for 3-card run,\n+30 for 4-card run,\n+60 for 5-card run,\n+100 for 6-card run,\n+150 for 7-card run.\n(For base strength numbers)"
  },
  {
    id: "artifact-protection-rune",
    suit: "artifact",
    name: "protection-rune",
    value: 1,
    bonus: "CLEARS the Penalty on all cards."
  },
  {
    id: "artifact-shield-of-keth",
    suit: "artifact",
    name: "shield-of-keth",
    value: 4,
    bonus: "+15 with any one Leader. \n[OR] +40 with both Leader and Sword of Keth."
  },
  {
    id: "artifact-world-tree",
    suit: "artifact",
    name: "world-tree",
    value: 2,
    bonus: "+50 if every active card in hand is a different suit."
  },
  {
    id: "beast-basilisk",
    suit: "beast",
    name: "basilisk",
    value: 35,
    penalty: "BLANKS all Army, Leader, and other Beast."
  },
  {
    id: "beast-dragon",
    suit: "beast",
    name: "dragon",
    value: 30,
    penalty: "−40 unless with at least one Wizard."
  },
  {
    id: "beast-hydra",
    suit: "beast",
    name: "hydra",
    value: 12,
    bonus: "+28 with Swamp."
  },
  {
    id: "beast-unicorn",
    suit: "beast",
    name: "unicorn",
    value: 9,
    bonus: "+30 with Princess. \n[OR] +15 with Empress, Queen, or Elemental Enchantress."
  },
  {
    id: "beast-warhorse",
    suit: "beast",
    name: "warhorse",
    value: 6,
    bonus: "+14 with any Leader or Wizard."
  },
  {
    id: "flame-candle",
    suit: "flame",
    name: "candle",
    value: 2,
    bonus: "+100 with Book of Changes, Bell Tower, and any one Wizard.",
  },
  {
    id: "flame-fire-elemental",
    suit: "flame",
    name: "fire-elemental",
    value: 4,
    bonus: "+15 for each other Flame."
  },
  {
    id: "flame-forge",
    suit: "flame",
    name: "forge",
    value: 9,
    bonus: "+9 for each Weapon and Artifact."
  },
  {
    id: "flame-lightning",
    suit: "flame",
    name: "lightning",
    value: 11,
    bonus: "+30 with Rainstorm."
  },
  {
    id: "flame-wildfire",
    suit: "flame",
    name: "wildfire",
    value: 40,
    penalty: "BLANKS all cards except Flame, Weather, Wizard, Weapon, Artifact, Deluge, Island, Mountain, Unicorn, and Dragon."
  },
  {
    // originally Great Flood (great-flood, greatflood)
    id: "flood-deluge",
    suit: "flood",
    name: "deluge",
    value: 32,
    penalty: "BLANKS all Army, all Land except Mountain, and all Flame except Lightning."
  },
  {
    id: "flood-fountain-of-life",
    suit: "flood",
    name: "fountain-of-life",
    value: 1,
    bonus: "Add the base strength of any one Weapon, Flood, Flame, Land, or Weather."
  },
  {
    id: "flood-island",
    suit: "flood",
    name: "island",
    value: 14,
    bonus: "CLEARS the Penalty on any one Flood or Flame."
  },
  {
    id: "flood-swamp",
    suit: "flood",
    name: "swamp",
    value: 18,
    penalty: "−3 for each Army and Flame."
  },
  {
    id: "flood-water-elemental",
    suit: "flood",
    name: "water-elemental",
    value: 4,
    bonus: "+15 for each other Flood."
  },
  {
    id: "land-bell-tower",
    suit: "land",
    name: "bell-tower",
    value: 8,
    bonus: "+15 with any one Wizard."
  },
  {
    id: "land-cavern",
    suit: "land",
    name: "cavern",
    value: 6,
    bonus: "+25 with Dwarvish Infantry or Dragon. \n\nCLEARS the Penalty on all Weather."
  },
  {
    id: "land-earth-elemental",
    suit: "land",
    name: "earth-elemental",
    value: 4,
    bonus: "+15 for each other Land."
  },
  {
    id: "land-forest",
    suit: "land",
    name: "forest",
    value: 7,
    bonus: "+12 for each Beast and Elven Archers."
  },
  {
    id: "land-mountain",
    suit: "land",
    name: "mountain",
    value: 9,
    bonus: "+50 with both Smoke and Wildfire. \n\nCLEARS the Penalty on all Flood."
  },
  {
    id: "leader-empress",
    suit: "leader",
    name: "empress",
    value: 15,
    bonus: "+10 for each Army.",
    penalty: "−5 for each other Leader."
  },
  {
    id: "leader-king",
    suit: "leader",
    name: "king",
    value: 8,
    bonus: "+5 for each Army. \n[OR] +20 for each Army if with Queen."
  },
  {
    id: "leader-princess",
    suit: "leader",
    name: "princess",
    value: 2,
    bonus: "+8 for each Army, Wizard, and other Leader."
  },
  {
    id: "leader-queen",
    suit: "leader",
    name: "queen",
    value: 6,
    bonus: "+5 for each Army. \n[OR] +20 for each Army if with King."
  },
  {
    id: "leader-warlord",
    suit: "leader",
    name: "warlord",
    value: 4,
    bonus: "Equal to the base strengths of all Army."
  },
  {
    id: "weapon-elven-longbow",
    suit: "weapon",
    name: "elven-longbow",
    value: 3,
    bonus: "+30 with Elven Archers, Warlord, or Beastmaster."
  },
  {
    id: "weapon-magic-wand",
    suit: "weapon",
    name: "magic-wand",
    value: 1,
    bonus: "+25 with any one Wizard."
  },
  {
    id: "weapon-sword-of-keth",
    suit: "weapon",
    name: "sword-of-keth",
    value: 7,
    bonus: "+10 with any one Leader. \n[OR] +40 with both Leader and Shield of Keth."
  },
  {
    id: "weapon-war-dirigible",
    suit: "weapon",
    name: "war-dirigible",
    value: 35,
    penalty: "BLANKED unless with at least one Army. \n\nBLANKED with any Weather."
  },
  {
    id: "weapon-warship",
    suit: "weapon",
    name: "warship",
    value: 23,
    penalty: "BLANKED unless with at least one Flood. \n\nCLEARS the word Army from all Penalties of all Flood."
  },
  {
    id: "weather-air-elemental",
    suit: "weather",
    name: "air-elemental",
    value: 4,
    bonus: "+15 for each other Weather."
  },
  {
    id: "weather-blizzard",
    suit: "weather",
    name: "blizzard",
    value: 30,
    penalty: "BLANKS all Flood. \n\n−5 for each Army, Leader, Beast, and Flame."
  },
  {
    id: "weather-rainstorm",
    suit: "weather",
    name: "rainstorm",
    value: 8,
    bonus: "+10 for each Flood.",
    penalty: "BLANKS all Flame except Lightning."
  },
  {
    id: "weather-smoke",
    suit: "weather",
    name: "smoke",
    value: 27,
    penalty: "This card is BLANKED unless with at least one Flame."
  },
  {
    id: "weather-whirlwind",
    suit: "weather",
    name: "whirlwind",
    value: 13,
    bonus: "+40 with Rainstorm and either Blizzard or Deluge."
  },
  {
    id: "wild-doppelganger",
    suit: "wild",
    name: "doppelganger",
    value: 0,
    neutral: "May duplicate the name, base strength, suit, and penalty – BUT NOT BONUS – of any one other card."
  },
  {
    id: "wild-mirage",
    suit: "wild",
    name: "mirage",
    value: 0,
    neutral: "May duplicate the name and suit of any one Army, Land, Weather, Flood, or Flame in the game. \nDoes not take the bonus, penalty, or base strength of the card duplicated."
  },
  {
    id: "wild-shapeshifter",
    suit: "wild",
    name: "shapeshifter",
    value: 0,
    neutral: "May duplicate the name and suit of any one Artifact, Leader, Wizard, Weapon, or Beast in the game. \nDoes not take the bonus, penalty, or base strength of the card duplicated."
  },
  {
    id: "wizard-beastmaster",
    suit: "wizard",
    name: "beastmaster",
    value: 9,
    bonus: "+9 for each Beast. \n\nCLEARS the Penalty on all Beast."
  },
  {
    id: "wizard-collector",
    suit: "wizard",
    name: "collector",
    value: 7,
    bonus: "+10 if three different cards in same suit, +40 if four different cards in same suit, +100 if five different cards in same suit."
  },
  {
    id: "wizard-enchantress",
    suit: "wizard",
    name: "enchantress",
    value: 5,
    bonus: "+5 for each Land, Weather, Flood, and Flame."
  },
  {
    id: "wizard-necromancer",
    suit: "wizard",
    name: "necromancer",
    value: 3,
    bonus: "At the end of the game, you may take one Army, Leader, Wizard, or Beast from the discard pile and add it to your hand as an eighth card."
  },
  {
    id: "wizard-warlock-lord",
    suit: "wizard",
    name: "warlock-lord",
    value: 25,
    penalty: "−10 for each Leader and other Wizard."
  },
]

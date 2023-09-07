import Brng from 'brng'

const ATTACK_TOP_BASE = 4.4
const WILD_MULTIPLIER = 1
const ATTACK_BOTTOM_MULTIPLIER = 1.2222222
// const ATTACK_BOTTOM_MULTIPLIER = 1

const effectsProportions = {
  fireTop: ATTACK_TOP_BASE,
  earthTop: ATTACK_TOP_BASE,
  waterTop: ATTACK_TOP_BASE,
  wildTop: ATTACK_TOP_BASE*WILD_MULTIPLIER,
  // push: 3,/
  // pull: 6,

  fireBottom: ATTACK_TOP_BASE*ATTACK_BOTTOM_MULTIPLIER,
  earthBottom: ATTACK_TOP_BASE*ATTACK_BOTTOM_MULTIPLIER,
  waterBottom: ATTACK_TOP_BASE*ATTACK_BOTTOM_MULTIPLIER,
  wildBottom: ATTACK_TOP_BASE*ATTACK_BOTTOM_MULTIPLIER*WILD_MULTIPLIER,

  // move: 7,

  money: 13.7,

  draw: 6,
  cycle: 2.8,
  trash: 1.8,
  // energy: 7,
}

const effectRoller = new Brng(effectsProportions, {bias: 4})

const topEffectList = [
  'fireTop', 'earthTop', 'waterTop', 'wildTop',
  'money', 'draw', 'cycle', 'trash'
]
const bottomEffectList = ['fireBottom', 'earthBottom', 'waterBottom', 'wildBottom', 'money', 'trash']

const attackList = [
  'fireTop', 'earthTop', 'waterTop', 'wildTop',
  'fireBottom', 'earthBottom', 'waterBottom', 'wildBottom',
]

const effectDisplayPriority = [
  'fireTop', 'earthTop', 'waterTop', 'wildTop',
  'fireBottom', 'earthBottom', 'waterBottom', 'wildBottom',
  'money', 'draw', 'cycle', 'trash', 'energy'
]

const attackListMapping = {
  fireTop: 'fireBottom',
  earthTop: 'earthBottom',
  waterTop: 'waterBottom',
  wildTop: 'wildBottom',

  fireBottom: 'fireTop',
  earthBottom: 'earthTop',
  waterBottom: 'waterTop',
  wildBottom: 'wildTop',
}


const effectToValueMapping = {
  fireTop: 100,
  earthTop: 100,
  waterTop: 100,
  wildTop: 150,

  fireBottom: 100,
  earthBottom: 100,
  waterBottom: 100,
  wildBottom: 150,

  money: 100,

  draw: 200,
  cycle: 100,
  trash: 200,
  energy: 50,
}

const proportionsCardCost = {
  1: 4,
  2: 5,
  3: 6,
  4: 7, // middle
  5: 6,
  6: 5,
  7: 4,
  // 8: 3,
  // 9: 2,
}
const cardCostRoller = new Brng(proportionsCardCost, {bias: 4, keepHistory: false})

const costToMaxValueMapping = {
  1: {first: 200, second: 200}, // 2
  2: {first: 300, second: 250}, // 275, // 2.5+3
  3: {first: 350, second: 350}, // 350, // 3.5 or 3+4
  4: {first: 400, second: 400}, // 400, // 4
  5: {first: 450, second: 450}, // 450, // 4.5 or 4+5
  6: {first: 500, second: 500}, // 500, // 5
  7: {first: 550, second: 500}, // 525, // 5+5.5
  8: {first: 600, second: 550}, // 575, // 5.5+6
  9: {first: 600, second: 600}, // 600, // 6
}

const topOrBottomRoller = new Brng({top: 1, bottom: 1}, {bias: 4})

const comboTypeRoller = new Brng({AA: 1, BB: 1, CC: 1, ABC: 1}, {bias: 4})


export {
  proportionsCardCost,
  effectsProportions,
  topEffectList,
  bottomEffectList,
  attackList,
  attackListMapping,
  effectToValueMapping,
  cardCostRoller,
  costToMaxValueMapping,
  topOrBottomRoller,
  comboTypeRoller,
  effectDisplayPriority,
}

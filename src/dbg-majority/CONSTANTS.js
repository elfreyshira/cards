import Brng from 'brng'
import _ from 'lodash'

const ATTACK_TOP_BASE_PROPORTION = 3

const ATTACK_TOP_VALUE = 100

const ATTAK_BOTTOM_BASE_PROPORTION = 3
const ATTACK_BOTTOM_RELATIVE_VALUE = 1
const MOVE_VALUE = ATTACK_TOP_VALUE/2

const effectsProportions = {
  fireTop: ATTACK_TOP_BASE_PROPORTION,
  earthTop: ATTACK_TOP_BASE_PROPORTION,
  waterTop: ATTACK_TOP_BASE_PROPORTION,
  // wildTop: ATTACK_TOP_BASE_PROPORTION,
  // push: 3,
  // pull: 6,

  fireBottom: ATTAK_BOTTOM_BASE_PROPORTION,
  earthBottom: ATTAK_BOTTOM_BASE_PROPORTION,
  waterBottom: ATTAK_BOTTOM_BASE_PROPORTION,
  wildBottom: ATTAK_BOTTOM_BASE_PROPORTION,

  move: 5,

  money: 13,

  // action: 5,
  draw: 10,
  // cycle: 3,
  trash: 3,
  // energy: 7,
}

const comboProportions = _.pick(effectsProportions, [
  'fireTop',
  'earthTop',
  'waterTop',
  // 'wildTop',
  // 'push',
  // 'pull',
  'fireBottom',
  'earthBottom',
  'waterBottom',
  'wildBottom',
  // 'move',
  'money',
  // 'action',
  'draw',
  // 'cycle',
  'trash',
  // 'energy',
])


const topEffectList = [
  'fireTop', 'earthTop', 'waterTop',
  // 'wildTop',
  'money', 'draw',
  // 'cycle',
  'trash',
  'move',
  // 'action',
]
const bottomEffectList = ['fireBottom', 'earthBottom', 'waterBottom', 'wildBottom', 'money', 'trash']

const attackList = [
  'fireTop', 'earthTop', 'waterTop',
  // 'wildTop',
  'fireBottom', 'earthBottom', 'waterBottom', 'wildBottom',
]

const effectDisplayPriority = [
  'fireTop', 'earthTop', 'waterTop',
  // 'wildTop',
  'fireBottom', 'earthBottom', 'waterBottom', 'wildBottom',
  'move',
  'money', 'draw',
  'cycle',
  'trash', 'energy',
  // 'action',
]

// const comboExclusion = ['wildTop', 'wildBottom']
const comboExclusion = []

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
  fireTop: ATTACK_TOP_VALUE,
  earthTop: ATTACK_TOP_VALUE,
  waterTop: ATTACK_TOP_VALUE,
  // wildTop: ATTACK_TOP_VALUE + MOVE_VALUE,

  fireBottom: ATTACK_TOP_VALUE,
  earthBottom: ATTACK_TOP_VALUE,
  waterBottom: ATTACK_TOP_VALUE,
  wildBottom: ATTACK_TOP_VALUE + MOVE_VALUE,

  move: 100,

  // action: 100,
  money: 100,

  draw: 200,
  cycle: 100,
  trash: 150,
  energy: 50,
}

const COMBO_VALUE_FRACTION = {
  // wildTop: 2/3,
  wildBottom: 1/3,
  trash: 1/3,
}
function getComboValueFraction (effect) {
  if (_.has(COMBO_VALUE_FRACTION, effect)) {
    return COMBO_VALUE_FRACTION[effect]
  }
  else {
    return 0.5
  }
}

// const proportionsCardCost = {
//   1: 4,
//   2: 5,
//   3: 6,
//   4: 7, // middle
//   5: 6,
//   6: 5,
//   // 7: 4,
//   // 8: 3,
//   // 9: 2,
// }
const proportionsCardCost = {
  1: 2,
  2: 3,
  3: 4, // middle
  4: 4, // middle
  5: 3,
  6: 2,
  // 7: 4,
  // 8: 3,
  // 9: 2,
}
const cardCostRoller = new Brng(proportionsCardCost, {bias: 4, keepHistory: false})

const costToMaxValueMapping = {
  1: {first: 200, second: 200}, // 2
  2: {first: 300, second: 250}, // 275, // 2.5+3
  3: {first: 350, second: 350}, // 350, // 3.5
  4: {first: 400, second: 400}, // 400, // 4
  5: {first: 450, second: 450}, // 450, // 4.5
  6: {first: 500, second: 500}, // 500, // 5
  7: {first: 550, second: 500}, // 525, // 5+5.5
  8: {first: 600, second: 550}, // 575, // 5.5+6
  9: {first: 600, second: 600}, // 600, // 6
}

const topOrBottomRoller = new Brng({top: 1, bottom: 1}, {bias: 4})

const comboTypeRoller = new Brng({AA: 1, BB: 1, CC: 1, ABC: 1}, {bias: 4})



export {
  proportionsCardCost,
  comboProportions,
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
  comboExclusion,
  getComboValueFraction
}

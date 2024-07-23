import _ from 'lodash'

// rondel (rd) = residents. cost = goods. discount = community.
// worker placement (wp) = business. cost = labor. discount = morale.
// card river (cr) = government. cost = taxes. discount = productivity.
// favor = wild. 6 favor --> anything

const BASE_VALUE = 100
const DELAY_RESOURCES_VALUE = 40
const ON_WP_LEAVE_VALUE = 75
const DISCOUNT_VALUE = 150


// const crStrengthToAvailableValueMapping = {
//   1.0: [[0,0,1,1]],
//   1.5: [[0,0,0,1.5],[0,1.25,1.25,1.25]],
//   2.0: [[0,0,0,2],[0,0,1.75,1.75],[0,1.5,1.5,1.5],[1.25,1.25,1.25,1.25]],
//   2.5: [[0,0,0,2.5],[0,1.75,1.75,1.75]],
//   3.0: [[0,0,0,3],[0,0,2.5,2.5],[0,2,2,2],[1.5,1.5,1.5,1.5]],
//   3.5: [[0,0,0,3.5],[0,2.25,2.25,2.25]],
//   4.0: [[0,0,0,4],[0,0,3.25,3.25],[0,2.5,2.5,2.5],[1.75,1.75,1.75,1.75]],
//   4.5: [[0,0,0,4.5],[0,2.75,2.75,2.75]],
//   5.0: [[0,0,0,5],[0,0,4,4],[0,3,3,3],[2,2,2,2]],
//   5.5: [[0,0,0,5.5],[0,3.25,3.25,3.25]],
//   6.0: [[0,0,0,6],[0,0,4.75,4.75],[0,3.5,3.5,3.5],[2.25,2.25,2.25,2.25]],
// }

////// without the 1.5 strength, and without activation on the lowest value
const crStrengthToAvailableValueMapping = {
  1.0: [[0,0,1,1]],
  2.0: [[0,0,0,2],    [0,0,1.75,1.75],    [0,1.5,1.5,1.5]],
  2.5: [[0,0,0,2.5],  [0,0,2.125,2.125],  [0,1.75,1.75,1.75]],
  3.0: [[0,0,0,3],    [0,0,2.5,2.5],      [0,2,2,2]],
  3.5: [[0,0,0,3.5],  [0,0,2.875,2.875],  [0,2.25,2.25,2.25]],
  4.0: [[0,0,0,4],    [0,0,3.25,3.25],    [0,2.5,2.5,2.5]],
  4.5: [[0,0,0,4.5],  [0,0,3.625,3.625],  [0,2.75,2.75,2.75]],
  5.0: [[0,0,0,5],    [0,0,4,4],          [0,3,3,3]],
  5.5: [[0,0,0,5.5],  [0,0,4.375,4.375],  [0,3.25,3.25,3.25]],
  6.0: [[0,0,0,6],    [0,0,4.75,4.75],    [0,3.5,3.5,3.5]],
}



// RD: MOVE
// m = 0.22983163333332526
// b = -0.05564531111107751

// WP: RECALL
// m = 0.4853751666668089
// b = 0.03166229629571782

// WP: SEND
// m = 0.4264227083333329
// b = 0.5603863194444465

// CR: ACTIVATE 2ND SPOT
// m = 0.2616610833333324
// b = 0.07391025000000395

// CR: ACTIVATE 3RD SPOT
// m = 0.2906679166666663
// b = 0.713140555555557

// CR: ACTIVATE 4TH SPOT
// m = 0.4872330000000004
// b = 0.5264039722222205

// CR: DROP 4TH SPOT
// m = 0.1507544166666662
// b = -0.14884359259259095


const effectToValueFuncMapping = {
  
  // RONDEL
  goods: _.constant(BASE_VALUE),
  goodsDelay: _.constant(DELAY_RESOURCES_VALUE),
  goodsOnWPLeave: _.constant(ON_WP_LEAVE_VALUE),
  rdMove: ({strength}) => BASE_VALUE*(strength*0.22983163333332526 - 0.05564531111107751),
  rdMoveAndActivate: ({strength}) => BASE_VALUE*(strength*0.5 + 0.5) - effectToValueFuncMapping.rdMove({strength})/3,

  // WORKER PLACEMENT
  labor: _.constant(BASE_VALUE),
  laborDelay: _.constant(DELAY_RESOURCES_VALUE),
  // laborOnWPLeave: NONE, because WP spots can't produce labor
  wpRecall: ({strength}) => BASE_VALUE*(strength*0.4853751666668089 + 0.03166229629571782),
  wpSend: ({strength}) => BASE_VALUE*(strength*0.5 + 0.5),

  // CARD RIVER
  // cannot have any delayed resources.
  taxes: _.constant(BASE_VALUE),
  taxesDelay: _.constant(DELAY_RESOURCES_VALUE),
  taxesOnWPLeave: _.constant(ON_WP_LEAVE_VALUE),
  crDrop: ({strength}) => BASE_VALUE*(
    strength*0.1507544166666662 - 0.14884359259259095
    // (strength-1)*0.2
  ),
  crActivate2: ({strength}) => BASE_VALUE*(
    strength*0.2616610833333324 + 0.07391025000000395
    // effectToValueFuncMapping.crActivate4({strength})*0.5
  ),
  crActivate3: ({strength}) => BASE_VALUE*(
    strength*0.2906679166666663 + 0.713140555555557
    // effectToValueFuncMapping.crActivate4({strength})*0.75
  ),
  crActivate4: ({strength}) => BASE_VALUE*(
    strength*0.4872330000000004 + 0.5264039722222205
    // strength*0.5 + 0.5
  ),
  
  draw: _.constant(BASE_VALUE),
  drawOnWPLeave: _.constant(BASE_VALUE),
  // favor: _.constant(25),

}

const ACTION_RESOURCE_LIST = [
  'rdMove',
  'rdMoveAndActivate',

  'wpRecall',
  'wpSend',

  'crDrop',
  'crActivate2',
  'crActivate3',
  'crActivate4'
]


const PHYSICAL_RESOURCE_LIST = [
  'goods',
  'goodsDelay',
  'goodsOnWPLeave',

  'labor',
  'laborDelay',
  'laborOnWPLeave',

  'taxes',
  'taxesDelay',
  'taxesOnWPLeave',

  'draw',
  'drawOnWPLeave',
]
const PHYSICAL_NORMAL_RESOURCE_LIST = [
  'goods',
  'labor',
  'taxes',
  'draw',
]
const PHYSICAL_SPECIAL_RESOURCE_LIST = [
  'goodsDelay',
  'goodsOnWPLeave',
  'laborDelay',
  'laborOnWPLeave',
  'taxesDelay',
  'taxesOnWPLeave',
  'drawOnWPLeave',
]
const PHYSICAL_DELAY_RESOURCE_LIST = [
  'goodsDelay',
  'laborDelay',
  'taxesDelay',
]
const PHYSICAL_ON_LEAVE_RESOURCE_LIST = [
  'goodsOnWPLeave',
  'laborOnWPLeave',
  'taxesOnWPLeave',
  'drawOnWPLeave',
]




const GOODS_RESOURCE_LIST = [
  'goods',
  'goodsDelay',
  'goodsOnWPLeave',
]
const LABOR_RESOURCE_LIST = [
  'labor',
  'laborDelay',
  'laborOnWPLeave',
]
const TAXES_RESOURCE_LIST = [
  'taxes',
  'taxesDelay',
  'taxesOnWPLeave',
]
const DRAW_RESOURCE_LIST = [
  'draw',
  'drawOnWPLeave',
]


// global.effectToValueFuncMapping = effectToValueFuncMapping

// const ACTION_PROPORTION_MULTIPLIER = 0.0625
const ACTION_PROPORTION_MULTIPLIER = 0.06
const baseActionProportions = _.mapValues({  
  rdMove: 10,
  rdMoveAndActivate: 14,

  wpRecall: 11,
  wpSend: 13,

  crDrop: 6,
  crActivate2: 5,
  crActivate3: 6,
  crActivate4: 7,
}, (value) => value * ACTION_PROPORTION_MULTIPLIER)

const baseResourceProportions = {
  // RONDEL (residential)
  goods: 3,

  // WP (business)
  labor: 3,

  // CR (government)
  taxes: 3,

  draw: 2,
  // favor: just filler
}


// CR
const availableActionsForCr = [
  'rdMove', 'rdMoveAndActivate', 'wpRecall', 'wpSend']
const crActionProportions = _.pick(baseActionProportions, availableActionsForCr)

// const availableResourcesForCr = [
  // 'draw', 'goods', 'goodsDiscount', 'labor', 'laborDiscount']
// const crResourceProportions = _.pick(baseResourceProportions, availableResourcesForCr)
const crResourceProportions = {
  goods: 3,
  labor: 3,
  draw: 2,

  ...crActionProportions
}

// WP
const availableActionsForWp = [
  'rdMove', 'rdActivateBehindAndMove', 'rdMoveAndActivate',
  'crDrop', 'crActivate2', 'crActivate3', 'crActivate4']
const wpActionProportions = _.pick(baseActionProportions, availableActionsForWp)

// const availableResourcesForWp = ['draw', 'goods', 'goodsDiscount', 'taxes', 'taxesDiscount']
// const wpResourceProportions = _.pick(baseResourceProportions, availableResourcesForWp)
const wpResourceProportions = {
  goods: 2.0,
  goodsDelay: 0.5/(DELAY_RESOURCES_VALUE/BASE_VALUE),
  goodsOnWPLeave: 0.5/(ON_WP_LEAVE_VALUE/BASE_VALUE),


  taxes: 2.0,
  taxesDelay: 0.5/(DELAY_RESOURCES_VALUE/BASE_VALUE),
  taxesOnWPLeave: 0.5/(ON_WP_LEAVE_VALUE/BASE_VALUE),

  draw: 1.7,
  drawOnWPLeave: 0.3/(ON_WP_LEAVE_VALUE/BASE_VALUE),

  ...wpActionProportions
}

// RONDEL
const availableActionsForRd = [
  'wpRecall', 'wpSend',
  'crDrop', 'crActivate2', 'crActivate3', 'crActivate4']
const rdActionProportions = _.pick(baseActionProportions, availableActionsForRd)

// const availableResourcesForRd = ['draw', 'taxes', 'taxesDiscount', 'labor', 'laborDiscount']
// const rdResourceProportions = _.pick(baseResourceProportions, availableResourcesForRd)
const rdResourceProportions = {
  taxes: 2.5,
  taxesDelay: 0.5/(DELAY_RESOURCES_VALUE/BASE_VALUE),

  labor: 2.5,
  laborDelay: 0.5/(DELAY_RESOURCES_VALUE/BASE_VALUE),

  draw: 2,

  ...rdActionProportions
}


export {
  crStrengthToAvailableValueMapping,

  effectToValueFuncMapping,

  crActionProportions,
  crResourceProportions,

  wpActionProportions,
  wpResourceProportions,

  rdActionProportions,
  rdResourceProportions,

  ACTION_RESOURCE_LIST,
  
  PHYSICAL_RESOURCE_LIST,
  PHYSICAL_NORMAL_RESOURCE_LIST,
  PHYSICAL_DELAY_RESOURCE_LIST,
  PHYSICAL_SPECIAL_RESOURCE_LIST,
  PHYSICAL_ON_LEAVE_RESOURCE_LIST,

  GOODS_RESOURCE_LIST,
  LABOR_RESOURCE_LIST,
  TAXES_RESOURCE_LIST,
  DRAW_RESOURCE_LIST,
}

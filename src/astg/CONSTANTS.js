import _ from 'lodash'

// rondel (rd) = residents. cost = goods. discount = community.
// worker placement (wp) = business. cost = labor. discount = morale.
// card river (cr) = government. cost = taxes. discount = productivity.
// favor = wild. 6 favor --> anything

const BASE_RESOURCES_VALUE = 100
const DELAY_RESOURCES_VALUE = 40
const ON_WP_LEAVE_VALUE = 75
const DISCOUNT_VALUE = 150

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
  goods: _.constant(BASE_RESOURCES_VALUE),
  goodsDelay: _.constant(DELAY_RESOURCES_VALUE),
  goodsOnWPLeave: _.constant(ON_WP_LEAVE_VALUE),
  rdMove: ({strength}) => (strength*0.22983163333332526 - 0.05564531111107751),
  rdMoveAndActivate: ({strength}) => (strength*0.5 + 0.5 - effectToValueFuncMapping.rdMove(strength)/3),
  // rdMoveAndActivate: ({strength}) => (strength*0.5 + 0.5),

  // WORKER PLACEMENT
  labor: _.constant(BASE_RESOURCES_VALUE),
  laborDelay: _.constant(DELAY_RESOURCES_VALUE),
  // laborOnWPLeave: NONE, because WP spots can't produce labor
  wpRecall: ({strength}) => (0.4853751666668089*strength + 0.03166229629571782),
  wpSend: ({strength}) => (strength*0.5 + 0.5),

  // CARD RIVER
  // cannot have any delayed resources.
  taxes: _.constant(BASE_RESOURCES_VALUE),
  taxesDelay: _.constant(DELAY_RESOURCES_VALUE),
  taxesOnWPLeave: _.constant(ON_WP_LEAVE_VALUE),
  crDrop: ({strength}) => (
    strength*0.1507544166666662 - 0.14884359259259095
    // (strength-1)*0.2
  ),
  crActivate2: ({strength}) => (
    strength*0.2616610833333324 + 0.07391025000000395
    // effectToValueFuncMapping.crActivate4(strength)*0.5
  ),
  crActivate3: ({strength}) => (
    strength*0.2906679166666663 + 0.713140555555557
    // effectToValueFuncMapping.crActivate4(strength)*0.75
  ),
  crActivate4: ({strength}) => (
    strength*0.4872330000000004 + 0.5264039722222205
    // strength*0.5 + 0.5
  ),
  
  card: _.constant(BASE_RESOURCES_VALUE),
  // favor: _.constant(25),

}

global.effectToValueFuncMapping = effectToValueFuncMapping

const baseActionProportions = {
  rdMove: 10,
  rdMoveAndActivate: 14,

  wpRecall: 10,
  wpSend: 14,

  crDrop: 8,
  crActivate2: 5,
  crActivate3: 5,
  crActivate4: 6,
}

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
const cardRiverActionProportions = _.pick(baseActionProportions, availableActionsForCr)

// const availableResourcesForCr = [
  // 'draw', 'goods', 'goodsDiscount', 'labor', 'laborDiscount']
// const cardRiverResourceProportions = _.pick(baseResourceProportions, availableResourcesForCr)
const cardRiverResourceProportions = {
  goods: 3,

  labor: 3,
}

// WP
const availableActionsForWp = [
  'rdMove', 'rdActivateBehindAndMove', 'rdMoveAndActivate',
  'crDrop', 'crActivate2', 'crActivate3', 'crActivate4']
const workerPlacementActionProportions = _.pick(baseActionProportions, availableActionsForWp)

// const availableResourcesForWp = ['draw', 'goods', 'goodsDiscount', 'taxes', 'taxesDiscount']
// const workerPlacementResourceProportions = _.pick(baseResourceProportions, availableResourcesForWp)
const workerPlacementResourceProportions = {
  goods: 2.0,
  goodsDelay: 0.5/(DELAY_RESOURCES_VALUE/BASE_RESOURCES_VALUE),
  goodsOnWPLeave: 0.5/(ON_WP_LEAVE_VALUE/BASE_RESOURCES_VALUE),


  taxes: 2.0,
  taxesDelay: 0.5/(DELAY_RESOURCES_VALUE/BASE_RESOURCES_VALUE),
  taxesOnWPLeave: 0.5/(ON_WP_LEAVE_VALUE/BASE_RESOURCES_VALUE),
}

// RONDEL
const availableActionsForRd = [
  'wpRecall', 'wpSend',
  'crDrop', 'crActivate2', 'crActivate3', 'crActivate4']
const rondelActionProportions = _.pick(baseActionProportions, availableActionsForRd)

// const availableResourcesForRd = ['draw', 'taxes', 'taxesDiscount', 'labor', 'laborDiscount']
// const rondelResourceProportions = _.pick(baseResourceProportions, availableResourcesForRd)
const rondelResourceProportions = {
  taxes: 2.5,
  taxesDelay: 0.5/(DELAY_RESOURCES_VALUE/BASE_RESOURCES_VALUE),

  labor: 2.5,
  laborDelay: 0.5/(DELAY_RESOURCES_VALUE/BASE_RESOURCES_VALUE),
}


export {
  effectToValueFuncMapping,
  cardRiverActionProportions,
  cardRiverResourceProportions,
  workerPlacementActionProportions,
  workerPlacementResourceProportions,
  rondelActionProportions,
  rondelResourceProportions
}

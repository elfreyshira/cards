import _ from 'lodash'

// rondel (rd) = residents. cost = goods. discount = community.
// worker placement (wp) = business. cost = labor. discount = morale.
// card river (cr) = government. cost = taxes. discount = productivity.
// favor = wild. 6 favor --> anything

const DELAY_RESOURCES_VALUE = 40
const ON_WP_LEAVE_VALUE = 75
const DISCOUNT_VALUE = 150

const effectToValueFuncMapping = {
  
  // RONDEL
  goods: _.constant(100),
  goodsDelay: _.constant(DELAY_RESOURCES_VALUE),
  goodsDiscount: _.constant(DISCOUNT_VALUE),
  goodsOnWPLeave: _.constant(ON_WP_LEAVE_VALUE),
  rdMove: (strength) => (strength*0.2621847333333209 - 0.16588682222216267),
  rdMoveAndActivate: (strength) => (strength*0.5 + 0.5 - effectToValueFuncMapping.rdMove(strength)/3),
  // rdMoveAndActivate: (strength) => (strength*0.5 + 0.5),

  // WORKER PLACEMENT
  labor: _.constant(100),
  laborDelay: _.constant(DELAY_RESOURCES_VALUE),
  laborDiscount: _.constant(DISCOUNT_VALUE),
  // laborOnWPLeave: NONE, because WP spots can't produce labor
  wpRecall: (strength) => (0.38206275000000006*strength - 0.04906238888888902),
  wpSend: (strength) => (strength*0.5 + 0.5),

  // CARD RIVER
  // cannot have any delayed resources.
  taxes: _.constant(100),
  taxesDelay: _.constant(DELAY_RESOURCES_VALUE),
  taxesDiscount: _.constant(DISCOUNT_VALUE),
  taxesOnWPLeave: _.constant(ON_WP_LEAVE_VALUE),
  crDrop: (strength) => (
    // strength*0.16644334166665967 - 0.1676560888888886
    (strength-1)*0.2
  ),
  crActivate2: (strength) => (
    strength*0.2320048958333338 + 0.3280226944444423
    // effectToValueFuncMapping.crActivate4(strength)*0.5
  ),
  crActivate3: (strength) => (
    strength*0.2625648333333326 + 0.7070115972222251
    // effectToValueFuncMapping.crActivate4(strength)*0.75
  ),
  crActivate4: (strength) => (
    // strength*0.43509335000000005 + 0.5653263916666664 + effectToValueFuncMapping.crDrop(strength)
    strength*0.43509335000000005 + 0.5653263916666664
    // strength*0.5 + 0.5
  ),
  
  card: _.constant(100),
  favor: _.constant(25),

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
  goodsDiscount: 1,

  // WP (business)
  labor: 3,
  laborDiscount: 1,

  // CR (government)
  taxes: 3,
  taxesDiscount: 1,

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
  goodsDiscount: 1,

  labor: 3,
  laborDiscount: 1,
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
  goodsDelay: 0.5/(DELAY_RESOURCES_VALUE/100),
  goodsOnWPLeave: 0.5/(ON_WP_LEAVE_VALUE/100),
  goodsDiscount: 1,


  taxes: 2.0,
  taxesDelay: 0.5/(DELAY_RESOURCES_VALUE/100),
  taxesOnWPLeave: 0.5/(ON_WP_LEAVE_VALUE/100),
  taxesDiscount: 1,
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
  taxesDelay: 0.5/(DELAY_RESOURCES_VALUE/100),
  taxesDiscount: 1,

  labor: 2.5,
  laborDelay: 0.5/(DELAY_RESOURCES_VALUE/100),
  laborDiscount: 1,
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

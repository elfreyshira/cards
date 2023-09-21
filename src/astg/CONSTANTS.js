import _ from 'lodash'

// rondel (rd) = residents. cost = goods. discount = community.
// worker placement (wp) = business. cost = labor. discount = morale.
// card river (cr) = government. cost = taxes. discount = productivity.
// favor = wild. 6 favor --> anything

const DELAY_RESOURCES_VALUE = 40

const effectToValueFuncMapping = {
  
  // RONDEL
  goods: _.constant(100),
  delayGoods: _.constant(DELAY_RESOURCES_VALUE),
  discountGoods: _.constant(150),
  rdMove: (strength) => (strength*0.3514782366666686 - 0.23139118000001965),
  rdActivateBehindAndMove: (strength) => (strength/2 + 0.5 + effectToValueFuncMapping.rdMove(strength)),
  rdMoveAndActivate: (strength) => (strength/2 + 0.5 + effectToValueFuncMapping.rdMove(strength)),

  // WORKER PLACEMENT
  labor: _.constant(100),
  delayLabor: _.constant(DELAY_RESOURCES_VALUE),
  discountLabor: _.constant(150),
  wpRecall: (strength) => (strength*0.30559518666668356 - 0.03914186888898352),
  wpSend: (strength) => (strength*0.5 + 0.5),

  // CARD RIVER
  // cannot have any delayed resources. therefore no goods/discountLabor
  taxes: _.constant(100),
  delayTaxes: _.constant(DELAY_RESOURCES_VALUE),
  discountTaxes: _.constant(150),
  crDrop: (strength) => (strength*0.16644334166665967 - 0.1676560888888886),
  crActivate2: (strength) => (
    strength*0.2320048958333338 + 0.3280226944444423 + effectToValueFuncMapping.crDrop(strength)/3
  ),
  crActivate3: (strength) => (
    strength*0.2625648333333326 + 0.7070115972222251 + effectToValueFuncMapping.crDrop(strength)/3*2
  ),
  crActivate4: (strength) => (
    strength*0.43509335000000005 + 0.5653263916666664 + effectToValueFuncMapping.crDrop(strength)
  ),
  
  draw: _.constant(100),
  favor: _.constant(25),

}

const baseActionProportions = {
  rdMove: 12,
  rdActivateBehindAndMove: 6,
  rdMoveAndActivate: 6,

  wpRecall: 12,
  wpSend: 12,

  crDrop: 12,
  crActivate2: 4,
  crActivate3: 4,
  crActivate4: 4,
}

const baseResourceProportions = {
  // RONDEL (residential)
  goods: 3,
  discountGoods: 1,

  // WP (business)
  labor: 3,
  discountLabor: 1,

  // CR (government)
  taxes: 3,
  discountTaxes: 1,

  draw: 2,
  // favor: just filler
}


// CR
const availableActionsForCr = [
  'rdMove', 'rdActivateBehindAndMove', 'rdMoveAndActivate', 'wpRecall', 'wpSend']
const cardRiverActionProportions = _.pick(baseActionProportions, availableActionsForCr)

// const availableResourcesForCr = [
  // 'draw', 'goods', 'discountGoods', 'labor', 'discountLabor']
// const cardRiverResourceProportions = _.pick(baseResourceProportions, availableResourcesForCr)
const cardRiverResourceProportions = {
  draw: 2,

  goods: 3,
  discountGoods: 1,

  labor: 3,
  discountLabor: 1,
}

// WP
const availableActionsForWp = [
  'rdMove', 'rdActivateBehindAndMove', 'rdMoveAndActivate',
  'crDrop', 'crActivate2', 'crActivate3', 'crActivate4']
const workerPlacementActionProportions = _.pick(baseActionProportions, availableActionsForWp)

// const availableResourcesForWp = ['draw', 'goods', 'discountGoods', 'taxes', 'discountTaxes']
// const workerPlacementResourceProportions = _.pick(baseResourceProportions, availableResourcesForWp)
const workerPlacementResourceProportions = {
  draw: 2,

  goods: 2.5,
  delayGoods: 0.5/(DELAY_RESOURCES_VALUE/100),
  discountGoods: 1,

  taxes: 2.5,
  delayTaxes: 0.5/(DELAY_RESOURCES_VALUE/100),
  discountTaxes: 1,
}

// RONDEL
const availableActionsForRd = [
  'wpRecall', 'wpSend',
  'crDrop', 'crActivate2', 'crActivate3', 'crActivate4']
const rondelActionProportions = _.pick(baseActionProportions, availableActionsForRd)

// const availableResourcesForRd = ['draw', 'taxes', 'discountTaxes', 'labor', 'discountLabor']
// const rondelResourceProportions = _.pick(baseResourceProportions, availableResourcesForRd)
const rondelResourceProportions = {
  draw: 2,

  taxes: 2.5,
  delayTaxes: 0.5/(DELAY_RESOURCES_VALUE/100),
  discountTaxes: 1,

  labor: 2.5,
  delayLabor: 0.5/(DELAY_RESOURCES_VALUE/100),
  discountLabor: 1,
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

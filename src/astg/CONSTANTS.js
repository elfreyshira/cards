import _ from 'lodash'

// rondel (rd) = residents. cost = goods. discount = community.
// worker placement (wp) = business. cost = labor. discount = morale.
// card river (cr) = government. cost = taxes. discount = productivity.
// favor = wild. 6 favor --> anything

const DELAY_RESOURCES_VALUE = 40

const RESOURCE_TO_VALUE_MAPPING = {
  goods: 100,
  goodsDelay: 40,
  goodsDiscount: 150,
  goodsOnWPLeave: 66,

  taxes: 100,
  taxesDelay: 40,
  taxesDiscount: 150,
  taxesOnWPLeave: 66,

  labor: 100,
  laborDelay: 40,
  laborDiscount: 150,
  // taxesOnWPLeave NONE

}

const effectToValueFuncMapping = {
  
  // RONDEL
  goods: _.constant(100),
  goodsDelay: _.constant(DELAY_RESOURCES_VALUE),
  goodsDiscount: _.constant(150),
  rdMove: (strength) => (strength*0.3514782366666686 - 0.23139118000001965),
  rdMoveAndActivate: (strength) => (strength/2 + 0.5 - effectToValueFuncMapping.rdMove(strength)/2),

  // WORKER PLACEMENT
  labor: _.constant(100),
  laborDelay: _.constant(DELAY_RESOURCES_VALUE),
  laborDiscount: _.constant(150),
  wpRecall: (strength) => (0.38206275000000006*strength - 0.04906238888888902),
  wpSend: (strength) => (strength*0.5 + 0.5),

  // CARD RIVER
  // cannot have any delayed resources. therefore no Delay
  taxes: _.constant(100),
  taxesDelay: _.constant(DELAY_RESOURCES_VALUE),
  taxesDiscount: _.constant(150),
  crDrop: (strength) => (
    // strength*0.16644334166665967 - 0.1676560888888886
    (strength-1)*0.2
  ),
  crActivate2: (strength) => (
    // strength*0.2320048958333338 + 0.3280226944444423 + effectToValueFuncMapping.crDrop(strength)/3
    effectToValueFuncMapping.crActivate4(strength)*0.5*0.8
  ),
  crActivate3: (strength) => (
    // strength*0.2625648333333326 + 0.7070115972222251 + effectToValueFuncMapping.crDrop(strength)/3*2
    effectToValueFuncMapping.crActivate4(strength)*0.75*0.8
  ),
  crActivate4: (strength) => (
    // strength*0.43509335000000005 + 0.5653263916666664 + effectToValueFuncMapping.crDrop(strength)
    strength*0.5 + 0.5
  ),
  
  card: _.constant(100),
  favor: _.constant(25),

}

global.effectToValueFuncMapping = effectToValueFuncMapping

const baseActionProportions = {
  rdMove: 12,
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
  draw: 2,

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
  draw: 2,

  goods: 2.5,
  goodsDelay: 0.5/(DELAY_RESOURCES_VALUE/100),
  goodsDiscount: 1,

  taxes: 2.5,
  taxesDelay: 0.5/(DELAY_RESOURCES_VALUE/100),
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
  draw: 2,

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

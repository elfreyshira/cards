import Brng from 'brng'
import _ from 'lodash'


import {
  generateConsistentMoment,
  generateRandomMoment,
  generateIncreaseMoment,
  generateDecreaseMoment
} from './generate-moment-cards.js'

import checkSimilarity from './check-similarity.js'
import Card from './Card.js'

import './index.css';

/*
card obj
--------------------
type: spot, upgrade, home, tap
spotSpaces: 1-2 (if 1: x1.5, if 2: x2, if 3: x2.5)
spotUpgrades: 0-2 (if 1: x1, if 0: x0.8, if 2: x1.2)
spotLevel: 1-3
points: 1-6
cost: {
  fire: 1,
  water: 1,
  air: 1,
  earth: 1,
}
loss: { // not for home cards.
  // 50% of the spots
  // 100% of the tap cards
  // 25% of the upgrades
  // 0% of the home cards
  money: 2,
  card: 2,
  fire: 2,
  water: 2,
  air: 2,
  earth: 2,
  wild: 4,
  tapAnother: 1, (-100 value)
}
gain for homes: { // all cards
  money: 2,
  card: 2,
  fire: 2,
  water: 2,
  air: 2,
  earth: 2,
  wild: 3,

  develop: 3.5,
  untap: 1, (+100 value)
}
gain for taps: {
  retrieve: 2 // not for homes
}
gain for spots and upgrades: {
  retrieve: 3,
  chainLevel1: 1.5,
  chainLevel2: 1.5,
  chainLevel3: 0, // or make it 0
  // level 1: chain to level 1 == +75
  // level 2: chain to level 1 == +50

  // level 2: chain to level 2 == +150
  // level 3: chain to level 2 == +125
  
  // level 3: chain to level 3 == +225
}


bonus: { // instant effects
// 25% of the cards
// most of the rank cards (90%) (maybe some can have none, straight up points)
  gain: {
    develop: 2,
    retrieve: 2,
    chainLevel1: 1,
    chainLevel2: 1,
    chainLevel3: 0, // don't want this early game, so just make it 0
    untap: 1,

    ....
  }
}

{
  // don't want this i think, because getting this early game would be better than late game
  treatAsLevel1: 0, 
  treatAsLevel2: 0,
}

card distribution:
- spots: 30
- upgrades: 15
- homes: 15
- tap: 15
------------------------------------
SPOTS
// avg cost (-100 for the card/develop base cost)
level 1. 1-2 points. = 175
level 1. 3-4 points. = 275
level 1. 5-6 points. = 375
avg: 275

175*2+50*1.5-100
level 2. 1-2 points. = 325
level 2. 3-4 points. = 425
level 2. 5-6 points. = 525
avg: 425

275*2+50*1.5-100
level 3. 1-2 points. = 525
level 3. 3-4 points. = 625
level 3. 5-6 points. = 725
avg: 625

level 1: 8
level 2: 12
level 3: 10

avg cost of spots: 451.67
------------------------------------
UPGRADES
+50: 4
+100: 8
+150: 3

(50*2*4+100*2*8+150*2*3+3.5*50*15-100*15)/15
avg cost of upgrades = 268.3
------------------------------------
HOMES
+100: 5
+150: 4
+200: 3
+250: 3

(100*2*5 + 150*2*4 + 200*2*3 + 250*2*3 + 3.5*50*15 - 100*15) / 15
avg cost of homes = 401.7
------------------------------------
TAP
+50: 4
+100: 7
+150: 4

(50*2*4+100*2*7+150*2*4+3.5*50*15-100*15)/15
avg cost of tap cards = 275
------------------------------------

(451.67*30 + 268.3*15 + 401.7*15 + 275*15)/(30+15+15+15)
avg cost of all cards = 370

--------------------------------

if avg cost of ranked cards are 300
then can have a ratio of 3:1 for elements:develop. which hopefully means you'll have more chances to develop than in general.

therefore: make it a 3:1 ratio for the cards. the rest of the develop can come from: 1-time bonus, rank bonus.

*/

const SPOT = '_SPOT'
const UPGRADE = 'UPGRADE'
const HOME = '__HOME'
const TAP = '___TAP'

const MIN_POINTS_MAP = {
  POINTS_1_4: 1,
  POINTS_5_8: 5,
  POINTS_9_12: 9
}
const LEVELS = {
  LEVEL_1: 'LEVEL_1',
  LEVEL_2: 'LEVEL_2',
  LEVEL_3: 'LEVEL_3',
}
const LEVELS_MAX_VALUE = {
  LEVEL_1: 100,
  LEVEL_2: 200,
  LEVEL_3: 300
}

const RESOURCE_GAIN_VALUE = {
  money: _.constant(25),
  card: _.constant(50),
  fire: _.constant(100),
  water: _.constant(100),
  // air: _.constant(100),
  earth: _.constant(100),
  wild: _.constant(120),
  // develop: _.constant(50),
  // untap: _.constant(100),
  untap: (type) => {
    if (type === HOME) {
      // untap for home doesn't have any effect when activated on rest.
      // therefore it's less valuable on a HOME card.
      return 115
    }
    else {
      return 140
    }
  },
  retrieve: _.constant(70), // 50 OR 75??
  chainLevel1: _.constant(65),
  chainLevel2: _.constant(130)
}

const RESOURCE_LOSS_VALUE = {
  // money: 50,
  // card: 37.5, // discarding unwanted cards doesn't hurt as much
  fire: 100,
  water: 100,
  // air: 100,
  earth: 100,
  wild: 80,
  tapAnother: 130 // at first was thinking 100. but just like a wild, it gives freedom to what you want to tap, so make it -75
}

const ACTION_RESOURCE_ARRAY = ['retrieve', 'chainLevel1', 'chainLevel2']

// const ABSTRACT_RESOURCE_ARRAY = ['develop', 'untap', 'retrieve','chainLevel1','chainLevel2']
const ABSTRACT_RESOURCE_ARRAY = ['untap', 'retrieve','chainLevel1','chainLevel2']
const SPECIAL_RESOURCE_ARRAY = ['money', 'card']

// const PHYSICAL_RESOURCE_ARRAY = ['fire', 'water', 'air', 'earth', 'wild']
const PHYSICAL_RESOURCE_ARRAY = ['fire', 'water', 'earth', 'wild']

function excludeValuesAbove (value, type) {
  return _.keys(
    _.omitBy(RESOURCE_GAIN_VALUE, (func) => {
      return func(type) <= value
    })
  )  
}


let cardsArray = []

// SPOT
_.times(5, () => {
  cardsArray.push({
    type: SPOT,
    spotLevel: LEVELS.LEVEL_1,
    // maxValue: 100
    maxValue: 125
  })
})
_.times(8, () => {
  cardsArray.push({
    type: SPOT,
    spotLevel: LEVELS.LEVEL_2,
    // maxValue: 200
    maxValue: 225
  })
})
_.times(7, () => {
  cardsArray.push({
    type: SPOT,
    spotLevel: LEVELS.LEVEL_3,
    // maxValue: 300
    maxValue: 325
  })
})


// HOME
_.times(5, () => {
  cardsArray.push({
    type: HOME,
    maxValue: 125
  })
})
_.times(5, () => {
  cardsArray.push({
    type: HOME,
    maxValue: 175
  })
})
_.times(5, () => {
  cardsArray.push({
    type: HOME,
    maxValue: 225
  })
})

// TAP
_.times(4, () => {
  cardsArray.push({
    type: TAP,
    maxValue: 125
  })
})
_.times(5, () => {
  cardsArray.push({
    type: TAP,
    maxValue: 175
  })
})
_.times(6, () => {
  cardsArray.push({
    type: TAP,
    maxValue: 225
  })
})


const cardPointsRoller = new Brng({
  POINTS_1_4: 1,
  POINTS_5_8: 1,
  // POINTS_9_12: 0.5
}, {bias: 3})

_.forEach(cardsArray, (cardObj) => {
  let excludeList = []
  if (cardObj.maxValue <= 50) { // for the small tap cards
    excludeList = ['POINTS_1_4']
  }
  cardObj.points = cardPointsRoller.roll({exclude: excludeList})
  cardObj.uuid = Math.random().toString(36).slice(2)
})
// for non-abstract 1475
// for abstract 510
const resourceGainRoller = new Brng({
// const spotGainRoller = new Brng({
  money: 3.5,
  card: 2.3,
  fire: 3,
  water: 3,
  // air: 2,
  earth: 3,
  wild: 3,
  // develop: 2.5,
  untap: 1.7,
  retrieve: 1.4,
  chainLevel1: 2.1, // added on later
  // chainLevel2: 1.6 // added on later
}, {
  keepHistory: true,
  bias: 4
})

const spotLossNumRoller = new Brng({0: 1, 1: 1}, {keepHistory: true, bias: 3})

const lossResourceRoller = new Brng({
  // money: 2,
  // card: 2,
  fire: 2,
  water: 2,
  // air: 1.75,
  earth: 2,
  wild: 5,
  tapAnother: 1, // (-120 value)
}, {
  keepHistory: true,
  bias: 4
})

// const homeGainRoller = new Brng({
//   money: 3,
//   card: 2,
//   fire: 2,
//   water: 2,
//   air: 2,
//   earth: 2,
//   wild: 4,
//   // develop: 2.5,
//   untap: 3,
// }, {
//   keepHistory: true,
//   bias: 2
// })

const tapLossNumRoller = new Brng({1: 1}, {keepHistory: true, bias: 2})
// const tapGainRoller = new Brng({
//   money: 3,
//   card: 2,
//   fire: 2,
//   water: 2,
//   air: 2,
//   earth: 2,
//   wild: 4,
//   // develop: 2.5,
//   // untap: 0.5,
//   retrieve: 3
// }, {
//   keepHistory: true,
//   bias: 2
// })

cardsArray = _.sortBy(cardsArray, ['type', 'maxValue', 'points'])

// add how many spaces the spot has
// const spotNumSpaceRoller = new Brng({1: 1, 2: 1}, {bias: 2})
// _.forEach(cardsArray, (cardObj) => {
//   if (cardObj.type === SPOT) {
//     // cardObj.spotSpaces = _.toNumber(spotNumSpaceRoller.roll())
//     cardObj.spotSpaces = 1
//   }
// })

// cardsArray = _.sortBy(cardsArray, ['type', 'maxValue', 'points'])

// add whether it has a bonus or not
// const cardHasBonusRoller = new Brng({hasBonus: 1, noBonus: 2}, {bias: 2})

// const discardEffectRoller = new Brng({
//   discard1moneyAnd1Wild_untap: 2,
//   discard1money_retrieve: 2,
//   discard1money_chainLevel1: 1.2,
//   discard1moneyAnd1Wild_chainLevel2: 0.8,

//   money2: 2,
//   draw: 2,
//   discard1Wild_wild: 2,
//   discard3money_wild: 2,
// }, {keepHistory: true, bias: 2})

// _.forEach(cardsArray, (cardObj) => {
//   cardObj.discardEffect = discardEffectRoller.roll()
// })

// cardsArray = _.sortBy(cardsArray, ['type', 'maxValue', 'points', 'discardEffect'])


/*
rules for the resource loss and gain:
- only have 1 type of resource loss, but can be repeated
- only deal with 3 resources total (loss variety + gain variety <= 3)
- only should deal with 2 physical resource gains (money, elements, wild, cards)
- max of 1 chainLevel per card
- for the abstract resources, max of 1 per resource
*/


// returns undoChainArray
function getLossAndGain(cardObj) {
  const undoChainArray = []

  const fixedMaxValue = cardObj.maxValue
  let currentMaxValue = fixedMaxValue
  let currentValue = 0
  let excludeList = []

  let loopTimes = 0
  let onlyInclude = []

  let hasLimitedPhysicalResource = false
  let hasLimitedTotalResource = false
  let hasAlreadyEnforcedPhysical = false

  /// START: RESOURCE LOSS
  /// START: RESOURCE LOSS
  const lossObj = {}
  if (cardObj.type !== HOME && cardObj.spotLevel !== LEVELS.LEVEL_1) { 
    // only for SPOT and TAP, not for HOME
    // level1 spots shouldn't have losses
    
    let lossNumRoller
    if (cardObj.type === SPOT) lossNumRoller = spotLossNumRoller
    else if (cardObj.type === TAP) lossNumRoller = tapLossNumRoller
    
    let numResourceLoss = _.toNumber(lossNumRoller.roll())
    undoChainArray.push(() => lossNumRoller.undo())

    if (numResourceLoss > 0) {
      const chosenResourceLoss = lossResourceRoller.roll()
      undoChainArray.push(() => lossResourceRoller.undo())
      lossObj[chosenResourceLoss] = numResourceLoss

      const valueLoss = RESOURCE_LOSS_VALUE[chosenResourceLoss]*numResourceLoss
      currentValue = currentValue - valueLoss
      currentMaxValue = currentMaxValue + valueLoss

      excludeList.push(chosenResourceLoss)

      // don't have tapAnother and untap on the same card
      if (chosenResourceLoss === 'tapAnother') {
        excludeList.push('untap')
      }
    } 
  }
  /// END: RESOURCE LOSS
  /// END: RESOURCE LOSS


  // START: RESOURCE GAIN
  // START: RESOURCE GAIN
  const gainObj = {}
  while (currentValue < (fixedMaxValue-25) && loopTimes <= 10) {
    loopTimes++
    if (loopTimes === 10) {
      console.log(loopTimes)
      console.log(gainObj)
    }

    // don't have chainLevel2 on level 1 cards
    if (cardObj.spotLevel === LEVELS.LEVEL_1) {
      excludeList = _.uniq(excludeList.concat('chainLevel2'))
    }

    const chosenResource = _.attempt(() => resourceGainRoller.roll({
      only: _.isEmpty(onlyInclude) ? undefined : onlyInclude,
      exclude: _.uniq(excludeValuesAbove(currentMaxValue, cardObj.type).concat(excludeList))
    }))

    if (_.isError(chosenResource)) {
      break
      console.log('----------------')
      console.log(chosenResource)
      console.log(JSON.stringify(gainObj))
      console.log(JSON.stringify(onlyInclude))
      console.log(JSON.stringify(excludeList))
      console.log(JSON.stringify(excludeValuesAbove(currentMaxValue).concat(excludeList)))
      console.log('-----------------')
      break
    }

    undoChainArray.push(() => resourceGainRoller.undo())

    // ADD CHOSEN RESOURCE TO THE CARD OBJ
    gainObj[chosenResource] = (gainObj[chosenResource] || 0) + 1

    // each abstract resource should only be once per card
    if (_.includes(ABSTRACT_RESOURCE_ARRAY, chosenResource)) {
      excludeList.push(chosenResource)
    }

    // each special resource should be called a max of 2 per card
    if (_.includes(SPECIAL_RESOURCE_ARRAY, chosenResource) && gainObj[chosenResource] === 2) {
      excludeList.push(chosenResource)
    }
    
    // if it has at least 2 physical resources, don't add anymore physical resources
    if (
      !hasLimitedPhysicalResource
      && _.intersection(
        _.keys(gainObj), PHYSICAL_RESOURCE_ARRAY
      ).length === 2
    ) {
      excludeList = _.uniq(
        excludeList.concat(_.without(PHYSICAL_RESOURCE_ARRAY, ..._.keys(gainObj)))
      )
      // onlyInclude = _.uniq(onlyInclude.concat(_.keys(gainObj).concat()))
      hasLimitedPhysicalResource = true
    }

    // can't have 2 of [retrieve, chainLevel1, chainLevel2] appear on the same card
    if (_.includes(ACTION_RESOURCE_ARRAY, chosenResource)) {
      excludeList = _.uniq(excludeList.concat(ACTION_RESOURCE_ARRAY))
    }

    // if there's already 2 resources, and none of them are physical
    // make sure the 3rd one is physical
    if (
      !hasAlreadyEnforcedPhysical
      && _.keys(gainObj).concat(_.keys(lossObj)).length === 2
      && currentMaxValue >= 100
      && _.intersection(_.keys(gainObj), PHYSICAL_RESOURCE_ARRAY).length === 0
    ) {
      hasAlreadyEnforcedPhysical = true
      // exclude all non-physical resource
      excludeList = _.uniq(excludeList.concat(ABSTRACT_RESOURCE_ARRAY).concat(SPECIAL_RESOURCE_ARRAY))
    }

    // if there's already 3 total resources involved, don't add anymore
    if (
      !hasLimitedTotalResource
      && _.keys(gainObj).concat(_.keys(lossObj)).length === 3
    ) {
      onlyInclude = _.keys(gainObj)
      
      // so that there isn't too much of "element: 3", and spreads it out
      if (currentMaxValue > 300) {
        onlyInclude = _.uniq(_.keys(gainObj).concat(PHYSICAL_RESOURCE_ARRAY))  
      }
      // !! reset the excludeList
      excludeList = _.cloneDeep(ABSTRACT_RESOURCE_ARRAY).concat(_.keys(lossObj))

      hasLimitedTotalResource = true
    }

    // UPDATE THE CURRENT MAX VALUE
    const valueGained = RESOURCE_GAIN_VALUE[chosenResource](cardObj.type)
    currentValue += valueGained
    currentMaxValue = currentMaxValue - valueGained

  }
  // END: RESOURCE GAIN
  // END: RESOURCE GAIN

  return {undoChainArray, lossObj, gainObj}
}


let currentCardType = SPOT
let hasAddedChainLevel1 = false
let hasAddedChainLevel2 = false

// order: SPOT, HOME, TAP
_.forEach(cardsArray, (cardObj, cardsArrayIndex) => {

  // add chainLevel2 once you're on spotLevel = 2
  if (!hasAddedChainLevel1 && cardObj.type === SPOT && cardObj.spotLevel !== LEVELS.LEVEL_1) {
    // resourceGainRoller.add({chainLevel1: 2})
    resourceGainRoller.add({chainLevel2: 1.6})
    hasAddedChainLevel1 = true
  }
  if (!hasAddedChainLevel2 && cardObj.type === SPOT && cardObj.spotLevel === LEVELS.LEVEL_3) {
    // resourceGainRoller.add({chainLevel2: 3})
    hasAddedChainLevel2 = true
  }


  // adjust the resourceGainRoller
  if (currentCardType !== cardObj.type) {
    if (cardObj.type === HOME) {
      currentCardType = HOME
      resourceGainRoller.remove('retrieve')
      resourceGainRoller.remove('chainLevel1')
      resourceGainRoller.remove('chainLevel2')
      resourceGainRoller.update({untap: 2})
    }
    else if (cardObj.type === TAP) {
      currentCardType = TAP
      resourceGainRoller.remove('untap')
      resourceGainRoller.add({retrieve: 2})
    }
  }

  // getLossAndGain(cardObj, cardsArrayIndex)
  // checkSimilarity(cardsArray.slice(0, cardsArrayIndex), _.cloneDeep(cardObj))

  let timesTriedToSetResources = 0
  while (true) {
    timesTriedToSetResources++
    const {undoChainArray, lossObj, gainObj} = getLossAndGain(cardObj)

    const newCardObj = _.cloneDeep(cardObj)
    if (!_.isEmpty(lossObj)) {
      newCardObj.loss = lossObj
    }
    newCardObj.gain = gainObj

    const {similarityRatio, mostSimilarCardObj} = checkSimilarity(
      cardsArray.slice(0, cardsArrayIndex), newCardObj)
    
    if (similarityRatio < 0.8 || timesTriedToSetResources > 10) {
      if (!_.isEmpty(lossObj)) {
        cardObj.loss = lossObj
      }
      cardObj.gain = gainObj

      if (similarityRatio >= 0.8 && timesTriedToSetResources > 10) {
        console.log('just gave up', similarityRatio, mostSimilarCardObj, cardObj)
      }
      break
    }
    else {
      // undoes everything and retries
      // console.log('failed!')
      _.over(undoChainArray)()
    }
  }
  

})


function roundToNearest25 (x) {
  return Math.round(x/25)*25
}


const COST_MULTIPLIER = {}
COST_MULTIPLIER[SPOT] = 1.4
COST_MULTIPLIER[HOME] = 1.6
COST_MULTIPLIER[TAP] = 1.5

// RESOURCE COST
_.forEach(cardsArray, (cardObj) => {
  let totalCostValue = 0
  // == (gain-loss)*multiplier + points - (default card cost)

  const lossValue = cardObj.loss ?
    RESOURCE_LOSS_VALUE[_.keys(cardObj.loss)[0]]*_.values(cardObj.loss)[0] : 0
  const gainValue = _.chain(cardObj.gain)
    .map((val, key) => RESOURCE_GAIN_VALUE[key](cardObj.type) * val)
    .sum()
    .value()
  
  // used to be 100 with 'develop', but now it's only 50
  const defaultCardCost = 50

  const multiplier = COST_MULTIPLIER[cardObj.type] 

  totalCostValue = (gainValue - lossValue)*multiplier - defaultCardCost

  const minPointsOnCard = MIN_POINTS_MAP[cardObj.points]
  let pointsOnCard = 0
  while (pointsOnCard < minPointsOnCard || roundToNearest25(totalCostValue)%100 !== 0) {
    pointsOnCard++
    totalCostValue += 25
  }

  cardObj.pointsOnCard = pointsOnCard
  cardObj.totalCostValue = roundToNearest25(totalCostValue)
  cardObj._usageValue = gainValue - lossValue
  
})

console.log(_.chain(cardsArray).map('totalCostValue').mean().value())
// average is usually 360

console.log(_.chain(cardsArray).map('totalCostValue').max().value())

const cost12VarietyRoller = new Brng({1:1, 2:1}, {keepHistory: true, bias: 2})
const cost123VarietyRoller = new Brng({1:1, 2:1, 3:1}, {keepHistory: true, bias: 2})
const cost23VarietyRoller = new Brng({2:1, 3:1}, {keepHistory: true, bias: 2})

const costToVarietyMap = {
  0: _.constant(1),
  100: _.constant(1),
  200: () => cost12VarietyRoller.roll(),
  300: () => cost12VarietyRoller.roll(),
  400: _.constant(2),
  500: _.constant(2),
  600: _.constant(2),
  700: _.constant(2),
  800: _.constant(3),
  900: _.constant(3)
}

const resourceCostRoller = new Brng({
  fire: 1,
  water: 1,
  earth: 1,
  // air: 1
}, {keepHistory: true, bias: 2})


// RESOURCE COST
cardsArray = _.sortBy(cardsArray, ['type', 'maxValue', 'totalCostValue', 'points', 'discardEffect'])

// returns resourceCostObj = {fire: 2, water: 1}
function getResourceCost (totalCostValue) {
  
  const costVariety = _.toNumber(costToVarietyMap[totalCostValue]())

  const resourceCostObj = {}
  let onlyResourceCost = []

  while (_.sum(_.values(resourceCostObj))*100 < totalCostValue) {
    const chosenResourceToPay = resourceCostRoller.roll(
      {only: _.isEmpty(onlyResourceCost) ? undefined : onlyResourceCost}
    )
    resourceCostObj[chosenResourceToPay] = (resourceCostObj[chosenResourceToPay] + 1) || 1

    if (_.isEmpty(onlyResourceCost) && costVariety === _.keys(resourceCostObj).length) {
      onlyResourceCost = _.keys(resourceCostObj)
    }
  }

  return resourceCostObj

}

_.forEach(cardsArray, (cardObj) => {
  cardObj.resourceCost = getResourceCost(cardObj.totalCostValue)
})

console.log(cardsArray)

console.log(resourceGainRoller.proportions)

////////////////////////////////////////////
////////////////////////////////////////////
////////////////////////////////////////////
////////////////////////////////////////////


// MOMENTS (rank cards)
let momentsArray = []

// SPOT
// const momentsConsistentCost = [2,2,3,3,3,4,4,4,5,5]
const momentsCost = [2,2,3,3,4]
_.times(5, (idx) => {
  momentsArray.push({
    type: 'CONSISTENT',
    cost: momentsCost[idx],
    bonus: {}, // {2: 'develop', 4: 'chainLevel1', 6: 'untap'}
    points: {} // {1: 10, 2: 10, 3: 10, ...}
  })
})
_.times(5, (idx) => {
  momentsArray.push({
    type: 'RANDOM',
    cost: momentsCost[idx],
    bonus: {},
    points: {}
  })
})
_.times(5, (idx) => {
  momentsArray.push({
    type: 'INCREASE',
    cost: momentsCost[idx],
    bonus: {},
    points: {}
  })
})
_.times(5, (idx) => {
  momentsArray.push({
    type: 'DECREASE', // make it barely decrease throughout the steps
    cost: momentsCost[idx],
    bonus: {},
    points: {}
  })
})

// const momentsBonusRoller = new Brng({
//   develop: 1,
//   untap: 1,
//   retrieve: 2,
//   chainLevel1: 1,
//   chainLevel2: 1,
// }, {keepHistory: true, bias: 2})

const momentHasBonusRoller = new Brng({
  hasBonus: 1,
  noBonus: 1
}, {keepHistory: true})
const momentBonusRoller = new Brng({
  untap: 2,
  retrieve: 2,
  chainLevel1: 1.2,
  chainLevel2: 0.8
})


_.forEach(momentsArray, (momentObj) => {
  
  // 5 steps
  _.times(5, (idx) => {
    if (momentHasBonusRoller.roll() === 'hasBonus') {
      
      // just use cardBonusRoller because it's the same resources
      momentObj.bonus[idx+1] = momentBonusRoller.roll()

      // brainstorm: could make it where each point not rightfully given, add 1/4 points until it's rightfully spent. essentially interest over a debt.
      /*
        for example: a 2 resource moments card, giving 0 points until the 6th step.
        1st step: 0 points (hold 8 points + 2 points)
        2nd: 0 points (hold 8 + 2 points)
        ...
        6th: = 8 (for this step) + 8*5 (held) + 2*5 (from points interest) = 58 (vs 48)
      */

      // or could make it a compounding interest almost? like: points held * 1.25? not sure how it would work though...
      /*
        maybe: points held * 1.2 * ratio of resources spent to claim it
        where ratio = 1+(resources/X) (where X=10 or something)
          -- maybe gotta add 0.5 to resources, since it requires a develop
        example: 2 resources, if X=10
        1: 0 points (8 held)
        2: 0 points (8 held + 8*(1+2/10) = 8 held + 9.6 to claim but not given)
        3: 0 points -- 8 held + 17.6*(1+2/10) = 8 + 21.12
        4: 0 points -- 8 held + 29.12*(1+2/10) = 8 + 34.944
        5: 0 points -- 8 held + 42.944*(1+2/10) = 8 + 51.53
        6: 8 + (59.53)*(1+2/10) = 79
        ***** maybe too strong? can tone it down. although, it IS a lot investing.
      */

      // WHAT IF: i have a separate thing for resource cost and rank points/bonus.
      // but then it'd require all resource costs to be the same. not sure if I want that.
    }
  })

  if (momentObj.type === 'CONSISTENT') {
    generateConsistentMoment(momentObj, RESOURCE_GAIN_VALUE)
  }
  else if (momentObj.type === 'RANDOM') {
    generateRandomMoment(momentObj, RESOURCE_GAIN_VALUE)
  }
  else if (momentObj.type === 'INCREASE') {
    generateIncreaseMoment(momentObj, RESOURCE_GAIN_VALUE)
  }
  else if (momentObj.type === 'DECREASE') {
    generateDecreaseMoment(momentObj, RESOURCE_GAIN_VALUE)
  }

  momentObj.resourceCost = getResourceCost(momentObj.cost * 100)
  
})

console.log('momentsArray')
console.log(momentsArray)

console.log('----------------------')
console.log('TAP _usageValue avg')
console.log(_.chain(cardsArray).filter({type:TAP}).map('_usageValue').value())
console.log(_.chain(cardsArray).filter({type:TAP}).map('_usageValue').mean().value())

console.log('----------------------')
console.log('SPOT, _usageValue, level 1 avg')
console.log(_.chain(cardsArray).filter({type:SPOT, spotLevel: LEVELS.LEVEL_1}).map('_usageValue').value())
console.log(_.chain(cardsArray).filter({type:SPOT, spotLevel: LEVELS.LEVEL_1}).map('_usageValue').mean().value())

console.log('----------------------')
console.log('SPOT, _usageValue, level 2 avg')
console.log(_.chain(cardsArray).filter({type:SPOT, spotLevel: LEVELS.LEVEL_2}).map('_usageValue').value())
console.log(_.chain(cardsArray).filter({type:SPOT, spotLevel: LEVELS.LEVEL_2}).map('_usageValue').mean().value())

console.log('----------------------')
console.log('SPOT, _usageValue, level 3 avg')
console.log(_.chain(cardsArray).filter({type:SPOT, spotLevel: LEVELS.LEVEL_3}).map('_usageValue').value())
console.log(_.chain(cardsArray).filter({type:SPOT, spotLevel: LEVELS.LEVEL_3}).map('_usageValue').mean().value())

console.log('----------------------')
console.log('HOME _usageValue avg')
console.log(_.chain(cardsArray).filter({type:HOME}).map('_usageValue').value())
console.log(_.chain(cardsArray).filter({type:HOME}).map('_usageValue').mean().value())

let lossCount = 0
_.forEach(
  cardsArray, obj=> {
    const objWithLoss = _.pick(obj.loss, ['wild', 'air', 'fire', 'water', 'earth'])
    if (!_.isEmpty(objWithLoss)) {
      lossCount++
    }
  }
)

let gainCount = 0
const lol = _.map(
  cardsArray, obj => {
    const objGain = _.pick(obj.gain, ['wild', 'air', 'fire', 'water', 'earth'])
    gainCount += _.sum(_.values(objGain))
    return objGain
  }
)

let airCount = 0
_.map(
  cardsArray, obj => {
    const objGain = _.pick(obj.gain, ['air'])
    airCount += _.sum(_.values(objGain))
    return objGain
  }
)

let fireCount = 0
_.map(
  cardsArray, obj => {
    const objGain = _.pick(obj.gain, ['fire'])
    fireCount += _.sum(_.values(objGain))
    return objGain
  }
)

let waterCount = 0
_.map(
  cardsArray, obj => {
    const objGain = _.pick(obj.gain, ['water'])
    waterCount += _.sum(_.values(objGain))
    return objGain
  }
)

let earthCount = 0
_.map(
  cardsArray, obj => {
    const objGain = _.pick(obj.gain, ['earth'])
    earthCount += _.sum(_.values(objGain))
    return objGain
  }
)

let wildCount = 0
_.map(
  cardsArray, obj => {
    const objGain = _.pick(obj.gain, ['wild'])
    wildCount += _.sum(_.values(objGain))
    return objGain
  }
)

let moneyCount = 0
_.map(
  cardsArray, obj => {
    const objGain = _.pick(obj.gain, ['money'])
    moneyCount += _.sum(_.values(objGain))
    return objGain
  }
)

let cardCount = 0
_.map(
  cardsArray, obj => {
    const objGain = _.pick(obj.gain, ['card'])
    cardCount += _.sum(_.values(objGain))
    return objGain
  }
)

let chainCount = 0
_.map(
  cardsArray, obj => {
    const objGain = _.pick(obj.gain, ['chainLevel1', 'chainLevel2'])
    chainCount += _.sum(_.values(objGain))
    return objGain
  }
)

let untapCount = 0
_.map(
  cardsArray, obj => {
    const objGain = _.pick(obj.gain, ['untap'])
    untapCount += _.sum(_.values(objGain))
    return objGain
  }
)

let retrieveCount = 0
_.map(
  cardsArray, obj => {
    const objGain = _.pick(obj.gain, ['retrieve'])
    retrieveCount += _.sum(_.values(objGain))
    return objGain
  }
)

console.log('lossCount', lossCount)
console.log('gainCount', gainCount)
console.log('net count', gainCount - lossCount)
console.log('moneyCount', moneyCount)
console.log('cardCount', cardCount)
console.log('chainCount', chainCount)
console.log('untapCount', untapCount)
console.log('retrieveCount', retrieveCount)
console.log('net resource gain / cardCount', (gainCount - lossCount)/cardCount)
console.log('net resource gain / moneyCount', (gainCount - lossCount)/moneyCount)

console.log('airCount', airCount)
console.log('fireCount', fireCount)
console.log('waterCount', waterCount)
console.log('earthCount', earthCount)
console.log('wildCount', wildCount)

////////////////////////////////////////////
////////////////////////////////////////////


// momentsArray
// cardsArray

const importantKeys = [
  'uuid',
  'type',
  'spotLevel',
  'pointsOnCard',
  'maxValue',
  'resourceCost',
  // 'totalCostValue',
  // 'discardEffect',
  'loss',
  'gain',
  '_usageValue'
]

function Cards () {
  return (
    <div>
      <pre>
        {/*{JSON.stringify(_.chain(cardsArray).map((obj) => _.pick(obj, importantKeys)).value(), null, 2)}*/}
        {/*{JSON.stringify(cardsArray, null, 2)}*/}
      </pre>

      {_.map(cardsArray, (obj) => {
        return <Card cardObj={_.pick(obj, importantKeys)} key={obj.uuid} />
      })}

      <pre>
        {/*{JSON.stringify(momentsArray, null, 2)}*/}
      </pre>
    </div>
  )
}



export default Cards

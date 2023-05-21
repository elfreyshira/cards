import Brng from 'brng'
import _ from 'lodash'

import {
  SPOT,
  HOME,
  TAP,
  MIN_POINTS_MAP,
  LEVELS,
  RESOURCE_GAIN_VALUE,
  RESOURCE_LOSS_VALUE,
  LATER_COUNT_ADDITIONAL_VALUE_MAPPING,
  /////////////
  PHYSICAL_RESOURCE_ARRAY,
  ///////////////
  spotResourceGainProportions,
  homeResourceGainProportions,
  tapResourceGainProportions,
  ////////////
  spotResourceLossProportions,
  homeResourceLossProportions,
  tapResourceLossProportions,
  pointGeneratorResourceLossProportions,
  //////////
  spotLevelProportions,
  spotLevelToMaxvalueMapping,
  homeMaxvalueProportions,
  tapMaxvalueProportions,
  //////
  spotResourceCostProportions,
  homeResourceCostProportions,
  tapResourceCostProportions,
} from './CONSTANTS.js'

import getNewIncludeExcludeList from './get-new-include-exclude-list.js'

import checkSimilarity from './check-similarity.js'
import {Card, Contract} from './Card.js'
// import ICONS from './icons.js'
import {Reference, Exchange, PlayATurn, PlayATurnSimultaneous} from './base-cards.js'


// import endGameCards from './end-game-cards.js'
// import './calculate-retrieve-cost.js'
// import './calculate-retrieve-cost-2.js'
// import './calculate-retrieve-cost-3.js'
// import './calculate-multiplier-cost.js'

// import contractsArray from './generate-contracts.js'
// import './calculate-avg-tag-value.js'

// import './generate-hex-spaces.js'

// import './generate-moments.js'


import './index.css';

function excludeValuesAbove (value, cardObj) {
  return _.keys(
    _.omitBy(RESOURCE_GAIN_VALUE, (func) => {
      return func(cardObj) <= value
    })
  )
}


let cardsArray = []

////////////////////////
/// RESOURCE GENERATORS
////////////////////////

// const cardsPerType = 0
// const cardsPerType = 5
const cardsPerType = 20
// const cardsPerType = 40

// SPOT
const spotLevelRoller = new Brng(spotLevelProportions, {bias: 4})
_.times(cardsPerType, (idx) => {
  const chosenSpotLevel = spotLevelRoller.roll()
  cardsArray.push({
    type: SPOT,
    spotLevel: chosenSpotLevel,
    maxValue: spotLevelToMaxvalueMapping[chosenSpotLevel]
  })
})

// HOME
const homeMaxvalueRoller = new Brng(homeMaxvalueProportions, {bias: 4})
_.times(cardsPerType, (idx) => {
  cardsArray.push({
    type: HOME,
    maxValue: _.toNumber(homeMaxvalueRoller.roll())
  })
})

// TAP
const tapMaxvalueRoller = new Brng(tapMaxvalueProportions, {bias: 4})
_.times(cardsPerType, (idx) => {
  cardsArray.push({
    type: TAP,
    maxValue: _.toNumber(tapMaxvalueRoller.roll())
  })
})

////////////////////////
/// POINT GENERATORS
////////////////////////

// const pointCardsPerType = 10
// const pointCardsPerType = 15
const pointCardsPerType = 0

// SPOT
_.times(pointCardsPerType, (idx) => {
  const chosenSpotLevel = spotLevelRoller.roll()
  cardsArray.push({
    type: SPOT,
    spotLevel: chosenSpotLevel,
    maxValue: spotLevelToMaxvalueMapping[chosenSpotLevel],
    isPointGenerator: true,
  })
})

// HOME
_.times(pointCardsPerType, (idx) => {
  cardsArray.push({
    type: HOME,
    maxValue: _.toNumber(homeMaxvalueRoller.roll()),
    isPointGenerator: true,
  })
})

// TAP
_.times(pointCardsPerType, (idx) => {
  cardsArray.push({
    type: TAP,
    maxValue: _.toNumber(tapMaxvalueRoller.roll()),
    isPointGenerator: true,
  })
})

////////////////////////
/// END POINT GENERATORS
////////////////////////

function maxValueSortFunc (cardObj) {
  if (cardObj.type === HOME) {
    return cardObj.maxValue // small to large
  }
  else {
    return 400 - cardObj.maxValue // large to small
  }
}
function hasLossSortFunc (cardObj) {
  return !cardObj.hasLoss // hasLoss first
  // return cardObj.hasLoss // hasLoss last
}
const TYPE_SORT_MAPPING = {}
TYPE_SORT_MAPPING[SPOT] = 1
TYPE_SORT_MAPPING[HOME] = 2
TYPE_SORT_MAPPING[TAP] = 3
function typeSortFunc (cardObj) {
  return TYPE_SORT_MAPPING[cardObj.type]
}
const sortCardsByArray = [
  typeSortFunc, 'isPointGenerator', maxValueSortFunc, hasLossSortFunc, 'totalCostValue'
]
////////////////

cardsArray = _.sortBy(cardsArray, sortCardsByArray)

const cardPointsRoller = new Brng({
  POINTS_0_3: 1,
  // POINTS_1_4: 1,
  // POINTS_5_8: 1,
}, {bias: 4})

const spotCardHasLossRoller = new Brng({0: 1, 1: 1}, {keepHistory: true, bias: 4})
// const homeCardHasLossRoller = new Brng({0: 8, 1: 2}, {keepHistory: true, bias: 4})

_.forEach(cardsArray, (cardObj) => {
  cardObj.points = cardPointsRoller.roll()
  cardObj.uuid = Math.random().toString(36).slice(2)

  if (cardObj.isPointGenerator) {
    return
  }

  let hasLoss
  if (cardObj.type === SPOT) {
    hasLoss = !!_.toNumber(spotCardHasLossRoller.roll())
  }
  else if (cardObj.type === HOME) {
    // hasLoss = !!_.toNumber(homeCardHasLossRoller.roll())
    hasLoss = false
  }
  else if (cardObj.type === TAP) {
    hasLoss = true
  }
  cardObj.hasLoss = hasLoss
  
})


const resourceGainRoller = new Brng(spotResourceGainProportions, {keepHistory: true, bias: 4})

const resourceGainPointsRoller = new Brng({point: 1}, {keepHistory: true})

const resourceLossRoller = new Brng(spotResourceLossProportions, {keepHistory: true, bias: 4})

const resourceLossForPointGeneratorRoller = new Brng(pointGeneratorResourceLossProportions, {
  keepHistory: true,
  bias: 1
})
const lossCountForPointGeneratorRoller = new Brng({
  1: 4,
  2: 3,
  3: 2,
}, {
  keepHistory: true,
  bias: 4
})

function getInitialExcludeList(cardObj) {
  let excludeList = []
  if (cardObj.type === SPOT) {
    const spotLevelNumber = _.last(cardObj.spotLevel)
    excludeList.push('retrieveLevel' + spotLevelNumber)
    excludeList.push('chainLevel' + spotLevelNumber)
  }
  return excludeList
}

// returns undoChainArray
function getLossAndGain(cardObj) {
  const undoChainArray = []

  const fixedMaxValue = cardObj.maxValue
  let currentMaxValue = fixedMaxValue
  let currentValue = 0
  let excludeList = getInitialExcludeList(cardObj)

  let loopTimes = 0
  let includeList = []

  let hasLimitedPhysicalResource = false
  let hasLimitedTotalResource = false
  let hasAlreadyEnforcedPhysical = false

  /// START: RESOURCE LOSS
  /// START: RESOURCE LOSS
  let lossObj = {}

  if (cardObj.hasLoss || cardObj.isPointGenerator) {

    /////
    let lossRollerToUse
    let lossCount = 1

    if (cardObj.isPointGenerator) {
      lossRollerToUse = resourceLossForPointGeneratorRoller
      lossCount = _.toNumber(lossCountForPointGeneratorRoller.roll())
    }
    else {
      lossRollerToUse = resourceLossRoller
    }

    _.times(lossCount, () => {
      const chosenResourceLoss = lossRollerToUse.roll()

      undoChainArray.push(() => lossRollerToUse.undo())
      lossObj[chosenResourceLoss] = lossObj[chosenResourceLoss] ? lossObj[chosenResourceLoss]+1 : 1


      ////////////////////////
      // update the exclude/inlude list
      ////////////////////////
      excludeList.push(chosenResourceLoss)
      if (_.includes(PHYSICAL_RESOURCE_ARRAY, chosenResourceLoss)) {
        excludeList.push(chosenResourceLoss + 'later')
      }
      // don't have tapAnother and untap on the same card
      if (chosenResourceLoss === 'tapAnother') {
        excludeList.push('untap')
      }
    })

    const valueLoss = getLossValue(lossObj)
    currentValue = currentValue - valueLoss
    currentMaxValue = currentMaxValue + valueLoss

  }
  /// END: RESOURCE LOSS
  /// END: RESOURCE LOSS


  // START: RESOURCE GAIN
  // START: RESOURCE GAIN
  const gainObj = {}
  while (currentValue < (fixedMaxValue - 25) && loopTimes <= 42) {
    loopTimes++
    if (loopTimes === 42) {
      console.log(loopTimes)
      console.log(gainObj)
    }

    let gainRollerToUse
    if (cardObj.isPointGenerator) {
      gainRollerToUse = resourceGainPointsRoller
    }
    else {
      gainRollerToUse = resourceGainRoller
    }

    // TODO: FIX THIS THING HERE!!!!!!!!!!!!!!!!!!!!!
    const chosenResource = _.attempt(() => gainRollerToUse.roll({
      only: _.isEmpty(includeList) ? undefined : includeList,
      exclude: _.uniq(excludeValuesAbove(currentMaxValue, cardObj).concat(excludeList))
    }))

    if (_.isError(chosenResource)) {
      break
      console.log('----------------')
      console.log(chosenResource)
      console.log(JSON.stringify(gainObj))
      console.log(JSON.stringify(includeList))
      console.log(JSON.stringify(excludeList))
      console.log(JSON.stringify(excludeValuesAbove(currentMaxValue).concat(excludeList)))
      console.log('-----------------')
      break
    }

    undoChainArray.push(() => gainRollerToUse.undo())

    // ADD CHOSEN RESOURCE TO THE CARD OBJ
    gainObj[chosenResource] = (gainObj[chosenResource] || 0) + 1 // !!!!!!!!!!!!!!!

    
    const {newIncludeList, newExcludeList} = getNewIncludeExcludeList(
      gainObj, chosenResource, includeList, excludeList)
    
    includeList = _.uniq(newIncludeList)
    excludeList = _.uniq(newExcludeList)


    // UPDATE THE CURRENT MAX VALUE
    const valueGained = RESOURCE_GAIN_VALUE[chosenResource](cardObj)
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
cardsArray = _.sortBy(cardsArray, sortCardsByArray)
_.forEach(cardsArray, (cardObj, cardsArrayIndex) => {

  // adjust the resourceGainRoller when staring the HOME and TAP cards
  if (currentCardType !== cardObj.type) {
    if (cardObj.type === HOME) {
      currentCardType = HOME
      resourceGainRoller.updateProportions(homeResourceGainProportions)
      resourceLossRoller.updateProportions(homeResourceLossProportions)
    }
    else if (cardObj.type === TAP) {
      currentCardType = TAP
      resourceGainRoller.updateProportions(tapResourceGainProportions)
      resourceLossRoller.updateProportions(tapResourceLossProportions)
    }
  }

  let timesTriedToSetResources = 0
  let acceptableRatio = 0.70
  const maxRatioAllowed = 0.95
  const timesUntilGivingUp = 200
  const similarityRatioIncrement = (maxRatioAllowed-acceptableRatio)/timesUntilGivingUp

  const acceptableDifference = {}
  acceptableDifference[SPOT] = 60
  acceptableDifference[TAP] = 40
  acceptableDifference[HOME] = 40

  let lowestSimilarityRatio = 1 // the lower the better
  let leastSimilarCardObj = {}

  while (true) {
    timesTriedToSetResources++
    const {undoChainArray, lossObj, gainObj} = getLossAndGain(cardObj)

    const newCardObj = _.cloneDeep(cardObj)
    if (!_.isEmpty(lossObj)) {
      newCardObj.loss = lossObj
    }
    newCardObj.gain = gainObj

    const currentUsageValue = getGainValue(newCardObj) - getLossValue(newCardObj.loss)

    const {similarityRatio, mostSimilarCardObj} = checkSimilarity(
      cardsArray.slice(0, cardsArrayIndex), newCardObj
    )

    const isWithinValueRange = (cardObj.maxValue - currentUsageValue) < acceptableDifference[cardObj.type]

    if (_.isEmpty(leastSimilarCardObj)) {
      leastSimilarCardObj = _.cloneDeep(newCardObj)
    }
    if (
      (similarityRatio <= lowestSimilarityRatio)
      && isWithinValueRange
    ) {
      lowestSimilarityRatio = similarityRatio
      leastSimilarCardObj = _.cloneDeep(newCardObj)
    }

    if (
      similarityRatio < acceptableRatio
      // the usageValue is not too low compared to the max value
      && isWithinValueRange
    ) {
      if (!_.isEmpty(lossObj)) {
        cardObj.loss = lossObj // !!!!!!!!!!!!!!!
      }
      cardObj.gain = gainObj // !!!!!!!!!!!!!!!
      break
    }
    else if (
      timesTriedToSetResources > timesUntilGivingUp
      && isWithinValueRange
    ) {
      if (!_.isEmpty(leastSimilarCardObj.loss)) {
        cardObj.loss = leastSimilarCardObj.loss // !!!!!!!!!!!!!!!
      }
      cardObj.gain = leastSimilarCardObj.gain // !!!!!!!!!!!!!!!
      console.log('just gave up', lowestSimilarityRatio, mostSimilarCardObj.uuid, _.cloneDeep(leastSimilarCardObj))
      break
    }
    else if (timesTriedToSetResources <= timesUntilGivingUp) {
      // undoes everything, increase acceptableRatio, retry

      acceptableRatio = _.min([acceptableRatio + similarityRatioIncrement, maxRatioAllowed])
      _.over(undoChainArray)()
    }
    // else. don't undo the resource rolls, just keep going and hope for a better result.
  }
  

})


function roundToNearest20 (x) {
  return Math.round(x/20)*20
}

function getGainValue (cardObj) {

  const baseMainValue = _.chain(cardObj.gain)
    .map((val, key) => RESOURCE_GAIN_VALUE[key](cardObj) * val)
    .sum()
    .value()

  // const totalLaterResourcesCount = _.chain(cardObj.gain)
  //   .pickBy((val, key) => {
  //     return _.includes(key, 'later')
  //   })
  //   .values()
  //   .sum()
  //   .value()

  // return baseMainValue + LATER_COUNT_ADDITIONAL_VALUE_MAPPING[totalLaterResourcesCount]

  return baseMainValue
}

function getLossValue (lossObj) {
  if (_.isEmpty(lossObj)) {
    return 0
  }
  else {
    return _.chain(lossObj)
      .map((val, key) => {
        if (key === 'wildsame') {
          const lossValuePerResource = RESOURCE_LOSS_VALUE[key]
          let totalLossValue = 0
          _.times(val, (idx) => {
            totalLossValue += _.min([lossValuePerResource + 10*idx, 100])
          })
          return totalLossValue
        }
        else {
          return RESOURCE_LOSS_VALUE[key] * val
        }
      })
      .sum()
      .value()
  }
}

const BASE_CARD_MULTIPLIER = 1.75
const DEFAULT_CARD_COST = 50 // every card built has this inherent value

// const BASE_SPOT_MULTIPLIER = 1.75
// const BASE_HOME_MULTIPLIER = 1.75
// const HOME_EXPONENTIAL_MULTIPLIER = 1.12
// const BASE_TAP_MULTIPLIER = 1.75


function getTotalCostValue (cardType, usageValue) {
  // return usageValue*BASE_CARD_MULTIPLIER - DEFAULT_CARD_COST

  if (cardType === SPOT) {
    const spotUsageValue = usageValue - 100 // since there's already +100 spots available
    return 1.58*(70+(spotUsageValue-70)**1.065) - DEFAULT_CARD_COST
  }
  if (cardType === HOME) {
    return 1.53*(70+(usageValue-70)**1.065) - DEFAULT_CARD_COST
  }
  if (cardType === TAP) {
    return 1.63*(70+(usageValue-70)**1.065) - DEFAULT_CARD_COST
  }
}

// RESOURCE COST
_.forEach(cardsArray, (cardObj) => {
  let totalCostValue = 0
  // == (gain-loss)*multiplier + points - (default card cost)

  const gainValue = getGainValue(cardObj)
  const lossValue = getLossValue(cardObj.loss)
  const usageValue = gainValue - lossValue

  totalCostValue = getTotalCostValue(cardObj.type, usageValue)

  const minPointsOnCard = MIN_POINTS_MAP[cardObj.points]
  // const minPointsOnCard = 1
  let pointsOnCard = 0
  while (pointsOnCard < minPointsOnCard || roundToNearest20(totalCostValue)%100 !== 0) {
    pointsOnCard++
    
    // !! this is WRONG ON PURPOSE. math-wise should be 25.
    // giving more value to end-game points on cards so that there's value to build it early/late.
    totalCostValue += 20
  }

  cardObj.pointsOnCard = pointsOnCard
  cardObj.totalCostValue = roundToNearest20(totalCostValue)
  cardObj._usageValue = usageValue
  
})

console.log(_.chain(cardsArray).map('totalCostValue').mean().value())
// average is usually 360

console.log(_.chain(cardsArray).map('totalCostValue').max().value())

const cost12VarietyRoller = new Brng({1:1, 2:1}, {keepHistory: true, bias: 4})
const cost123VarietyRoller = new Brng({1:1, 2:1, 3:1}, {keepHistory: true, bias: 4})
const cost23VarietyRoller = new Brng({2:2, 3:1}, {keepHistory: true, bias: 4})
const cost23More3VarietyRoller = new Brng({2:1, 3:1}, {keepHistory: true, bias: 4})

const costToVarietyMap = {
  0: _.constant(1),
  100: _.constant(1),
  200: _.constant(2),
  300: _.constant(2),
  400: _.constant(2),
  // 400: () => cost12VarietyRoller.roll(),
  500: _.constant(2),
  600: _.constant(2),
  700: _.constant(2),
  800: _.constant(3),
  900: _.constant(3)
}

const resourceCostRoller = new Brng(spotResourceCostProportions, {keepHistory: true, bias: 2})
let currentCardTypeForResourceCost = SPOT
const typeToResourceCostMapping = {}
typeToResourceCostMapping[SPOT] = 'fire'
typeToResourceCostMapping[HOME] = 'water'
typeToResourceCostMapping[TAP] = 'earth'

// RESOURCE COST

// returns {resourceCost, undoChainArray} -- resourceCost = {fire: 2, water: 1, ...}
function getResourceCost (totalCostValue, cardType) {

  if (cardType === SPOT && cardType !== currentCardTypeForResourceCost) {
    currentCardTypeForResourceCost = SPOT
    resourceCostRoller.updateProportions(spotResourceCostProportions)
  }
  else if (cardType === HOME && cardType !== currentCardTypeForResourceCost) {
    currentCardTypeForResourceCost = HOME
    resourceCostRoller.updateProportions(homeResourceCostProportions)
  }
  else if (cardType === TAP && cardType !== currentCardTypeForResourceCost) {
    currentCardTypeForResourceCost = TAP
    resourceCostRoller.updateProportions(tapResourceCostProportions)
  }

  const undoChainArray = []
  
  const costVariety = _.toNumber(costToVarietyMap[totalCostValue]())

  const resourceCostObj = {}
  let onlyResourceCost = []

  while (_.sum(_.values(resourceCostObj))*100 < totalCostValue) {
    let chosenResourceToPay
    if (_.sum(_.values(resourceCostObj)) === 0 && !_.isEmpty(typeToResourceCostMapping[cardType])) {
      chosenResourceToPay = resourceCostRoller.roll(typeToResourceCostMapping[cardType])
    }
    else {
      chosenResourceToPay = resourceCostRoller.roll(
        {only: _.isEmpty(onlyResourceCost) ? undefined : onlyResourceCost}
      )
    }
    
    undoChainArray.push(() => resourceCostRoller.undo())
    resourceCostObj[chosenResourceToPay] = (resourceCostObj[chosenResourceToPay] + 1) || 1

    if (_.isEmpty(onlyResourceCost) && costVariety === _.keys(resourceCostObj).length) {
      onlyResourceCost = _.keys(resourceCostObj)
    }
  }

  return {resourceCost: resourceCostObj, undoChainArray}

}
// SETTING RESOURCE COST FOR EACH CARD
cardsArray = _.sortBy(cardsArray, sortCardsByArray)
_.forEach(cardsArray, (cardObj, cardsArrayIndex) => {
  
  let timesTriedToSetResources = 0
  let acceptableRatio = 0.85
  const maxRatioAllowed = 0.95
  const timesUntilGivingUp = 20
  const similarityRatioIncrement = (maxRatioAllowed-acceptableRatio)/timesUntilGivingUp

  while (true) {
    timesTriedToSetResources++
    const {resourceCost, undoChainArray} = getResourceCost(cardObj.totalCostValue, cardObj.type)

    const newCardObj = _.cloneDeep(cardObj)
    newCardObj.resourceCost = resourceCost


    const {similarityRatio, mostSimilarCardObj} = checkSimilarity(
      cardsArray.slice(0, cardsArrayIndex), newCardObj
    )
    
    if (similarityRatio < acceptableRatio || timesTriedToSetResources > timesUntilGivingUp) {
      cardObj.resourceCost = resourceCost // !!!!!!!!!!!!!!!!!!!!

      if (similarityRatio >= acceptableRatio && timesTriedToSetResources > timesUntilGivingUp) {
        console.log('just gave up! resource cost', similarityRatio, mostSimilarCardObj, cardObj)
      }
      break
    }
    else {
      // undoes everything, increase acceptableRatio, retry

      acceptableRatio = _.min([acceptableRatio + similarityRatioIncrement, maxRatioAllowed])
      _.over(undoChainArray)()
    }
  }
  
})

console.log('resourceGainRoller.proportions', resourceGainRoller.proportions)
console.log('resourceLossRoller.proportions', resourceLossRoller.proportions)
console.log('resourceCostRoller.proportions', resourceCostRoller.proportions)


// console.log('momentsArray')
// console.log(momentsArray)

console.log('----------------------')
console.log('SPOT, _usageValue, level 2 avg')
console.log(_.chain(cardsArray).filter({type:SPOT, spotLevel: LEVELS.LEVEL_2}).map('_usageValue').value())
console.log(_.chain(cardsArray).filter({type:SPOT, spotLevel: LEVELS.LEVEL_2}).map('_usageValue').mean().value())

console.log('----------------------')
console.log('SPOT, _usageValue, level 3 avg')
console.log(_.chain(cardsArray).filter({type:SPOT, spotLevel: LEVELS.LEVEL_3}).map('_usageValue').value())
console.log(_.chain(cardsArray).filter({type:SPOT, spotLevel: LEVELS.LEVEL_3}).map('_usageValue').mean().value())

console.log('----------------------')
console.log('SPOT, _usageValue, level 4 avg')
console.log(_.chain(cardsArray).filter({type:SPOT, spotLevel: LEVELS.LEVEL_4}).map('_usageValue').value())
console.log(_.chain(cardsArray).filter({type:SPOT, spotLevel: LEVELS.LEVEL_4}).map('_usageValue').mean().value())

console.log('----------------------')
console.log('HOME _usageValue avg')
console.log(_.chain(cardsArray).filter({type:HOME}).map('_usageValue').value())
console.log(_.chain(cardsArray).filter({type:HOME}).map('_usageValue').mean().value())

console.log('----------------------')
console.log('TAP _usageValue avg')
console.log(_.chain(cardsArray).filter({type:TAP}).map('_usageValue').value())
console.log(_.chain(cardsArray).filter({type:TAP}).map('_usageValue').mean().value())

function countOccurences (key, resources) {
  let countTotal = 0
  _.forEach(
    cardsArray, obj => {
      const resourcesToCount = _.pick(obj[key], resources)
      countTotal += _.sum(_.values(resourcesToCount))
      return resourcesToCount
    }
  )
  console.log(key, JSON.stringify(resources), countTotal)
  return countTotal
}

countOccurences('resourceCost', ['fire'])
countOccurences('resourceCost', ['water'])
countOccurences('resourceCost', ['earth'])

const lossCount = countOccurences('loss', ['wild', 'fire', 'water', 'earth'])
const gainCount = countOccurences('gain', ['wild', 'fire', 'water', 'earth'])
console.log('net count', gainCount - lossCount)

countOccurences('gain', ['fire'])
countOccurences('gain', ['water'])
countOccurences('gain', ['earth'])
countOccurences('gain', ['wild'])

countOccurences('gain', ['firelater'])
countOccurences('gain', ['waterlater'])
countOccurences('gain', ['earthlater'])
countOccurences('gain', ['firelater', 'waterlater', 'earthlater'])

const moneyCount = countOccurences('gain', ['money'])
const cardCount = countOccurences('gain', ['card'])

const chainLevel1Count = countOccurences('gain', ['chainLevel1'])
const chainLevel2Count = countOccurences('gain', ['chainLevel2'])
const chainLevel3Count = countOccurences('gain', ['chainLevel3'])
const chainLevel4Count = countOccurences('gain', ['chainLevel4'])



console.log('----------------------')
console.log('chainLevel1Count + chainLevel2Count + chainLevel3Count + chainLevel4Count',
  chainLevel1Count + chainLevel2Count + chainLevel3Count + chainLevel4Count)
countOccurences('gain', ['untap'])

const retrieveLevel1Count = countOccurences('gain', ['retrieveLevel1'])
const retrieveLevel2Count = countOccurences('gain', ['retrieveLevel2'])
const retrieveLevel3Count = countOccurences('gain', ['retrieveLevel3'])
const retrieveLevel4Count = countOccurences('gain', ['retrieveLevel4'])

// countOccurences('gain', ['retrieve'])
console.log('retrieveLevel1Count + retrieveLevel2Count + retrieveLevel3Count + retrieveLevel4Count',
  retrieveLevel1Count + retrieveLevel2Count + retrieveLevel3Count + retrieveLevel4Count)
// countOccurences('gain', ['grabanother'])


////////////////////////////////////////////
////////////////////////////////////////////
// add the starter spots


const starterSpots = [
  {
    "uuid": "STARTER SPOT: FIRE",
    "type": SPOT,
    "spotLevel": "LEVEL_1",
    "gain": {
      "fire": 1
    },
    "_usageValue": 100
  },
  {
    "uuid": "STARTER SPOT: WATER",
    "type": SPOT,
    "spotLevel": "LEVEL_1",
    "gain": {
      "water": 1
    },
    "_usageValue": 100
  },
  {
    "uuid": "STARTER SPOT: EARTH",
    "type": SPOT,
    "spotLevel": "LEVEL_1",
    "gain": {
      "earth": 1
    },
    "_usageValue": 100
  },
  {
    "uuid": "STARTER SPOT: MONEY",
    "type": SPOT,
    "spotLevel": "LEVEL_1",
    "gain": {
      "money": 4
    },
    "_usageValue": 100
  },
  {
    "uuid": "STARTER SPOT: CARD",
    "type": SPOT,
    "spotLevel": "LEVEL_1",
    "gain": {
      "card": 2
    },
    "_usageValue": 100
  },
  {
    uuid: "EXCHANGE",
    ExtraStuff: <Exchange />
  },
  {
    uuid: "REFERENCE",
    ExtraStuff: <Reference />
  },
  {
    uuid: "PLAY A TURN",
    ExtraStuff: <PlayATurn />
  },
  {
    uuid: "PLAY A TURN (SIMULTANEOUS)",
    ExtraStuff: <PlayATurnSimultaneous />
  },

]

cardsArray = cardsArray.concat(starterSpots)


////////////////////////////////////////////
////////////////////////////////////////////

const cardsImportantKeys = [
  'uuid',
  'type',
  'isPointGenerator',
  'spotLevel',
  'pointsOnCard',
  'maxValue',
  'resourceCost',
  // 'totalCostValue',
  'hasLoss',
  'loss',
  'gain',
  '_usageValue',
  'ExtraStuff',
]

const contractsImportantKeys = [
  'type',
  'resourceCost',
  'totalCostValue',
  'tagNumber',
  'tagElement',
  'conditionalType',
  'conditionalPer',
  'conditionalPoints',
  'resourceCostObj',
  'basePoints',
]

function Cards () {
  return (
    <div>



      {_.map(cardsArray, (obj) => {
        return <Card cardObj={_.pick(obj, cardsImportantKeys)} key={obj.uuid} />
      })}


      <pre>
        {JSON.stringify(_.chain(cardsArray).map((obj) => _.pick(obj, cardsImportantKeys)).value(), null, 2)}
        
        {/*{JSON.stringify(momentsArray, null, 2)}*/}
        {/*{JSON.stringify(_.chain(contractsArray).map((obj) => _.pick(obj, contractsImportantKeys)).value(), null, 2)}*/}
      </pre>

      
    </div>
  )
}


console.log('cardsArray !!', cardsArray)

export default Cards

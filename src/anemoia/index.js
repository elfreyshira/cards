import Brng from 'brng'
import _ from 'lodash'

import {
  generateConsistentMoment,
  generateRandomMoment,
  generateIncreaseMoment,
  generateDecreaseMoment
} from './generate-moment-cards.js'

import {
  SPOT,
  HOME,
  TAP,
  MIN_POINTS_MAP,
  LEVELS,
  RESOURCE_GAIN_VALUE,
  RESOURCE_LOSS_VALUE,
  /////////////
  PHYSICAL_RESOURCE_ARRAY,
} from './CONSTANTS.js'

import getNewIncludeExcludeList from './get-new-include-exclude-list.js'

import checkSimilarity from './check-similarity.js'
import Card from './Card.js'
import ICONS from './icons.js'


// import endGameCards from './end-game-cards.js'
// import './calculate-retrieve-cost.js'

import './index.css';

function excludeValuesAbove (value, cardObj) {
  return _.keys(
    _.omitBy(RESOURCE_GAIN_VALUE, (func) => {
      return func(cardObj) <= value
    })
  )
}


let cardsArray = []
const cardsMultiply = 1 // 1 = 45 cards, 2 = 90 cards

// SPOT
const spotMaxValues =         [225,  325]
const spotCardsPerMaxValue =  [8,    7]
const spotLevels = [LEVELS.LEVEL_2,  LEVELS.LEVEL_3]
_.forEach(spotMaxValues, (val, idx) => {
  _.times(spotCardsPerMaxValue[idx] * cardsMultiply, () => {
    cardsArray.push({
      type: SPOT,
      maxValue: val,
      spotLevel: spotLevels[idx]
    })
  })
})

// HOME
const homeMaxValues =         [125, 150,  175,  200,  225,  250]
const homeCardsPerMaxValue =  [3,   2,    3,    2,    3,    2]
_.forEach(homeMaxValues, (val, idx) => {
  _.times(homeCardsPerMaxValue[idx] * cardsMultiply, () => {
    cardsArray.push({
      type: HOME,
      maxValue: val
    })
  })
})

// TAP
const tapMaxValues =         [125, 175,  225]
const tapCardsPerMaxValue =  [5,   5,    5,]
_.forEach(tapMaxValues, (val, idx) => {
  _.times(tapCardsPerMaxValue[idx] * cardsMultiply, () => {
    cardsArray.push({
      type: TAP,
      maxValue: val
    })
  })
})


const cardPointsRoller = new Brng({
  POINTS_0_3: 1,
  // POINTS_1_4: 1,
  // POINTS_5_8: 1,
}, {bias: 4})

const spotCardHasLossRoller = new Brng({0: 3, 1: 2}, {keepHistory: true, bias: 4})

_.forEach(cardsArray, (cardObj) => {
  cardObj.points = cardPointsRoller.roll()
  cardObj.uuid = Math.random().toString(36).slice(2)

  let hasLoss
  if (cardObj.type === SPOT) {
    hasLoss = !!_.toNumber(spotCardHasLossRoller.roll())
  }
  else if (cardObj.type === HOME) {
    hasLoss = false
  }
  else if (cardObj.type === TAP) {
    hasLoss = true
  }
  cardObj.hasLoss = hasLoss
  
})

const proportionsChainLevel1 = 0.50
const proportionsChainLevel2 = 0.55
const proportionsChainLevel3 = 0.47

const proportionsUntapOnHomeCards = 1.8 // changed for home cards
const proportionsRetrieveOnTapCards = 2.0 // changed for tap cards

const proportionsGrabAnotherOnNonSpotCards = 0.8
const proportionsNowResourcesOnNonSpotCards = 2
const proportionsLaterResources = 1

const resourceGainRoller = new Brng({
  money: 3.7,
  card: 2.3,
  fire: 1.9,
  firelater: 1,
  water: 1.9,
  waterlater: 1,
  earth: 1.9,
  earthlater: 1,
  wild: 3.3,
  // wildlater: 1,
  grabanother: 0.8, // changed later via proportionsGrabAnotherOnNonSpotCards
  untap: 1.5, // changed later via proportionsUntapOnHomeCards
  retrieve: 1.8, // changed later via proportionsRetrieveOnTapCards
  chainLevel1: proportionsChainLevel1,
  chainLevel2: proportionsChainLevel2,
  chainLevel3: proportionsChainLevel3,
}, {
  keepHistory: true,
  bias: 4
})

const proportionsTapAnotherOnTapCards = 0.9
const lossResourceRoller = new Brng({
  fire: 2,
  water: 2,
  earth: 2,
  wild: 5,
  tapAnother: 3, // changed later via proportionsTapAnotherOnTapCards
}, {
  keepHistory: true,
  bias: 4
})


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
  let includeList = []

  let hasLimitedPhysicalResource = false
  let hasLimitedTotalResource = false
  let hasAlreadyEnforcedPhysical = false

  /// START: RESOURCE LOSS
  /// START: RESOURCE LOSS
  const lossObj = {}
  if (cardObj.hasLoss) {
    const chosenResourceLoss = lossResourceRoller.roll()
    undoChainArray.push(() => lossResourceRoller.undo())
    lossObj[chosenResourceLoss] = 1

    const valueLoss = RESOURCE_LOSS_VALUE[chosenResourceLoss]
    currentValue = currentValue - valueLoss
    currentMaxValue = currentMaxValue + valueLoss

    excludeList.push(chosenResourceLoss)

    if (_.includes(PHYSICAL_RESOURCE_ARRAY, chosenResourceLoss)) {
      excludeList.push(chosenResourceLoss + 'later')
    }

    // don't have tapAnother and untap on the same card
    if (chosenResourceLoss === 'tapAnother') {
      excludeList.push('untap')
    }
  }
  /// END: RESOURCE LOSS
  /// END: RESOURCE LOSS


  // START: RESOURCE GAIN
  // START: RESOURCE GAIN
  const gainObj = {}
  while (currentValue < (fixedMaxValue - 25) && loopTimes <= 10) {
    loopTimes++
    if (loopTimes === 10) {
      console.log(loopTimes)
      console.log(gainObj)
    }

    // don't have chainLevel2 on level 1 cards
    // if (cardObj.spotLevel === LEVELS.LEVEL_1) {
    //   excludeList = _.uniq(excludeList.concat('chainLevel2'))
    // }

    const chosenResource = _.attempt(() => resourceGainRoller.roll({
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

    undoChainArray.push(() => resourceGainRoller.undo())

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

function hasLossSortFunc (cardObj) {
  return !cardObj.hasLoss // hasLoss first
  // return cardObj.hasLoss // hasLoss last
}
function maxValueSortFunc (cardObj) {
  return 400 - cardObj.maxValue // large to small
  // return cardObj.maxValue // small to large
}
const TYPE_SORT_MAPPING = {}
TYPE_SORT_MAPPING[SPOT] = 1
TYPE_SORT_MAPPING[HOME] = 2
TYPE_SORT_MAPPING[TAP] = 3
function typeSortFunc (cardObj) {
  return TYPE_SORT_MAPPING[cardObj.type]
}

// order: SPOT, HOME, TAP
cardsArray = _.sortBy(cardsArray, [typeSortFunc, maxValueSortFunc, hasLossSortFunc])
_.forEach(cardsArray, (cardObj, cardsArrayIndex) => {

  // // add chainLevel1 once you're on spotLevel = 2
  // if (!hasAddedChainLevel1 && cardObj.type === SPOT && cardObj.spotLevel !== LEVELS.LEVEL_1) {
  //   resourceGainRoller.add({chainLevel1: proportionsChainLevel1})
  //   // resourceGainRoller.add({chainLevel2: proportionsChainLevel2})
  //   hasAddedChainLevel1 = true
  // }
  // // add chainLevel2 once you're on spotLevel = 3
  // if (!hasAddedChainLevel2 && cardObj.type === SPOT && cardObj.spotLevel === LEVELS.LEVEL_3) {
  //   resourceGainRoller.add({chainLevel2: proportionsChainLevel2})
  //   hasAddedChainLevel2 = true
  // }


  // adjust the resourceGainRoller when staring the HOME and TAP cards
  if (currentCardType !== cardObj.type) {
    if (cardObj.type === HOME) {
      currentCardType = HOME
      resourceGainRoller.remove('retrieve')
      // resourceGainRoller.remove('chainLevel1')
      // resourceGainRoller.remove('chainLevel2')
      resourceGainRoller.update({
        untap: proportionsUntapOnHomeCards,

        grabanother: proportionsGrabAnotherOnNonSpotCards

        // water: proportionsNowResourcesOnNonSpotCards,
        // earth: proportionsNowResourcesOnNonSpotCards,
        // fire: proportionsNowResourcesOnNonSpotCards,
        // wild: proportionsNowResourcesOnNonSpotCards,

        // waterlater: proportionsLaterResources,
        // earthlater: proportionsLaterResources,
        // firelater: proportionsLaterResources,
        // wildlater: proportionsLaterResources
      })
    }
    else if (cardObj.type === TAP) {
      currentCardType = TAP
      resourceGainRoller.remove('untap')
      lossResourceRoller.update({tapAnother: proportionsTapAnotherOnTapCards})
      resourceGainRoller.add({retrieve: proportionsRetrieveOnTapCards})
    }
  }

  // getLossAndGain(cardObj, cardsArrayIndex)
  // checkSimilarity(cardsArray.slice(0, cardsArrayIndex), _.cloneDeep(cardObj))

  let timesTriedToSetResources = 0
  let acceptableRatio = 0.70
  const maxRatioAllowed = 0.90
  const timesUntilGivingUp = 100
  const similarityRatioIncrement = (maxRatioAllowed-acceptableRatio)/timesUntilGivingUp

  const acceptableDifference = {}
  acceptableDifference[SPOT] = 100
  acceptableDifference[TAP] = 50
  acceptableDifference[HOME] = 50

  while (true) {
    timesTriedToSetResources++
    const {undoChainArray, lossObj, gainObj} = getLossAndGain(cardObj)

    const newCardObj = _.cloneDeep(cardObj)
    if (!_.isEmpty(lossObj)) {
      newCardObj.loss = lossObj
    }
    newCardObj.gain = gainObj

    const currentUsageValue = getGainValue(newCardObj) - getLossValue(newCardObj)

    const {similarityRatio, mostSimilarCardObj} = checkSimilarity(
      cardsArray.slice(0, cardsArrayIndex), newCardObj
    )
    
    if (
      (
        similarityRatio < acceptableRatio
        // the usageValue is not too low compare to the max value
        && (cardObj.maxValue - currentUsageValue) < acceptableDifference[cardObj.type]
      )
      || timesTriedToSetResources > timesUntilGivingUp
    ) {
      if (!_.isEmpty(lossObj)) {
        cardObj.loss = lossObj
      }
      cardObj.gain = gainObj // !!!!!!!!!!!!!!!

      if (similarityRatio >= acceptableRatio && timesTriedToSetResources > timesUntilGivingUp) {
        console.log('just gave up', similarityRatio, mostSimilarCardObj, cardObj)
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


function roundToNearest25 (x) {
  return Math.round(x/25)*25
}

function getGainValue (cardObj) {
  return _.chain(cardObj.gain)
    .map((val, key) => RESOURCE_GAIN_VALUE[key](cardObj) * val)
    .sum()
    .value()
}

function getLossValue (cardObj) {
  return cardObj.loss ?
    RESOURCE_LOSS_VALUE[_.keys(cardObj.loss)[0]] * _.values(cardObj.loss)[0]
    : 0
}

const BASE_SPOT_MULTIPLIER = 1.6
const BASE_HOME_MULTIPLIER = 1.75
const HOME_EXPONENTIAL_MULTIPLIER = 1.19
const BASE_TAP_MULTIPLIER = 1.75
const DEFAULT_CARD_COST = 50 // every card built has this inherent value

function getTotalCostValue (cardType, usageValue) {
  if (cardType === SPOT) {
    return usageValue*BASE_SPOT_MULTIPLIER - DEFAULT_CARD_COST
  }
  if (cardType === HOME) {
    return 100*BASE_HOME_MULTIPLIER
      + (usageValue-100)**HOME_EXPONENTIAL_MULTIPLIER
      - DEFAULT_CARD_COST
  }
  if (cardType === TAP) {
    return usageValue*BASE_TAP_MULTIPLIER - DEFAULT_CARD_COST
  }
}

global.getTotalCostValue = getTotalCostValue

// RESOURCE COST
_.forEach(cardsArray, (cardObj) => {
  let totalCostValue = 0
  // == (gain-loss)*multiplier + points - (default card cost)

  const gainValue = getGainValue(cardObj)
  const lossValue = getLossValue(cardObj)
  const usageValue = gainValue - lossValue

  totalCostValue = getTotalCostValue(cardObj.type, usageValue)

  const minPointsOnCard = MIN_POINTS_MAP[cardObj.points]
  let pointsOnCard = 0
  while (pointsOnCard < minPointsOnCard || roundToNearest25(totalCostValue)%100 !== 0) {
    pointsOnCard++
    totalCostValue += 25
  }

  cardObj.pointsOnCard = pointsOnCard
  cardObj.totalCostValue = roundToNearest25(totalCostValue)
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
  200: () => cost12VarietyRoller.roll(),
  300: _.constant(2),
  400: _.constant(2),
  500: () => cost23More3VarietyRoller.roll(),
  600: () => cost23More3VarietyRoller.roll(),
  700: () => cost23More3VarietyRoller.roll(),
  800: _.constant(3),
  900: _.constant(3)
}

const resourceCostRoller = new Brng({
  fire: 1,
  water: 1,
  earth: 1,
}, {keepHistory: true, bias: 2})


// RESOURCE COST

// returns {resourceCost, undoChainArray} -- resourceCost = {fire: 2, water: 1, ...}
function getResourceCost (totalCostValue) {
  const undoChainArray = []
  
  const costVariety = _.toNumber(costToVarietyMap[totalCostValue]())

  const resourceCostObj = {}
  let onlyResourceCost = []

  while (_.sum(_.values(resourceCostObj))*100 < totalCostValue) {
    const chosenResourceToPay = resourceCostRoller.roll(
      {only: _.isEmpty(onlyResourceCost) ? undefined : onlyResourceCost}
    )
    undoChainArray.push(() => resourceCostRoller.undo())
    resourceCostObj[chosenResourceToPay] = (resourceCostObj[chosenResourceToPay] + 1) || 1

    if (_.isEmpty(onlyResourceCost) && costVariety === _.keys(resourceCostObj).length) {
      onlyResourceCost = _.keys(resourceCostObj)
    }
  }

  return {resourceCost: resourceCostObj, undoChainArray}

}

cardsArray = _.sortBy(cardsArray, [typeSortFunc, maxValueSortFunc, hasLossSortFunc, 'totalCostValue'])
_.forEach(cardsArray, (cardObj, cardsArrayIndex) => {
  
  let timesTriedToSetResources = 0
  let acceptableRatio = 0.85
  const maxRatioAllowed = 0.95
  const timesUntilGivingUp = 20
  const similarityRatioIncrement = (maxRatioAllowed-acceptableRatio)/timesUntilGivingUp

  while (true) {
    timesTriedToSetResources++
    const {resourceCost, undoChainArray} = getResourceCost(cardObj.totalCostValue)

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
      momentObj.bonus[idx+1] = momentBonusRoller.roll()
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


const lossCount = countOccurences('loss', ['wild', 'fire', 'water', 'earth'])
const gainCount = countOccurences('gain', ['wild', 'fire', 'water', 'earth'])
console.log('net count', gainCount - lossCount)

countOccurences('gain', ['fire'])
countOccurences('gain', ['water'])
countOccurences('gain', ['earth'])
countOccurences('gain', ['wild'])

countOccurences('gain', ['firelater', 'waterlater', 'earthlater'])

const moneyCount = countOccurences('gain', ['money'])
const cardCount = countOccurences('gain', ['card'])

const chainLevel1Count = countOccurences('gain', ['chainLevel1'])
const chainLevel2Count = countOccurences('gain', ['chainLevel2'])
const chainLevel3Count = countOccurences('gain', ['chainLevel3'])

const tapAnotherCount = countOccurences('loss', ['tapAnother'])
const untapCount = countOccurences('gain', ['untap'])

console.log('----------------------')
console.log('chainLevel1Count + chainLevel2Count + chainLevel3Count',
  chainLevel1Count + chainLevel2Count + chainLevel3Count)
console.log('tapAnotherCount + untapCount', tapAnotherCount + untapCount)
countOccurences('gain', ['retrieve'])
countOccurences('gain', ['grabanother'])


////////////////////////////////////////////
////////////////////////////////////////////
// add the starter spots

function Arrow () {
  return <span className="anytime-arrow">&rarr;</span>
}

const starterSpots = [
  {
    "uuid": "STARTER SPOT: WILD (1)",
    "type": SPOT,
    "spotLevel": "LEVEL_1",
    "gain": {
      "wild": 1
    },
    "_usageValue": 100
  },
  {
    "uuid": "STARTER SPOT: WILD (2)",
    "type": SPOT,
    "spotLevel": "LEVEL_1",
    "gain": {
      "wild": 1
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
    uuid: "ANYTIME",
    ExtraStuff: (
      <div className="anytime-container">
        <div className="anytime-title">ANYTIME</div>
        <div className="anytime-row"><ICONS.Money amount={5}/> <Arrow/> <ICONS.Wild /></div>
        <div className="anytime-row"><ICONS.Money amount={3}/> <Arrow/> <ICONS.Card /></div>
        {/*<div className="anytime-row">
          <ICONS.Card /><ICONS.Card /><ICONS.Card /> <Arrow/> <ICONS.Wild />
        </div>*/}
        <div className="anytime-row"><ICONS.Card /><ICONS.Card /> <Arrow/> <ICONS.Money amount={3}/></div>
        {/*<div className="anytime-row"><ICONS.Wild/> <Arrow/> <ICONS.Card/></div>*/}
        <div className="anytime-row"><ICONS.Wild/> <Arrow/> <ICONS.Money amount={3}/></div>
        {/*<div className="anytime-row"><ICONS.Wild/><ICONS.Wild/> <Arrow/> <ICONS.Wild/><ICONS.Money amount={1}/></div>*/}

      </div>
      
    )
  }
]

cardsArray = cardsArray.concat(starterSpots)


////////////////////////////////////////////
////////////////////////////////////////////

const importantKeys = [
  'uuid',
  'type',
  'spotLevel',
  'pointsOnCard',
  'maxValue',
  'resourceCost',
  // 'totalCostValue',
  'hasLoss',
  'loss',
  'gain',
  '_usageValue',
  'ExtraStuff'
]

function Cards () {
  return (
    <div>
      <pre>
        {/*{JSON.stringify(_.chain(cardsArray).map((obj) => _.pick(obj, importantKeys)).value(), null, 2)}*/}
        {/*{JSON.stringify(cardsArray, null, 2)}*/}
      </pre>

      {_.map(cardsArray, (obj) => {
        {return <Card cardObj={_.pick(obj, importantKeys)} key={obj.uuid} />}
      })}

      <pre>
        {JSON.stringify(_.chain(cardsArray).map((obj) => _.pick(obj, importantKeys)).value(), null, 2)}
        {/*{JSON.stringify(momentsArray, null, 2)}*/}
      </pre>
    </div>
  )
}



export default Cards

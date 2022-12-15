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
} from './CONSTANTS.js'

import getNewIncludeExcludeList from './get-new-include-exclude-list.js'

import checkSimilarity from './check-similarity.js'
import {Card, Contract} from './Card.js'
import ICONS from './icons.js'
import baseCards from './base-cards.js'


// import endGameCards from './end-game-cards.js'
// import './calculate-retrieve-cost.js'

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
const cardsMultiply = 2 // 1 = 45 cards, 2 = 90 cards

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
const tapMaxValues =         [125,  150,  175,  200,  225]
const tapCardsPerMaxValue =  [3,    3,    3,    3,    3]
_.forEach(tapMaxValues, (val, idx) => {
  _.times(tapCardsPerMaxValue[idx] * cardsMultiply, () => {
    cardsArray.push({
      type: TAP,
      maxValue: val
    })
  })
})

////////////////////////
/// POINT GENERATORS
////////////////////////

const pointCardsMultiply = 2 // 1 = 12 cards, 2 = 24 cards

// SPOT
const spotPointsMaxValues =         [125, 225,  325]
const spotPointsCardsPerMaxValue =  [2,   2,    2]
const spotPointsLevels = [LEVELS.LEVEL_1, LEVELS.LEVEL_2,  LEVELS.LEVEL_3]
_.forEach(spotPointsMaxValues, (val, idx) => {
  _.times(spotPointsCardsPerMaxValue[idx] * pointCardsMultiply, () => {
    cardsArray.push({
      type: SPOT,
      isPointGenerator: true,
      maxValue: val,
      spotLevel: spotPointsLevels[idx]
    })
  })
})

// HOME
const homePointsMaxValues =         [125, 150,  175,  200,  225,  250]
const homePointsCardsPerMaxValue =  [1,   1,    1,    1,    1,    1]
_.forEach(homePointsMaxValues, (val, idx) => {
  _.times(homePointsCardsPerMaxValue[idx] * pointCardsMultiply, () => {
    cardsArray.push({
      type: HOME,
      isPointGenerator: true,
      maxValue: val
    })
  })
})

// TAP
const tapPointsMaxValues =         [125,  150,  175,  200,  225]
const tapPointsCardsPerMaxValue =  [1,    1,    2,    1,    1]
_.forEach(tapPointsMaxValues, (val, idx) => {
  _.times(tapPointsCardsPerMaxValue[idx] * pointCardsMultiply, () => {
    cardsArray.push({
      type: TAP,
      isPointGenerator: true,
      maxValue: val
    })
  })
})
////////////////////////
/// END POINT GENERATORS
////////////////////////


const cardPointsRoller = new Brng({
  POINTS_0_3: 1,
  // POINTS_1_4: 1,
  // POINTS_5_8: 1,
}, {bias: 4})

const spotCardHasLossRoller = new Brng({0: 1, 1: 1}, {keepHistory: true, bias: 4})
const homeCardHasLossRoller = new Brng({0: 8, 1: 2}, {keepHistory: true, bias: 4})

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
    hasLoss = !!_.toNumber(homeCardHasLossRoller.roll())
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
  bias: 4
})
const lossCountForPointGeneratorRoller = new Brng({
  1: 1,
  2: 1,
}, {
  keepHistory: true,
  bias: 4
})

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

const sortCardsByArray = [
  typeSortFunc, 'isPointGenerator', maxValueSortFunc, hasLossSortFunc, 'totalCostValue'
]

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
  const maxRatioAllowed = 0.90
  const timesUntilGivingUp = 100
  const similarityRatioIncrement = (maxRatioAllowed-acceptableRatio)/timesUntilGivingUp

  const acceptableDifference = {}
  acceptableDifference[SPOT] = 75
  acceptableDifference[TAP] = 40
  acceptableDifference[HOME] = 40

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
    
    if (
      (
        similarityRatio < acceptableRatio
        // the usageValue is not too low compare to the max value
        && (cardObj.maxValue - currentUsageValue) < acceptableDifference[cardObj.type]
      )
      || timesTriedToSetResources > timesUntilGivingUp
    ) {
      if (!_.isEmpty(lossObj)) {
        cardObj.loss = lossObj // !!!!!!!!!!!!!!!
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
    return usageValue * (1.70 + (usageValue-100)/1000) - DEFAULT_CARD_COST
  }
  if (cardType === HOME) {

    return usageValue * (1.65 + (usageValue-100)/600) - DEFAULT_CARD_COST
  }
  if (cardType === TAP) {
    return usageValue * (1.70 + (usageValue-100)/600) - DEFAULT_CARD_COST
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

cardsArray = _.sortBy(cardsArray, sortCardsByArray)
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

console.log(resourceGainRoller.proportions)


// console.log('momentsArray')
// console.log(momentsArray)

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
  // {
  //   uuid: "ANYTIME",
  //   ExtraStuff: (
  //     <div className="anytime-container">
  //       <div className="anytime-title">ANYTIME</div>
  //       <div className="anytime-row"><ICONS.Money amount={5}/> <Arrow/> <ICONS.Wild /></div>
  //       <div className="anytime-row"><ICONS.Money amount={3}/> <Arrow/> <ICONS.Card /></div>
  //       <div className="anytime-row"><ICONS.Card /> <Arrow/> <ICONS.Money amount={1}/></div>
  //       <div className="anytime-row"><ICONS.Card /> <ICONS.Card /> <Arrow/> <ICONS.Money amount={3}/></div>
  //       <div className="anytime-row"><ICONS.Card /> <ICONS.Money amount={1}/> <Arrow/> <ICONS.Card /></div>
  //       <div className="anytime-row"><ICONS.Wild/> <Arrow/> <ICONS.Money amount={3}/></div>
  //       <div className="anytime-row"><ICONS.Wild/> <ICONS.Money amount={2}/> <Arrow/> <ICONS.Wild/></div>
  //     </div>
  //   )
  // },
  {
    uuid: "REFERENCE",
    ExtraStuff: (
      <div className="anytime-container">
        <div className="anytime-title">REFERENCE</div>
        {/*<div className="anytime-row"><ICONS.Wild/> : <ICONS.Fire/> / <ICONS.Water/> / <ICONS.Earth/></div>*/}
        {/*<div className="anytime-row"><ICONS.Untap/> : refresh one of your <ICONS.Tap/> cards</div>*/}
      </div>
    )
  }
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
  'ExtraStuff'
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

<ICONS.Spot />
  <ICONS.Home />
  <ICONS.Tap />
  <ICONS.Earth />
  <ICONS.Fire />
  <ICONS.Water />
  <ICONS.Wild />
  <ICONS.Wildsame />
  <ICONS.Card />
  <ICONS.Tapanother />
  <ICONS.Retrieve />
  <ICONS.Money amount={3}/>
  <ICONS.Grab />
  <ICONS.Grabanother />
  <ICONS.ThisCard />
  <ICONS.Point amount={4}/>
  <ICONS.Points4/>
  <ICONS.Points2/>
  <ICONS.Chainlevel1 />
  <ICONS.Chainlevel2 />
  <ICONS.Chainlevel3 />
  <ICONS.Untap />
  <ICONS.Windmill />


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

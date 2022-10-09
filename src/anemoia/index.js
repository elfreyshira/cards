import Brng from 'brng'
import _ from 'lodash'

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

const SPOT = 'SPOT'
const UPGRADE = 'UPGRADE'
const HOME = 'HOME'
const TAP = 'TAP'

const MIN_POINTS_MAP = {
  POINTS_1_4: 1,
  POINTS_5_8: 5
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
  money: _.constant(50),
  card: _.constant(50),
  fire: _.constant(100),
  water: _.constant(100),
  air: _.constant(100),
  earth: _.constant(100),
  wild: _.constant(125),
  develop: _.constant(50),
  untap: _.constant(100),
  retrieve: _.constant(25),
  chainLevel1: _.constant(75),
  // chainLevel1: (callLevel) => {
  //   if (callLevel === LEVELS.LEVEL_1) {
  //     return 75
  //   }
  //   else { // level 2 or 3
  //     return 50
  //   }
  // },
  chainLevel2: (callLevel) => {
    if (callLevel === LEVELS.LEVEL_1) {
      // throw new Error('Level 1 should never chain to Level 2')
      return 400
    }
    // else if (callLevel === LEVELS.LEVEL_2) {
    //   return 150
    // }
    else { // level 2 or 3
      // return 125 for level 3 dulu
      return 150
    }
  },
}

const RESOURCE_LOSS_VALUE = {
  money: _.constant(50),
  card: _.constant(37.5), // discarding unwanted cards doesn't hurt as much
  fire: _.constant(100),
  water: _.constant(100),
  air: _.constant(100),
  earth: _.constant(100),
  wild: _.constant(75),
  tapAnother: _.constant(75) // at first was thinking 100, but just like a wild, it gives freedom to what you want to tap, so make it -75
}

const ABSTRACT_RESOURCE_ARRAY = ['develop', 'untap', 'retrieve','chainLevel1','chainLevel2', 'card']
const PHYSICAL_RESOURCE_ARRAY = ['money', 'fire', 'water', 'air', 'earth', 'wild']

function excludeValuesAbove (value, level) {
  return _.keys(
    _.omitBy(RESOURCE_GAIN_VALUE, (func) => {
      return func(level) <= value
    })
  )  
}


// add the type and level
let spotArray = []
_.times(8, () => {
  spotArray.push({
    type: SPOT,
    spotLevel: LEVELS.LEVEL_1
  })
})
_.times(12, () => {
  spotArray.push({
    type: SPOT,
    spotLevel: LEVELS.LEVEL_2
  })
})
_.times(10, () => {
  spotArray.push({
    type: SPOT,
    spotLevel: LEVELS.LEVEL_3
  })
})

const spotPointsRoller = new Brng({
  POINTS_1_4: 1,
  POINTS_5_8: 1,
  // POINTS_5_6:1
} ,{bias: 3})

_.forEach(spotArray, (spotObj) => {
  spotObj.points = spotPointsRoller.roll()
})

const spotGainRoller = new Brng({
  money: 2,
  card: 2,
  fire: 2,
  water: 2,
  air: 2,
  earth: 2,
  wild: 3,
  develop: 2.5,
  untap: 0.5,
  retrieve: 2,
  chainLevel1: 1.2,
  chainLevel2: .8
}, {
  keepHistory: true,
  bias: 2
})

const spotLossNumRoller = new Brng({0: 12, 1: 5, 2: 3}, {keepHistory: true, bias: 2})
const spotLossResourceRoller = new Brng({
  money: 2,
  card: 2,
  fire: 2,
  water: 2,
  air: 2,
  earth: 2,
  wild: 3,
  tapAnother: .5, // (-100 value)
}, {
  keepHistory: true,
  bias: 2
})

spotArray = _.sortBy(spotArray, ['type', 'spotLevel', 'points'])

// add how many spaces the spot has
const spotNumSpaceRoller = new Brng({1: 1, 2: 1}, {bias: 2})
_.forEach(spotArray, (spotObj) => {
  spotObj.spotSpaces = _.toNumber(spotNumSpaceRoller.roll())
})

spotArray = _.sortBy(spotArray, ['type', 'spotLevel', 'points', 'spotSpaces'])

// add whether it has a bonus or not
const cardHasBonusRoller = new Brng({hasBonus: 1, noBonus: 2}, {bias: 2})
const cardBonusRoller = new Brng({
  develop: 1,
  untap: 1,
  retrieve: 2,
  chainLevel1: 1,
  chainLevel2: 1
}, {keepHistory: true, bias: 2})
_.forEach(spotArray, (spotObj) => {
  if (cardHasBonusRoller.roll() === 'hasBonus') {
    let bonusResource = cardBonusRoller.roll()

    if (spotObj.spotLevel === LEVELS.LEVEL_1 && bonusResource === 'chainLevel2') {
      cardBonusRoller.undo()
      bonusResource = cardBonusRoller.roll({exclude: ['chainLevel2']})
    }
    spotObj.bonus = bonusResource
  }
})

spotArray = _.sortBy(spotArray, ['type', 'spotLevel', 'points', 'spotSpaces', 'bonus'])


/*
rules for the resource loss and gain:
- only have 1 type of resource loss, but can be repeated
- only deal with 3 resources total (loss variety + gain variety <= 3)
- only should deal with 2 physical resource gains (money, elements, wild, cards)
- max of 1 chainLevel per card
- for the abstract resources, max of 1 per resource
*/


_.forEach(spotArray, (spotObj) => {
  const fixedMaxValue = LEVELS_MAX_VALUE[spotObj.spotLevel]
  let currentMaxValue = fixedMaxValue
  let currentValue = 0
  const resourceGainObj = {}
  let excludeList = []

  let loopTimes = 0
  let onlyInclude = []

  let hasLimitedPhysicalResource = false
  let hasLimitedTotalResource = false

  /// START: RESOURCE LOSS
  /// START: RESOURCE LOSS
  let numResourceLoss = _.toNumber(spotLossNumRoller.roll())
  let chosenResourceLoss
  if (numResourceLoss > 0) {
    chosenResourceLoss = spotLossResourceRoller.roll()
    spotObj.loss = {}

    if (chosenResourceLoss === 'tapAnother' && numResourceLoss === 2) {
      numResourceLoss = 1
      spotLossNumRoller.undo()
      spotLossNumRoller.roll('1')
    }

    if (numResourceLoss === 2) {
      spotLossResourceRoller.roll(chosenResourceLoss)
    }

    spotObj.loss[chosenResourceLoss] = numResourceLoss

    const valueLoss = RESOURCE_LOSS_VALUE[chosenResourceLoss]()*numResourceLoss
    currentValue = currentValue - valueLoss
    currentMaxValue = currentMaxValue + valueLoss

    excludeList.push(chosenResourceLoss)
  }
  /// END: RESOURCE LOSS
  /// END: RESOURCE LOSS

  if (spotObj.spotLevel === LEVELS.LEVEL_1) {
    excludeList.push('chainLevel2')
  }

  while (currentValue < (fixedMaxValue-40) && loopTimes <= 10) {
    loopTimes++
    if (loopTimes === 10) {
      console.log(loopTimes)
      console.log(resourceGainObj)
    }
    // const chosenResource = spotGainRoller.roll()
    const chosenResource = _.attempt(() => spotGainRoller.roll({
      only: _.isEmpty(onlyInclude) ? undefined : onlyInclude,
      exclude: excludeValuesAbove(currentMaxValue).concat(excludeList)
    }))

    if (_.isError(chosenResource)) {
      break
      console.log('----------------')
      console.log(chosenResource)
      console.log(JSON.stringify(resourceGainObj))
      console.log(JSON.stringify(onlyInclude))
      console.log(JSON.stringify(excludeList))
      console.log(JSON.stringify(excludeValuesAbove(currentMaxValue).concat(excludeList)))
      console.log('-----------------')
      break
    }
    if (_.includes(ABSTRACT_RESOURCE_ARRAY, chosenResource)) {
      excludeList.push(chosenResource)
    }
    
    resourceGainObj[chosenResource] = (resourceGainObj[chosenResource] || 0) + 1

    if (
      _.intersection(
        _.keys(resourceGainObj), PHYSICAL_RESOURCE_ARRAY
      ).length === 2
      && !hasLimitedPhysicalResource
    ) {
      excludeList = _.uniq(
        excludeList.concat(_.without(PHYSICAL_RESOURCE_ARRAY, ..._.keys(resourceGainObj)))
      )
      // onlyInclude = _.uniq(onlyInclude.concat(_.keys(resourceGainObj).concat()))
      hasLimitedPhysicalResource = true
    }

    if (
      _.keys(resourceGainObj).concat(_.keys(spotObj.loss)).length === 3
      && !hasLimitedTotalResource
    ) {
      onlyInclude = _.uniq(onlyInclude.concat(_.keys(resourceGainObj)))
      hasLimitedTotalResource = true
    }

    if (chosenResource === 'chainLevel1' || chosenResource === 'chainLevel2') {
      excludeList = _.uniq(excludeList.concat(['chainLevel1', 'chainLevel2']))
    }

    if (
      _.keys(resourceGainObj).concat(_.keys(spotObj.loss)).length === 2
      && currentMaxValue >= 100
      && _.intersection(_.keys(resourceGainObj), PHYSICAL_RESOURCE_ARRAY).length === 0
    ) {
      excludeList = _.uniq(excludeList.concat(ABSTRACT_RESOURCE_ARRAY))
    }

    
    const valueGained = RESOURCE_GAIN_VALUE[chosenResource](spotObj.spotLevel)
    currentValue += valueGained
    currentMaxValue = currentMaxValue - valueGained

  }
  spotObj.gain = resourceGainObj
  // console.log('resourceGainObj', resourceGainObj)


})


function roundToNearest25 (x) {
  return Math.ceil(x/25)*25
}

// RESOURCE COST
_.forEach(spotArray, (spotObj) => {
  let totalCostValue = 0
  // == bonus - (loss+gain)*2 + points - default card cost

  const bonusValue = spotObj.bonus ? RESOURCE_GAIN_VALUE[spotObj.bonus]() : 0
  const lossValue = spotObj.loss ?
    RESOURCE_LOSS_VALUE[_.keys(spotObj.loss)[0]]()*_.values(spotObj.loss)[0] : 0
  const gainValue = _.chain(spotObj.gain).map((val, key) => RESOURCE_GAIN_VALUE[key]()*val).sum().value()
  const defaultCardCost = 100

  const multiplier = spotObj.spotSpaces === 2 ? 2 : 1.5

  totalCostValue = bonusValue + (gainValue - lossValue)*multiplier - defaultCardCost

  const minPointsOnCard = MIN_POINTS_MAP[spotObj.points]
  let pointsOnCard = 0
  while (pointsOnCard < minPointsOnCard || roundToNearest25(totalCostValue)%100 !== 0) {
    pointsOnCard++
    totalCostValue += 25
  }

  spotObj.pointsOnCard = pointsOnCard
  spotObj.totalCostValue = roundToNearest25(totalCostValue)
  
})

console.log(_.chain(spotArray).map('totalCostValue').mean().value())
// average is usually 360

console.log(_.chain(spotArray).map('totalCostValue').max().value())

const costVarietyRoller = new Brng({1:2, 2:3, 3:1}, {keepHistory: true, bias: 2})
const costToVarietyMap = {
  100: [1],
  200: [1,2],
  300: [1,2],
  400: [2,3],
  500: [2,3],
  600: [2,3],
  700: [2,3],
  800: [2,3],
  900: [2,3]
}
const resourceCostRoller = new Brng({
  fire: 1,
  water: 1,
  earth: 1,
  air: 1
}, {keepHistory: true, bias: 2})


spotArray = _.sortBy(spotArray, ['type', 'spotLevel', 'totalCostValue', 'points', 'spotSpaces', 'bonus'])
_.forEach(spotArray, (spotObj) => {

  const totalCostValue = spotObj.totalCostValue
  const costVariety = _.toNumber(costVarietyRoller.roll({only:costToVarietyMap[totalCostValue]}))

  const resourceCostObj = {}
  let onlyResourceCost = []
  while (_.sum(_.values(resourceCostObj))*100 < spotObj.totalCostValue) {
    const chosenResourceToPay = resourceCostRoller.roll(
      {only: _.isEmpty(onlyResourceCost) ? undefined : onlyResourceCost}
    )
    resourceCostObj[chosenResourceToPay] = (resourceCostObj[chosenResourceToPay] + 1) || 1

    if (costVariety === _.keys(resourceCostObj).length) {
      console.log('here', costVariety, _.keys(resourceCostObj))
      onlyResourceCost = _.keys(resourceCostObj)
    }

  }
  spotObj.resourceCost = resourceCostObj


})

console.log(spotArray)

console.log(spotGainRoller.proportions)

function Cards () {
  return <div><pre>{JSON.stringify(spotArray, null, 2)}</pre> </div>
}

export default Cards

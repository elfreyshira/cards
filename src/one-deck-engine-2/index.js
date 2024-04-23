import Brng from 'brng'
import _ from 'lodash'

import {Card} from './Card.js'
import Character from './Character.js'

import '../util/base.css'
import './index.css'

import getNewExcludeList from '../util/getNewExcludeList.js'


// const CARD_QUANTITY = 0

const CARD_QUANTITY = 52
console.clear()

// const RESOURCE_VALUES_MAPPING = {
//   draw: 125, // or 300

//   fireProduce: 50,
//   fireStorage: 50,

//   earthProduce: 50,
//   earthStorage: 50,

//   waterProduce: 50,
//   waterStorage: 50,

//   wildProduce: 75,
//   wildStorage: 75,

//   fireDiscount: 150,
//   earthDiscount: 150,
//   waterDiscount: 150,

//   point: 200,
//   // tieBreaker: 50,

//   // buildWithOnlyDiscount: 300, // after selecting the activate action
//   // buildWithOnlyProduced: 300, // including cards, after selecting the build action

//   // activateAfterBuildLevel1: 100,
//   // activateAfterBuildLevel2: 
// }

// const RESOURCE_VALUES_MAPPING = {
//   draw: 250, // or 300

//   fireProduce: 100,
//   fireStorage: 100,

//   earthProduce: 100,
//   earthStorage: 100,

//   waterProduce: 100,
//   waterStorage: 100,

//   wildProduce: 150,
//   wildStorage: 150,

//   fireDiscount: 300,
//   earthDiscount: 300,
//   waterDiscount: 300,

//   point: 200,
//   // tieBreaker: 50,

//   // buildWithOnlyDiscount: 300, // after selecting the activate action
//   // buildWithOnlyProduced: 300, // including cards, after selecting the build action

//   // activateAfterBuildLevel1: 100,
//   // activateAfterBuildLevel2: 
// }

const RESOURCE_VALUES_MAPPING = {
  draw: 200, // or 300

  fireProduce: 75,
  fireStorage: 75,

  earthProduce: 75,
  earthStorage: 75,

  waterProduce: 75,
  waterStorage: 75,

  wildProduce: 100,
  wildStorage: 100,

  fireDiscount: 200,
  earthDiscount: 200,
  waterDiscount: 200,

  point: 200,
  // tieBreaker: 50,

  buildWithOnlyDiscounted: 300, // after selecting the activate action
  buildWithOnlyProduced: 300, // including cards, after selecting the build action

  // activateAfterBuildLevel1: 100,
  // activateAfterBuildLevel2: 
}

const RESOURCE_LIST = _.keys(RESOURCE_VALUES_MAPPING)

/////////////////////////////
/////////////////////////////
/////////////////////////////


const resourceGainRoller = new Brng({
  draw: 1.7,

  fireProduce: 0.85,
  fireStorage: 1.15,

  earthProduce: 0.85,
  earthStorage: 1.15,

  waterProduce: 0.85,
  waterStorage: 1.15,

  wildProduce: 1.7,
  wildStorage: 2.3,

  fireDiscount: 1.42,
  earthDiscount: 1.42,
  waterDiscount: 1.42,

  point: 5.4,
  // tieBreaker: 50,

  buildWithOnlyDiscounted: 0.5, // after selecting the activate action
  buildWithOnlyProduced: 0.5, // including cards, after selecting the build action
}, {bias: 4})

const costResourceRoller = new Brng({
  fire: 1,
  earth: 1,
  water: 1
}, {bias: 4})

const CARD_COST_DISTRIBUTION = {
  // https://boardgamegeek.com/image/5536942/race-galaxy
  1: 10,
  2: 36,

  3: 20,
  4: 16,

  5: 12,
  6: 9,
  7: 5,
}
const cardCostTotalRoller = new Brng(CARD_COST_DISTRIBUTION, {bias: 4})

const cardCostVarietyRoller = new Brng({
  1: 4,
  2: 3,
  3: 2,
}, {bias: 4})

const timePassedRoller = new Brng({
  0: 1,
  1: 1,
  2: 1,
}, {bias: 4})

const discardForResourceRoller = new Brng({
  fire: 1,
  earth: 1,
  water: 1,
}, {bias: 4})

const canHavePntsRoller = new Brng({
  true: 70,
  false: 30,
}, {bias: 4})

// activation levels:
// 1: 100-150
// 2: 200-250
// 3: 300+

//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
//////////////////////////////////////////////////////


let cardsArray = [
  // {
  //   costTotal,
  //   costVariety,
  //   timePassed,
  //   cost: {
  //     fire: ...,
  //     earth: ...,
  //     water: ...,
  //   },
  //   tiebreaker: NUMBER,
  //   expectedValue: NUMBER,
  //   gain: {
  //     fireProduce: ...,
  //   }
  // }
]

const sortOrderArray = [(cardObj) => -cardObj.costTotal, 'canHavePnts', 'costVariety', 'discard', 'timePassed']

_.times(CARD_QUANTITY, () => {
  const costTotal = _.toNumber(cardCostTotalRoller.roll())

  cardsArray.push({
    costTotal: costTotal,
    expectedValue: 100, // every card has base value of 100
    maxVarietyResourcesOnly: costTotal >= 6 ? false : true,
    uuid: Math.random().toString(36).slice(2),
    // cost: {},
    // gain: {}
  })
})
cardsArray = _.sortBy(cardsArray, sortOrderArray)

_.forEach(cardsArray, (cardObj) => {
  cardObj.costVariety = _.toNumber(cardCostVarietyRoller.roll())
})
cardsArray = _.sortBy(cardsArray, sortOrderArray)


_.forEach(cardsArray, (cardObj) => {
  if (canHavePntsRoller.roll() === 'true') {
    cardObj.canHavePnts = true
  }
})
cardsArray = _.sortBy(cardsArray, sortOrderArray)

_.forEach(cardsArray, (cardObj) => {
  cardObj.discard = discardForResourceRoller.roll()
})
cardsArray = _.sortBy(cardsArray, sortOrderArray)

_.forEach(cardsArray, (cardObj) => {
  cardObj.timePassed = _.toNumber(timePassedRoller.roll())
})
cardsArray = _.sortBy(cardsArray, sortOrderArray)


_.forEach(cardsArray, (cardObj) => {
  const costObj = {}
  let expectedValue = cardObj.expectedValue
  _.times(cardObj.costTotal, () => {
    const newExcludeList = getNewExcludeList(costObj, {
      groupingMaxVariety: [
        {resourceList: ['fire', 'earth', 'water'], max: cardObj.costVariety},
      ]
    })

    const costResource = costResourceRoller.roll({exclude: newExcludeList})
    costObj[costResource] = costObj[costResource] ? (costObj[costResource] + 1) : 1
    expectedValue += 100 + (costObj[costResource] - 1)*10
  })
  cardObj.cost = costObj
  cardObj.expectedValue = _.round(expectedValue, 1)
})

// // // // // // // // // // // // // // // // // // // // // // // // // // // 
// // // // // // // // // // // // // // // // // // // // // // // // // // // 

const VALUE_SLACK = 30
function getAvailableEffects (remainingValue) {
  // returns all effects that are less than remainingValue
  return _.keys(
    _.pickBy(RESOURCE_VALUES_MAPPING, (resourceValue) => {
      return resourceValue <= (remainingValue + VALUE_SLACK)
    })
  )
}

const VALUE_TIEBREAKER = 50

_.forEach(cardsArray, (cardObj) => {
  let currentValue = 0
  const gainObj = {}

  // while (currentValue < (cardObj.expectedValue - 99)) {
  while (true) {

    const newExcludeList = getNewExcludeList(
      gainObj,
      {
        groupingMaxVariety: [
          {
            // resourceList: cardObj.maxVarietyResourcesOnly ?
            //   RESOURCE_LIST : _.without(RESOURCE_LIST, 'point'),
            resourceList: _.without(RESOURCE_LIST, 'point'),
            max: 3
          },
          // {resourceList: RESOURCE_LIST, max: 3},

          {resourceList: ['fireDiscount', 'earthDiscount', 'waterDiscount'], max: 2},
          {resourceList: ['fireProduce', 'earthProduce', 'waterProduce', 'wildProduce', 'draw'], max: 2},
          {resourceList: ['fireStorage', 'earthStorage', 'waterStorage', 'wildStorage'], max: 1},
          {resourceList: [
            ['fireStorage', 'fireProduce', 'fireDiscount'],
            ['earthStorage', 'earthProduce', 'earthDiscount'],
            ['waterStorage', 'waterProduce', 'waterDiscount'],
          ], max: 2},
          {resourceList: ['fireProduce', 'fireStorage'], max: 1},
          {resourceList: ['earthProduce', 'earthStorage'], max: 1},
          {resourceList: ['waterProduce', 'waterStorage'], max: 1},
          {resourceList: ['wildProduce', 'wildStorage'], max: 1},
        ],

        groupingMaxQuantity: [
          {resourceList: ['fireStorage', 'earthStorage', 'waterStorage', 'wildStorage'], max: 4},
          {resourceList: ['fireProduce', 'earthProduce', 'waterProduce', 'wildProduce', 'draw'], max: 4},
          {resourceList: ['fireDiscount', 'earthDiscount', 'waterDiscount'], max: 3},
          {resourceList: ['buildWithOnlyDiscounted', 'buildWithOnlyProduced'], max: 1},
          {resourceList: ['draw'], max: 1},
          {resourceList: ['point'], max: cardObj.canHavePnts ? 3 : 0},
        ],

      },
    )

    const onlyList = _.intersection(
      RESOURCE_LIST,
      getAvailableEffects(cardObj.expectedValue - currentValue)
    )
    const newResourceToAdd = _.attempt(() => 
      resourceGainRoller.roll({
        exclude: newExcludeList,
        only: onlyList
      })
    )
    if (_.isError(newResourceToAdd)) {
      if (cardObj.expectedValue - currentValue >= VALUE_TIEBREAKER) {
        cardObj.tieBreaker = _.floor((cardObj.expectedValue - currentValue)/VALUE_TIEBREAKER)
      }
      if (currentValue > cardObj.expectedValue) {
        cardObj.advantage = true
      }
      else if (currentValue < cardObj.expectedValue) {
        cardObj.loss = true
      }
      
      break // !!!!!!!!!!!!!!!!
    }

    gainObj[newResourceToAdd] = gainObj[newResourceToAdd] ?
      gainObj[newResourceToAdd] + 1 : 1
    currentValue += RESOURCE_VALUES_MAPPING[newResourceToAdd]
  }

  cardObj.gain = gainObj
  cardObj.actualValue = currentValue
})



function Cards () {
  return (
    <div>
      {
        _.map(cardsArray, (cardObj, idx) => <Card key={idx} cardObj={cardObj} /> )
      }
      <Character farmType="one"/>
      <Character farmType="wild"/>
      {/*<Character farmType="discount"/>*/}
      {/*<Character farmType="produce"/>*/}
      <pre className="noprint">{JSON.stringify(cardsArray, null, 2)}</pre>
    </div>
    
  )
}

console.log(resourceGainRoller.proportions)

export default Cards

import Brng from 'brng'
import _ from 'lodash'

import {Card} from './Card.js'
import Character from './Character.js'

import '../util/base.css'
import './index.css'

import getNewExcludeList from '../util/getNewExcludeList.js'
import biasRandom from '../util/biasRandom.js'


// const CARD_QUANTITY = 0

const CARD_QUANTITY = 52
console.clear()


const RESOURCE_VALUES_MAPPING = {
  draw: 150,

  wildProduce: 50,
  wildStorage: 50,

  fireDiscount: 150,
  waterDiscount: 150,

  drawAfterBuildEngine: 300,
  drawAfterBuildPurchase: 200,

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
  draw: 1.8,

  wildProduce: 1.9,
  wildStorage: 2.1,

  fireDiscount: 1,
  waterDiscount: 1,

  drawAfterBuildEngine: 0.3,
  drawAfterBuildPurchase: 0.3,


  // buildWithOnlyDiscounted: 0.5, // after selecting the activate action
  // buildWithOnlyProduced: 0.5, // including cards, after selecting the build action
}, {bias: 1})

const CARD_COST_DISTRIBUTION = {
  // https://boardgamegeek.com/image/5536942/race-galaxy
  1: 10,
  2: 36,

  3: 20,
  4: 14,

  5: 10,
  6: 7,
  // 7: 5,
}
const cardCostTotalRoller = new Brng(CARD_COST_DISTRIBUTION, {bias: 4})


const pointCostRoller = new Brng(_.countBy(_.range(2, 12+1)), {bias: 4})

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

const sortOrderArray = [
  (cardObj) => -cardObj.costTotal,
  'costPurchaseSide',
  (cardObj) => cardObj.purchaseArray ? cardObj.purchaseArray[0] : 0,
  (cardObj) => cardObj.purchaseArray ? cardObj.purchaseArray[1] : 0,
]

_.times(CARD_QUANTITY, () => {
  const costTotal = _.toNumber(cardCostTotalRoller.roll())

  cardsArray.push({
    costTotal: costTotal,
    expectedValue: 100 + costTotal*100, // every card has base value of 100
    maxVarietyResourcesOnly: costTotal >= 6 ? false : true,
    uuid: Math.random().toString(36).slice(2),
    // cost: {},
    // gain: {}
  })
})
cardsArray = _.sortBy(cardsArray, sortOrderArray)

_.forEach(cardsArray, (cardObj, cardsArrayIndex) => {
  cardObj.pointCost = _.toNumber(pointCostRoller.roll())
})
cardsArray = _.sortBy(cardsArray, sortOrderArray)

_.forEach(cardsArray, (cardObj, cardsArrayIndex) => {
  cardObj.costPurchaseSide = cardsArray[cardsArray.length - cardsArrayIndex - 1].costTotal
})
cardsArray = _.sortBy(cardsArray, sortOrderArray)


function getPurchasePower (maxValue) {
  const purchasePower = _.floor(
    Math.abs(
      // biasRandom() + biasRandom() - 1
      Math.random() + Math.random() - 1
    )
    * (maxValue*1.5 + 2)
  )
  if (purchasePower > maxValue) {
    return getPurchasePower(maxValue)
  }
  else {
    return purchasePower
  }
}

_.forEach(cardsArray, (cardObj, cardsArrayIndex) => {
  // const purchaseArray = []
  const purchaseSideValue = cardObj.costPurchaseSide + 1

  // first
  const first = getPurchasePower(purchaseSideValue/1.5)
  const second = first + getPurchasePower(purchaseSideValue - first*1.5)
  const third = second + _.round(
    (purchaseSideValue - first*1.5 - (second - first)) / 0.6666666
    - 0.1
  )

  cardObj.purchaseArray = [first, second, third]

})
cardsArray = _.sortBy(cardsArray, sortOrderArray)

// // // // // // // // // // // // // // // // // // // // // // // // // // // 
// // // // // // // // // // // // // // // // // // // // // // // // // // // 

const VALUE_SLACK = 1
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
          {resourceList: ['wildStorage', 'wildProduce'], max: 1},
          {resourceList: ['fireDiscount', 'waterDiscount'], max: 1},
        ],

        groupingMaxQuantity: [
          {resourceList: ['wildStorage'], max: 3},
          {resourceList: ['wildProduce'], max: 3},
          {resourceList: ['wildProduce', 'draw'], max: 5},
          {resourceList: ['drawAfterBuildEngine', 'drawAfterBuildPurchase'], max: 1},
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
      <Character/>
      <Character/>

      <pre className="noprint">{JSON.stringify(cardsArray, null, 2)}</pre>
    </div>
    
  )
}

console.log(resourceGainRoller.proportions)

export default Cards

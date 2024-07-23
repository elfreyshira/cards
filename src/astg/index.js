import _ from 'lodash'
import Brng from 'brng'

import generateValues from './generate-values.js'
import {
  effectToValueFuncMapping,
  crResourceProportions,
  wpResourceProportions,
  rdResourceProportions,
  ACTION_RESOURCE_LIST,
  PHYSICAL_RESOURCE_LIST,
  PHYSICAL_SPECIAL_RESOURCE_LIST,
  GOODS_RESOURCE_LIST,
  LABOR_RESOURCE_LIST,
  TAXES_RESOURCE_LIST,
  DRAW_RESOURCE_LIST,

  crStrengthToAvailableValueMapping,
} from './CONSTANTS.js'


import getNewExcludeList from '../util/getNewExcludeList.js'
import getAvailableResources from '../util/getAvailableResources.js'
import roundToNearest from '../util/roundToNearest.js'

import Card from './Card.js'

import '../util/base.css'
import './index.css'

// console.clear()

const TYPES_OF_CARD = ['wp', 'cr', 'rd']

const QUANTITY_PER_STRENGTH = 2

const strengthArray = _.reverse([
  2,    2.5,  3,    // tier 1
  3.5,  4,    4.5,  // tier 2
  5,    5.5,  6     // tier 3
])

const cardCostProportions = {
  0: 1,
  1: 1,
  2: 1,
  3: 1,
  4: 1,
  5: 1,
  6: 1,
  7: 1,
  8: 1,
}

const crActivationIndexRoller = new Brng({0: 1, 1: 1, 2: 1}, {bias: 4, repeatTolerance: 0})

const WP_EARLY_RESOURCE_DIVIDER = 1.1
function getExpectedValue(cardType, strength, crActivationIndex) {
  if (cardType === 'wp') {
    // return strength*100
    return strength * 100 * (4 / 3) / WP_EARLY_RESOURCE_DIVIDER
  }
  else if (cardType === 'cr') {
    return _.last(crStrengthToAvailableValueMapping[strength][crActivationIndex])* 100
    // return strength*100
  }
  else {
    return strength*100
  }
}

function getAdjustedCurrentValue(cardType, currentValue, crActivation) {
  if (cardType === 'rd') {
    return currentValue
  }
  else if (cardType === 'wp') {
    return currentValue * (3/4) * WP_EARLY_RESOURCE_DIVIDER
  }
  else if (cardType === 'cr') {
    return ((currentValue-100) / crActivation * 4) + 100
  }
}

const rollerByType = {
  wp: new Brng(wpResourceProportions, {bias: 4}),
  rd: new Brng(rdResourceProportions, {bias: 4}),
  cr: new Brng(crResourceProportions, {bias: 4}),
}

const cardsArray = []

_.forEach(TYPES_OF_CARD, (cardType) => {
  _.forEach(strengthArray, (strength) => {
    _.times(QUANTITY_PER_STRENGTH, () => {
      const cardObj = {}

      let crActivationIndex
      if (cardType === 'cr') {
        crActivationIndex = _.toNumber(crActivationIndexRoller.roll())
        cardObj.crActivation = 4-crActivationIndex
      }

      _.merge(cardObj, {
        type: cardType,
        strength: strength,
        cost: (strength-1)*200 - 200,
        expectedValue: getExpectedValue(cardType, strength, crActivationIndex),
      })

      let gainObj = {}
      let currentValue = 0

      /// CHOOSE FIRST RESOURCE, FORCING IT TO BE PHYSICAL
      const chosenResource = rollerByType[cardType].roll({only: PHYSICAL_RESOURCE_LIST})
      gainObj[chosenResource] = 1
      currentValue += effectToValueFuncMapping[chosenResource](cardObj)

      while (true) {

        const onlyList = getAvailableResources(
          effectToValueFuncMapping,
          cardObj.expectedValue - currentValue,
          25, // slack
          cardObj
        )
        // (resourceMapping, remainingValue, valueSlack = 0, cardObj = {})

        const excludeList = getNewExcludeList(
          gainObj,
          {
            groupingMaxVariety: [
              {resourceList: PHYSICAL_RESOURCE_LIST, max: cardObj.expectedValue <= 330 ? 1 : 2},
              {resourceList: PHYSICAL_SPECIAL_RESOURCE_LIST, max: 1},

              {resourceList: GOODS_RESOURCE_LIST, max: 1},
              {resourceList: LABOR_RESOURCE_LIST, max: 1},
              {resourceList: TAXES_RESOURCE_LIST, max: 1},
              {resourceList: DRAW_RESOURCE_LIST, max: 1},
            ],
            groupingMaxQuantity: [
              {resourceList: ACTION_RESOURCE_LIST, max: 1},
              {resourceList: PHYSICAL_SPECIAL_RESOURCE_LIST, max: 3},
              {resourceList: DRAW_RESOURCE_LIST, max: 2},
            ]
          }
        )

        const chosenResource = _.attempt(
          () => rollerByType[cardType].roll({only: onlyList, exclude: excludeList})
        )
        if (_.isError(chosenResource)) {
          break
        }
        else {
          gainObj[chosenResource] = gainObj[chosenResource] ? gainObj[chosenResource] + 1 : 1
          currentValue += effectToValueFuncMapping[chosenResource](cardObj)
        }

      }

      const favor = _.max([_.round((cardObj.expectedValue - currentValue)/50), 0])
      if (favor > 0) {
        gainObj.favor = favor
        currentValue += favor * 50
      }

      cardObj.currentValue = currentValue
      cardObj.gain = gainObj

      // points
      const adjustedCurrentValue = getAdjustedCurrentValue(cardType, currentValue, cardObj.crActivation)
      
      cardObj.expectedPoints = (strength - 1) * 2

      // cardObj.points2 = ((cardObj.cost + 200) - (adjustedCurrentValue - 100)) / 50
      const actualPoints = ((cardObj.cost + 200) - (adjustedCurrentValue - 100)*1.5) / 25
      cardObj.points = _.clamp(
        _.round(cardObj.expectedPoints + (actualPoints - cardObj.expectedPoints)*1.2),
        0, // can't have any points lower than 0
        100
      )

      cardsArray.push(cardObj)

    })
  })
})


function Cards () {
  return <div>
    {_.map(cardsArray, (cardObj, idx) => <Card key={idx} cardObj={cardObj} /> )}
    <pre className="noprint">{JSON.stringify(cardsArray, null, 2)}</pre>
  </div>
}

console.log(rollerByType.wp.proportions)
console.log(rollerByType.rd.proportions)
console.log(rollerByType.cr.proportions)

export default Cards

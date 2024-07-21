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
} from './CONSTANTS.js'


import getNewExcludeList from '../util/getNewExcludeList.js'
import getAvailableResources from '../util/getAvailableResources.js'
import roundToNearest from '../util/roundToNearest.js'

// import './index.css'

// console.clear()

const TYPES_OF_CARD = ['wp', 'cr', 'rd']

const QUANTITY_PER_STRENGTH = 2

const strengthArray = [
  2,    2.5,  3,    // tier 1
  3.5,  4,    4.5,  // tier 2
  5,    5.5,  6     // tier 3
]

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

const WP_EARLY_RESOURCE_DIVIDER = 1.1
function getExpectedValue(cardType, strength) {
  if (cardType === 'wp') {
    // return strength*100
    return strength * 100 * (4 / 3) / WP_EARLY_RESOURCE_DIVIDER
  }
  else {
    return strength*100
  }
}

const rollerByType = {
  wp: new Brng(wpResourceProportions, {bias: 4}),
  rd: new Brng(rdResourceProportions, {bias: 4}),
  cr: new Brng(crResourceProportions, {bias: 4}),
}

const cardsArray = []

_.forEach(TYPES_OF_CARD, (cardType) => {
  _.forEach(_.reverse(strengthArray), (strength) => {
    _.times(QUANTITY_PER_STRENGTH, () => {

      const cardObj = {
        type: cardType,
        strength: strength,
        cost: (strength-1)*200-200,
        expectedValue: getExpectedValue(cardType, strength),
      }

      let gainObj = {}
      let currentValue = 0

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
              {resourceList: ['draw'], max: 3},
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

      cardsArray.push(cardObj)

    })
  })
})


function Cards () {
  return <div>
    <pre>{JSON.stringify(cardsArray, null, 2)}</pre>
  </div>
}

console.log(rollerByType.wp.proportions)
console.log(rollerByType.rd.proportions)
console.log(rollerByType.cr.proportions)

export default Cards

import _ from 'lodash'
import Brng from 'brng'
import seed from 'seed-random'

import '../util/base.css'
import generateGainObj from '../util/generateGainObj.js'
import getLeastSimilarObj from '../util/getLeastSimilarObj.js'
import createNestedBrngRoller from '../util/createNestedBrngRoller.js'
import countOccurances from '../util/countOccurances.js'

import Card from './Card.js'



import './index.css'

import starterCards from './starterCards.js'

// console.clear()


const params = new URL(document.URL).searchParams
const seedID = params.get('seed')
if (_.isString(seedID)) {
  Brng.random = seed(seedID)
}


const CARD_QUANTITY = 31


const resourceToValueMapping = {
  money: 100,

  energy: 50,
  ninja: 200,
  point: 200,

  addTroop: 100,
  moveTroop: 50,
  moveMech: 150,
  addToAny: 150,
  moveToAny: 100,
  moveAll: 150,

  draw: 200,
  cycle: 100,
  bonus: 50, // put 1 at bottom of deck, draw 1

  // BOTTOM
  strength: 150,
  retaliate: 125, // losing
  retreat: 75, // losing
  // resurrect: 125, // losing
  rally: 75, // both
  push: 125, // both
  steal: 100,
}

const valueSlackRoller = new Brng({0: 1, 50: 1}, {bias: 4})

const gainTopRoller = new Brng({
  money: 120,

  // point: 10,

  energy: 200, // * 0.5 = 100

  ninja: 15, // * 2 = 30
  addToAny: 10, //* 3 = 30

  moveToAny: 20, // x 2 = 40
  moveAll: 10, // x 3 = 30
  moveMech: 10, // x 3 = 30

  // draw: 2,
  // cycle: 15,
}, {bias: 4, keepHistory: true})

const gainBottomRoller = new Brng({
  strength: 15, // winning
  retaliate: 5, // losing
  retreat: 4, // losing
  // resurrect: 2, // losing

  rally: 6, // both
  push: 2, // both
  steal: 3, // both
}, {bias: 4, keepHistory: true})



const costRoller = new Brng({
  1: 2,
  2: 3,

  3: 4,
  4: 3,
  5: 2,
  6: 1.2,
  // 7: .8,
}, {bias: 4})

const costToValueMapping = {
  1: 200,
  2: 275,

  3: 333,
  4: 380,
  5: 418,
  6: 450,
  // 7: 5.20,
  // 8: 5.50,
}

const cardObjSimilaritySettings = {
  cost: [1, 3], // multiplier = 1, max diff = 3, type = Number, 
  gainTop: {
    energy: [1, 3],
    money: [1, 2],
    ninja: [1, 1],
    addToAny: [1, 1],
    moveToAny: [1, 1],
    moveAll: [1, 1],
    moveMech: [1, 1],
  },
  currentTopValue: [1, 2],
  gainBottom: {
    strength: [1, 3],
    retaliate: [1, 3],
    // resurrect: [1, 2],
    retreat: [1, 3],
    rally: [1, 3],
    steal: [1, 3],
  },
  currentBottomValue: [1, 2],
}
const cardObjSimilaritySettings2 = {
  cost: [1, 3], // multiplier = 1, max diff = 3, type = Number, 
  gainBottom: {
    strength: [1, 3],
    retaliate: [1, 3],
    // resurrect: [1, 2],
    retreat: [1, 3],
    rally: [1, 3],
    steal: [1, 3],
  },
  currentBottomValue: [1, 2],
}

/////////////////////////////

const sortOrderArray = [
  (cardObj) => -cardObj.cost,
]

let cardsArray = []
_.times(CARD_QUANTITY, (index) => {
  const cardCost = costRoller.roll()
  cardsArray.push({
    cost: cardCost,
    expectedValue: costToValueMapping[cardCost],
    uuid: Math.random().toString(36).slice(2),
  })
})
cardsArray = _.sortBy(cardsArray, sortOrderArray)

_.forEach(cardsArray, (cardObj, index) => {

  const tempGainObj = {}
  const valueSlackBottom = _.toNumber(valueSlackRoller.roll())

// START: BOTTOM BOTTOM BOTTOM BOTTOM BOTTOM 
  const leastSimilarObj2 = getLeastSimilarObj(
    cardsArray.slice(0, index),
    10, // max attempts
    cardObjSimilaritySettings2,
    (addUndo, addRedo) => {

      const newCardObj = _.cloneDeep(cardObj)

      const exclusionRules = {
        groupingMaxVariety: [
          {resourceList: ['strength', 'retaliate', 'retreat', 'rally', 'push', 'steal'], max: 1},
          // {resourceList: ['retreat', 'rally'], max: 1},
          // {resourceList: ['retreat', 'strength'], max: 1},
        ],
        groupingMaxQuantity: [
          // {resourceList: ['extract'], max: 3},
          // {resourceList: ['rally'], max: 4},
          // {resourceList: ['retreat'], max: 4},
        ]
      }

      let {gainObj, currentValue} = generateGainObj({
        // REQUIRED
        resourceToValueMapping: resourceToValueMapping,
        cardObj: newCardObj, // {expectedValue, ...}
        resourceRoller: gainBottomRoller,

        // OPTIONAL
        valueSlack: valueSlackBottom,
        exclusionRules,
        gainObj: tempGainObj,
        addUndo,
        addRedo,
      })

      // const bonus = _.round((newCardObj.expectedValue - currentValue)/resourceToValueMapping.bonus)
      // if (bonus > 0) {
      //   gainObj.bonus2 = bonus
      //   currentValue += bonus * resourceToValueMapping.bonus
      // }

      newCardObj.gainBottom = gainObj
      newCardObj.currentBottomValue = currentValue

      return newCardObj
    }
  )

  _.merge(cardObj, leastSimilarObj2)
  // FINISH: BOTTOM BOTTOM BOTTOM BOTTOM BOTTOM 

  // START: TOP TOP TOP TOP TOP TOP TOP TOP TOP
  const leastSimilarObj = getLeastSimilarObj(
    cardsArray.slice(0, index),
    10, // max attempts
    cardObjSimilaritySettings,
    (addUndo, addRedo) => {

      const newCardObj = _.cloneDeep(cardObj)

      const exclusionRules = {
        groupingMaxVariety: [
          {resourceList: ['money', 'moveToAny', 'moveAll', 'moveMech', 'addToAny', 'ninja'], max: 1},
          // {resourceList: ['addToAny', 'moveToAny'], max: 1},
          // {resourceList: ['addTroop', 'addToAny'], max: 1},
        ],
        groupingMaxQuantity: [
          {resourceList: ['money'], max: 3},
          // {resourceList: ['moveTroop'], max: 3},
          {resourceList: ['moveAll'], max: 1},
          {resourceList: ['moveToAny'], max: 2},
          {resourceList: ['moveMech'], max: 2},
          {resourceList: ['ninja'], max: 2},
        ]
      }

      const topExpectedValue = newCardObj.expectedValue
        + (newCardObj.expectedValue - newCardObj.currentBottomValue) * .7

      let {gainObj, currentValue} = generateGainObj({
        // REQUIRED
        resourceToValueMapping: resourceToValueMapping,
        cardObj: newCardObj, // {expectedValue, ...}
        expectedValue: topExpectedValue,
        resourceRoller: gainTopRoller,

        // OPTIONAL
        valueSlack: resourceToValueMapping.bonus/2,
        exclusionRules,
        gainObj: tempGainObj,
        addUndo,
        addRedo,
      })

      const bonus = _.round((topExpectedValue - currentValue)/resourceToValueMapping.bonus)
      if (bonus > 0) {
        gainObj.bonus = bonus
        currentValue += bonus * resourceToValueMapping.bonus
      }

      newCardObj.gainTop = gainObj
      newCardObj.currentTopValue = currentValue

      return newCardObj
    }
  )

  _.merge(cardObj, leastSimilarObj)
  // FINISH: TOP TOP TOP TOP TOP TOP TOP TOP TOP



})

// console.log(_.sum(_.sortBy(document.similarityRatioArray, (a) => -a).slice(0,50)))
console.log(_.round(_.mean(document.similarityRatioArray), 4))

countOccurances(cardsArray, 'gainTop', 'bonus')

console.log(gainTopRoller.proportions)

// !! TO ADD STARTER CARDS
// cardsArray = cardsArray.concat(starterCards)

const cardsImportantKeys = [
  'cost',
  'expectedValue',
  'currentValue',
  'gain',
  'uuid',
]

function Cards () {
  return <div>
    {_.map(cardsArray, (cardObj, idx) => <Card key={idx} cardObj={cardObj} /> )}
    <pre className="noprint">
      {JSON.stringify(cardsArray, null, 2)}
      {/*{JSON.stringify(_.chain(cardsArray).map((obj) => _.pick(obj, cardsImportantKeys)).value(), null, 2)}*/}
    </pre>

  </div>
}

export default Cards

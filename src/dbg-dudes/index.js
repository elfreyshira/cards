import _ from 'lodash'
import Brng from 'brng'
import seed from 'seed-random'

import '../util/base.css'
import generateGainObj from '../util/generateGainObj.js'
import getLeastSimilarObj from '../util/getLeastSimilarObj.js'
import createNestedBrngRoller from '../util/createNestedBrngRoller.js'

// import Card from './Card.js'



// import './index.css'

// import starterCards from './starterCards.js'

// console.clear()


const params = new URL(document.URL).searchParams
const seedID = params.get('seed')
if (_.isString(seedID)) {
  Brng.random = seed(seedID)
}


const CARD_QUANTITY = 50

const valueSlackRoller = new Brng({0: 1, 0.5: 1}, {bias: 4})

const gainTopRoller = new Brng({
  extract: 60,

  // add troops = 115
  addTroop: 110,
  addToAny: 15, // add = 1 * 15 = 15, move = 2 * 15 = 30
  
  // move troops = 200
  moveTroop: 50, // x 1 = 50
  moveToAny: 15, // x 2 = 30
  moveAll: 10, // x 3 = 30
  moveMech: 20, // x 3 = 60

  
  // 5
  // draw: 2,
  // cycle: 1,
}, {bias: 4, keepHistory: true})

const gainBottomRoller = new Brng({
  atk: 13, // winning

  def: 10, // losing
  retaliate: 5, // losing
  retreat: 5, // losing
  resurrect: 2, // losing

  rally: 5, // both
  push: 2, // both
}, {bias: 4, keepHistory: true})


const resourceToValueMapping = {
  extract: 1,
  money: 1,
  tech: 1,
  trash: 1,

  addTroop: 1,
  moveTroop: 0.5,
  moveMech: 1.5,
  addToAny: 2,
  moveToAny: 1,
  moveAll: 1.5,

  draw: 2,
  cycle: 1,
  bonus: 0.5, // put 1 at bottom of deck, draw 1

  // BOTTOM
  atk: 0.75, // winning
  def: 0.75, // losing
  retaliate: 1, // losing
  retreat: 0.75, // losing
  resurrect: 1.5, // losing
  rally: 0.75, // both
  push: 1.5, // both
}

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
  1: 2,
  2: 2.80,

  3: 3.45,
  4: 4.00,
  5: 4.46,
  6: 4.86,
  7: 5.20,
  8: 5.50,
}

const cardObjSimilaritySettings = {
  cost: [1, 3], // multiplier = 1, max diff = 3, type = Number, 
  gainTop: {
    extract: [1, 2],
    addTroop: [1, 2],
    addToAny: [1, 1],
    moveTroop: [1, 3],
    moveToAny: [1, 1],
    moveAll: [1, 1],
    moveMech: [1, 1],
  },
  gainBottom: {
    atk: [1, 3],
    def: [1, 3],
    retaliate: [1, 3],
    resurrect: [1, 2],
    retreat: [1, 3],
    rally: [1, 3],
  },
}
const cardObjSimilaritySettings2 = {
  cost: [1, 3], // multiplier = 1, max diff = 3, type = Number, 
  gainBottom: {
    atk: [1, 3],
    def: [1, 3],
    retaliate: [1, 3],
    resurrect: [1, 2],
    retreat: [1, 3],
    rally: [1, 3],
  },
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
          {resourceList: ['atk', 'def', 'retaliate', 'retreat', 'rally', 'resurrect', 'push'], max: 1},
          {resourceList: ['retreat', 'rally'], max: 1},
          {resourceList: ['retreat', 'atk'], max: 1},
          {resourceList: ['def', 'atk'], max: 1},
          {resourceList: ['def', 'retaliate'], max: 1},
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
          {resourceList: ['extract', 'addTroop', 'addToAny',
            'moveTroop', 'moveToAny', 'moveAll', 'moveMech'], max: 2},
          {resourceList: ['moveTroop', 'moveToAny', 'moveAll', 'moveMech'], max: 1},
          {resourceList: ['addTroop', 'addToAny'], max: 1},
        ],
        groupingMaxQuantity: [
          {resourceList: ['extract'], max: 3},
          {resourceList: ['moveTroop'], max: 4},
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
        valueSlack: 0.25,
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

console.log(_.sum(_.sortBy(document.lol, (a) => -a).slice(0,20)))

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
    {/*{_.map(cardsArray, (cardObj, idx) => <Card key={idx} cardObj={cardObj} /> )}*/}
    <pre className="noprint">
      {JSON.stringify(cardsArray, null, 2)}
      {/*{JSON.stringify(_.chain(cardsArray).map((obj) => _.pick(obj, cardsImportantKeys)).value(), null, 2)}*/}
    </pre>

  </div>
}

export default Cards

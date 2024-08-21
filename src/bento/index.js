import _ from 'lodash'
import Brng from 'brng'
import seed from 'seed-random'

import generateGainObj from '../util/generateGainObj.js'

import checkSimilarity from '../util/checkSimilarity.js'
import getLeastSimilarObj from '../util/getLeastSimilarObj.js'

import Card from './Card.js'

import '../util/base.css'
import getAvailableResources from '../util/getAvailableResources.js'
import createNestedBrngRoller from '../util/createNestedBrngRoller.js'
import './index.css'

import starterCards from './starterCards.js'

// console.clear()


const params = new URL(document.URL).searchParams
const seedID = params.get('seed')
if (_.isString(seedID)) {
  Brng.random = seed(seedID)
}


const CARD_QUANTITY = 34


const squareRoller = createNestedBrngRoller({
  remove: {weight: .7, children: {
    remove1: 1,
    remove2: 1,
    remove3: 1,
    remove4: 1,
  }},
  carb: {weight: 0.6, children: {
    carb1: 3,
    carb2: 4,
    carb3: 5,
    carb4: 5,
  }},
  meat: {weight: 0.9, children: {
    meat1: 3,
    meat2: 4,
    meat3: 5,
    meat4: 5,
  }},
  veggie: {weight: 0.8, children: {
    veggie1: 3,
    veggie2: 4,
    veggie3: 5,
    veggie4: 5,
  }},
  edge: {weight: .4, children: {
    edge1: 4,
    edge2: 5,
    edge3: 6,
  }},
}, {bias: 4})

const generateShapeRollerMapping = () => {
  return {
    4: new Brng({T4: 1, L4: 1, S4: 1, I4: 1, O4: 1}, {bias: 4}),
    3: new Brng({I3: 1, L3: 1}, {bias: 4}),
    2: {roll: _.constant('I2')},
    1: {roll: _.constant('O1')},
  }
}
const typeToRollerMapping = {
  remove: generateShapeRollerMapping(),
  carb: generateShapeRollerMapping(),
  veggie: generateShapeRollerMapping(),
  meat: generateShapeRollerMapping(),
}

const gainRoller = new Brng({
  money: 3,
  point: 4,
  trash: 1,
}, {bias: 4, keepHistory: true})



const resourceToValueMapping = {
  // empty: 2, // taken out because it's against the core of tile-laying games

  // includes the +2 from an empty square
  remove: 3, // minimum value
  remove1: 3,
  remove2: 3.5,
  remove3: 4,
  remove4: 4.5,

  carb: 0, // minimum value
  carb1: 1.5,
  carb2: 1,
  carb3: 0.5,
  carb4: 0,

  meat: -1, // minimum value
  meat1: 1.25,
  meat2: 0.5,
  meat3: -0.25,
  meat4: -1,

  veggie: -0.5, // minimum value
  veggie1: 1.375,
  veggie2: 0.75,
  veggie3: 0.125,
  veggie4: -0.5,

  // includes the +2 from an empty square
  edge: 2.5, // minimum value
  edge1: 2.5,
  edge2: 3,
  edge3: 3.5,

  //////////////

  money: 1,
  point: 1,

  // cycle: 1,
  trash: 1,

  bonus: 0.5, // acts a wild. 4 bonus --> any effect. max of 10 bonus.
}

const costRoller = new Brng({
  1: 2,
  2: 3,

  3: 4,
  4: 3,
  5: 2,
  6: 1.2,
  7: .8,
}, {bias: 4})

const costToValueMapping = {
  1: 2, // 0
  2: 2.82, // .82

  3: 3.50, // 1.5
  4: 4.08, // 2.08
  5: 4.57, // 2.57
  6: 5.00, // 3
  7: 5.38, // 3.38
}

const cardObjSimilaritySettings = {
  cost: [1, 3], // multiplier = 1, max diff = 3, type = Number, 
  type: [1, 1, String],
  size: [1, 2],
  shapeID: [1, 1, String],
  gain: {
    money: [1, 3],
    point: [1, 3],
    trash: [1, 1],
  }
}
// const cardObjSimilaritySettings = {}

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
  let tempCurrentValue = 0

  /// CHOOSE SQUARE RESOURCE
  const onlyList = getAvailableResources(resourceToValueMapping, cardObj.expectedValue, 0.25)
  
  const chosenResource = squareRoller.roll({
    only: onlyList
  })

  tempGainObj[chosenResource] = 1
  tempCurrentValue += resourceToValueMapping[chosenResource]

  cardObj.type = chosenResource.replace(/\d/, '')
  if (cardObj.type !== 'edge') {
    const size = chosenResource.replace(/[^\d]+/, '')
    cardObj.shapeID = typeToRollerMapping[cardObj.type][size].roll()
    cardObj.size = size
  }

  const leastSimilarObj = getLeastSimilarObj(
    cardsArray.slice(0, index),
    0.5, // acceptableSimilarityRatioArg
    20, // max runs
    cardObjSimilaritySettings,
    (addUndo) => {

      const newCardObj = _.cloneDeep(cardObj)

      const exclusionRules = {
        groupingMaxVariety: [
          {resourceList: ['trash', 'point', 'money'], max: 2},
          {resourceList: ['trash', 'money'], max: 1},
          {resourceList: ['point', 'money'], max: newCardObj.expectedValue < 3 ? 1 : 2},
        ],
        groupingMaxQuantity: [
          {resourceList: ['trash'], max: 1},
          {resourceList: ['money'], max: 4},
        ]
      }

      let {gainObj, currentValue} = generateGainObj({
        // REQUIRED
        resourceToValueMapping: resourceToValueMapping,
        cardObj: newCardObj, // {expectedValue, ...}
        resourceRoller: gainRoller,

        // OPTIONAL
        valueSlack: 0.25,
        exclusionRules,
        gainObj: tempGainObj,
        currentValue: tempCurrentValue,
      })
      // minus 1 to subtract the default shape resource. doesn't include bonus.
      _.times( _.sum(_.values(gainObj)) - 1, () => addUndo(gainRoller) )

      // gainObj.bonus = _.round((newCardObj.expectedValue - currentValue)/0.5)
      const bonus = _.round((newCardObj.expectedValue - currentValue)/resourceToValueMapping.bonus)
      if (bonus > 0) {
        gainObj.bonus = bonus
        currentValue += bonus * resourceToValueMapping.bonus
      }

      newCardObj.gain = gainObj
      newCardObj.currentValue = currentValue

      return newCardObj
  })

  _.merge(cardObj, leastSimilarObj)

})

console.log(_.sum(_.sortBy(document.lol, (a) => -a).slice(0,10)))

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

import _ from 'lodash'
import Brng from 'brng'
import seed from 'seed-random'

import generateGainObj from '../util/generateGainObj.js'

import checkSimilarity from '../util/checkSimilarity.js'
import getLeastSimilarObj from '../util/getLeastSimilarObj.js'

// import Card from './Card.js'

import '../util/base.css'
import getAvailableResources from '../util/getAvailableResources.js'
import createNestedBrngRoller from '../util/createNestedBrngRoller.js'
import './index.css'

// import starterCards from './starterCards.js'

// console.clear()

/// notes
// discounts for building cards and activating a conversion.
// encourages building cheap cards and low conversions.
// also: untap and effects that allow you to activate a card without a cost.
// encourages expensive cards and costly conversions

const params = new URL(document.URL).searchParams
const seedID = params.get('seed')
if (_.isString(seedID)) {
  Brng.random = seed(seedID)
}


const CARD_QUANTITY = 50

const MINUS_RESOURCES = {
  l1m0: 1,
  l1m1: 2,
  l1m2: 3,
  l1m3: 4,
  l1m4: 2,
  l1m5: 2,
  l1m6: 2,
}

const cardTypeRoller = createNestedBrngRoller({
  l1: {weight: 5, children: _.cloneDeep(MINUS_RESOURCES)},

  l2: {weight: 4, children: _.cloneDeep(MINUS_RESOURCES)},

  l3: {weight: 3, children: _.cloneDeep(MINUS_RESOURCES)},

}, {bias: 4})

const levelToValueMapping = {
  l1: 1.5,
  l2: 2.5,
  l3: 3.5,
}

const resourceToValueMapping = {
  aura: 1,
  ash: 1,
  brine: 2,
  clay: 3,

}

const costRoller = new Brng({
  aura: 3,
  ash: 3,
  brine: 1.5,
  clay: 1,
}, {bias: 4})

const gainRoller = new Brng({
  aura: 3,
  ash: 3,
  brine: 1.5,
  clay: 1,
}, {bias: 4})

//////////////////////////







const generateShapeRollerMapping = () => {
  return {
    4: new Brng({T4: 1, L4: 1, S4: 1, I4: 1, O4: 1}, {bias: 4}),
    3.5: new Brng({T4s: 1, L4s: 1, S4s: 1, I4s: 1}, {bias: 4}),
    3: new Brng({I3: 1, L3: 1}, {bias: 4}),
    2.5: new Brng({I3s: 1, L3s: 1}, {bias: 4}),
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

  /// CARB
  // includes the +2 from an empty square
  remove: 3, // minimum value

  removeNormal: 3, // minimum value
  remove1: 3,
  remove2: 3.5,
  remove3: 4,
  remove4: 4.5,

  removeDiagonal: 3.25,
  remove205: 3.25,
  remove305: 3.75,


  /// CARB
  carb: 0, // minimum value

  carbNormal: 0, // minimum value
  carb1: 1.5,
  carb2: 1,
  carb3: 0.5,
  carb4: 0,

  carbDiagonal: 0.25,
  carb205: 0.75,
  carb305: 0.25,

  /// MEAT -- MAX GROUP OF 4
  meat: -1, // minimum value

  meatNormal: -1, // minimum value
  meat1: 1.25,
  meat2: 0.5,
  meat3: -0.25,
  meat4: -1,

  meatDiagonal: -0.25,
  meat205: 0.5,
  meat305: -0.25,

  /// VEGGIE -- MUST ONLY HAVE ONE GROUP PER ENCLOSED AREA
  veggie: -0.5, // minimum value

  veggieNormal: -0.5, // minimum value
  veggie1: 1.375,
  veggie2: 0.75,
  veggie3: 0.125,
  veggie4: -0.5,

  // no veggie diagonal because veggies need to stick together
  // veggieDiagonal: -0.1875,
  // veggie205: 0.4375,
  // veggie305: -0.1875,

  /// EDGE
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


const cardObjSimilaritySettings = {
  cost: [1, 3], // multiplier = 1, max diff = 3, type = Number, 
  type: [1, 1, String],
  size: [1, 2],
  shapeID: [1, 1, String],
  gain: {
    money: [1, 2],
    point: [1, 2],
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

  cardObj.type = chosenResource.replace(/\d+/, '')
  if (cardObj.type !== 'edge') {
    const size = parseFloat( chosenResource.replace(/[^\d]+/, '').split(0).join('.') )
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
cardsArray = cardsArray.concat(starterCards)

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

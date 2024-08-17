import _ from 'lodash'
import Brng from 'brng'
import seed from 'seed-random'

import generateGainObj from '../util/generateGainObj.js'

import Card from './Card.js'

import '../util/base.css'
import getAvailableResources from '../util/getAvailableResources.js'
import createNestedBrngRoller from '../util/createNestedBrngRoller.js'
import './index.css'

// console.clear()


const params = new URL(document.URL).searchParams
const seedID = params.get('seed')
if (_.isString(seedID)) {
  Brng.random = seed(seedID)
}


const CARD_QUANTITY = 50


const squareRoller = createNestedBrngRoller({
  remove: {weight: .7, children: {
    remove1: 1,
    remove2: 1,
    remove3: 1,
    remove4: 1,
  }},
  normal: {weight: 1, children: {
    normal1: 3,
    normal2: 4,
    normal3: 5,
    normal4: 5,
  }},
  special: {weight: 1.2, children: {
    special1: 3,
    special2: 4,
    special3: 5,
    special4: 5,
  }},
  edge: {weight: .5, children: {
    edge1: 4,
    edge2: 5,
    edge3: 6,
  }},
}, {bias: 4})

const shapes = {
  T4: ` 111
        010`,

  L4: ` 111
        100`,

  S4: ` 110
        011`,

  I4: ` 1111`,

  O4: ` 11
        11`,

  I3: ` 111`,

  L3: ` 11
        10`,

  I2: ` 11`,

  O1: ` 1`,
}


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
  normal: generateShapeRollerMapping(),
  special: generateShapeRollerMapping(),
}

const gainRoller = new Brng({
  money: 3,
  point: 4,

  // cycle: 1.5,
  trash: 1,
}, {bias: 4})



const resourceToValueMapping = {
  // empty: 2, // taken out because it's against the core of tile-laying games

  // includes the +2 from an empty square
  remove: 3, // minimum value
  remove1: 3,
  remove2: 3.5,
  remove3: 4,
  remove4: 4.5,

  normal: 0, // minimum value
  normal1: 1.5,
  normal2: 1,
  normal3: 0.5,
  normal4: 0,

  special: -1, // minimum value
  special1: 1.25,
  special2: 0.5,
  special3: -0.25,
  special4: -1,

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
    cardObj.shape = shapes[typeToRollerMapping[cardObj.type][size].roll()]
    cardObj.size = size
  }


  const exclusionRules = {
    groupingMaxVariety: [
      {resourceList: ['trash', 'point', 'money'], max: 2},
      {resourceList: ['point', 'money'], max: cardObj.expectedValue < 3 ? 1 : 2},
    ],
    groupingMaxQuantity: [
      {resourceList: ['trash'], max: 1},
      {resourceList: ['money'], max: 4},
    ]
  }

  let {gainObj, currentValue} = generateGainObj({
    // REQUIRED
    resourceToValueMapping: resourceToValueMapping,
    cardObj, // {expectedValue, ...}
    resourceRoller: gainRoller,

    // OPTIONAL
    valueSlack: 0.25,
    exclusionRules,
    gainObj: tempGainObj,
    currentValue: tempCurrentValue,
  })

  // gainObj.bonus = _.round((cardObj.expectedValue - currentValue)/0.5)
  const bonus = _.round((cardObj.expectedValue - currentValue)/resourceToValueMapping.bonus)
  if (bonus > 0) {
    gainObj.bonus = bonus
    currentValue += bonus * resourceToValueMapping.bonus
  }

  cardObj.gain = gainObj
  cardObj.currentValue = currentValue

})



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
      {/*{JSON.stringify(cardsArray, null, 2)}*/}
      {JSON.stringify(_.chain(cardsArray).map((obj) => _.pick(obj, cardsImportantKeys)).value(), null, 2)}
    </pre>

  </div>
}

export default Cards

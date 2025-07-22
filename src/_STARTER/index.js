import _ from 'lodash'
import Brng from 'brng'

import '../util/base.css'
import setSeedForBrng from '../util/setSeedForBrng.js'
import generateGainObj from '../util/generateGainObj.js'
import getLeastSimilarObj from '../util/getLeastSimilarObj.js'
import createNestedBrngRoller from '../util/createNestedBrngRoller.js'
import countOccurances from '../util/countOccurances.js'
import ICONS from '../util/icons.js'


// import Card from './Card.js'
// import './index.css'
// import starterCards from './starterCards.js'

// console.clear()
setSeedForBrng(Brng)

const CARD_QUANTITY = 50


/// vv COST vv ///
const costToValueMapping = {
  1: 200,
  2: 300,
  3: 400
}

const costRoller = new Brng({
  1: 1,
  2: 3,
  3: 2,
}, {bias: 4})
/// ^^ COST ^^ ///


const resourceToValueMapping = {
  money: 100,
  draw: 200,
  point: 100,
}

// or createNestedBrngRoller({})
const gainRoller = new Brng({
  money: 2,
  draw: 1,
  point: 3,
}, {bias: 4, keepHistory: true})


// for getLeastSimilarObj()
const cardObjSimilaritySettings = {
  cost: [1, 3], // multiplier = 1, max diff = 3, type = Number, 
  gain: {
    money: [1, 3],
    draw: [1, 2],
  },
}



/////////////////////////////
/////////////////////////////
/////////////////////////////

const sortOrderArray = [
  (cardObj) => -cardObj.cost,
]

let cardsArray = []

_.times(CARD_QUANTITY, (index) => {
  const cardCost = _.toNumber(costRoller.roll())
  cardsArray.push({
    uuid: Math.random().toString(36).slice(2),
    cost: cardCost,
    expectedValue: costToValueMapping[cardCost], // required when using generateGainObj()
  })
})
cardsArray = _.sortBy(cardsArray, sortOrderArray)

_.forEach(cardsArray, (cardObj, index) => {

  const leastSimilarObj = getLeastSimilarObj (
    cardsArray.slice(0, index),
    10, // max attempts
    cardObjSimilaritySettings,
    (addUndo, addRedo) => {

      const newCardObj = _.cloneDeep(cardObj)

      const exclusionRules = {
        // groupingMaxVariety: [
        //   {resourceList: ['draw', 'discard'], max: 1},
        //   {resourceList: ['money', 'trash'], max: 1},
        // ],
        // groupingMaxQuantity: [
        //   {resourceList: ['draw'], max: 3},
        //   {resourceList: ['money', 'point'], max: 4},
        // ]
      }

      let {gainObj, currentValue} = generateGainObj({
        // REQUIRED
        resourceToValueMapping: resourceToValueMapping,
        cardObj: newCardObj, // {expectedValue, ...}
        resourceRoller: gainRoller,

        // OPTIONAL
        valueSlack: 25,
        exclusionRules,
        // gainObj: cardObj.gain,
        currentValue: cardObj.currentValue,
        addUndo,
        addRedo,
        
      })

      newCardObj.gain = gainObj
      newCardObj.currentValue = currentValue

      return newCardObj
    }
  )

  _.merge(cardObj, leastSimilarObj)
})
cardsArray = _.sortBy(cardsArray, sortOrderArray)


/////////////////////////////
/////////////////////////////
/////////////////////////////

const effectToIconMapping = {
  money: ICONS.Dollar
}

function Card (props) {
  
  const {
    cost,
    gain
  } = props.cardObj

  return (
    <div className="card lg">
        <div className="cost md">
          ${cost}
        </div>
        <div className="effect">
          {_.map(effectToIconMapping, (ChosenIcon, effect) => {
            if (_.has(gain, effect)) {
              return <div key={effect}>
                <ChosenIcon number={gain[effect]} />
              </div>
            }
            else {
              return null
            }
          })}
        </div>
    </div>
  )
}

/////////////////////////////
/////////////////////////////
/////////////////////////////


// console.log(gainRoller.proportions)
// console.log(_.sum(_.sortBy(document.similarityRatioArray, (a) => -a).slice(0, 10)))
// console.log(_.round(_.mean(document.similarityRatioArray), 4))

// countOccurances(cardsArray, 'gain', 'money')
// countOccurances(cardsArray, 'gain', 'point')

// !! TO ADD STARTER CARDS
// cardsArray = cardsArray.concat(starterCards)

const cardsImportantKeys = [
  'cost',
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

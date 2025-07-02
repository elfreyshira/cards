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
  1: 300,
  2: 350,
  3: 400,
  4: 450,
  5: 500,
  // 6: 524,
  7: 550,
}

const costRoller = new Brng({
  1: 3,
  2: 5,
  3: 7,
  4: 5,
  5: 3,
  // 6: 3,
  7: 2,
}, {bias: 4})
/// ^^ COST ^^ ///


const resourceToValueMapping = {
  atk: 100,
  money: 100,
  draw: 150,
  playFromHand: 250,
  playFromDeck: 300,
  nextAtk: 75,
  // atkHand: 400,
  // atkCardsPlayed: 400,
  // futureAtk: 250,
  bonus: 50,
}

// or createNestedBrngRoller({})
const gainRoller = new Brng({
  atk: 30,
  nextAtk: 8,
  // futureAtk: 4,

  money: 15,

  draw: 5.5,
  playFromHand: 5,
  playFromDeck: 5,
}, {bias: 4, keepHistory: true})

const alternateCubeRoller = new Brng({
  1: 2,
  2: 2.1,
  3: 2.2,
  4: 2.3,
  5: 2.4,
}, {bias: 4})


// for getLeastSimilarObj()
const cardObjSimilaritySettings = {
  cost: [1, 4], // multiplier = 1, max diff = 3, type = Number, 
  gain: {
    atk: [1, 3],
    money: [1, 2],
    draw: [1, 1],
    playFromHand: [1, 1],
    playFromDeck: [1, 1],
    nextAtk: [1, 3],
    // futureAtk: [1, 2],
    bonus: [1, 1],
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
  if (index <= CARD_QUANTITY * 3/4) {
    cardObj.alternate = _.toNumber(alternateCubeRoller.roll())
  }
  else {
    cardObj.alternate = 'trash'
  }
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
        groupingMaxVariety: [
          {resourceList: ['draw', 'playFromHand', 'playFromDeck'],
            max: 1},
          {resourceList: _.keys(resourceToValueMapping), max: 2}
        ],
        groupingMaxQuantity: [
          {resourceList: ['playFromHand', 'playFromDeck', 'draw'], max: 1},
          // {resourceList: [ 'nextAtk'], max: 3}
        ]
      }

      let {gainObj, currentValue} = generateGainObj({
        // REQUIRED
        resourceToValueMapping: resourceToValueMapping,
        cardObj: newCardObj, // {expectedValue, ...}
        resourceRoller: gainRoller,

        // OPTIONAL
        // valueSlack: 0,
        exclusionRules,
        // gainObj: cardObj.gain,
        // currentValue: cardObj.currentValue,
        addUndo,
        addRedo,
        
      })

      //// BONUS
      let bonus = _.round((newCardObj.expectedValue - currentValue)/resourceToValueMapping.bonus)
      // if (bonus >= 2) {
      //   const moneyGain = _.floor(bonus/2)
      //   gainObj.money = gainObj.money ? gainObj.money + moneyGain : moneyGain
      //   bonus = bonus - moneyGain*2
      //   currentValue += moneyGain * resourceToValueMapping.money
      // }
      if (bonus > 0) {
        gainObj.bonus = bonus
        currentValue += bonus * resourceToValueMapping.bonus
      }
      //// BONUS

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

console.log(gainRoller.proportions)
// console.log(_.sum(_.sortBy(document.similarityRatioArray, (a) => -a).slice(0, 10)))
// console.log(_.round(_.mean(document.similarityRatioArray), 4))

countOccurances(cardsArray, 'gain', 'draw')
countOccurances(cardsArray, 'gain', 'playFromHand')
countOccurances(cardsArray, 'gain', 'playFromDeck')
countOccurances(cardsArray, 'gain', ['atk', 'nextAtk'])
countOccurances(cardsArray, 'gain', 'money')

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

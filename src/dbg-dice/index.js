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
else {
  const generatedSeedId = Math.random().toString(36).slice(2,6)
  Brng.random = seed(generatedSeedId)
  console.log('generatedSeedId', generatedSeedId)
}


const CARD_QUANTITY = 36

const effectsList = [
  'money', 'cycleCard', 'cycleDice', 'trashDice', 'trashCard', 'drawCard',
  'drawDice', 'reroll', 'pickRoll']


const extraDiceCost = 25

const resourceToValueMapping = {
  money: 100,
  cycleCard: 100,
  cycleDice: 100,
  trashDice: 150,
  trashCard: 150,
  drawCard: 200,
  drawDice: 200,
  reroll: 75,
  pickRoll: 250,

  cost0: 0,
  cost1: -100 - extraDiceCost,
  cost2: -200 - extraDiceCost,
  cost3: -300 - extraDiceCost,
  cost4: -400 - extraDiceCost,
  cost5: -500 - extraDiceCost,
  // cost6: -600 - extraDiceCost,

  bonus: 50
}

const diceCostRoller = createNestedBrngRoller({
  cost0: 1,
  hasCost: {weight: 1, children: {
    cost1: 1,
    cost2: 1,
    cost3: 1,
    cost4: 1,
    cost5: 1,
    // cost6: 1,
  }},
}, {bias: 4, repeatTolerance: 0})

const gainRoller = new Brng({
  money: 175,

  // 50*1.25*2+10*1.25*1+10*1.25*1+20*2+4*1+4+6+4*2.5 = 214
  drawCard: 50,
  trashCard: 10,
  
  drawDice: 25,
  trashDice: 5,
  
  reroll: 12,
  // pickRoll: 4,

}, {bias: 4, keepHistory: true})



const bonusTypeRoller = new Brng({
  deckCycle: 1,
  trashMarket: 1,
}, {bias: 4, keepHistory: true})



const costRoller = new Brng({
  // 1: 1,
  // 2: 2,

  // 3: 3,
  // 4: 4,
  // 5: 3,
  // 6: 2,

  2: 2,
  3: 3,
  4: 4,
  5: 5,

  6: 5,
  7: 4,
  8: 3,
  9: 2,
}, {bias: 4})

const costToValueMapping = {
  2: 200,
  3: 243,
  4: 283,
  5: 320,
  6: 354,
  7: 385,
  8: 414,
  9: 441,
}

/////////////////////////////

const sortOrderArray = [
  (cardObj) => -cardObj.cost,
  // (cardObj) => {
  //   const diceCostNumber = _.chain(cardObj.gain)
  //     .keys()
  //     .find(effect => _.startsWith(effect, 'cost'))
  //     .last()
  //     .toNumber()
  //     .value()
  //   return -diceCostNumber
  // },

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
  const gainObj = {}
  const chosenCardCost = diceCostRoller.roll()
  
  gainObj[chosenCardCost] = 1
  cardObj.gain = gainObj
  cardObj.currentValue = resourceToValueMapping[chosenCardCost]
})
cardsArray = _.sortBy(cardsArray, sortOrderArray)


const cardObjSimilaritySettings = {
  cost: [1, 3], // multiplier = 1, max diff = 3, type = Number, 
  gain: {
    cost0: [1, 1],
    cost1: [1, 1],
    cost2: [1, 1],
    cost3: [1, 1],
    cost4: [1, 1],
    cost5: [1, 1],
    // cost6: [1, 1],

    money: [1,4],
    drawCard: [1,2],
    trashCard: [1,2],

    drawDice: [1,2],
    trashDice: [1,2],

    reroll: [1,2],
  },
}

_.forEach(cardsArray, (cardObj, index) => {

  const leastSimilarObj = getLeastSimilarObj(
    cardsArray.slice(0, index),
    10, // max attempts
    cardObjSimilaritySettings,
    (addUndo, addRedo) => {

      const newCardObj = _.cloneDeep(cardObj)

      const exclusionRules = {
        groupingMaxVariety: [
          {resourceList: effectsList, max: 2},
          {resourceList: ['drawCard', 'drawDice', 'pickRoll'], max: 1},
          {resourceList: ['trashCard', 'trashDice'], max: 1},
          {resourceList: ['reroll', 'pickRoll'], max: 1},
          {resourceList: ['cost0', 'drawCard'], max: 1},
        ],
        groupingMaxQuantity: [
          {resourceList: ['trashCard'], max: 1},
          {resourceList: ['trashDice'], max: 1},
          {resourceList: ['drawCard'], max: 3},
          {resourceList: ['drawDice'], max: 2},
          {resourceList: ['reroll'], max: 2},
        ]
      }

      let {gainObj, currentValue} = generateGainObj({
        // REQUIRED
        resourceToValueMapping: resourceToValueMapping,
        cardObj: newCardObj, // {expectedValue, ...}
        resourceRoller: gainRoller,

        // OPTIONAL
        valueSlack: 25,
        exclusionRules,
        gainObj: cardObj.gain,
        currentValue: cardObj.currentValue,
        addUndo,
        addRedo,
        
      })

      let bonus = _.round((newCardObj.expectedValue - currentValue)/resourceToValueMapping.bonus)
      if (bonus >= 2) {
        const moneyGain = _.floor(bonus/2)
        gainObj.money = gainObj.money ? gainObj.money + moneyGain : moneyGain
        bonus = bonus - moneyGain*2
        currentValue += moneyGain * resourceToValueMapping.money
      }
      if (bonus > 0) {
        const bonusType = bonusTypeRoller.roll()
        gainObj[bonusType] = bonus
        currentValue += bonus * resourceToValueMapping.bonus
        
        addUndo(bonusTypeRoller)
        addRedo(bonusTypeRoller, bonusType)
      }

      newCardObj.gain = gainObj
      newCardObj.currentValue = currentValue

      const discardValue = currentValue > newCardObj.expectedValue
        ? _.floor(newCardObj.expectedValue, -2) : _.ceil(newCardObj.expectedValue, -2)
      newCardObj.discardValue = discardValue/100

      return newCardObj
    }
  )

  _.merge(cardObj, leastSimilarObj) // !!!!!!!!

})




// console.log(_.sum(_.sortBy(document.lol, (a) => -a).slice(0,50)))
console.log(_.sortBy(document.lol, (a) => -a).slice(0,50))
console.log(_.round(_.mean(document.lol), 4))
countOccurances(cardsArray, 'gain', ['deckCycle', 'trashMarket'])
countOccurances(cardsArray, 'gain', ['reroll'])
countOccurances(cardsArray, 'gain', ['money'])

// !! TO ADD STARTER CARDS
// cardsArray = cardsArray.concat(starterCards)

const cardsImportantKeys = [
  'cost',
  // 'expectedValue',
  // 'currentValue',
  'gain',
  'uuid',
]


function Cards () {
  return <div>
    {_.map(cardsArray, (cardObj, idx) => <Card key={idx} cardObj={cardObj} /> )}
    <pre className="noprint">
      {JSON.stringify(cardsArray, null, 2)}
      {/*{JSON.stringify(_.chain(cardsArray).map((obj) => _.pick(obj, cardsImportantKeys)).value(), null, 2)}*/}
      {/*{JSON.stringify(_.map(cardsArray, obj => obj.gain), null, 2)}*/}
    </pre>

  </div>
}

export default Cards

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


const extraDiceCost = 50

const resourceToValueMapping = {
  cost0: 0,
  cost1: -100 - extraDiceCost,
  cost2: -200 - extraDiceCost,
  cost3: -300 - extraDiceCost,
  cost4: -400 - extraDiceCost,
  cost5: -500 - extraDiceCost,
  cost6: -600 - extraDiceCost,

  /////// #### TOP
  drawCard: 200,
  drawDice: 200,
  reroll: 100,
  // cycleCard: 125,
  // cycleDice: 125,
  // trashDice: 150,
  // trashCard: 150,
  // pickRoll: 200,

  doubleNextCard: 350, // card
  discardCardDrawDice: 225, // dice
  discardDiceDrawCard: 225, // card

  discountDiceCost: 200, // dice
  // discountValueToDrawDice: 150, // dice
  // discountValueToDrawCard: 150, // card


  /////// #### BOTTOM
  money: 100,
  moneyPerDiceUsed: 300,
  moneyPer2CardsUsed: 350,
  purchasedCardsToTopDeck: 175,
  purchasedDiceToBag: 175,
  doubleBaseMoneyOfCard: 250, // max 5

  discountPurchaseCard: 175, // money
  discountPurchaseDice: 175, // money
  discountTrash: 175, // trash
  

  bonus: 50,
  deckCycle: 50
}

const diceCostRollerCheap = createNestedBrngRoller({
  cost0: 1,
  hasCost: {weight: 1, children: {
    cost1: 8,
    cost2: 7,
    cost3: 6,
    cost4: 5,
    cost5: 4,
    cost6: 3,
  }},
}, {bias: 4, repeatTolerance: 0})
const diceCostRollerExpensive = createNestedBrngRoller({
  cost0: 1,
  hasCost: {weight: 1, children: {
    cost1: 3,
    cost2: 4,
    cost3: 5,
    cost4: 6,
    cost5: 7,
    cost6: 8,
  }},
}, {bias: 4, repeatTolerance: 0})




const specialEffectsProportionsWeight = 3.3
const gainProportions = {
  /////// #### TOP
  drawCard: 51,
  drawDice: 25,
  reroll: 11,

  doubleNextCard: specialEffectsProportionsWeight, // card
  discardCardDrawDice: specialEffectsProportionsWeight, // dice
  discardDiceDrawCard: specialEffectsProportionsWeight, // card

  discountDiceCost: specialEffectsProportionsWeight, // dice
  // discountValueToDrawDice: specialEffectsProportionsWeight, // dice
  // discountValueToDrawCard: specialEffectsProportionsWeight, // card
  

  /////// #### BOTTOM
  money: 120, // UNIVERSAL

  moneyPerDiceUsed: specialEffectsProportionsWeight,
  moneyPer2CardsUsed: specialEffectsProportionsWeight,

  purchasedCardsToTopDeck: specialEffectsProportionsWeight,
  purchasedDiceToBag: specialEffectsProportionsWeight,
  doubleBaseMoneyOfCard: specialEffectsProportionsWeight,

  discountPurchaseCard: specialEffectsProportionsWeight, // money
  discountPurchaseDice: specialEffectsProportionsWeight, // money
  discountTrash: specialEffectsProportionsWeight, // trash
}
const gainRoller = new Brng(gainProportions, {bias: 4, keepHistory: true})

const proportionsWithDiceCost = _.merge({}, gainProportions, {
  drawCard: 57,
  drawDice: 19,
})
const proportionsWithoutDiceCost = _.merge({}, gainProportions, {
  drawCard: 38,
  drawDice: 38,
})


const topEffectsList = [
  'drawCard', 'drawDice', 'reroll',
  'doubleNextCard', 'discardCardDrawDice', 'discardDiceDrawCard',
  'discountDiceCost', 'discountValueToDrawDice', 'discountValueToDrawCard'
]

const bottomEffectsList = [
  'moneyPerDiceUsed', 'moneyPer2CardsUsed', 'purchasedCardsToTopDeck',
  'purchasedDiceToBag', 'doubleBaseMoneyOfCard',
  'discountPurchaseCard', 'discountPurchaseDice', 'discountTrash',
]

const onlyOneEffectsList = [
  'doubleNextCard', 'discardCardDrawDice', 'discardDiceDrawCard',
  'discountDiceCost', 'discountValueToDrawDice', 'discountValueToDrawCard',

  'moneyPerDiceUsed', 'moneyPer2CardsUsed', 'purchasedCardsToTopDeck',
  'purchasedDiceToBag', 'doubleBaseMoneyOfCard',
  'discountPurchaseCard', 'discountPurchaseDice', 'discountTrash',
]

const specialEffectsList = [
  'doubleNextCard',
  'discountDiceCost', 'discountValueToDrawDice', 'discountValueToDrawCard',

  'purchasedCardsToTopDeck', 'purchasedDiceToBag', 'doubleBaseMoneyOfCard',
  'discountPurchaseCard', 'discountPurchaseDice', 'discountTrash',
]

const costRoller = new Brng({
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
  (cardObj) => !(cardObj.diceCost > 0),
  (cardObj) => -cardObj.cost,
  (cardObj) => -cardObj.diceCost,
  
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
  const cardCost = _.toNumber(costRoller.roll())
  cardsArray.push({
    cost: cardCost,
    expectedValue: costToValueMapping[cardCost],
    uuid: Math.random().toString(36).slice(2),
  })
})
cardsArray = _.sortBy(cardsArray, sortOrderArray)

_.forEach(cardsArray, (cardObj, index) => {
  const gainObj = {}
  const chosenCardCost = cardObj.cost <= 5 ?
    diceCostRollerCheap.roll() : diceCostRollerExpensive.roll()
  
  gainObj[chosenCardCost] = 1

  cardObj.gain = gainObj
  cardObj.diceCost = _.toNumber(_.last(chosenCardCost))
  cardObj.currentValue = resourceToValueMapping[chosenCardCost]

  if (cardObj.cost <= 2 && cardObj.diceCost === 0) {
    gainObj.noDrawCard = 1
  }
})
cardsArray = _.sortBy(cardsArray, sortOrderArray)


const cardObjSimilaritySettings = {
  cost: [1, 3], // multiplier = 1, max diff = 3, type = Number, 
  diceCost: [1,3],
  gain: {

    doubleNextCard: [1,1,String], // card
    discardCardDrawDice: [1,1,String], // dice
    discardDiceDrawCard: [1,1,String], // card

    discountDiceCost: [1,1,String], // dice

    moneyPerDiceUsed: [1,1,String],
    moneyPer2CardsUsed: [1,1,String],

    purchasedCardsToTopDeck: [1,1,String],
    purchasedDiceToBag: [1,1,String],
    doubleBaseMoneyOfCard: [1,1,String],

    discountPurchaseCard: [1,1,String], // money
    discountPurchaseDice: [1,1,String], // money
    discountTrash: [1,1,String], // trash



    money: [1,4],
    drawCard: [1,2],
    drawDice: [1,2],
    reroll: [1,2],
  },
}

_.forEach(cardsArray, (cardObj, index) => {

  if (cardObj.diceCost === 0) {
    gainRoller.updateProportions(proportionsWithoutDiceCost)
  }
  else { // cardObj.diceCost > 0
    gainRoller.updateProportions(proportionsWithDiceCost)
  }

  const leastSimilarObj = getLeastSimilarObj(
    cardsArray.slice(0, index),
    10, // max attempts
    cardObjSimilaritySettings,
    (addUndo, addRedo) => {

      const newCardObj = _.cloneDeep(cardObj)

      const exclusionRules = {
        groupingMaxVariety: [
          {resourceList: _.concat(topEffectsList, bottomEffectsList), max: 2},
          // {resourceList: bottomEffectsList, max: 1},
          {resourceList: specialEffectsList, max: 1},
          {resourceList: ['moneyPerDiceUsed', 'drawDice'], max: 1},
          {resourceList: ['moneyPer2CardsUsed', 'drawCard'], max: 1},

          {resourceList: ['discardCardDrawDice', 'drawDice'], max: 1},
          {resourceList: ['discardDiceDrawCard', 'drawCard'], max: 1},

          {resourceList: ['drawCard', 'drawDice'], max: 1},
          // {resourceList: ['cost0', 'drawCard'], max: 1},
          // {resourceList: [
          //   ['cost1', 'cost2', 'cost3', 'cost4', 'cost5', 'cost6'],
          //   'drawDice'],
          // max: 1},

          // {resourceList: [
          //   ['cost1', 'cost2', 'cost3', 'cost4', 'cost5', 'cost6'],
          //   ['discardCardDrawDice', 'discardDiceDrawCard']],
          // max: 1},

          // {resourceList: [
          //   ['cost1', 'cost2', 'cost3', 'cost4', 'cost5', 'cost6'],
          //   'doubleBaseMoneyOfCard'],
          // max: 1},

          {resourceList: ['noDrawCard', 'drawCard'], max: 1},
        ],
        groupingMaxQuantity: [
          {resourceList: onlyOneEffectsList, max: 1},
          {resourceList: ['drawCard'], max: 3},
          {resourceList: ['drawDice'], max: 2},
          {resourceList: ['drawCard', 'drawDice'], max: 3},
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
        gainObj.deckCycle = bonus
        currentValue += bonus * resourceToValueMapping.bonus
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
// countOccurances(cardsArray, 'gain', ['deckCycle', 'trashMarket'])
// countOccurances(cardsArray, 'gain', ['reroll'])
// countOccurances(cardsArray, 'gain', ['money'])

_.forEach(resourceToValueMapping, (val, key) => {
  countOccurances(cardsArray, 'gain', [key])
})

// !! TO ADD STARTER CARDS
// cardsArray = cardsArray.concat(starterCards)

const cardsImportantKeys = [
  'cost',
  // 'expectedValue',
  // 'currentValue',
  'gain',
  'uuid',
]

console.log(gainRoller.proportions)
console.log(gainRoller.originalProportions)

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

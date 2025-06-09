import _ from 'lodash'
import Brng from 'brng'
import seed from 'seed-random'

import '../util/base.css'
import generateGainObj from '../util/generateGainObj.js'
import getLeastSimilarObj from '../util/getLeastSimilarObj.js'
import createNestedBrngRoller from '../util/createNestedBrngRoller.js'
import countOccurances from '../util/countOccurances.js'

// import Card from './Card.js'


import ICONS from '../util/icons.js'
// import './index.css'

// import starterCards from './starterCards.js'

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


const CARD_QUANTITY = 30

// [ATTACK, TAP, DEFENSE]
const cardTypeRoller = createNestedBrngRoller({
  defOnce: {weight: 2, children: {
    defOnce_atkGood_tapBad: 1,
    defOnce_tapGood_atkBad: 1,
  }},
  atkOnce: {weight: 1, children: {
    atkOnce_defGood_tapBad: 1,
    atkOnce_tapGood_defBad: 1,
  }},
  tapOnce: {weight: 1, children: {
    tapOnce_defGood_atkBad: 1,
    tapOnce_atkGood_defBad: 1,
  }},
}, {bias: 4})

const manaCostRoller = new Brng({
  // 0: 1
  // 1: 2
  // 2: 4
  // 3: 5
  // 4: 3
  // 5: 2
  // 6: 1

  1: 10,
  2: 30,
  3: 25,
  4: 15,
  5: 7,
  6: 5,
}, {bias: 4})

const tapActionRoller = createNestedBrngRoller({
  // offense: {weight: 20, children: {
  //   damage: 1,
  // }},
  damage: 20, // offense
  engine: {weight: 40, children: {
    mana: 1,
    draw: 2,
    untap: 1,
  }},
  control: {weight: 40, children: {
    destroy: 2,
    return: 3,
    tap: 5,
  }},
}, {bias: 4})



/////////////////////////////


/////////////////////////////

const sortOrderArray = [
  // (cardObj) => -cardObj.cost,
  'type',
  'cost',
  'tap',
]

let cardsArray = []

_.times(CARD_QUANTITY, (index) => {
  
  const cost = manaCostRoller.roll()
  cardsArray.push({
    uuid: Math.random().toString(36).slice(2),
    cost: _.toNumber(manaCostRoller.roll()),
  })
})
cardsArray = _.sortBy(cardsArray, sortOrderArray)

_.forEach(cardsArray, (cardObj, index) => {
  cardObj.type = cardTypeRoller.roll()
})
cardsArray = _.sortBy(cardsArray, sortOrderArray)

_.forEach(cardsArray, (cardObj, index) => {
  cardObj.tap = tapActionRoller.roll()
})
cardsArray = _.sortBy(cardsArray, sortOrderArray)


_.forEach(cardsArray, (cardObj, index) => {
  const strength = cardObj.cost + 2

  const creatureLeewayMult = 1.5
  const tapMult = _.includes(cardObj.type, 'tapOnce') ? 2 : 1

  cardObj.__destroyMana = _.round( strength/2 * tapMult * creatureLeewayMult - 2, 2)
  cardObj.__returnMana = _.round( strength/2 * tapMult * creatureLeewayMult , 2)
  cardObj.__tapMana = _.round( strength/2 * tapMult * 1.5 * creatureLeewayMult, 2)

  const ATK = _.includes(cardObj.type, 'atkOnce') ? strength :
    (_.includes(cardObj.type, 'atkGood') ? strength/2 : _.toString(strength/2)+'-' )
  cardObj.ATK = ATK

  const DEF = _.includes(cardObj.type, 'defOnce') ? strength :
    (_.includes(cardObj.type, 'defGood') ? strength/2 : _.toString(strength/2)+'-' )
  cardObj.DEF = DEF

  const TAP = _.includes(cardObj.type, 'tapOnce') ? strength :
    (_.includes(cardObj.type, 'tapGood') ? strength/2 : _.toString(strength/2)+'-' )
  cardObj.TAP = TAP

})


// console.log(_.sum(_.sortBy(document.lol, (a) => -a).slice(0,50)))
// console.log(_.round(_.mean(document.lol), 4))

// countOccurances(cardsArray, 'gainTop', 'bonus')

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

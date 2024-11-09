import _ from 'lodash'
import Brng from 'brng'
import seed from 'seed-random'

import '../util/base.css'
import generateGainObj from '../util/generateGainObj.js'
import getLeastSimilarObj from '../util/getLeastSimilarObj.js'
import createNestedBrngRoller from '../util/createNestedBrngRoller.js'
import countOccurances from '../util/countOccurances.js'

// import Card from './Card.js'



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


const CARD_QUANTITY = 54


const effectRoller = createNestedBrngRoller({
  atk: {weight: 2, children: {

    atk_normal: {weight: 2, children: {
      
      atk1: 1,
      atk2: 1,
      atk3: 1,

      atk3Discard1: 1,
      atk4Discard1: 1,

      atk1Draw1: 1,
      atk2Draw1: 1,

      atk1PerTurn: 1.2,
    }},

    // atk_true: {weight: 1, children: {
    //   atkTrue1: 1,
    //   atkTrue2: 1,

    //   atkTrue3Discard1: 1,

    //   atkTrue1Draw1: 1,
    // }},

    atk_special: {weight: 1, children: {

      atkSpecialCard: {weight: 2, children: {
        atk1PerHand: 2,
        atk1PerPlayed: 2,

        atk1PerDiscard: 1,
        atk2PerDiscard: 1,
      }},

      atkWhenDef: {weight: 1, children: {
        atk1WhenPlayDef: 1,
        atk2WhenPlayDef: 1,
      }},

      atkPerDef: {weight: 1, children: {
        atk1PerDef: 1,
        atk2PerDef: 1,
      }},
      
      nextDoubleAtk: 1,
    }},
    
  }},

  def: {weight: 1, children: {
    shield: {weight: 1, children: {
      shield1: 1,
      shield2: 1,
      shield3: 1,
      shield4: 1,

      shield2Atk1: 2,
      shield3Atk1: 2,

      shieldPerHand: 1,
      shield1PerDiscard: 0.5,
      shield2PerDiscard: 0.5,

      shield1Draw1: 1,
      shield2Draw1: 1,
      shield3Draw1: 1,
      
      shield3Discard1: 1,
      shield4Discard1: 1,
      shield5Discard1: 1,
      
    }},
    
    heal: {weight: 1, children: {
      heal1: 1,
      heal2: 1,
      heal3: 1,
      heal4: 1,

      healPerHand: 1,
      heal1PerDiscard: 0.5,
      heal2PerDiscard: 0.5,

      heal1Draw1: 1,
      heal2Draw1: 1,
      heal3Draw1: 1,
      
      heal3Discard1: 1,
      heal4Discard1: 1,
      heal5Discard1: 1,
    }},
    
  }},

  misc: {weight: .1, children: {
    drawAllDiscard: 1,
    drawAllPrevious: 1,
    discardAllPrevious: 1
  }},
}, {bias: 4})

const rarityRoller = new Brng({
  C: 4,
  R: 3,
  SR: 2,
  UR: 1,
}, {bias: 4})

const cardNumberRoller = new Brng({
  1: 10 + 5,
  2: 10 + 6,
  3: 10 + 7,
  4: 10 + 8,
  5: 10 + 9,
  6: 10 + 10,
  7: 10 + 11,
  8: 10 + 12,
  9: 10 + 13,

  10: 10 + 13,
  11: 10 + 12,
  12: 10 + 11,
  13: 10 + 10,
  14: 10 + 9,
  15: 10 + 8,
  16: 10 + 7,
  17: 10 + 6,
  18: 10 + 5,
}, {bias: 4})

/////////////////////////////

const sortOrderArray = [
  // (cardObj) => cardObj.effect,
  'number',
  // 'count',
  'effect',
  'rarity',
]

let cardsArray = []

_.times(CARD_QUANTITY, (index) => {
  cardsArray.push({
    effect: effectRoller.roll()
    // uuid: Math.random().toString(36).slice(2),
  })
})
cardsArray = _.sortBy(cardsArray, sortOrderArray)

_.forEach(cardsArray, (cardObj, index) => {
  cardObj.rarity = rarityRoller.roll()
})
cardsArray = _.sortBy(cardsArray, sortOrderArray)


// const effectCount = _.countBy(cardsArray, 'effect');
// cardsArray = _.map(cardsArray, obj => ({
//   ...obj,
//   count: effectCount[obj.effect]
// }))
// cardsArray = _.sortBy(cardsArray, sortOrderArray)

_.forEach(cardsArray, (cardObj, index) => {
  cardObj.number = _.toNumber(cardNumberRoller.roll())
})
cardsArray = _.sortBy(cardsArray, sortOrderArray)

console.log(cardsArray.length)


//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
/// put the most counts in the middle

// const groupedByEffect = _.groupBy(cardsArray, 'count');
// const topArray = []
// const bottomArray = []

// let currentArray = topArray
// let cardNumber = 0
// _.forEach(groupedByEffect, (arrayOfCount, count) => {
//   let previousEffect
//   _.forEach(arrayOfCount, cardObj => {
//     if (previousEffect !== cardObj.effect) {
//       currentArray = (topArray.length <= bottomArray.length) ? topArray : bottomArray
//       cardNumber++
//     }
//     currentArray.push(cardObj)
//     cardObj.cardNumber = cardNumber
//     previousEffect = cardObj.effect
//   })
// })

// cardsArray = [...topArray, ...bottomArray.reverse()]

//////////////////////////////////////////////////////
//////////////////////////////////////////////////////

function Cards () {
  return <div>
    {/*{_.map(cardsArray, (cardObj, idx) => <Card key={idx} cardObj={cardObj} /> )}*/}
    <pre className="noprint">
      {JSON.stringify(cardsArray, null, 2)}
      {/*{JSON.stringify(_.chain(cardsArray).map((obj) => _.pick(obj, cardsImportantKeys)).value(), null, 2)}*/}
      {/*{JSON.stringify(_.map(cardsArray, obj => obj.gain), null, 2)}*/}
    </pre>

  </div>
}

export default Cards



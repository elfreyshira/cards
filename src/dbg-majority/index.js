import Brng from 'brng'
import _ from 'lodash'

// attack types: fire, earth, water
// conflict areas: mountain, forest, island, city

// Top: troops, draw, trash, move, money, energy, discard
// Bottom: +attack, money, energy, trash

// 50% attack/move, 25% draw/trash/energy, 25% money



const effectRoller = new Brng({
  // attack: 42,
  fire: 9,
  earth: 9,
  water: 9,
  wild: 14,

  move: 7,

  money: 13,

  draw: 8,
  trash: 2,
  energy: 6,
}, {bias: 4})
const topEffectList = ['fire', 'earth', 'water', 'wild', 'move', 'money', 'draw', 'trash']
const bottomEffectList = ['fire', 'earth', 'water', 'wild', 'money', 'trash']
const attackList = ['fire', 'earth', 'water', 'wild']


const effectToValueMapping = {
  // attack: 100, // TODO REMOVE
  fire: 100,
  earth: 100,
  water: 100,
  wild: 150,
  move: 50,

  money: 100,

  draw: 200,
  trash: 200,
  energy: 50,
}

const proportionsCardCost = {
  1: 4,
  2: 5,
  3: 6,
  4: 7, // middle
  5: 6,
  6: 5,
  7: 4,
  8: 3,
  9: 2,
}
const cardCostRoller = new Brng(proportionsCardCost, {bias: 4, keepHistory: false})

const costToMaxValueMapping = {
  1: 200, // 2
  2: 275, // 2.5+3
  3: 350, // 3.5 or 3+4
  4: 400, // 4
  5: 450, // 4.5 or 4+5
  6: 500, // 5
  7: 525, // 5+5.5
  8: 575, // 5.5+6
  9: 600, // 6
}

///////////////////////////////////////
///////////////////////////////////////
///////////////////////////////////////
///////////////////////////////////////

let cardsArray = []

// const CARD_QUANTITY = 5
// const CARD_QUANTITY = 1
const CARD_QUANTITY = 42

_.times(CARD_QUANTITY, () => {
  cardsArray.push({cost: cardCostRoller.roll()})
})
// cardsArray = _.sortBy(cardsArray, ['cost'])
cardsArray = _.sortBy(cardsArray, [cardObj => -cardObj.cost])


function getAvailableEffects (remainingValue) {
  // returns all effects that are less than remainingValue
  return _.keys(
    _.pickBy(effectToValueMapping, (effectValue) => {
      return effectValue < remainingValue
    })
  )
}


function getExcludedEffectsTooBig (remainingValue) {
  // returns all the effects that are bigger than remainingValue
  return _.keys(
    _.omitBy(effectToValueMapping, (effectValue) => {
      return effectValue <= remainingValue
    })
  )
}

function getCurrentValue(effectObj) {
  let currentValue = 0
  _.forEach(effectObj, (val, key) => {
    currentValue += effectToValueMapping[key]*(val || 0)
  })
  return currentValue
}

_.forEach(cardsArray, cardObj => {

  const maxValue = costToMaxValueMapping[cardObj.cost]
  const topObj = {}
  const bottomObj = {}

  let attempts = 0
  while ((getCurrentValue(topObj) + getCurrentValue(bottomObj)) < maxValue*2 && attempts < 20) {

    const topValue = getCurrentValue(topObj)
    const bottomValue = getCurrentValue(bottomObj)

    let exclusion = []    

    if (topValue <= bottomValue) {
      let onlyList = _.intersection(
        _.cloneDeep(topEffectList),
        getAvailableEffects(maxValue - topValue + 25)
      ).concat('energy')
      if (_.intersection(topEffectList, _.keys(topObj)).length === 2) {
        onlyList = _.keys(topObj).concat('energy')
      }

      if (maxValue <= 200 || maxValue - topValue < 200) {
        exclusion = _.uniq(_.concat(exclusion, 'draw'))
      }      

      if (_.intersection(attackList, _.keys(topObj)).length >= 1) {
        exclusion = _.uniq(_.concat(exclusion, _.without(attackList, ..._.keys(topObj)) ))
      }

      const chosenEffect = _.attempt(() => effectRoller.roll({only: onlyList, exclude: exclusion}))

      if (!_.isError(chosenEffect)) {
        topObj[chosenEffect] = topObj[chosenEffect] ? topObj[chosenEffect]+1 : 1  
      }
    }

    else {
      let onlyList = _.intersection(
        _.cloneDeep(bottomEffectList),
        getAvailableEffects(maxValue - bottomValue + 25)
      ).concat('energy')

      if (_.intersection(bottomEffectList, _.keys(bottomObj)).length === 2) {
        onlyList = _.keys(bottomObj).concat('energy')
      }

      if (_.intersection(attackList, _.keys(bottomObj)).length >= 1) {
        exclusion = _.uniq(_.concat(exclusion, _.without(attackList, ..._.keys(bottomObj)) ))
      }

      const chosenEffect = _.attempt(() => effectRoller.roll({only: onlyList, exclude: exclusion}))
      if (!_.isError(chosenEffect)) {
        bottomObj[chosenEffect] = bottomObj[chosenEffect] ? bottomObj[chosenEffect]+1 : 1  
      }
    }
    

    attempts++

    // if (maxValue - currentValue < 2) {
    //   // exclusion = _.uniq(_.concat(exclusion, ['draw', 'gem']))
    //   exclusion = _.uniq(_.concat(exclusion, ['draw']))
    // }

    // if (_.intersection(primaryResources, _.keys(primaryBenefitObj)).length === 2) {
    //   exclusion = _.uniq(_.concat(
    //     exclusion,
    //     _.without(['money', 'attack', 'gem'], ..._.keys(primaryBenefitObj))
    //   ))
    // }


    // if (_.intersection(primaryResources, _.keys(primaryBenefitObj)).length === 1
    //   && maxValue <= 4 // only for lower cards
    // ) {
    //   exclusion = _.uniq(_.concat(
    //     exclusion,
    //     _.without(['money', 'attack', 'gem'], ..._.keys(primaryBenefitObj))
    //   ))
    // }

    // if (_.keys(primaryBenefitObj).length === 3) {
    // // if ( _.intersection(positiveResources, _.keys(primaryBenefitObj)).length === 3 ) {
    //   exclusion = _.uniq(_.concat(
    //     exclusion,
    //     _.without(_.keys(proportionsEffect), ..._.keys(primaryBenefitObj))
    //   ))
    // }
    

    // const chosenEffect = effectRoller.roll({exclude: exclusion})

    // if (_.includes(['opponentMoney', 'opponentAttack', 'opponentGem', 'opponentDraw'], chosenEffect)) {
    //   exclusion = _.uniq(_.concat(
    //     exclusion,
    //     ['opponentMoney', 'opponentAttack', 'opponentGem', 'opponentDraw']
    //   ))
    // }

    // currentValue += effectToValueMapping[chosenEffect]
    // primaryBenefitObj[chosenEffect] = primaryBenefitObj[chosenEffect]
      // ? primaryBenefitObj[chosenEffect]+1 : 1
  }

  cardObj.top = topObj
  cardObj.bottom = bottomObj

})



const cardsImportantKeys = ['cost', 'top']

function Cards () {
  return (
    <div>
      <pre>
        {/*{JSON.stringify(_.pick(cardsArray, cardsImportantKeys), null, 2)}*/}
        {/*{JSON.stringify(_.chain(cardsArray).map((obj) => _.pick(obj, cardsImportantKeys)).value(), null, 2)}*/}
        {JSON.stringify(cardsArray,null,2)}
      </pre>
    </div>
  )
}

function countOccurences (key, resources) {
  let countTotal = 0
  _.forEach(
    cardsArray, obj => {
      const resourcesToCount = _.pick(obj[key], resources)
      countTotal += _.sum(_.values(resourcesToCount))
      return resourcesToCount
    }
  )
  console.log(key, JSON.stringify(resources), countTotal)
  return countTotal
}


export default Cards

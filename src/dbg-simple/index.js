import Brng from 'brng'
import _ from 'lodash'


const effectToValueMapping = {
  // positive
  money: 1,
  attack: 1,
  gem: 1,
  draw: 2,
  drawAndDiscard: 1,

  // negative
  // discard: -1,
  opponentMoney: -1,
  opponentAttack: -1,
  opponentGem: -1,
  opponentDraw: -2,
}

const proportionsEffect = {
  // positive
  money: 10,
  attack: 12,
  gem: 16, // 10 if gem=2 value. 20 if gem=1 value
  draw: 8,
  drawAndDiscard: 5,

  // negative
  opponentMoney: 0.7,
  opponentAttack: 0.7,
  opponentGem: 0.7,
  opponentDraw: 0.7,
}
const proportionsAttackEffect = {
  money: 12,
  // attack: 12,
  gem: 14,
  draw: 7,
  // drawAndDiscard: 4,
}

const effectRoller = new Brng(proportionsEffect, {bias: 1, keepHistory: true})

const proportionsCardCost = {
  1: 5,
  2: 8,
  // 3: NONE,
  4: 9,
  5: 7,
  // 6: NONE,
  7: 4,
  8: 3,
  // 9: NONE,
  // 10: 3,
}
const cardCostRoller = new Brng(proportionsCardCost, {bias: 4, keepHistory: true})

const costToMaxValue = {
  1: 2,
  2: 3,
  // 3: NONE,
  4: 4,
  5: 5,
  // 6: NONE,
  7: 6,
  8: 7,
  // 9: NONE,
  // 10: 8,
}

const costToHealthMapping = {
  1: 5, // 5
  2: 4, // 8
  4: 3, // 9
  5: 2, // 7
  7: 1,
  8: 1, // 7
  // 10: 2,

  // 1: 7,
  // 2: 6,
  // 4: 5,
  // 5: 4,
  // 7: 3,
  // 8: 2,
  // 10: 1,
}

const healthToMaxValue = {
  // 2: 1,
  // 3: 2,
  // 4: 3,
  // 5: 4,
  // 6: 5,
  // 7: 6,
  // 8: 7,

  1: 1,
  2: 2,
  3: 3,
  4: 5,
  5: 6,
  // 6: 7,
  // 7: 7,
  // 8: 8,
}

const quantityCards = 36
let cardsArray = []

_.times(quantityCards, (idx) => {
  const cardCost = _.toNumber(cardCostRoller.roll())
  cardsArray.push({
    cost: cardCost,
    health: costToHealthMapping[cardCost],
    uuid: Math.random().toString(36).slice(2),
  })
})


// cardsArray = _.sortBy(cardsArray, ['cost']) // least expensive first
cardsArray = _.sortBy(cardsArray, cardObj => -cardObj.cost) // most expensive first
_.forEach(cardsArray, cardObj => {
  const primaryMaxValue = costToMaxValue[cardObj.cost]

  let currentValue = 0
  const primaryBenefitObj = {}
  let exclusion = []

  if (primaryMaxValue <= 2) {
    exclusion = _.concat(exclusion, 'draw')
  }

  while (currentValue < primaryMaxValue) {

    if (primaryMaxValue - currentValue < 2) {
      // exclusion = _.uniq(_.concat(exclusion, ['draw', 'gem']))
      exclusion = _.uniq(_.concat(exclusion, ['draw']))
    }

    if (_.intersection(['money', 'attack', 'gem'], _.keys(primaryBenefitObj)).length === 2) {
      exclusion = _.uniq(_.concat(
        exclusion,
        _.without(['money', 'attack', 'gem'], ..._.keys(primaryBenefitObj))
      ))
    }


    if (_.intersection(['money', 'attack', 'gem'], _.keys(primaryBenefitObj)).length === 1
      && primaryMaxValue <= 5 // only for lower cards
    ) {
      exclusion = _.uniq(_.concat(
        exclusion,
        _.without(['money', 'attack', 'gem'], ..._.keys(primaryBenefitObj))
      ))
    }

    if (_.keys(primaryBenefitObj).length === 3) {
      exclusion = _.uniq(_.concat(
        exclusion,
        _.without(_.keys(proportionsEffect), ..._.keys(primaryBenefitObj))
      ))
    }
    

    const chosenEffect = effectRoller.roll({exclude: exclusion})

    if (_.includes(['opponentMoney', 'opponentAttack', 'opponentGem', 'opponentDraw'], chosenEffect)) {
      exclusion = _.uniq(_.concat(
        exclusion,
        ['opponentMoney', 'opponentAttack', 'opponentGem', 'opponentDraw']
      ))
    }

    currentValue += effectToValueMapping[chosenEffect]
    primaryBenefitObj[chosenEffect] = primaryBenefitObj[chosenEffect]
      ? primaryBenefitObj[chosenEffect]+1 : 1
  }
  cardObj.primaryEffect = primaryBenefitObj
  // cardObj.maxValue = primaryMaxValue
  // cardObj.value = currentValue
})

effectRoller.updateProportions(proportionsAttackEffect)

cardsArray = _.sortBy(cardsArray, ['cost']) // least expensive first
// cardsArray = _.sortBy(cardsArray, cardObj => -cardObj.cost) // most expensive first
_.forEach(cardsArray, cardObj => {
  const attackMaxValue = healthToMaxValue[cardObj.health]

  let currentValue = 0
  const attackBenefitObj = {}
  let exclusion = []

  while (currentValue < attackMaxValue) {

    if (attackMaxValue - currentValue < 2) {
      // exclusion = _.uniq(_.concat(exclusion, ['draw', 'gem']))
      exclusion = _.uniq(_.concat(exclusion, ['draw']))
    }

    if (_.intersection(['money', 'gem'], _.keys(attackBenefitObj)).length === 1
      && attackMaxValue <= 3 // only for lower cards
    ) {
      exclusion = _.uniq(_.concat(
        exclusion,
        _.without(['money', 'gem'], ..._.keys(attackBenefitObj))
      ))
    }

    if (_.keys(attackBenefitObj).length === 2) {
      exclusion = _.uniq(_.concat(
        exclusion,
        _.without(_.keys(proportionsEffect), ..._.keys(attackBenefitObj))
      ))
    }

    const chosenEffect = effectRoller.roll({exclude: exclusion})

    
    currentValue += effectToValueMapping[chosenEffect]
    attackBenefitObj[chosenEffect] = attackBenefitObj[chosenEffect]
      ? attackBenefitObj[chosenEffect]+1 : 1
  }
  // cardObj.attackEffect = attackBenefitObj
  // cardObj.maxValue = attackMaxValue
  // cardObj.value = currentValue
})


function Cards () {
  return (
    <div>
      <pre>
        {JSON.stringify(cardsArray, null, 2)}
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

countOccurences('primaryEffect', 'money')
countOccurences('primaryEffect', 'attack')
countOccurences('primaryEffect', 'gem')
countOccurences('primaryEffect', 'draw')
countOccurences('primaryEffect', 'drawAndDiscard')

export default Cards

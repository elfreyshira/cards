import Brng from 'brng'
import _ from 'lodash'

// attack types: fire, earth, water
// conflict areas: mountain, forest, island, city

// Top: troops, draw, trash, move, money, energy, discard
// Bottom: +attack, money, energy, trash

// 50% attack/move, 25% draw/trash/energy, 25% money

console.clear()

const ATTACK_TOP_BASE = 4.4
const WILD_MULTIPLIER = 1.2
const ATTACK_BOTTOM_MULTIPLIER = 1.2222222
// const ATTACK_BOTTOM_MULTIPLIER = 1

const effectsProportions = {
  fireTop: ATTACK_TOP_BASE,
  earthTop: ATTACK_TOP_BASE,
  waterTop: ATTACK_TOP_BASE,
  wildTop: ATTACK_TOP_BASE*WILD_MULTIPLIER,
  // push: 3,/
  // pull: 6,

  fireBottom: ATTACK_TOP_BASE*ATTACK_BOTTOM_MULTIPLIER,
  earthBottom: ATTACK_TOP_BASE*ATTACK_BOTTOM_MULTIPLIER,
  waterBottom: ATTACK_TOP_BASE*ATTACK_BOTTOM_MULTIPLIER,
  wildBottom: ATTACK_TOP_BASE*ATTACK_BOTTOM_MULTIPLIER*WILD_MULTIPLIER,

  // move: 7,

  money: 13.5,

  draw: 6,
  cycle: 3,
  trash: 1.8,
  // energy: 7,
}

const effectRoller = new Brng(effectsProportions, {bias: 4})

const topEffectList = [
  'fireTop', 'earthTop', 'waterTop', 'wildTop',
  'money', 'draw', 'cycle', 'trash'
]
const bottomEffectList = ['fireBottom', 'earthBottom', 'waterBottom', 'wildBottom', 'money', 'trash']

const attackList = [
  'fireTop', 'earthTop', 'waterTop', 'wildTop',
  'fireBottom', 'earthBottom', 'waterBottom', 'wildBottom',
]

const attackListMapping = {
  fireTop: 'fireBottom',
  earthTop: 'earthBottom',
  waterTop: 'waterBottom',
  wildTop: 'wildBottom',

  fireBottom: 'fireTop',
  earthBottom: 'earthTop',
  waterBottom: 'waterTop',
  wildBottom: 'wildTop',
}


const effectToValueMapping = {
  fireTop: 100,
  earthTop: 100,
  waterTop: 100,
  wildTop: 150,

  fireBottom: 100,
  earthBottom: 100,
  waterBottom: 100,
  wildBottom: 150,

  money: 100,

  draw: 200,
  cycle: 100,
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
  1: {first: 200, second: 200}, // 2
  2: {first: 300, second: 250}, // 275, // 2.5+3
  3: {first: 350, second: 350}, // 350, // 3.5 or 3+4
  4: {first: 400, second: 400}, // 400, // 4
  5: {first: 450, second: 450}, // 450, // 4.5 or 4+5
  6: {first: 500, second: 500}, // 500, // 5
  7: {first: 550, second: 500}, // 525, // 5+5.5
  8: {first: 600, second: 550}, // 575, // 5.5+6
  9: {first: 600, second: 600}, // 600, // 6
}

const topOrBottomRoller = new Brng({top: 1, bottom: 1}, {bias: 4})

const comboTypeRoller = new Brng({AA: 1, BB: 1, CC: 1, ABC: 1}, {bias: 4})

///////////////////////////////////////
///////////////////////////////////////
///////////////////////////////////////
///////////////////////////////////////

let cardsArray = []
const cardsSortOrder = [
  cardObj => -cardObj.cost, // highest to lowest
  // 'cost', // highest to lowest
  // [cardObj => -Math.abs(5-cardObj.cost), 'cost']
  'comboType',
  'priority',
]

// const CARD_QUANTITY = 5
// const CARD_QUANTITY = 1
const CARD_QUANTITY = 42

_.times(CARD_QUANTITY, () => {
  cardsArray.push({cost: cardCostRoller.roll()})
})

// adding comboType
cardsArray = _.sortBy(cardsArray, cardsSortOrder)
_.forEach(cardsArray, cardObj => {
  cardObj.comboType = comboTypeRoller.roll()
})

// adding priority
cardsArray = _.sortBy(cardsArray, cardsSortOrder)
_.forEach(cardsArray, cardObj => {
  cardObj.priority = topOrBottomRoller.roll()
})

const VALUE_SLACK = 25
function getAvailableEffects (remainingValue) {
  // returns all effects that are less than remainingValue
  return _.keys(
    _.pickBy(effectToValueMapping, (effectValue) => {
      return effectValue <= remainingValue + VALUE_SLACK
    })
  )
}


function getCurrentValue(effectObj) {
  let currentValue = 0
  _.forEach(_.omit(effectObj, 'combo'), (val, key) => {
    currentValue += (effectToValueMapping[key] || 0) * (val || 0)
  })
  // if (effectObj.combo) {
  //   currentValue -= effectToValueMapping[effectObj.combo]/2
  // }
  return currentValue
}

//////////////// COMBO ////////////////////////////////////
//////////////// COMBO ////////////////////////////////////
cardsArray = _.sortBy(cardsArray, cardsSortOrder)
_.forEach(cardsArray, cardObj => {

  const topObj = {}
  const bottomObj = {}

  let firstChosenEffect
  if (cardObj.priority === 'top') {
    firstChosenEffect = effectRoller.roll({only: topEffectList})
    topObj[firstChosenEffect] = 0.5
    topObj.combo = firstChosenEffect
  }
  else { // bottom priority
    firstChosenEffect = effectRoller.roll({only: bottomEffectList})
    bottomObj[firstChosenEffect] = 0.5
    bottomObj.combo = firstChosenEffect
  }

  cardObj.top = topObj
  cardObj.bottom = bottomObj
})

//////////////////////////////////// FILL THE REST ///////////////////////////
//////////////////////////////////// FILL THE REST ///////////////////////////
cardsArray = _.sortBy(cardsArray, cardsSortOrder)
_.forEach(cardsArray, cardObj => {
  // not a feature on brng yet
  // effectRoller.biasMultiplier = 4-Math.round(cardObj.cost/3)

  const topObj = _.cloneDeep(cardObj.top)
  const bottomObj = _.cloneDeep(cardObj.bottom)

  let topMaxValue, bottomMaxValue
  if (cardObj.priority === 'top') {
    topMaxValue = costToMaxValueMapping[cardObj.cost].first
    bottomMaxValue = costToMaxValueMapping[cardObj.cost].second
  }
  else { // bottom priority
    bottomMaxValue = costToMaxValueMapping[cardObj.cost].first
    topMaxValue = costToMaxValueMapping[cardObj.cost].second
  }


  let attempts = 0
  while (
    (getCurrentValue(topObj) + getCurrentValue(bottomObj)) < (topMaxValue + bottomMaxValue)
    && attempts < 40
  ) {

    const topValue = getCurrentValue(topObj)
    const bottomValue = getCurrentValue(bottomObj)

    let exclusion = []

    ////////// TOP ///////////////////////////////////////////////////////////////////////////
    ////////// TOP ///////////////////////////////////////////////////////////////////////////
    ////////// TOP ///////////////////////////////////////////////////////////////////////////
    ////////// TOP ///////////////////////////////////////////////////////////////////////////
    ////////// TOP ///////////////////////////////////////////////////////////////////////////
    if (cardObj.priority === 'top' ? topValue <= bottomValue : topValue < bottomValue) {
      let onlyList = _.intersection(
        topEffectList,
        getAvailableEffects(topMaxValue - topValue)
      )

      if (
        _.intersection(topEffectList, _.keys(topObj)).length >= 2 // 2 unique effects max
        || (topMaxValue <= 200 && !_.isEmpty(topObj)) // $1 card
      ) {
        onlyList = _.intersection(
          _.keys(topObj),
          topEffectList,
          getAvailableEffects(topMaxValue - topValue)
        )
      }

      // make sure the top and bottom don't share the same attack type
      const attacksToExclude = []
      _.forEach(_.keys(bottomObj), (bottomKey) => {
        attacksToExclude.push(attackListMapping[bottomKey])
      })
      exclusion = _.uniq(_.concat(exclusion, attacksToExclude))

      // don't have money on both sides
      if (_.includes(_.keys(bottomObj), 'money')) {
        exclusion = _.uniq(_.concat(exclusion, 'money'))
      }

      if (topMaxValue <= 200) {
        exclusion = _.uniq(_.concat(exclusion, 'draw'))
      }

      // max of 2 cycle in one card
      if (topObj['cycle'] > 1) {
        exclusion = _.uniq(_.concat(exclusion, 'cycle'))
      }

      // max of 4 pull in one card
      // if (topObj['pull'] >= 4) {
      //   exclusion = _.uniq(_.concat(exclusion, 'pull'))
      // }

      // draw and cycle cannot be together
      if (_.intersection(_.keys(topObj), ['draw', 'cycle']).length >= 1) {
        exclusion = _.uniq(_.concat(exclusion, _.without(['draw', 'cycle'], ..._.keys(topObj)) ))
      }

      // money 2+ and attack cannot be together
      // if (_.includes(_.keys(topObj), 'money') && topObj.money >= 2) {
      //   exclusion = _.uniq(_.concat(exclusion, attackList))
      // }

      // limit 1 attack type per side
      if (_.intersection(attackList, _.keys(topObj)).length >= 1) {
        exclusion = _.uniq(_.concat(
          exclusion,
          _.without(attackList, ..._.keys(topObj)),
          // 'money' // money and attack can't be together
        ))
      }

      const chosenEffect = _.attempt(() =>
        effectRoller.roll({only: onlyList, exclude: _.compact(exclusion)})
      )

      if (!_.isError(chosenEffect)) {
        topObj[chosenEffect] = topObj[chosenEffect] ? topObj[chosenEffect]+1 : 1  
      }
      else {
        topObj.energy = topObj.energy ? topObj.energy+1 : 1  
      }
    }

    ////////// BOTTOM ///////////////////////////////////////////////////////////////////////////
    ////////// BOTTOM ///////////////////////////////////////////////////////////////////////////
    ////////// BOTTOM ///////////////////////////////////////////////////////////////////////////
    ////////// BOTTOM ///////////////////////////////////////////////////////////////////////////
    ////////// BOTTOM ///////////////////////////////////////////////////////////////////////////
    else {
      let onlyList = _.intersection(
        _.cloneDeep(bottomEffectList),
        getAvailableEffects(bottomMaxValue - bottomValue)
      )

      if (
        _.intersection(bottomEffectList, _.keys(bottomObj)).length >= 2 // 2 unique effects
        || (bottomMaxValue <= 200 && !_.isEmpty(bottomObj)) // $1 card
      ) {
        onlyList = _.intersection(
          _.keys(bottomObj),
          bottomEffectList,
          getAvailableEffects(bottomMaxValue - bottomValue)
        )
      }

      // make sure the top and bottom don't share the same attack type
      const attacksToExclude = []
      _.forEach(_.keys(topObj), (topKey) => {
        attacksToExclude.push(attackListMapping[topKey])
      })
      exclusion = _.uniq(_.concat(exclusion, attacksToExclude))

      // don't have money on both sides
      if (_.includes(_.keys(topObj), 'money')) {
        exclusion = _.uniq(_.concat(exclusion, 'money'))
      }

      // (ONLY BOTTOM) money and attack cannot be together
      if (_.includes(_.keys(bottomObj), 'money') && bottomObj.money > 0) {
        exclusion = _.uniq(_.concat(exclusion, attackList))
      }

      // limit 1 attack type per side
      if (_.intersection(attackList, _.keys(bottomObj)).length >= 1) {
        exclusion = _.uniq(_.concat(
          exclusion,
          _.without(attackList, ..._.keys(bottomObj)),
          'money' // (ONLY BOTTOM) money and attack cannot be together
        ))
      }

      // max of 1 trash in one card
      if (bottomObj['trash'] > 0) {
        exclusion = _.uniq(_.concat(exclusion, 'trash'))
      }

      const chosenEffect = _.attempt(() =>
        effectRoller.roll({only: onlyList, exclude: _.compact(exclusion)})
      )

      if (!_.isError(chosenEffect)) {
        bottomObj[chosenEffect] = bottomObj[chosenEffect] ? bottomObj[chosenEffect]+1 : 1  
      }
      else {
        bottomObj.energy = bottomObj.energy ? bottomObj.energy+1 : 1  
      }
    }
    

    attempts++

  }

  cardObj.top = topObj
  cardObj.bottom = bottomObj
  cardObj.topValue = getCurrentValue(topObj)
  cardObj.bottomValue = getCurrentValue(bottomObj)

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


// key -- String / resources -- Array[String]
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


const forAttack = 0
  + countOccurences('top', ['wildTop'])*1.5
  + countOccurences('bottom', ['wildBottom'])*1.5
  + countOccurences('top', ['fireTop'])
  + countOccurences('bottom', ['fireBottom'])
  + countOccurences('top', ['earthTop'])
  + countOccurences('bottom', ['earthBottom'])
  + countOccurences('top', ['waterTop'])
  + countOccurences('bottom', ['waterBottom'])
  + countOccurences('top', ['energy'])/2
  + countOccurences('bottom', ['energy'])/2

const forEngine = 0
  + countOccurences('top', ['money'])
  + countOccurences('bottom', ['money'])
  + countOccurences('top', ['trash'])*2
  + countOccurences('bottom', ['trash'])*2

const forDrawing = 0
  + countOccurences('top', ['draw'])*2
  + countOccurences('top', ['cycle'])

const totalValue = forAttack + forEngine + forDrawing
console.log('forAttack', _.round(forAttack/totalValue*100, 2))
console.log('forEngine', _.round(forEngine/totalValue*100, 2))
console.log('forDrawing', _.round(forDrawing/totalValue*100, 2))


// console.log(effectRoller.proportions)
// console.log(effectRoller)
// console.log(cardsArray)

export default Cards

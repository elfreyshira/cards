import _ from 'lodash'
import Brng from 'brng'

import Card from './Card.js'
import checkSimilarity from './check-similarity.js'
import starterCards from './starter-cards.js'

import './index.css'

import {
  proportionsCardCost,
  effectsProportions,
  topEffectList,
  bottomEffectList,
  attackList,
  attackListMapping,
  effectToValueMapping,
  cardCostRoller,
  costToMaxValueMapping,
  topOrBottomRoller,
  comboTypeRoller,
  comboProportions,
  comboExclusion,
  getComboValueFraction
} from './CONSTANTS'

console.clear()


const EFFECT_ROLLER_BIAS = 4
const effectRoller = new Brng(effectsProportions, {bias: 4, keepHistory: true})

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
// const CARD_QUANTITY = 15
// const CARD_QUANTITY = 0
// const CARD_QUANTITY = 1
// const CARD_QUANTITY = 42
// const CARD_QUANTITY = _.sum(_.values(proportionsCardCost))
const CARD_QUANTITY = _.sum(_.values(proportionsCardCost))*2

// filling in the card cost
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
  // if (!_.has(cardObj, 'priority')) {
    cardObj.priority = topOrBottomRoller.roll()
  // }
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
effectRoller.updateProportions(comboProportions)

// effectRoller.setBias(EFFECT_ROLLER_BIAS/2)
cardsArray = _.sortBy(cardsArray, cardsSortOrder)
_.forEach(cardsArray, cardObj => {

  const topObj = _.cloneDeep(cardObj.top) || {}
  const bottomObj = _.cloneDeep(cardObj.bottom) || {}

  let firstChosenEffect
  if (cardObj.priority === 'top') {
    // firstChosenEffect = effectRoller.roll({only: _.without(topEffectList, ...comboExclusion)})
    firstChosenEffect = effectRoller.roll({only: topEffectList}) // once brng is at ^1.12.0
    
    // topObj[firstChosenEffect] = 0.5
    topObj[firstChosenEffect] = getComboValueFraction(firstChosenEffect)
    topObj.combo = firstChosenEffect
  }
  else { // bottom priority
    firstChosenEffect = effectRoller.roll({only: _.without(bottomEffectList, ...comboExclusion)})
    // firstChosenEffect = effectRoller.roll({only: bottomEffectList})
    
    // bottomObj[firstChosenEffect] = 0.5
    bottomObj[firstChosenEffect] = getComboValueFraction(firstChosenEffect)
    bottomObj.combo = firstChosenEffect
  }

  cardObj.top = topObj
  cardObj.bottom = bottomObj
})
// effectRoller.setBias(EFFECT_ROLLER_BIAS)
effectRoller.setBias(EFFECT_ROLLER_BIAS*2) // this makes it 8, which is higher than max
effectRoller.updateProportions(effectsProportions)


///////// CUSTOM CARDS //////////////////////////////
///////// CUSTOM CARDS //////////////////////////////
// const shouldDoCustomCards = true
const shouldDoCustomCards = false

if (shouldDoCustomCards) {
  cardsArray.push({
    cost: '9',
    priority: 'top',
    bottom: {wildBottom: 4},
    // customBottom: "For each card played this turn that costs $2 or less: [Wild]"
    customCard: 'gainForEachCard',
    customSide: 'bottom',
  })
  _.times(4, () => effectRoller.roll('wildBottom'))

  cardsArray.push({
    cost: '9',
    priority: 'bottom',
    top: {draw: 3},
    // customTop: "When you purchase a card: [Draw]",
    customCard: 'drawWhenPurchase',
    customSide: 'top',
  })
  _.times(3, () => effectRoller.roll('draw'))

  cardsArray.push({
    cost: '8',
    priority: 'top',
    top: {wildTop: 4},
    // customTop: "Any location: gain units equal to the number of your units already there."
    customCard: 'doubleUnits',
    customSide: 'top',
  })
  _.times(4, () => effectRoller.roll('wildTop'))

  cardsArray.push({
    cost: '8',
    priority: 'bottom',
    bottom: {wildBottom: 4},
    customCard: 'lossForEachCard',
    customSide: 'bottom',
  })
  _.times(4, () => effectRoller.roll('wildBottom'))

  cardsArray.push({
    cost: '8',
    priority: 'bottom',
    bottom: {money: 6},
    customCard: 'moneyForEachUnit',
    customSide: 'bottom',
  })
  _.times(6, () => effectRoller.roll('money'))
}

///////// CUSTOM CARDS //////////////////////////////

////// adding unique ids ///////
_.forEach(cardsArray, cardObj => {
  cardObj.uuid = Math.random().toString(36).slice(2)
})
////// adding unique ids ///////

////////////////////////////////////
////////////////////////////////////
function getTopAndBottomEffect (cardObj, topMaxValue, bottomMaxValue) {
  const topObj = _.cloneDeep(cardObj.top) || {}
  const bottomObj = _.cloneDeep(cardObj.bottom) || {}

  let timesRolled = 0
  const effectsRolledArray = []

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
    if (cardObj.priority === 'top'
      ? (topValue - TOP_VALUE_EXTRA) <= bottomValue
      : (topValue - TOP_VALUE_EXTRA) < bottomValue
    ) {
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

      // don't have trash/draw/cycle on both sides
      // if (_.includes(_.keys(bottomObj), 'trash')) {
      //   exclusion = _.uniq(_.concat(exclusion, ['trash', 'draw', 'cycle']))
      // }
      if (_.includes(_.keys(bottomObj), 'trash')) {
        exclusion = _.uniq(_.concat(exclusion, 'trash'))
      }

      if (
        topMaxValue <= 200 // for small cards
        || topObj['draw'] > 1 // max of 2 draw in one card
      ) {
        exclusion = _.uniq(_.concat(exclusion, 'draw'))
      }

      // max of 2 cycle in one card
      if (topObj['cycle'] > 1) {
        exclusion = _.uniq(_.concat(exclusion, 'cycle'))
      }

      // max of 1 trash in one card
      if (topObj['trash'] > 0) {
        exclusion = _.uniq(_.concat(exclusion, 'trash'))
      }

      // // max of 1 action in one card
      // if (topObj['action'] > 0) {
      //   exclusion = _.uniq(_.concat(exclusion, 'action'))
      // }

      // // max of 4 move in one card
      // if (topObj['move'] > 3) {
      //   exclusion = _.uniq(_.concat(exclusion, 'move'))
      // }

      // // move/wildTop cannot be together
      // if (_.intersection(_.keys(topObj), ['move', 'wildTop']).length >= 1) {
      //   exclusion = _.uniq(_.concat(
      //     exclusion,
      //     _.without(['move', 'wildTop'], ..._.keys(topObj))
      //   ))
      // }

      // draw/cycle/trash cannot be together
      if (_.intersection(_.keys(topObj), ['draw', 'cycle', 'trash']).length >= 1) {
        exclusion = _.uniq(_.concat(
          exclusion,
          _.without(['draw', 'cycle', 'trash'], ..._.keys(topObj))
        ))
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
        effectsRolledArray.push(chosenEffect)
        timesRolled++
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

      // don't have trash/draw/cycle on both sides
      // if (_.intersection(_.keys(topObj), ['trash', 'draw', 'cycle']).length > 0) {
      //   exclusion = _.uniq(_.concat(exclusion, ['trash', 'draw', 'cycle']))
      // }
      if (_.includes(_.keys(topObj), 'trash')) {
        exclusion = _.uniq(_.concat(exclusion, 'trash'))
      }


      // (ONLY BOTTOM ONLY) money and attack cannot be together
      if (
        _.intersection(_.keys(bottomObj), attackList.concat('money')).length >= 1
        // && bottomMaxValue <= 300 // for low value cards
      ) {
        exclusion = _.uniq(_.concat(
          exclusion,
          _.without(attackList.concat('money'), ..._.keys(bottomObj))
        ))
      }

      // limit 1 attack type per side
      if (_.intersection(attackList, _.keys(bottomObj)).length >= 1) {
        exclusion = _.uniq(_.concat(
          exclusion,
          _.without(attackList, ..._.keys(bottomObj))
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
        effectsRolledArray.push(chosenEffect)
        timesRolled++
      }
      else {
        bottomObj.energy = bottomObj.energy ? bottomObj.energy+1 : 1
      }
    }
  

    attempts++
    if (attempts > 39) {
      console.log('what the heck!!!!!!!')
    }

  }

  return {topObj, bottomObj, timesRolled, effectsRolledArray}
}

function rollWithSetValues (givenBrngRoller, effectsRolledArray) {
  _.forEach(effectsRolledArray, chosenEffect => {
    givenBrngRoller.roll(chosenEffect)
  })
  return givenBrngRoller
}

////////////////////// FILL THE REST ///////////////////////////
////////////////////// FILL THE REST ///////////////////////////

const TOP_VALUE_EXTRA = 0 // if no actions
// const TOP_VALUE_EXTRA = 100 // if you include action cost

const similarityRatioArray = []
cardsArray = _.sortBy(cardsArray, cardsSortOrder)
_.forEach(cardsArray, (cardObj, cardsArrayIndex) => {

  let topMaxValue, bottomMaxValue
  if (cardObj.priority === 'top') {
    topMaxValue = costToMaxValueMapping[cardObj.cost].first + TOP_VALUE_EXTRA
    bottomMaxValue = costToMaxValueMapping[cardObj.cost].second
  }
  else { // bottom priority
    bottomMaxValue = costToMaxValueMapping[cardObj.cost].first
    topMaxValue = costToMaxValueMapping[cardObj.cost].second + TOP_VALUE_EXTRA
  }

  /////////////////
  let attemptsToFillEffects = 0
  const maxAttemptsToFillEffects = 10
  const fillEffectsAttemptsArray = []

  while (attemptsToFillEffects < maxAttemptsToFillEffects) {
    attemptsToFillEffects++
    const {
      topObj, bottomObj, timesRolled, effectsRolledArray
    } = getTopAndBottomEffect(cardObj, topMaxValue, bottomMaxValue)

    const newCardObj = _.cloneDeep(cardObj) || {}
    newCardObj.top = topObj
    newCardObj.bottom = bottomObj
    newCardObj.topValue = getCurrentValue(topObj)
    newCardObj.bottomValue = getCurrentValue(bottomObj)

    const {similarityRatio, mostSimilarCardObj} = checkSimilarity(
      cardsArray.slice(0, cardsArrayIndex), newCardObj
    )
    fillEffectsAttemptsArray.push({
      similarityRatio,
      mostSimilarCardObj,
      effectsRolledArray,
      top: _.cloneDeep(topObj),
      bottom: _.cloneDeep(bottomObj),
    })

    _.times(timesRolled, () => effectRoller.undo())
  }
  const {
    top, bottom, effectsRolledArray,
    similarityRatio, mostSimilarCardObj,
  } = _.sortBy(fillEffectsAttemptsArray, 'similarityRatio')[0]

  rollWithSetValues(effectRoller, effectsRolledArray)

  similarityRatioArray.push(similarityRatio)

  /////////////////


  cardObj.top = top
  cardObj.bottom = bottom
  cardObj.topValue = getCurrentValue(top)
  cardObj.bottomValue = getCurrentValue(bottom)
  // console.log(cardObj.uuid, similarityRatio, mostSimilarCardObj)

})
console.log('_.mean(similarityRatioArray)', _.mean(similarityRatioArray))
similarityRatioArray.sort(function(a, b){return b-a});
console.log(similarityRatioArray.slice(0,4))


//////////////// START: STARTER CARDS ////////////
// cardsArray = starterCards.concat(starterCards)
cardsArray = cardsArray.concat(starterCards).concat(starterCards)
//////////////// END: STARTER CARDS ////////////

const cardsImportantKeys = ['cost', 'top']

function Cards () {
  return (
    <div>
      {
        _.map(cardsArray, (cardObj, idx) => <Card key={idx} cardObj={cardObj} /> )
      }
      <pre className="noprint">
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
    cardsArray, cardObj => {
      if (cardObj.cost === '0') {
        // IGNORE starter cards
        return
      }
      const resourcesToCount = _.pick(cardObj[key], resources)
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
  + countOccurences('top', ['move'])/2

const forEngine = 0
  + countOccurences('top', ['money'])
  + countOccurences('bottom', ['money'])
  + countOccurences('top', ['trash'])*1.5
  + countOccurences('bottom', ['trash'])*1.5

const forMorePlays = 0
  + countOccurences('top', ['draw'])*2
  + countOccurences('top', ['cycle'])
  // + countOccurences('top', ['action'])

const totalValue = forAttack + forEngine + forMorePlays
console.log('forAttack', _.round(forAttack/totalValue*100, 2))
console.log('forEngine', _.round(forEngine/totalValue*100, 2))
console.log('forMorePlays', _.round(forMorePlays/totalValue*100, 2))


console.log(effectRoller.proportions)
// console.log(effectRoller)
console.log(cardsArray)

export default Cards

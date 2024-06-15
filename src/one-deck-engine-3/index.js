import Brng from 'brng'
import _ from 'lodash'

import {Card} from './Card.js'
// import Character from './Character.js'

import '../util/base.css'
import './index.css'

import getNewExcludeList from '../util/getNewExcludeList.js'
import getAvailableResources from '../util/getAvailableResources.js'
import roundToNearest from '../util/roundToNearest.js'

global.Brng = Brng

// const CARD_QUANTITY = 0
// const CARD_QUANTITY = 52
// const CARD_QUANTITY = 1
const CARD_QUANTITY = 100
console.clear()

const TAG_LIST = ['red', 'green', 'blue']

const ENGINE_MULTIPLIER = 1.5
// WORK = ACTIVATE
// RECRUIT = BUILD ENGINE
// CONSTRUCT = BUILD TAG
// INVITE = PURCHASE 10 POINTS

const RESOURCE_VALUES_MAPPING = _.mapValues({
  // work = activate
  draw: 150,
  money: 100,

  // increase work on build
  untapTheCardOnRecruit: 250,
  untapOnConstruct: 200,
  untapOnInvite: 200,

  // passive build discount
  discountRecruit: 150,
  discountConstruct: 100,
  discountInvite: 100,

  // passive build draw
  drawOnRecruit: 200,
  drawOnConstruct: 150,
  drawOnInvite: 150,

  // increase build
  extraRecruit: 300,
  extraConstruct: 200,
  extraInvite: 200,
  
}, (value) => value * ENGINE_MULTIPLIER)

const RESOURCE_LIST = _.keys(RESOURCE_VALUES_MAPPING)
const NON_ACTIVATE_RESOURCES = _.without(RESOURCE_LIST, 'draw', 'money')

const UNTAP_PASSIVE_RESOURCES = ['untapTheCardOnRecruit', 'untapOnConstruct', 'untapOnInvite']
const DISCOUNT_PASSIVE_RESOURCES = ['discountRecruit', 'discountConstruct', 'discountInvite']
const DRAW_PASSIVE_RESOURCES = ['drawOnRecruit', 'drawOnConstruct', 'drawOnInvite']
const EXTRA_BUILD_RESOURCES = ['extraRecruit', 'extraConstruct', 'extraInvite']

const RECRUIT_PASSIVE_RESOURCES = [
  'untapTheCardOnRecruit', 'discountRecruit', 'drawOnRecruit', 'extraRecruit']
const CONSTRUCT_PASSIVE_RESOURCES = [
  'untapOnConstruct', 'discountConstruct', 'drawOnConstruct', 'extraConstruct']
const INVITE_PASSIVE_RESOURCES = [
  'untapOnInvite', 'discountInvite', 'drawOnInvite', 'extraInvite']

const TAG_COMBO_COST_MAPPING = {
  red: 1.0,
  green: 1.2,
  blue: 1.5,
}

const TAG_SIDE_VALUES_MAPPING = _.mapValues({
  red: 100,
  green: 150,
  blue: 200,
}, (value) => value * ENGINE_MULTIPLIER)


/////////////////////////////
/////////////////////////////
/////////////////////////////


const resourceGainRoller = new Brng({
  // work = activate
  draw: 40,
  money: 40,

  // increase activate on build
  untapTheCardOnRecruit: 5,
  untapOnConstruct: 3,
  untapOnInvite: 3,

  // passive build discount
  discountRecruit: 5,
  discountConstruct: 3,
  discountInvite: 3,

  // passive build draw
  drawOnRecruit: 5,
  drawOnConstruct: 3,
  drawOnInvite: 3,

  // increase build
  extraRecruit: 3.3,
  extraConstruct: 2,
  extraInvite: 2,

}, {bias: 4})
global.resourceGainRoller = resourceGainRoller


const tagComboTypeRoller = new Brng({
  cost: 4,
  activate: 3,
  point: 2,
}, {bias: 4})

const tagComboCostRoller = new Brng({
  red: 2, // value 1 -- 1.75
  green: 1.66666666666666, // value 1.2 -- 1.8
  blue: 1.33333333333333, // value 1.5 -- 1.875
}, {bias: 4})

const tagSideRoller = new Brng({
  red: 2, // value 1
  green: 1.333333333333, // value 1.5
  blue: 1, // value 2
}, {bias: 1})

const tagSideVarietyRoller = new Brng({1: 1, 2: 1}, {bias: 4})

const CARD_COST_DISTRIBUTION = {
  // https://boardgamegeek.com/image/5536942/race-for-the-galaxy
  // 1: 10,
  // 2: 36,

  // 3: 20,
  // 4: 14,

  // 5: 10,
  // 6: 7,
  //////////

  1: 2,
  2: 4,

  3: 5,
  4: 4,

  5: 3,
  6: 2,
}
const cardCostRoller = new Brng(CARD_COST_DISTRIBUTION, {bias: 4})

const pointCostRoller = new Brng(_.countBy(_.range(3, 10+1)), {bias: 4})

// activation levels:
// 1: 100-150
// 2: 200-250
// 3: 300+

//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
//////////////////////////////////////////////////////


let cardsArray = [
  // {
  //   cost: 4, //$
  //   tagType: ,// COST, ACTIVATE, POINT
  //   expectedValue: 100,
  //   actualValue: 105,
  //   point: 2,
  //   gain: {
  //     resource1: ,
  //     resource2: ,
  //   },
  //   tags: {
  //     red: 1,
  //   }
  // }
]

const sortOrderArray = [
  (cardObj) => -cardObj.costForResources,
  'tagComboType',
  'tagComboVariety',
  'tagSideCost',
  'tagSideVariety',
//   (cardObj) => cardObj.purchaseArray ? cardObj.purchaseArray[0] : 0,
  // (cardObj) => cardObj.purchaseArray ? cardObj.purchaseArray[1] : 0,
]


///// CREATE THE CARDS
_.times(CARD_QUANTITY, () => {
  const costTotal = _.toNumber(cardCostRoller.roll())

  cardsArray.push({
    costForResources: costTotal,
    expectedResourcesValue: 200 + costTotal*100, // every card has base value of 200 (build + card)

    uuid: Math.random().toString(36).slice(2),
    // cost: {},
    // gain: {}
  })
})
cardsArray = _.sortBy(cardsArray, sortOrderArray)

////// FILL TAG SIDE COST
_.forEach(cardsArray, (cardObj, index) => {
  cardObj.tagSideCost = cardsArray[cardsArray.length - index - 1].costForResources
  cardObj.tagSideExpectedValue = 200 + cardObj.tagSideCost*100
})
cardsArray = _.sortBy(cardsArray, sortOrderArray)


////// FILL TAG COMBO TYPE
_.forEach(cardsArray, (cardObj) => {
  cardObj.tagComboType = tagComboTypeRoller.roll()
})
cardsArray = _.sortBy(cardsArray, sortOrderArray)

//// TAG COMBO VARIETY
const tagComboVarietyRoller = new Brng({1: 1, 2:1}, {bias: 4})
_.forEach(cardsArray, (cardObj) => {
  cardObj.tagComboVariety = _.toNumber(tagComboVarietyRoller.roll())
})
cardsArray = _.sortBy(cardsArray, sortOrderArray)

////// FILL CARDS FOR: TAG COMBO = COST
_.forEach(cardsArray, (cardObj) => {
  if (cardObj.tagComboType !== 'cost') return;

  const tagComboCostObj = {}
  let tagComboCostCurrentValue = 0

  while(true) {

    let valueSlack = 0.75 // blue
    if (_.has(tagComboCostObj, 'green')) {
      valueSlack = 0.6
    }
    if (_.has(tagComboCostObj, 'red')) {
      valueSlack = 0.5
    }
    

    const onlyList = getAvailableResources(
      TAG_COMBO_COST_MAPPING,
      cardObj.costForResources - tagComboCostCurrentValue,
      valueSlack
    )

    const excludeList = getNewExcludeList(
      tagComboCostObj,
      {
        groupingMaxVariety: [
          {resourceList: TAG_LIST, max: cardObj.tagComboVariety}
        ]
      }
    )

    const chosenTag = _.attempt(() => tagComboCostRoller.roll({only: onlyList, exclude: excludeList}))
    if (_.isError(chosenTag)) {
      break
    }
    else {
      tagComboCostObj[chosenTag] = tagComboCostObj[chosenTag] ? tagComboCostObj[chosenTag] + 1 : 1
      tagComboCostCurrentValue += TAG_COMBO_COST_MAPPING[chosenTag]
    }
  }
  cardObj.tagComboCost = tagComboCostObj
  cardObj.tagComboCostCurrentValue = _.round(tagComboCostCurrentValue, 1)
  
  // update expectedResourcesValue to avg with tagComboCost
  cardObj.expectedResourcesValue = (cardObj.expectedResourcesValue
    + (cardObj.tagComboCostCurrentValue*100 + 200)) / 2

})
cardsArray = _.sortBy(cardsArray, sortOrderArray)

////// FILL CARDS FOR: TAG COMBO = ACTIVATE
const tagComboActivateTypeRoller = new Brng({red: 1, green: 1.25, blue: 1.333333333}, {bias: 4})

const tagComboActivateRedRoller = new Brng({1:1, 2:1, 3:1, 4:1, 5:1, 6:1}, {bias: 4, repeatTolerance: 0})
const tagComboActivateGreenRoller = new Brng({1:1, 2:1, 3:1, 4:1, 5:1}, {bias: 4, repeatTolerance: 0})
const tagComboActivateBlueRoller = new Brng({1:1, 2:1, 3:1, 4:1,}, {bias: 4, repeatTolerance: 0})

const tagComboActivateGainRoller = new Brng({draw:1, money:1}, {bias: 0.5})

_.forEach(cardsArray, (cardObj) => {
  if (cardObj.tagComboType !== 'activate') return;

  const tagType1 = tagComboActivateTypeRoller.roll()
  const tagComboObjTemp = {}
  tagComboObjTemp[tagType1] = 1

  const excludeList = getNewExcludeList(
    tagComboObjTemp,
    {
      groupingMaxVariety: [
        {resourceList: TAG_LIST, max: cardObj.tagComboVariety}
      ]
    }
  )
  tagComboActivateTypeRoller.repeatTolerance = 2 - cardObj.tagComboVariety + 0.1
  const tagType2 = tagComboActivateTypeRoller.roll({exclude: excludeList})

  let tagComboActivateValue = 0
  const tagComboActivateObj = {} // {red6: 'draw', green1: 'money'}
  _.forEach([tagType1, tagType2], (tagType) => {

    const chosenGain = tagComboActivateGainRoller.roll()

    if (tagType === 'red') {
      const redTagNumber = tagComboActivateRedRoller.roll()
      tagComboActivateObj[tagType + redTagNumber] = chosenGain
      tagComboActivateValue += (1 - redTagNumber/7) * RESOURCE_VALUES_MAPPING[chosenGain]
    }
    else if (tagType === 'green') {
      const greenTagNumber = tagComboActivateGreenRoller.roll()
      tagComboActivateObj[tagType + greenTagNumber] = chosenGain
      tagComboActivateValue += (1 - (greenTagNumber/5*6)/7) * RESOURCE_VALUES_MAPPING[chosenGain]
      
    }
    else if (tagType === 'blue') {
      const blueTagNumber = tagComboActivateBlueRoller.roll()
      tagComboActivateObj[tagType + blueTagNumber] = chosenGain
      tagComboActivateValue += (1 - (blueTagNumber/4*6)/7) * RESOURCE_VALUES_MAPPING[chosenGain]
    }
  })

  cardObj.tagComboActivate = tagComboActivateObj
  cardObj.tagComboActivateValue = _.round(tagComboActivateValue/1.5)
  
  // update expectedResourcesValue by subtracting the combo activate value
  cardObj.expectedResourcesValue = cardObj.expectedResourcesValue - cardObj.tagComboActivateValue

})
cardsArray = _.sortBy(cardsArray, sortOrderArray)


////// FILL CARDS FOR: TAG COMBO = POINT
const tcPointRollerForVarietyMapping = {
  1: new Brng({red: 1, green: 1.25, blue: 1.33333333}, {bias: 4}),
  2: new Brng({
      red_green: 2.25,
      red_blue: 2.333333333333,
      green_blue: 2.583333333333,
    }, {bias: 4})
}

const tcPointPerTagRollerMapping = {
  red: new Brng({1: 1}, {bias: 0}),
  green: new Brng({1: 0.8, 2: 0.2}, {bias: 4}),
  blue: new Brng({1: 0.5, 2: 0.5}, {bias: 4}),
  red_green: new Brng({1: 0.5333333333, 2: 0.4666666667}, {bias: 4}),
  red_blue: new Brng({1: 0.3333333333, 2: 0.66666666}, {bias: 4}),
  green_blue: new Brng({1: 0.2, 2: 0.8}, {bias: 4}), 
}

const expectedPointTotalMapping = {
  red: {
    1: 6,
  },
  green: {
    1: 5,
    2: 10,
  },
  blue: {
    1: 4,
    2: 8,
  },
  red_green: {
    1: 3.66666666666666,
    2: 7.3333333333333
  },
  red_blue: {
    1: 3.33333333333,
    2: 6.6666666666666,
  },
  green_blue: {
    1: 3,
    2: 6,
  }
}

_.forEach(cardsArray, (cardObj) => {
  if (cardObj.tagComboType !== 'point') return;
  const tagComboPointObj = {}

  const tcTypeRoller = tcPointRollerForVarietyMapping[cardObj.tagComboVariety]
  const tcType = tcTypeRoller.roll()

  let excludeList = []
  if (cardObj.costForResources <= 3) {
    excludeList = ['2']
  }
  const tcPointPerTag = _.toNumber(tcPointPerTagRollerMapping[tcType].roll({exclude: excludeList}))
  if (tcPointPerTag === 2) {
    // tcTypeRoller.roll(tcType) // roll again
  }

  tagComboPointObj[tcType] = tcPointPerTag
  cardObj.tagComboPoint = tagComboPointObj
  cardObj.expectedPointsFromTagCombo = expectedPointTotalMapping[tcType][tcPointPerTag]

  // update expectedResourcesValue by subtracting the expected points
  cardObj.expectedResourcesValue = cardObj.expectedResourcesValue - cardObj.expectedPointsFromTagCombo*50

})
cardsArray = _.sortBy(cardsArray, sortOrderArray)


///// FILL THE RESOURCE GAIN
_.forEach(cardsArray, (cardObj) => {
  let currentValue = 0
  const gainObj = {}

  while(true) {
    const onlyList = getAvailableResources(
      RESOURCE_VALUES_MAPPING,
      cardObj.expectedResourcesValue - currentValue,
      25 // value slack
    )

    const excludeList = getNewExcludeList(
      gainObj,
      {
        groupingMaxVariety: [
          {resourceList: RESOURCE_LIST, max: 3},
          {resourceList: NON_ACTIVATE_RESOURCES, max: cardObj.costForResources >= 4 ? 2 : 1},
        ],
        groupingMaxQuantity: [
          {resourceList: UNTAP_PASSIVE_RESOURCES, max: 1},
          {resourceList: DISCOUNT_PASSIVE_RESOURCES, max: 1},
          {resourceList: DRAW_PASSIVE_RESOURCES, max: 1},
          {resourceList: EXTRA_BUILD_RESOURCES, max: 1},

          {resourceList: RECRUIT_PASSIVE_RESOURCES, max: 1},
          {resourceList: CONSTRUCT_PASSIVE_RESOURCES, max: 1},
          {resourceList: INVITE_PASSIVE_RESOURCES, max: 1},
        ]
      }
    )

    const chosenResource = _.attempt(() => resourceGainRoller.roll({
      only: onlyList,
      exclude: excludeList
    }))
    if (_.isError(chosenResource)) {
      break // means no more available options to pick
    }
    else {
      gainObj[chosenResource] = gainObj[chosenResource] ? gainObj[chosenResource] + 1 : 1
      currentValue += RESOURCE_VALUES_MAPPING[chosenResource]
    }
  }
  cardObj.gain = gainObj
  cardObj.currentValue = currentValue
  cardObj.points = _.round((cardObj.expectedResourcesValue - currentValue)/50)
})
cardsArray = _.sortBy(cardsArray, sortOrderArray)


/////// FILL TAG SIDE VARIETY
_.forEach(cardsArray, (cardObj) => {
  cardObj.tagSideVariety = _.toNumber(tagSideVarietyRoller.roll())
})
cardsArray = _.sortBy(cardsArray, sortOrderArray)


///////// FILL TAG SIDE GAIN ////////
_.forEach(cardsArray, (cardObj) => {
  let tagSideCurrentValue = 0
  const tagSideObj = {}

  while(true) {
    const onlyList = getAvailableResources(
      TAG_SIDE_VALUES_MAPPING,
      cardObj.tagSideExpectedValue - tagSideCurrentValue,
      25 // value slack
    )

    const excludeList = getNewExcludeList(
      tagSideObj,
      {
        groupingMaxVariety: [
          {resourceList: TAG_LIST, max: cardObj.tagSideVariety}
        ]
      }
    )

    const chosenTag = _.attempt(() => tagSideRoller.roll({only: onlyList, exclude: excludeList}))
    if (_.isError(chosenTag)) {
      break
    }
    else {
      tagSideObj[chosenTag] = tagSideObj[chosenTag] ? tagSideObj[chosenTag] + 1 : 1
      tagSideCurrentValue += TAG_SIDE_VALUES_MAPPING[chosenTag]
    }
  }
  cardObj.tagSide = tagSideObj
  cardObj.tagSideCurrentValue = tagSideCurrentValue
  cardObj.tagSidePoints = _.round((cardObj.tagSideExpectedValue - tagSideCurrentValue)/50)
})
cardsArray = _.sortBy(cardsArray, sortOrderArray)

// // // // // // // // // // // // // // // // // // // // // // // // // // // 
// // // // // // // // // // // // // // // // // // // // // // // // // // // 

// _.forEach(cardsArray, (cardObj) => {
//   let currentValue = 0
//   const gainObj = {}

//   // while (currentValue < (cardObj.expectedValue - 99)) {
//   while (true) {

//     const newExcludeList = getNewExcludeList(
//       gainObj,
//       {
//         groupingMaxVariety: [
//           {resourceList: ['wildStorage', 'wildProduce'], max: 1},
//           {resourceList: ['fireDiscount', 'waterDiscount'], max: 1},
//         ],

//         groupingMaxQuantity: [
//           {resourceList: ['wildStorage'], max: 3},
//           {resourceList: ['wildProduce'], max: 3},
//           {resourceList: ['wildProduce', 'draw'], max: 5},
//           {resourceList: ['drawAfterBuildEngine', 'drawAfterBuildPurchase'], max: 1},
//         ],

//       },
//     )

//     const onlyList = _.intersection(
//       RESOURCE_LIST,
//       getAvailableResources(cardObj.expectedValue - currentValue)
//     )
//     const newResourceToAdd = _.attempt(() => 
//       resourceGainRoller.roll({
//         exclude: newExcludeList,
//         only: onlyList
//       })
//     )
//     if (_.isError(newResourceToAdd)) {
//       if (cardObj.expectedValue - currentValue >= VALUE_TIEBREAKER) {
//         cardObj.tieBreaker = _.floor((cardObj.expectedValue - currentValue)/VALUE_TIEBREAKER)
//       }
//       if (currentValue > cardObj.expectedValue) {
//         cardObj.advantage = true
//       }
//       else if (currentValue < cardObj.expectedValue) {
//         cardObj.loss = true
//       }
      
//       break // !!!!!!!!!!!!!!!!
//     }

//     gainObj[newResourceToAdd] = gainObj[newResourceToAdd] ?
//       gainObj[newResourceToAdd] + 1 : 1
//     currentValue += RESOURCE_VALUES_MAPPING[newResourceToAdd]
//   }

//   cardObj.gain = gainObj
//   cardObj.actualValue = currentValue
// })

const cardsImportantKeys = [
  'costForResources',
  'tagComboType',
  'tagComboActivate',
  'tagComboCost',
  'tagComboPoint',
  'gain',
  'points',
  'tagSide',
  'tagSidePoints',
  'uuid',
]

function Cards () {
  return (
    <div>
      {
        _.map(cardsArray, (cardObj, idx) => <Card key={idx} cardObj={cardObj} /> )
      }

      <pre className="noprint">
        {
          JSON.stringify(
            _.chain(cardsArray).map((obj) => _.pick(obj, cardsImportantKeys)).value()
          , null, 2)
        }
        {
          //JSON.stringify(cardsArray, null, 2)
        }
      </pre>
    </div>
    
  )
}

console.log(resourceGainRoller.proportions)
const lol = {}
_.forEach(RESOURCE_LIST, (key) => {
  lol[key] = _.round(RESOURCE_VALUES_MAPPING[key] * resourceGainRoller.originalProbabilities[key], 1)
})
global.lol = lol
console.log(lol)

export default Cards

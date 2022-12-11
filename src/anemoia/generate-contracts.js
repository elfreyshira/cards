import _ from 'lodash'
import Brng from 'brng'

const CONTRACT_A = 'CONTRACT_A'
const CONTRACT_B = 'CONTRACT_B'
const CONTRACT_C = 'CONTRACT_C'

// const contractObj = {
//   type: CONTRACT_A,
//   resourceCost: 2, //3, 4
//   tagNumber: 1,
//   tagElement: 'fire', // if tagNumber > 0
//   basePoints: 10,

//   conditionalPoints: 5,
//   conditionalType: 'card', // or 'tag'
//   conditionalPer: 'TAP' HOME SPOT, // or 'fire' water earth
// }

// types of element: fire/water/earth, wild, wild (same), wild (not fire)
// number of resources it costs: 2 (1), 3 (1), 4 (1 or 2), 5 (2)

const numberOfResourcesRoller = new Brng({3:1, 4:1, 5:1}, {bias: 4})
const sameOrNotRoller = new Brng({same:1, free:1}, {bias: 3})

// for 3 and 5 resources
const extraSpecificElementRoller = new Brng({0:1, 1:1}, {bias: 3})


const tagElementRoller = new Brng({none: 3, fire: 2, water: 2, earth: 2}, {bias: 4})
const tagNumberRollerMapping = {
  fire: new Brng({1:1, 2:1}, {bias: 4}),
  water: new Brng({1:1, 2:1}, {bias: 4}),
  earth: new Brng({1:1, 2:1}, {bias: 4}),
}

// const hasConditionalRoller = new Brng({yes:2, no:1}, {bias: 3})
const hasConditionalRoller = new Brng({yes:2, no:0}, {bias: 3})
const conditionalTypeRoller = new Brng({card: 1, cardcost:1, tag:2}, {bias: 4})

// single: 2.5. double: 5.0
// cardcost. single: 9. double: 17
const conditionalCardPerRoller = new Brng({SPOT: 1, HOME:1, TAP:1}, {bias: 4})

// single: 6. double: 4.5*2 = 9
const conditionalTagPerRoller = new Brng({fire: 1, water:1, earth:1}, {bias: 4})


let contractsArray = []

const perType = 15
_.times(perType, () => {
  const newContractObj = {
    type: CONTRACT_A,
    resourceCost: _.toNumber(numberOfResourcesRoller.roll())
  }
  contractsArray.push(newContractObj)
})
_.times(perType, () => {
  contractsArray.push({
    type: CONTRACT_B,
    resourceCost: _.toNumber(numberOfResourcesRoller.roll())
  })
})
_.times(perType, () => {
  contractsArray.push({
    type: CONTRACT_C,
    resourceCost: _.toNumber(numberOfResourcesRoller.roll())
  })
})

function sortResourceCostFunc (contractObj) {
  return contractObj.resourceCost
}

const sortOrderArray = [
  'type',
  sortResourceCostFunc,
  'tagElement',
  'tagNumber',
  'conditionalType',
  'specificElementCost',
  'same',
  'totalCostValue'
]


contractsArray = _.sortBy(contractsArray, sortOrderArray)
_.forEach(contractsArray, (contractObj) => {
  const tagElementChosen = tagElementRoller.roll()
  if (tagElementChosen === 'none') {
    contractObj.tagNumber = 0
  }
  else {
    contractObj.tagNumber = _.toNumber(tagNumberRollerMapping[tagElementChosen].roll())
    contractObj.tagElement = tagElementChosen
  }
})


contractsArray = _.sortBy(contractsArray, sortOrderArray)
_.forEach(contractsArray, (contractObj) => {
  if (contractObj.tagNumber === 0 && hasConditionalRoller.roll() === 'yes') {
    contractObj.conditionalType = conditionalTypeRoller.roll() // !!!!!!!!!

    if (_.includes(['card', 'cardcost'], contractObj.conditionalType)) {
      contractObj.conditionalPer = conditionalCardPerRoller.roll()
    }
    else if (contractObj.conditionalType === 'tag') {
      contractObj.conditionalPer = conditionalTagPerRoller.roll()
    }

  }
})

const specificElementCostMapping = {
  3: () => 1 + _.toNumber(extraSpecificElementRoller.roll()),
  4: _.constant(2),
  5: () => 2 + _.toNumber(extraSpecificElementRoller.roll()),
}
contractsArray = _.sortBy(contractsArray, sortOrderArray)
_.forEach(contractsArray, (contractObj) => {
  if (contractObj.tagNumber >= 1) {
    contractObj.specificElementCost = specificElementCostMapping[contractObj.resourceCost]()
  }
})

contractsArray = _.sortBy(contractsArray, sortOrderArray)
_.forEach(contractsArray, (contractObj) => {
  const wildsToPay = contractObj.resourceCost - (contractObj.specificElementCost || 0)
  if (wildsToPay >= 2) {
    contractObj.same = (sameOrNotRoller.roll() === 'same')
  }
})

const costValueOfSame = [80, 90, 100, 100]
const valueMultiplierMapping = {}
valueMultiplierMapping[CONTRACT_A] = 1.3
valueMultiplierMapping[CONTRACT_B] = 1.0
valueMultiplierMapping[CONTRACT_C] = 0.77

contractsArray = _.sortBy(contractsArray, sortOrderArray)
_.forEach(contractsArray, (contractObj) => {
  let totalCostValue = 0
  const resourceCostObj = {}

  if (contractObj.specificElementCost > 0) {
    resourceCostObj[contractObj.tagElement] = contractObj.specificElementCost
    totalCostValue += 100*contractObj.specificElementCost
  }

  if (contractObj.same) {
    resourceCostObj.wildsame = _.min([contractObj.resourceCost - (contractObj.specificElementCost || 0), 3])
    totalCostValue += _.sum(costValueOfSame.slice(0, resourceCostObj.wildsame))

    const leftoverWild = contractObj.resourceCost
      - (contractObj.specificElementCost || 0)
      - resourceCostObj.wildsame

    if (leftoverWild > 0) {
      resourceCostObj.wild = leftoverWild
      totalCostValue += 80*leftoverWild
    }
  }
  else {
    resourceCostObj.wild = contractObj.resourceCost - (contractObj.specificElementCost || 0)
    totalCostValue += 80*resourceCostObj.wild
  }

  contractObj.resourceCostObj = _.cloneDeep(resourceCostObj) // !!!!!!!!!!
  contractObj.totalCostValue = totalCostValue * valueMultiplierMapping[contractObj.type]

})


// includes points for winning comparison, if winning it is 5/2, compared to 2 neighbors.
// this is a little higher than calculated avg, because we assume human players are smarter than RNG
const pointsPerTag = 4.5

const avgMaxTagCount = 6.1
const avgCardsOfEachTypePlayed = 2.5
const avgResourceCostPerCard = 3.4

contractsArray = _.sortBy(contractsArray, sortOrderArray)
_.forEach(contractsArray, (contractObj) => {
  let totalCostValue = _.cloneDeep(contractObj.totalCostValue)

  totalCostValue -= contractObj.tagNumber * pointsPerTag * 25
  
  // for tag comparison at the end
  // if first place gets 3 points
  // totalCostValue -= contractObj.tagNumber
  // * (pointsForWinningTagComparison * 2 / avgMaxTagCount)
  // * 25


  if (contractObj.tagNumber > 0) {
    contractObj.basePoints = Math.round(totalCostValue / 25)
  }
  else if (contractObj.conditionalType === 'card') {
    const avgPointsGained = 
    contractObj.conditionalPoints = _.max([Math.floor(totalCostValue/25/avgCardsOfEachTypePlayed * .7), 1])
    totalCostValue -= contractObj.conditionalPoints*25*avgCardsOfEachTypePlayed

    contractObj.basePoints = Math.round(totalCostValue / 25)
  }
  else if (contractObj.conditionalType === 'cardcost') {
    contractObj.conditionalPoints = _.max([
      1,
      Math.floor(totalCostValue/25/avgResourceCostPerCard/avgCardsOfEachTypePlayed)
    ])

    totalCostValue -= contractObj.conditionalPoints*25*avgResourceCostPerCard*avgCardsOfEachTypePlayed
    
    contractObj.basePoints = Math.round(totalCostValue / 25)
  }
  else if (contractObj.conditionalType === 'tag') {
    contractObj.conditionalPoints = _.max([Math.floor(totalCostValue/25/avgMaxTagCount * .8), 1])

    totalCostValue -= contractObj.conditionalPoints*25*avgMaxTagCount
    
    contractObj.basePoints = Math.round(totalCostValue / 25)
  }
  else {
    contractObj.basePoints = Math.round(totalCostValue / 25)
  }
})



contractsArray = _.sortBy(contractsArray, sortOrderArray)
console.log('contractsArray')
console.log(contractsArray)

export default contractsArray

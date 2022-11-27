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
const sameOrNotRoller = new Brng({same:1, free:1}, {bias: 2})

// for 4 resources
const numberOfSpecificElementRoller = new Brng({1:1, 2:1}, {bias: 2})

const tagNumberRoller = new Brng({0:1, 1:1, 2:1}, {bias: 4})
const tagElementRoller = new Brng({fire: 1, water:1, earth:1}, {bias: 4})


const hasConditionalRoller = new Brng({yes:2, no:1}, {bias: 3})
const conditionalTypeRoller = new Brng({card: 1, cardcost:1, tag:2}, {bias: 2})

// single: 2.5. double: 5.0
// cardcost. single: 9. double: 17
const conditionalCardPerRoller = new Brng({SPOT: 1, HOME:1, TAP:1}, {bias: 4})

// single: 7. double: 4.5*2 = 9
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

function descSortResourceCostFunc (contractObj) {
  return contractObj.resourceCost
}

const sortOrderArray = [
  'type',
  descSortResourceCostFunc,
  'tagNumber',
  'tagElement',
  'conditionalType',
  'specificElementCost',
  'same',
  'totalCostValue'
]


contractsArray = _.sortBy(contractsArray, sortOrderArray)
_.forEach(contractsArray, (contractObj) => {
  if (contractObj.resourceCost <= 3) {
    // tagNumberRoller.update({2:0})
  }
  else if (contractObj.resourceCost >= 4) {
    // tagNumberRoller.update({2:1.5})
  }
  contractObj.tagNumber = _.toNumber(tagNumberRoller.roll())
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


contractsArray = _.sortBy(contractsArray, sortOrderArray)
_.forEach(contractsArray, (contractObj) => {
  if (contractObj.tagNumber >= 1 && contractObj.resourceCost === 4) {
    contractObj.specificElementCost = _.toNumber(numberOfSpecificElementRoller.roll())
  }
  else if (contractObj.tagNumber >= 1 && contractObj.resourceCost === 5) {
    contractObj.specificElementCost = 2
  }
  else if (contractObj.tagNumber >= 1) {
    contractObj.specificElementCost = 1
  }

})

contractsArray = _.sortBy(contractsArray, sortOrderArray)
_.forEach(contractsArray, (contractObj) => {
  const wildsToPay = contractObj.resourceCost - (contractObj.specificElementCost || 0)
  if (wildsToPay >= 2 && wildsToPay <= 5) {
    contractObj.same = (sameOrNotRoller.roll() === 'same')
  }
})


contractsArray = _.sortBy(contractsArray, sortOrderArray)
_.forEach(contractsArray, (contractObj) => {
  if (contractObj.tagNumber >= 1) {
    const chosenTagElement = tagElementRoller.roll()
    contractObj.tagElement = chosenTagElement // !!!!!!!!!!
    if (contractObj.specificElementCost >= 2) {
      _.times(contractObj.specificElementCost - 1, () => tagElementRoller.roll(chosenTagElement))
    }
  }
})

const costValueOfSame = [80, 90, 100, 100]
const costAdjustmentMapping = {}
costAdjustmentMapping[CONTRACT_A] = 1.35
costAdjustmentMapping[CONTRACT_B] = 1.0
costAdjustmentMapping[CONTRACT_C] = 0.74

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
  contractObj.totalCostValue = totalCostValue * costAdjustmentMapping[contractObj.type]

})


const pointsPerTag = 4.2
const pointsForWinningTagComparison = 3

contractsArray = _.sortBy(contractsArray, sortOrderArray)
_.forEach(contractsArray, (contractObj) => {
  let totalCostValue = _.cloneDeep(contractObj.totalCostValue)

  totalCostValue -= contractObj.tagNumber * pointsPerTag * 25
  
  // for tag comparison at the end
  // if first place gets 3 points
  totalCostValue -= contractObj.tagNumber * (pointsForWinningTagComparison*2/6) * 25


  if (contractObj.tagNumber > 0) {
    contractObj.basePoints = Math.round(totalCostValue / 25)
  }
  else if (contractObj.conditionalType === 'card') {
    const avgPointsGained = 
    contractObj.conditionalPoints = _.max([Math.floor(totalCostValue/25/2.5 * .7), 1])
    totalCostValue -= contractObj.conditionalPoints*25*2.5

    contractObj.basePoints = Math.round(totalCostValue / 25)
  }
  else if (contractObj.conditionalType === 'cardcost') {
    contractObj.conditionalPoints = Math.floor(totalCostValue/25/3.33/2.5)

    totalCostValue -= contractObj.conditionalPoints*25*3.33*2.5
    
    contractObj.basePoints = Math.round(totalCostValue / 25)
  }
  else if (contractObj.conditionalType === 'tag') {
    contractObj.conditionalPoints = Math.floor(totalCostValue/25/7)

    totalCostValue -= contractObj.conditionalPoints*25*7
    
    contractObj.basePoints = Math.round(totalCostValue / 25)
  }
  else {
    contractObj.basePoints = Math.round(totalCostValue / 25)
  }
})



// CONTRACT_A
// _.times(20, (idx) => {
//   const contractObj = {
//     type: CONTRACT_A,
//     tagNumber: tagNumberRoller.roll()
//   }

//   if (contractObj.tagNumber > 0) {
//     const chosenTagElement = tagElementRoller.roll()
//     tagElementRoller.roll(chosenTagElement)
//     contractObj.tagElement = chosenTagElement
//   }


// })

contractsArray = _.sortBy(contractsArray, sortOrderArray)
console.log('contractsArray')
console.log(contractsArray)

export default contractsArray

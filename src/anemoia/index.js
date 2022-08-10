import Brng from 'brng'
import _ from 'lodash'

const resourceGainRoller = new Brng(
  {A: 1, B: 1, C: 1},
  {bias: 3, keepHistory: true, repeatTolerance: .5}
)
const resourceLossRoller = new Brng(
  {A: 1, B: 1, C: 1},
  {bias: 3, repeatTolerance: .5}
)
const arrowDirectionRoller = new Brng(
  {LEFT: 1, UP: 1, RIGHT: 1, DOWN: 1},
  {bias: 1, repeatTolerance: 0}
)

const cardArray = []
const cardArray2 = []

function gain(num, key) {
  const chosenKey = resourceGainRoller.roll(key)
  _.times(num-1, () => {
    resourceGainRoller.roll(chosenKey)
  })
  return chosenKey
}
function lose(num, key) {
  const chosenKey = resourceLossRoller.roll(key)
  _.times(num-1, () => {
    resourceLossRoller.roll(chosenKey)
  })
  return chosenKey
}

function loseAndGain(numLoss, numGain) {
  const resourceLost = lose(numLoss)

  let resourceGained = resourceGainRoller.roll()
  let timesStalled = 0
  while (resourceGained === resourceLost && timesStalled < 50) {
    console.log('stalling here: loseAndGain')
    resourceGainRoller.undo()
    resourceGained = resourceGainRoller.roll()
    timesStalled++
  }
  if (timesStalled >= 50) {
    resourceGainRoller.undo()
    const availableResources = ['A', 'B', 'C']
    _.pull(availableResources, resourceLost)
    const resourceB = availableResources[0]
    const resourceC = availableResources[1]

    if (resourceGainRoller.proportions[resourceB] > resourceGainRoller.proportions[resourceC]) {
      resourceGained = resourceB
    }
    else {
      resourceGained = resourceC
    }
    resourceGainRoller.roll(resourceGained)
  }
  gain(numGain-1, resourceGained)

  return {resourceLost, resourceGained}
}


function gain2Types(numGainA, numGainB) {
  const resourceGainedA = gain(numGainA)

  let resourceGainedB = resourceGainRoller.roll()
  let timesStalled = 0
  while (resourceGainedB === resourceGainedA && timesStalled < 50) {
    console.log('stalling here: gain2Types')
    resourceGainRoller.undo()
    resourceGainedB = resourceGainRoller.roll()
    timesStalled++
  }
  if (timesStalled >= 50) {
    resourceGainRoller.undo()
    const availableResources = ['A', 'B', 'C']
    _.pull(availableResources, resourceGainedA)
    const resourceB = availableResources[0]
    const resourceC = availableResources[1]

    if (resourceGainRoller.proportions[resourceB] > resourceGainRoller.proportions[resourceC]) {
      resourceGainedB = resourceB
    }
    else {
      resourceGainedB = resourceC
    }
    resourceGainRoller.roll(resourceGainedB)
  }
  gain(numGainB-1, resourceGainedB)

  return {resourceGainedA, resourceGainedB}
}


function loseAndGainTwoTypes(numLossA, numGainB, numGainC) {
  const resourceALoss = lose(numLossA)

  const resourceTypes = ['A', 'B', 'C']
  _.pull(resourceTypes, resourceALoss)
  
  const resourceB = _.sample(resourceTypes)
  _.pull(resourceTypes, resourceB)

  const resourceC = resourceTypes[0]

  gain(numGainB, resourceB)
  gain(numGainC, resourceC)

  return {
    resourceALoss: resourceALoss,
    resourceBGain: resourceB,
    resourceCGain: resourceC
  }
}

//////// 1 (2) value, no direction
_.times(6, () => {
  cardArray.push({
    activation: `+1 ${gain(1)}`,
    activationValue: 1
  })
})
_.times(2, () => {
  const {resourceLost, resourceGained} = loseAndGain(1, 2)
  cardArray.push({
    activation: `-1 ${resourceLost}, +2 ${resourceGained}`,
    activationValue: 1
  })
})
_.times(2, () => {
  const {resourceLost, resourceGained} = loseAndGain(2, 3)
  cardArray.push({
    activation: `-2 ${resourceLost}, +3 ${resourceGained}`,
    activationValue: 1
  })
})

//////// 2 (4) value, no direction
_.times(6, () => {
  cardArray.push({
    activation: `+2 ${gain(2)}`,
    activationValue: 2
  })
})
_.times(2, () => {
  const {resourceLost, resourceGained} = loseAndGain(1, 3)
  cardArray.push({
    activation: `-1 ${resourceLost}, +3 ${resourceGained}`,
    activationValue: 2
  })
})
_.times(1, () => {
  const {resourceLost, resourceGained} = loseAndGain(2, 4)
  cardArray.push({
    activation: `-2 ${resourceLost}, +4 ${resourceGained}`,
    activationValue: 2
  })
})
_.times(1, () => {
  const {resourceALoss, resourceBGain, resourceCGain} = loseAndGainTwoTypes(2, 2, 2)
  cardArray.push({
    activation: `-2 ${resourceALoss}, +2 ${resourceBGain}, +2 ${resourceCGain}`,
    activationValue: 2
  })
})


//////////// 3 (6) value, no direction
_.times(6, () => {
  cardArray.push({
    activation: `+3 ${gain(3)}`,
    activationValue: 3
  })
})
_.times(1, () => {
  const {resourceLost, resourceGained} = loseAndGain(1, 4)
  cardArray.push({
    activation: `-1 ${resourceLost}, +4 ${resourceGained}`,
    activationValue: 3
  })
})
_.times(1, () => {
  const {resourceALoss, resourceBGain, resourceCGain} = loseAndGainTwoTypes(1, 2, 2)
  cardArray.push({
    activation: `-1 ${resourceALoss}, +2 ${resourceBGain}, +2 ${resourceCGain}`,
    activationValue: 3
  })
})
_.times(1, () => {
  const {resourceLost, resourceGained} = loseAndGain(2, 5)
  cardArray.push({
    activation: `-2 ${resourceLost}, +5 ${resourceGained}`,
    activationValue: 3
  })
})
_.times(1, () => {
  const {resourceALoss, resourceBGain, resourceCGain} = loseAndGainTwoTypes(2, 2, 3)
  cardArray.push({
    activation: `-2 ${resourceALoss}, +2 ${resourceBGain}, +3 ${resourceCGain}`,
    activationValue: 3
  })
})


////// 1 (2) value, with directions
_.times(10, () => {
  cardArray2.push({
    activation: `${arrowDirectionRoller.roll()}, -1 ${lose(1)}`,
    activationValue: 1
  })
})

////// 2 (4) value, with directions
_.times(10, () => {
  cardArray2.push({
    activation: `${arrowDirectionRoller.roll()}`,
    activationValue: 2
  })
})

////// 3 (6) value, with directions
_.times(5, () => {
  cardArray2.push({
    activation: `${arrowDirectionRoller.roll()}, ${arrowDirectionRoller.roll()}, -1 ${lose(1)}`,
    activationValue: 3
  })
})
_.times(5, () => {
  cardArray2.push({
    activation: `${arrowDirectionRoller.roll()}, +1 ${gain(1)}`,
    activationValue: 3
  })
})

// console.log(cardArray)
// console.log(cardArray2)

let placement6ValueRoller = new Brng({'4arrows': 4, '3arrows+1': 6}, {bias: 3})
const directionNotChosenRoller = new Brng({LEFT: 1, UP: 1, RIGHT: 1, DOWN: 1}, {bias: 3})

let placement4ValueRoller = new Brng({'2arrows_corner': 6, '2arrows_opp+1': 4}, {bias: 4})
const directionForCornerRoller = new Brng({LEFT: 1, UP: 1, RIGHT: 1, DOWN: 1}, {bias: 4})
const directionsForOpposite = ['LEFT', 'UP', 'RIGHT', 'DOWN', 'LEFT', 'UP', 'RIGHT', 'DOWN']
const oppositeDirections = {
  LEFT: 'RIGHT',
  UP: 'DOWN',
  RIGHT: 'LEFT',
  DOWN: 'UP'
}
const nextDirectionInCorner = {
  LEFT: 'UP',
  UP: 'RIGHT',
  RIGHT: 'DOWN',
  DOWN: 'LEFT'
}


_.forEach(cardArray, (obj) => {
  /////////// 6 value placement, with direction
  if (obj.activationValue === 1) {

    if (placement6ValueRoller.roll() === '4arrows') {
      obj.placement = 'LEFT, UP, RIGHT, DOWN'
    }
    else { // if placement6ValueRoller.roll() === '3arrows+1'
      const directionExcluded = directionNotChosenRoller.roll()
      const directionsChosen = _.pull(['LEFT', 'UP', 'RIGHT', 'DOWN'], directionExcluded)

      arrowDirectionRoller.roll(directionsChosen[0])
      arrowDirectionRoller.roll(directionsChosen[1])
      arrowDirectionRoller.roll(directionsChosen[2])

      obj.placement = `${directionsChosen.join(', ')}, +1 ${gain(1)}`
    }
  }

  /////////// 4 value placement, with direction
  if (obj.activationValue === 2) {
    if (placement4ValueRoller.roll() === '2arrows_corner') {
      const direction1 = directionForCornerRoller.roll()
      arrowDirectionRoller.roll(direction1)
      const direction2 = arrowDirectionRoller.roll(nextDirectionInCorner[direction1])
      obj.placement = `${direction1}, ${direction2}`

    }
    else { // if '2arrows_opp+1'
      const direction1 = arrowDirectionRoller.roll(directionsForOpposite.pop())
      const direction2 = arrowDirectionRoller.roll(oppositeDirections[direction1])
      obj.placement = `${direction1}, ${direction2}, +1 ${gain(1)}`
    }
  }

  /////////// 2 value placement, with direction
  if (obj.activationValue === 3) {
    obj.placement = `${arrowDirectionRoller.roll()}`
  }

})

//////////////////////////
/////// for cardArray2
///////////////////////

placement6ValueRoller = new Brng({'6resources': 5, '3and3': 5}, {bias: 3})
placement4ValueRoller = new Brng({'4resources': 5, '2and2': 5}, {bias: 3})

_.forEach(cardArray2, (obj) => {
  
  /////////// 6 value placement, no direction
  if (obj.activationValue === 1) {
    if (placement6ValueRoller.roll() === '6resources') {
      obj.placement = `+6 ${gain(6)}`
    }
    else { // 3and3
      const {resourceGainedA, resourceGainedB} = gain2Types(3, 3)
      obj.placement = `+3 ${resourceGainedA}, +3 ${resourceGainedB}`
    }
  }

  /////////// 4 value placement, no direction
  if (obj.activationValue === 2) {
    if (placement4ValueRoller.roll() === '4resources') {
      obj.placement = `+4 ${gain(4)}`
    }
    else { // 2and2
      const {resourceGainedA, resourceGainedB} = gain2Types(2, 2)
      obj.placement = `+2 ${resourceGainedA}, +2 ${resourceGainedB}`
    }
  }

  /////////// 2 value placement, no direction
  if (obj.activationValue === 3) {
    obj.placement = `+2 ${gain(2)}`
  }

})

console.log(cardArray)
console.log(cardArray2)


////////////////// for the character point cards //////////////
////////////////// for the character point cards //////////////
////////////////// for the character point cards //////////////

const pointCardsVarietyRoller = new Brng({
  A: 4,
  B: 4,
  C: 4,
  
}, {bias: 1})


function Cards () {
  return <div>hello world </div>
}

export default Cards

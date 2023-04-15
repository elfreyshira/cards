// 2023.02.18
import _ from 'lodash'

const SPOT = 'SPOT'
const HOME = 'HOME'
const TAP = 'TAP'

function generateCards () {

  const cards = []

  _.times(3, () => {
    cards.push({type: SPOT, value: _.random(200, 325)})
  })

  _.times(3, () => {
    cards.push({type: HOME, value: _.random(100, 200)})
  })

  _.times(3, () => {
    cards.push({type: TAP, value: _.random(100, 175)})
  })

  return _.shuffle(cards)

}

function costOf(cardObj) {
  if (cardObj.type === SPOT) {
    return (cardObj.value-100) * 1.5
  }
  else {
    return cardObj.value * 2
  }
}

let dataList = []

_.times(100, () => {
  const cards = generateCards()
  const spotValueSum = _.chain(cards).filter((cardObj) => cardObj.type === SPOT).sumBy('value').value()
  const homeValueSum = _.chain(cards).filter((cardObj) => cardObj.type === HOME).sumBy('value').value()
  const tapValueSum = _.chain(cards).filter((cardObj) => cardObj.type === TAP).sumBy('value').value()

  let spots = [100,100,100]
  let takenSpots = []

  const homes = []
  const taps = []

  let currentResources = 200

  let workersAvailable = 3

  let turnsTaken = 0

  while (cards.length > 0) {
    // do a single turn

    // build if able
    while (cards.length > 0 && currentResources >= costOf(cards[0])) {
      const newBuiltCard = cards.shift()
      currentResources -= costOf(newBuiltCard)

      if (newBuiltCard.type === SPOT) {
        spots.push(newBuiltCard.value)
      }
      else if (newBuiltCard.type === HOME) {
        homes.push(newBuiltCard.value)
      }
      else if (newBuiltCard.type === TAP) {
        taps.push(newBuiltCard.value)
        currentResources += newBuiltCard.value
      }
    }

    // move worker
    if (workersAvailable === 0) { // rest
      workersAvailable = 3
      spots = spots.concat(takenSpots)
      takenSpots = []
      currentResources += _.sum(homes) + _.sum(taps)

    }
    else { // move
      workersAvailable--
      spots = _.sortBy(spots, x=>-x)
      const spotVisited = spots.shift()
      takenSpots.push(spotVisited)
      currentResources += spotVisited
    }

    turnsTaken++

  }


  // console.log('-------------')
  // console.log(spotValueSum, homeValueSum, tapValueSum)

  const score = _.round((20-turnsTaken) + currentResources/1000, 2)

  // console.log('turnsTaken', turnsTaken)
  // console.log('currentResources', currentResources)

  const dataObj = {
    score,
    spotValueSum, homeValueSum, tapValueSum
  }
  dataList.push(dataObj)


})

dataList = _.chain(dataList).sortBy('spotValueSum').map((obj, idx)=>{obj.spotRank = idx+1; delete obj.spotValueSum; return obj}).value()

dataList = _.chain(dataList).sortBy('homeValueSum').map((obj, idx)=>{obj.homeRank = idx+1; delete obj.homeValueSum; return obj}).value()

dataList = _.chain(dataList).sortBy('tapValueSum').map((obj, idx)=>{obj.tapRank = idx+1; delete obj.tapValueSum; return obj}).value()

dataList = _.sortBy(dataList, x=>-x.score)

let spotRankWeightedSum = 0
let homeRankWeightedSum = 0
let tapRankWeightedSum = 0
let denominator = 0

_.forEach(dataList, (obj, idx) => {
  const weight = (dataList.length - idx)

  spotRankWeightedSum += (obj.spotRank * weight)
  homeRankWeightedSum += (obj.homeRank * weight)
  tapRankWeightedSum += (obj.tapRank * weight)
  denominator += weight
})

console.log('dataList')
console.log(dataList)

console.log('spot', spotRankWeightedSum/denominator)
console.log('home', homeRankWeightedSum/denominator)
console.log('tap', tapRankWeightedSum/denominator)


global.generateCards = generateCards

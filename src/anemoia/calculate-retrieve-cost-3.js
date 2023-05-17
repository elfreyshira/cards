import _ from 'lodash'

/*
spots = [300, 200, 100]
homes = [200, 150, 100]
taps = [200, 150, 100]
retrieveLevel = 1 (2, 3, 4)
*/

function getCorrectSpot (spots, maxRetrieveSpotValue) {
  return _.max(_.filter(spots, (x)=>x <= maxRetrieveSpotValue))
}

function calculateRetrieveCost ({spots = [0], homes = [0], taps = [0], maxRetrieveSpotValue = 100}) {

  const allSpots = _.sortBy(spots.concat([100,100,100]), (val) => 0-val).slice(0,3)
  homes = _.sortBy(homes.concat([0,0,0]), (val) => 0-val).slice(0,3)
  taps = _.sortBy(taps.concat([0,0,0]), (val) => 0-val).slice(0,3)

  const avgValuePerTurn = (_.sum(allSpots) + _.sum(homes) + _.sum(taps)) / 4

  const totalRetrieveValue = _.sum(allSpots)
    + (getCorrectSpot(allSpots, maxRetrieveSpotValue) + _.max(homes))
    + _.sum(homes)
    + _.sum(taps)
    - (avgValuePerTurn * (5))

  return totalRetrieveValue
}

const listOfSpotsCombinations =[
  [100,100,100],
  [100,100,200],
  [100,100,270],
  [100,100,325],
  [100,200,200],
  [100,200,270],
  [100,200,325],
  [100,270,270],
  [100,270,325],
  [100,325,325],
  [200,200,200],
  [200,200,270],
  [200,200,325],
  [200,270,270],
  [200,270,325],
  [200,325,325],
  [270,270,270],
  [270,270,325],
  [270,325,325],
  [325,325,325]
]

// const homes = [100]
// const taps = [100]
// const config = {homes: [200, 100], taps: []}
// const config = {homes: [], taps: [200, 100]}
const config = {homes: [200, 100], taps: [200, 100]}
_.forEach(listOfSpotsCombinations, (spots, idx) => {
  console.log('100_'+idx, calculateRetrieveCost(_.merge(config, {spots, maxRetrieveSpotValue: 100})))
})
_.forEach(listOfSpotsCombinations, (spots, idx) => {
  console.log('200_'+idx, calculateRetrieveCost(_.merge(config, {spots, maxRetrieveSpotValue: 200})))
})
_.forEach(listOfSpotsCombinations, (spots, idx) => {
  console.log('270_'+idx, calculateRetrieveCost(_.merge(config, {spots, maxRetrieveSpotValue: 270})))
})
_.forEach(listOfSpotsCombinations, (spots, idx) => {
  console.log('325_'+idx, calculateRetrieveCost(_.merge(config, {spots, maxRetrieveSpotValue: 325})))
})

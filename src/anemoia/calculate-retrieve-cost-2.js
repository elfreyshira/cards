// 2023.02.06
import _ from 'lodash'

/*
spots = [300, 200, 100]
homes = [200, 150, 100]
taps = [200, 150, 100]
retrieveCount = 2
*/

function calculateRetrieveCost ({spots = [0], homes = [0], taps = [0], retrieveCount = 1}) {

  const allSpots = _.sortBy(spots.concat([100,100,100]), (val) => 0-val).slice(0,3)
  homes = _.sortBy(homes.concat([0,0,0]), (val) => 0-val).slice(0,3)
  taps = _.sortBy(taps.concat([0,0,0]), (val) => 0-val).slice(0,3)

  const avgValuePerTurn = (_.sum(allSpots) + _.sum(homes) + _.sum(taps)) / 4

  const totalRetrieveValue = _.sum(allSpots)
    + ((_.max(allSpots) + _.max(homes)) * retrieveCount)
    + _.sum(homes)
    + _.sum(taps)
    - (avgValuePerTurn * (4+retrieveCount))

  const avgRetrieveValue = totalRetrieveValue / retrieveCount

  return avgRetrieveValue
}

// value of 100 - 1400


function doWithMax(maxTotalValue) {
  // const maxTotalValue = 100

  const arrayOfAvgRetrieveCost = []
  _.times(1000, () => {
    let currentTotalValue = 0
    const [spots, homes, taps] = [[], [], []]
    while (currentTotalValue < maxTotalValue) {
      
      const cardType = _.sample(['spot','home','tap'])

      if (cardType === 'spot') {
        const newSpot = _.random(100, 225)
        currentTotalValue += newSpot
        spots.push(newSpot + 100)
      }
      else if (cardType === 'home') {
        const newHome = _.random(100, 225)
        currentTotalValue += newHome
        homes.push(newHome)
      }
      else if (cardType === 'tap') {
        const newTap = _.random(100, 200)
        currentTotalValue += newTap
        taps.push(newTap)
      }
    }
    // console.log(spots, homes, taps)
    arrayOfAvgRetrieveCost.push(calculateRetrieveCost({spots, homes, taps}))
  })
  console.log(_.mean(arrayOfAvgRetrieveCost))
}

_.times(30, (idx) => {
  console.log(idx*60)
  doWithMax(idx*60)
  console.log('--------------')
})


window.calculateRetrieveCost = calculateRetrieveCost
window.doWithMax = doWithMax

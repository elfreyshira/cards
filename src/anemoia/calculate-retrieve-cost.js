import _ from 'lodash'

const setup = {
  home: [100],
  tap: [100],
  normalSpots: [100, 200],
  retrieveSpot: 300
}

function calculateRetrieveCost ({home=[0], tap=[0], normalSpots, retrieveSpot}) {
  const avgValue = (_.sum(normalSpots) + retrieveSpot + _.sum(home) + _.sum(tap))/4

  const X_value = avgValue*5
    - _.max(normalSpots)*2 // 1st placement, 3rd placement
    - _.min(normalSpots) // 4th placement
    - _.sum(home) // from resting
    - _.sum(tap) // from resting
    - _.max(home) // 2nd placement retrieving

  const retrieveCost = retrieveSpot - X_value

  return retrieveCost
}


const defaultSetup = {home: [300, 200, 100], tap: [300, 200, 100]}
// const defaultSetup = {}

const setupArray = [
  {normalSpots: [100, 100], retrieveSpot: 100},
  
  {normalSpots: [100, 200], retrieveSpot: 100},
  {normalSpots: [100, 100], retrieveSpot: 200},
  
  {normalSpots: [100, 300], retrieveSpot: 100},
  {normalSpots: [100, 100], retrieveSpot: 300},
  
  {normalSpots: [200, 200], retrieveSpot: 100},
  {normalSpots: [100, 200], retrieveSpot: 200},

  {normalSpots: [200, 300], retrieveSpot: 100},
  {normalSpots: [100, 300], retrieveSpot: 200},
  {normalSpots: [100, 200], retrieveSpot: 300},

  {normalSpots: [300, 300], retrieveSpot: 100},
  {normalSpots: [100, 300], retrieveSpot: 300},

  {normalSpots: [200, 200], retrieveSpot: 200},

  {normalSpots: [200, 300], retrieveSpot: 200},
  {normalSpots: [200, 200], retrieveSpot: 300},

  {normalSpots: [300, 300], retrieveSpot: 200},
  {normalSpots: [200, 300], retrieveSpot: 300},

  {normalSpots: [300, 300], retrieveSpot: 300},
]


_.forEach(setupArray, (obj, idx) => {
  console.log(idx, 'retrieveCost', calculateRetrieveCost(_.merge(obj, defaultSetup)))
})

////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////

const setupForChain = {
  home: [100],
  tap: [100],

  normalSpots: [100, 200],
  chainSpot: 300,
  chainTo: 100
}


const defaultChainSetup = {home: [300, 200, 100], tap: [300, 200, 100]}
const setupChainArray = [
  {normalSpots: [100, 100], chainSpot: 100, chainTo: 100},
  
  {normalSpots: [100, 200], chainSpot: 100, chainTo: 100},
  {normalSpots: [100, 100], chainSpot: 200, chainTo: 100},
  
  {normalSpots: [100, 300], chainSpot: 100, chainTo: 100},
  {normalSpots: [100, 100], chainSpot: 300, chainTo: 100},
  
  // {normalSpots: [200, 200], chainSpot: 100}, // not possible
  {normalSpots: [100, 200], chainSpot: 200, chainTo: 100},
  {normalSpots: [100, 200], chainSpot: 200, chainTo: 200},

  // {normalSpots: [200, 300], chainSpot: 100}, // not possible
  {normalSpots: [100, 300], chainSpot: 200, chainTo: 100},
  {normalSpots: [100, 200], chainSpot: 300, chainTo: 100},
  {normalSpots: [100, 200], chainSpot: 300, chainTo: 200},

  // {normalSpots: [300, 300], chainSpot: 100}, // not possible
  {normalSpots: [100, 300], chainSpot: 300, chainTo: 100},

  {normalSpots: [200, 200], chainSpot: 200, chainTo: 200},

  {normalSpots: [200, 300], chainSpot: 200, chainTo: 200},
  {normalSpots: [200, 200], chainSpot: 300, chainTo: 200},

  // {normalSpots: [300, 300], chainSpot: 200}, // not possible
  {normalSpots: [200, 300], chainSpot: 300, chainTo: 200},

  // {normalSpots: [300, 300], chainSpot: 300}, // not possible
]

function calculateChainCost ({home=[0], tap=[0], normalSpots, chainSpot, chainTo}) {
  const avgValue = (_.sum(normalSpots) + chainSpot + _.sum(home) + _.sum(tap)) / 4

  const leftOverSpot = [].concat(normalSpots)
    .splice(_.findIndex(normalSpots, (spot) => spot!==chainTo), 1)[0]

  const X_value = avgValue*3
    - _.sum(home) // from resting
    - _.sum(tap) // from resting
    - chainTo // 2nd placement (triggered by 1st placement)
    - leftOverSpot // 3rd placement

  const chainCost = chainSpot - X_value
  return chainCost
}

_.forEach(setupChainArray, (obj, idx) => {
  console.log(idx, 'chainCost', calculateChainCost(_.merge(obj, defaultChainSetup)))
})

window.calculateRetrieveCost = calculateRetrieveCost

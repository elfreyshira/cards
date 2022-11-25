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


const defaultSetup = {home: [300, 200, 100], tap: []}
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


// _.forEach(setupArray, (obj, idx) => {
//   console.log(idx, 'retrieveCost', calculateRetrieveCost(_.merge(obj, defaultSetup)))
// })

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
const setupChainArray_OLD = [
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


function calculateChainCost_OLD ({home=[0], tap=[0], normalSpots, chainSpot, chainTo}) {
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

// _.forEach(setupChainArray_OLD, (obj, idx) => {
//   console.log(idx, 'chainCost', calculateChainCost_OLD(_.merge(obj, defaultChainSetup)))
// })

/////////////////////////////////
/////////////////////////////////

const baseLevel1Spots = [100, 100, 100, 100]
const setupChainArray = [
  {builtSpots: [200], chainSpot: 200, chainTo: 100},

  {builtSpots: [300], chainSpot: 300, chainTo: 100},

  {builtSpots: [200, 200], chainSpot: 200, chainTo: 200},
  {builtSpots: [200, 200], chainSpot: 200, chainTo: 100},

  {builtSpots: [200, 300], chainSpot: 300, chainTo: 200},
  {builtSpots: [200, 300], chainSpot: 300, chainTo: 100},
  {builtSpots: [200, 300], chainSpot: 200, chainTo: 100},

  {builtSpots: [300, 300], chainSpot: 300, chainTo: 300},
  {builtSpots: [300, 300], chainSpot: 300, chainTo: 100},

  {builtSpots: [200, 200, 200], chainSpot: 200, chainTo: 100},
  {builtSpots: [200, 200, 200], chainSpot: 200, chainTo: 200},

  {builtSpots: [200, 200, 300], chainSpot: 300, chainTo: 100},
  {builtSpots: [200, 200, 300], chainSpot: 300, chainTo: 200},
  {builtSpots: [200, 200, 300], chainSpot: 200, chainTo: 200},
  {builtSpots: [200, 200, 300], chainSpot: 200, chainTo: 100},

  {builtSpots: [200, 300, 300], chainSpot: 300, chainTo: 100},
  {builtSpots: [200, 300, 300], chainSpot: 300, chainTo: 200},
  {builtSpots: [200, 300, 300], chainSpot: 300, chainTo: 300},
  {builtSpots: [200, 300, 300], chainSpot: 200, chainTo: 100},

  {builtSpots: [300, 300, 300], chainSpot: 300, chainTo: 100},
  {builtSpots: [300, 300, 300], chainSpot: 300, chainTo: 300},

  {builtSpots: [200, 200, 200, 200], chainSpot: 200, chainTo: 200},
  {builtSpots: [200, 200, 200, 200], chainSpot: 200, chainTo: 100},

  {builtSpots: [200, 200, 200, 300], chainSpot: 300, chainTo: 100},
  {builtSpots: [200, 200, 200, 300], chainSpot: 300, chainTo: 200},
  {builtSpots: [200, 200, 200, 300], chainSpot: 200, chainTo: 200},
  {builtSpots: [200, 200, 200, 300], chainSpot: 200, chainTo: 100},

  {builtSpots: [200, 200, 300, 300], chainSpot: 300, chainTo: 100},
  {builtSpots: [200, 200, 300, 300], chainSpot: 300, chainTo: 200},
  {builtSpots: [200, 200, 300, 300], chainSpot: 300, chainTo: 300},
  {builtSpots: [200, 200, 300, 300], chainSpot: 200, chainTo: 200},
  {builtSpots: [200, 200, 300, 300], chainSpot: 200, chainTo: 100},


  {builtSpots: [200, 300, 300, 300], chainSpot: 300, chainTo: 100},
  {builtSpots: [200, 300, 300, 300], chainSpot: 300, chainTo: 200},
  {builtSpots: [200, 300, 300, 300], chainSpot: 300, chainTo: 300},

  {builtSpots: [300, 300, 300, 300], chainSpot: 300, chainTo: 100},
  {builtSpots: [300, 300, 300, 300], chainSpot: 300, chainTo: 300},
]

function descSortFunc (val) {
  return 300 - val
}


function calculateChainCost ({builtSpots, chainSpot, chainTo}) {

  const builtSpotsCombined = _.cloneDeep(builtSpots).concat(baseLevel1Spots)

  const avgValue = _.sum(_.sortBy(builtSpotsCombined, descSortFunc).slice(0,3)) / 4


  const idxChainSpot = builtSpotsCombined.findIndex(val => val === chainSpot)
  builtSpotsCombined.splice(idxChainSpot, 1)

  const idxChainTo = builtSpotsCombined.findIndex(val => val === chainTo)
  builtSpotsCombined.splice(idxChainTo, 1)

  const xValue = avgValue * 4
    - chainTo
    - _.sum(_.sortBy(builtSpotsCombined, descSortFunc).slice(0,2))

  const chainCost = chainSpot - xValue
  return chainCost
}

_.forEach(setupChainArray, (obj, idx) => {
  // console.log(idx, obj, 'chainCost', calculateChainCost(obj))
  console.log(idx, calculateChainCost(obj))
})

window.calculateRetrieveCost = calculateRetrieveCost
window.calculateChainCost = calculateChainCost

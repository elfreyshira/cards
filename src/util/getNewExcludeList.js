import _ from 'lodash'

// const log = console.log
const log = _.noop

function getNewExcludeList (
  currentResourceMap = {}, // // {resource1: quantity, resource2: quantity, ...}
  {
    // limitsMap = {}, // {resource1: max_quantity, ...}
    groupingMaxVariety = [], // [{resourceList: [rsc1, rsc2, ...], max: NUMBER}, ...]
    groupingMaxQuantity = [], // [{resourceList: [rsc1, rsc2, ... ], max: NUMBER}, ...]
    


    // excludesMap = {}, // {resource1: [resource2, ...], ...}
    // includeList = [], // [resource1, resource2, ...]
    // maxDifferentResources = 3,
  }
) {

  log('currentResourceMap', currentResourceMap)
  let excludeList = []
  const currentResourceKeys = _.keys(currentResourceMap)

  // _.forEach(currentResourceMap, (resourceQuantity, resourceKey) => {
    
  //   // excludeList = excludeList.concat(excludesMap[resourceKey])

  //   if (_.isNumber(limitsMap[resourceKey]) && resourceQuantity >= limitsMap[resourceKey]) {
  //     excludeList.push(resourceKey)
  //   }

  // })

  if (!_.isEmpty(groupingMaxVariety)) {
    _.forEach(groupingMaxVariety, (groupingObj) => {

      log('groupingObj', groupingObj)
      
      let totalVariety = 0
      _.forEach(groupingObj.resourceList, (resource) => {
        if (currentResourceMap[resource] > 0) {
          totalVariety += 1
        }
      })

      log('totalVariety', totalVariety)
      if (totalVariety >= groupingObj.max) {
        log('exclude')
        log(groupingObj.resourceList, currentResourceKeys, _.difference(groupingObj.resourceList, currentResourceKeys))
        excludeList = _.concat(excludeList, _.difference(groupingObj.resourceList, currentResourceKeys))
      }
      
    })
  }

  if (!_.isEmpty(groupingMaxQuantity)) {
    _.forEach(groupingMaxQuantity, (groupingObj) => {
      
      let totalQuantity = 0
      _.forEach(groupingObj.resourceList, (resource) => {
        if (_.isNumber(currentResourceMap[resource])) {
          totalQuantity += currentResourceMap[resource]
        }
      })

      if (totalQuantity >= groupingObj.max) {
        excludeList = _.concat(excludeList, groupingObj.resourceList)
      }
      
    })
  }
  

  // if (_.size(currentResourceMap) >= maxDifferentResources) {
  //   excludeList = excludeList.concat(
  //     _.without(includeList, ..._.keys(currentResourceMap))
  //   )
  // }

  return _.uniq(excludeList)
}





// const newExcludeList = getNewExcludeList(
//   {
//     fire: 1,
//     // earth: 0,
//     water: 2,

//     // fireDiscount: 2,
//     // earthDiscount: 0,
//     // waterDiscount: 0,

//   },
//   {
//     groupingMaxVariety: [
//       {resourceList: [
//         'fire', 'earth', 'water', 'fireDiscount', 'earthDiscount', 'waterDiscount',
//         'wild', 'draw'
//       ], max: 3},
//       {resourceList: ['fire', 'earth', 'water'], max: 2},
//       {resourceList: ['fireDiscount', 'earthDiscount', 'waterDiscount'], max: 2},
//       {resourceList: ['fireDelay', 'earthDelay', 'waterDelay'], max: 1},
//       // {resourceList: ['earth', 'earthDiscount'], max: 1},
//       // {resourceList: ['water', 'waterDiscount'], max: 1},
//     ]
//   }
// )

// log(newExcludeList)

export default getNewExcludeList

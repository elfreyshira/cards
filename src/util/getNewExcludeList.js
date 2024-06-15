import _ from 'lodash'

// const log = console.log
const log = _.noop

function getNewExcludeList (
  currentResourceMap = {}, // // {resource1: quantity, resource2: quantity, ...}
  {
    groupingMaxVariety = [], // [{resourceList: [rsc1, rsc2, ...], max: NUMBER}, ...]
    groupingMaxQuantity = [], // [{resourceList: [rsc1, rsc2, ... ], max: NUMBER}, ...]
  }
) {

  // log('currentResourceMap', currentResourceMap)
  let excludeList = []

  if (!_.isEmpty(groupingMaxVariety)) {
    _.forEach(groupingMaxVariety, (groupingObj) => {
      let currentResourceKeys = _.keys(currentResourceMap)

      // log('groupingObj', groupingObj)
      
      let totalVariety = 0
      _.forEach(groupingObj.resourceList, (resourceObj) => {
        if (_.isArray(resourceObj)) {
          let temporaryArrayVariety = 0
          _.forEach(resourceObj, (resourceKey) => {
            if (currentResourceMap[resourceKey] > 0) {
              temporaryArrayVariety += 1
            }
          })
          if (temporaryArrayVariety > 0) {
            currentResourceKeys = _.uniq(_.concat(currentResourceKeys, resourceObj))
            totalVariety += 1
          }
        }
        else {
          if (currentResourceMap[resourceObj] > 0) {
            totalVariety += 1
          }
        }
      })

      // log('totalVariety', totalVariety)
      if (totalVariety >= groupingObj.max) {
        const flattenedResourceList = _.flatten(groupingObj.resourceList)
        
        // log('exclude')
        // log(groupingObj.resourceList, currentResourceKeys, _.difference(flattenedResourceList, currentResourceKeys))

        excludeList = _.concat(excludeList, _.difference(flattenedResourceList, currentResourceKeys))
      }
      
    })
  }

  if (!_.isEmpty(groupingMaxQuantity)) {
    _.forEach(groupingMaxQuantity, (groupingObj, index) => {
      log('index = ', index)
      log('groupingMaxQuantity', groupingMaxQuantity)
      log('groupingObj', groupingObj)
      
      let totalQuantity = 0
      _.forEach(groupingObj.resourceList, (resource) => {
        if (_.isNumber(currentResourceMap[resource])) {
          totalQuantity += currentResourceMap[resource]
        }
      })

      log('totalQuantity', totalQuantity)

      if (totalQuantity >= groupingObj.max) {
        excludeList = _.concat(excludeList, groupingObj.resourceList)
      }
      
    })
  }

  log('!!!!!!!!! excludeList', _.uniq(excludeList))
  return _.uniq(excludeList)
}





// const newExcludeList = getNewExcludeList(
//   {
//     // fire: 1,
//     // earth: 0,
//     // water: 2,

//     fireDiscount: 1,
//     // earthDiscount: 0,
//     // waterDiscount: 0,

//     // fireProduce: 0,
//     earthProduce: 1,
//     // waterProduce: 1,

//   },
//   {
//     groupingMaxVariety: [
//       // {resourceList: [
//       //   'fire', 'earth', 'water', 'fireDiscount', 'earthDiscount', 'waterDiscount',
//       //   'wild', 'draw'
//       // ], max: 3},
//       // {resourceList: ['fire', 'earth', 'water'], max: 2},
//       // {resourceList: ['fireDiscount', 'earthDiscount', 'waterDiscount'], max: 2},
//       // {resourceList: ['fireDelay', 'earthDelay', 'waterDelay'], max: 1},
//       {resourceList: [
//         ['fireDiscount', 'fireProduce'],
//         ['earthDiscount', 'earthProduce'],
//         ['waterDiscount', 'waterProduce'],
//       ], max: 1},
//       // {resourceList: ['earth', 'earthDiscount'], max: 1},
//       // {resourceList: ['water', 'waterDiscount'], max: 1},
//     ]
//   }
// )
// log(newExcludeList)

export default getNewExcludeList

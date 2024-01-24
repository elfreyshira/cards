import _ from 'lodash'

function getNewExcludeList ({
  defaultLimit = 1,
  limitsMap = {}, // {resource1: max_quantity, ...}
  excludesMap = {}, // {resource1: [resource2, ...], ...}
  includeList = [], // [resource1, resource2, ...]
  maxDifferentResources = 3,

  currentResourceMap = {}, // {resource1: quantity, resource2: quantity, ...}
}) {
  let excludeList = []

  _.forEach(currentResourceMap, (resourceQuantity, resourceKey) => {
    excludeList = excludeList.concat(excludesMap[resourceKey])
    if (resourceQuantity >= (limitsMap[resourceKey] || defaultLimit) ) {
      excludeList.push(resourceKey)
    }
  })

  if (_.size(currentResourceMap) >= maxDifferentResources) {
    excludeList = excludeList.concat(
      _.without(includeList, ..._.keys(currentResourceMap))
    )
  }

  return _.uniq(excludeList)
}





// const newExcludeList = getNewExcludeList({
//   limitsMap: {
//     apple: 2, orange: 3, mango: 1,
//     dog: 2, cat: 1, cow: 4, moose: 3, snake: 2
//   },
//   excludesMap: {
//     apple:  ['dog','cat','cow','moose','snake'],
//     orange: ['dog','cat','cow','moose','snake'],
//     mango: ['dog','cat','cow','moose','snake'],

//     dog: ['apple', 'orange', 'mango'],
//     cat: ['apple', 'orange', 'mango'],
//     cow: ['apple', 'orange', 'mango'],
//     moose: ['apple', 'orange', 'mango'],
//     snake: ['apple', 'orange', 'mango'],
//   },

//   includeList: ['dog','cat','cow','moose','snake'],
//   maxDifferentResources: 3,
//   currentResourceMap: {
//     dog: 1,
//     cat: 1,
//     cow: 4,
//     // dog: 2,
//     // cat: 1,
//   }
// })

// console.log(newExcludeList)

export default getNewExcludeList

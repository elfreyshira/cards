import _ from 'lodash'


// returns all resources that are less than remainingValue
function getAvailableResources (resourceMapping, remainingValue, valueSlack = 0, cardObj = {}) {
  return _.keys(
    _.pickBy(resourceMapping, (resourceValue, resourceKey) => {
      let tempResourceValue = resourceValue
      if (_.isFunction(resourceValue)) {
        tempResourceValue = resourceValue(cardObj)
      }

      return tempResourceValue <= (remainingValue + valueSlack)
    })
  )
}

export default getAvailableResources

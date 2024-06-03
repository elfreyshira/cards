import _ from 'lodash'


// returns all resources that are less than remainingValue
function getAvailableResources (resourceMapping, remainingValue, valueSlack = 0, cardObj = {}) {
  return _.keys(
    _.pickBy(resourceMapping, (resourceValue, resourceKey) => {
      return resourceValue <= (remainingValue + valueSlack)
    })
  )
}

export default getAvailableResources

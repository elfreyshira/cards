import _ from 'lodash'

export default function countOccurences (cardsArray, key, resources) {
  let countTotal = 0
  _.forEach(
    cardsArray, obj => {
      const resourcesToCount = _.pick(obj[key], resources)
      countTotal += _.sum(_.values(resourcesToCount))
      return resourcesToCount
    }
  )
  console.log(key, JSON.stringify(resources), countTotal)
  return countTotal
}

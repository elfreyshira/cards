import _ from 'lodash'


export default function checkSimilarity(cardsArray, newCardObj) {
  let highestSimilarityRatio = 0
  let mostSimilarCardObj = {}

  _.forEach(cardsArray, (prevCardObj) => {
    let comparisonSpace = 0
    let similarityPoints = 0


    const sameGainResources = _.intersection(
      _.keys(prevCardObj.gain),
      _.keys(newCardObj.gain)
    )

    // whether the resources gained are the same
    comparisonSpace += _.max([_.keys(prevCardObj.gain).length, _.keys(newCardObj.gain).length])
    similarityPoints += sameGainResources.length

    // amount of resources gained
    _.forEach(sameGainResources, (resourceGained) => {
      comparisonSpace += 1.5
      if (prevCardObj.gain[resourceGained] === newCardObj.gain[resourceGained]) {
        similarityPoints += 1.5
      }
    })
    
    // to check if they have the same exact resources involved
    comparisonSpace += 2
    if (
      _.keys(prevCardObj.gain).length === sameGainResources.length
      && _.keys(newCardObj.gain).length === sameGainResources.length 
    ) {
      similarityPoints += 2
    }

    // for loss comparison
    comparisonSpace += 2
    const bothHasLoss = !_.isEmpty(prevCardObj.loss) && !_.isEmpty(newCardObj.loss)
    if (bothHasLoss && (_.keys(prevCardObj.loss)[0] === _.keys(newCardObj.loss)[0])) {
      similarityPoints += 2
    }
    const bothHasOnlyGains = _.isEmpty(prevCardObj.loss) && _.isEmpty(newCardObj.loss)
    if (bothHasOnlyGains) {
      similarityPoints += 2
    }

    // for type comparison
    comparisonSpace += 3
    if (prevCardObj.type === newCardObj.type) {
      similarityPoints += 3
    }

    // points comparison
    comparisonSpace += 1
    if (prevCardObj.points === newCardObj.points) {
      similarityPoints += 1
    }

    // maxValue comparison
    comparisonSpace += 1
    similarityPoints += 1 - (Math.abs(prevCardObj.maxValue - newCardObj.maxValue) / 200)

    // RESOURCE COST COMPARISON (only done if there's already resources assigned)
    if (_.has(newCardObj, 'resourceCost')) {

      const sameResourceCostArray = _.intersection(
        _.keys(prevCardObj.resourceCost),
        _.keys(newCardObj.resourceCost)
      )

      comparisonSpace += _.max([
        _.keys(prevCardObj.resourceCost).length, _.keys(newCardObj.resourceCost).length
      ])/2
      similarityPoints += sameResourceCostArray.length/2

      _.forEach(sameResourceCostArray, (resourceKey) => {
        comparisonSpace += 0.5
        if (prevCardObj.resourceCost[resourceKey] === newCardObj.resourceCost[resourceKey]) {
          similarityPoints += 0.5
        }
      })

      comparisonSpace += 1
      if (
        _.keys(prevCardObj.resourceCost).length === sameResourceCostArray.length
        && _.keys(newCardObj.resourceCost).length === sameResourceCostArray.length 
      ) {
        similarityPoints += 1
      }

    }

    // console.log(similarityPoints/comparisonSpace)
    // if (_.has(newCardObj, 'resourceCost') &&  similarityPoints/comparisonSpace >= 0.85) {
    //   console.log(prevCardObj, newCardObj, similarityPoints, comparisonSpace)
    // }

    // returns a ratio between 0-1
    // console.log(similarityPoints, comparisonSpace)
    const similarityRatio = similarityPoints/comparisonSpace
    if (similarityRatio > highestSimilarityRatio) {
      mostSimilarCardObj = prevCardObj
      highestSimilarityRatio = similarityRatio
    }
  })

  return {similarityRatio: highestSimilarityRatio, mostSimilarCardObj}

}
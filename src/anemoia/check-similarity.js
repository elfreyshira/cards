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

    comparisonSpace += _.max([_.keys(prevCardObj.gain).length, _.keys(newCardObj.gain).length])
    similarityPoints += sameGainResources.length

    // check how many of their resources gains intersect
    _.forEach(sameGainResources, (resourceGained) => {
      comparisonSpace += 1.5
      if (prevCardObj.gain[resourceGained] === newCardObj.gain[resourceGained]) {
        similarityPoints += 1.5
      }
    })
    
    // to check if they have the same exact resources
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

    // console.log(similarityPoints/comparisonSpace)
    if (similarityPoints/comparisonSpace >= 0.8) {
      // console.log(prevCardObj, newCardObj, similarityPoints, comparisonSpace)
    }

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

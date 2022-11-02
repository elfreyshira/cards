import _ from 'lodash'


export default function checkSimilarity(cardsArray, newCardObj) {
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

    if (similarityPoints/comparisonSpace >= 0.80) {
      console.log(prevCardObj, newCardObj, similarityPoints, comparisonSpace)
    }

    // returns a ratio between 0-1
    return similarityPoints/comparisonSpace
  })

}

function checkSimilarity2(cardsArray, newCardObj) {
  _.forEach(cardsArray, (prevCardObj) => {
    let similarityPoints = 0

    const bothHasLoss = !_.isEmpty(prevCardObj.loss) && !_.isEmpty(newCardObj.loss)
    if (bothHasLoss) {
      similarityPoints += 1
    }
    if (bothHasLoss && (_.keys(prevCardObj.loss)[0] === _.keys(newCardObj.loss)[0])) {
      similarityPoints += 2
    }

    const bothHasOnlyGains = _.isEmpty(prevCardObj.loss) && _.isEmpty(newCardObj.loss)
    if (bothHasOnlyGains) {
      similarityPoints += 1
    }

    if (prevCardObj.type === newCardObj.type) {
      similarityPoints += 2
    }

    const sameGainResources = _.intersection(
      _.keys(prevCardObj.gain),
      _.keys(newCardObj.gain)
    )
    similarityPoints += sameGainResources.length

    if (
      _.keys(prevCardObj.gain).length === sameGainResources.length
      && _.keys(newCardObj.gain).length === sameGainResources.length 
    ) {
      similarityPoints += 3
    }

    _.forEach(sameGainResources, (resourceGained) => {
      if (prevCardObj.gain[resourceGained] === newCardObj.gain[resourceGained]) {
        similarityPoints += 1.5
      }
    })

    if (prevCardObj.maxValue === newCardObj.maxValue) {
      similarityPoints += 1
    }

    if (similarityPoints >= 11) {
      console.log(prevCardObj, newCardObj, similarityPoints)
    }
    // console.log(similarityPoints)
    // const similarityArray = [
    //   prevCardObj.type === newCardObj.type,
    //   prevCardObj.totalCostValue === newCardObj.totalCostValue,
    //   prevCardObj.pointsOnCard === newCardObj.pointsOnCard,
    // ]

  })
}

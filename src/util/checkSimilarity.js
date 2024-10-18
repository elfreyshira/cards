import _ from 'lodash'

function compareObj({currentObj, prevObj, settings, similarityPoints = 0, comparisonSpace = 0}) {
  let smyPts = similarityPoints
  let compSpce = comparisonSpace

  _.forEach(settings, (value, key) => {
    if (_.isArray(value)) {

      const multiplier = value[0] || 1
      const ceiling = value[1] || 3
      const valueType = value[2] || Number

      if (!_.has(currentObj, key) && !_.has(prevObj, key)) {
        // do nothing
      }
      else if (valueType === Number) {
        smyPts += multiplier - (
          (_.clamp(
            Math.abs( (currentObj[key] || 0) - (prevObj[key] || 0) ),
            ceiling
          )/ ceiling)
        ) * multiplier

        compSpce += multiplier
      }
      else { // String
        smyPts += (currentObj[key] === prevObj[key] ? multiplier : 0)
        compSpce += multiplier
      }

    }
    else if (_.isObject(value)) {
      const similarityResults = compareObj({
        currentObj: currentObj[key],
        prevObj: prevObj[key],
        settings: value,
        // similarityPoints: smyPts,
        // comparisonSpace: compSpce,
      })

      smyPts += similarityResults[0]
      compSpce += similarityResults[1]
    }
  })

  return [smyPts, compSpce]
}

function checkSimilarity(cardsArray, currentObj = {}, settings = {}) {

  let highestSimilarityRatio = 0
  // let mostSimilarCardObj = {}

  _.forEach(cardsArray, (prevObj) => {
    
    const [similarityPoints, comparisonSpace] = compareObj({currentObj, prevObj, settings})
    const similarityRatio = similarityPoints / (comparisonSpace||1)
    
    if (similarityRatio > highestSimilarityRatio) {
      // mostSimilarCardObj = prevObj
      highestSimilarityRatio = similarityRatio
    }
  })

  return highestSimilarityRatio
}

export default checkSimilarity

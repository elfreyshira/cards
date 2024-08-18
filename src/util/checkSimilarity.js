import _ from 'lodash'

const cardObjSettings = {
  cost: [1, 3], // multiplier = 1, max diff = 3, type = Number, 
  type: [2, 1, String],
  size: [1, 2],
  shapeID: [2, 1, String],
  gain: {
    money: [2, 3],
    point: [2, 3],
    trash: [2, 1],
    bonus: [1, 1],
  }
}

function compareObj({currentObj, prevObj, settings, diff = 0, max = 0}) {
  let tempDiff = diff
  let tempMax = max

  _.forEach(settings, (value, key) => {
    if (_.isArray(value)) {

      const multiplier = value[0] || 1
      const ceiling = value[1] || 3
      const valueType = value[2] || Number


      if (valueType === Number) {
        tempDiff += (_.clamp(
          Math.abs( (currentObj[key] || 0) - (prevObj[key] || 0) ),
          ceiling
        )/ ceiling)
        * multiplier

        tempMax += multiplier
      }
      else { // String
        tempDiff += (currentObj[key] === prevObj[key] ? multiplier : 0)
        tempMax += multiplier
      }

    }
    else if (_.isObject(value)) {
      const similarityResults = compareObj({
        currentObj: currentObj[key],
        prevObj: prevObj[key],
        settings: value,
        diff: tempDiff,
        max: tempMax,
      })

      tempDiff += similarityResults[0]
      tempMax += similarityResults[1]
    }
  })

  return [tempDiff, tempMax]
}

function checkSimilarity(cardsArray, currentObj = {}, settings = {}) {

  let highestSimilarityRatio = 0
  // let mostSimilarCardObj = {}

  _.forEach(cardsArray, (prevObj) => {
    
    const [diff, max] = compareObj({currentObj, prevObj, settings})
    const similarityRatio = diff / (max||1)
    
    if (similarityRatio > highestSimilarityRatio) {
      // mostSimilarCardObj = prevObj
      highestSimilarityRatio = similarityRatio
    }
  })

  return highestSimilarityRatio
}

export default checkSimilarity

import _ from 'lodash'

const cardObjSettings = {
  cost: [1, 3], // multiplier = 1, max diff = 3, type = Number, 
  type: [2, 1, String],
  size: [1, 2],
  shapeID: [1, 1, String],
  gain: {
    money: [2, 2],
    point: [2, 2],
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

      tempMax += multiplier

      if (valueType === Number){
        tempDiff += (_.clamp(
          Math.abs( (currentObj[key] || 0) - (prevObj[key] || 0) ),
          ceiling
        )/ ceiling)
        * multiplier
      }
      else { // String
        tempDiff += (currentObj[key] === prevObj[key] ? multiplier : 0)
      }

    }
    else if (_.isObject(value)) {
      const similarityResults = checkSimilarity({
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

function checkSimilarity(cardsArray, currentObj = {}) {
  // const newCardObj = _.cloneDeep(newCardObjArg)

  let highestSimilarityRatio = 0
  // let mostSimilarCardObj = {}

  _.forEach(cardsArray, (prevObj) => {
    
    const [diff, max] = compareObj({currentObj, prevObj})
    const similarityRatio = diff/max
    
    if (similarityRatio > highestSimilarityRatio) {
      // mostSimilarCardObj = prevObj
      highestSimilarityRatio = similarityRatio
    }
  })

  return highestSimilarityRatio
  // return {similarityRatio: highestSimilarityRatio, mostSimilarCardObj}
}

// const elf1 = {
//   "cost": "5",
//   "expectedValue": 4.57,
//   "uuid": "a03le7ax4i9",
//   "type": "special",
//   "shapeID": "L3",
//   "size": "3",
//   "gain": {
//     "special3": 1,
//     "point": 4,
//     "trash": 1
//   },
//   "currentValue": 4.75
// }

// const elf2 = {
//   "cost": "5",
//   "expectedValue": 4.57,
//   "uuid": "8fc9kdu42y",
//   "type": "normal",
//   "shapeID": "S4",
//   "size": "4",
//   "gain": {
//     "normal4": 1,
//     "money": 3,
//     "point": 1,
//     "bonus": 1
//   },
//   "currentValue": 4.5
// }

// console.log(checkSimilarity({currentObj: elf1, prevObj: elf2, settings: cardObjSettings}))

export default checkSimilarity

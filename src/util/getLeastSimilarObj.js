import _ from 'lodash'

import checkSimilarity from './checkSimilarity.js'

// addUndo(roller)
// func(addUndo) returns [cardObj, undoChain]
// returns cardObj
function getLeastSimilarObj (
  cardsArray, acceptableSimilarityRatioArg = 0.3, maxRuns = 20, settings, func) {

  let timesTried = 0
  let acceptableSimilarityRatio = acceptableSimilarityRatioArg

  while (true) {
    const undoChain = []
    const addUndo = (roller) => {
      undoChain.push(() => roller.undo())
    }
    const newCardObj = func(addUndo)

    const similarityRatio = checkSimilarity(cardsArray, newCardObj, settings)

    if (
      similarityRatio <= acceptableSimilarityRatio
      || timesTried >= maxRuns
    ) {
      console.log('similarityRatio', similarityRatio)
      console.log('timesTried', timesTried)
      return newCardObj
      break
    }
    else {
      _.over(undoChain)()
      timesTried++
      acceptableSimilarityRatio += (1 - acceptableSimilarityRatioArg) / maxRuns
    }
    
  }

  

  // const {
  //   top, bottom, effectsRolledArray,
  //   similarityRatio, mostSimilarCardObj,
  // } = _.sortBy(fillEffectsAttemptsArray, 'similarityRatio')[0]
}

export default getLeastSimilarObj

import _ from 'lodash'

import checkSimilarity from './checkSimilarity.js'

// addUndo(roller)
// func(addUndo) returns [cardObj, undoChain]
// returns cardObj

document.lol = []

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

      document.lol.push(similarityRatio)
      
      // RETURN !!!!!!!!!!!!!!!!!!!!!!
      return newCardObj
      break
    }
    else {
      _.over(undoChain)()
      timesTried++
      acceptableSimilarityRatio += (1 - acceptableSimilarityRatioArg) / maxRuns
    }
    
  }

}

export default getLeastSimilarObj

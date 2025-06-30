import _ from 'lodash'

import checkSimilarity from './checkSimilarity.js'

document.similarityRatioArray = []

// addUndo(roller)

// func(addUndo, addRedo) -- generates and fills the cardObj with resources
// returns newCardObj

// returns cardObj
function getLeastSimilarObj (
  cardsArray, totalAttempts = 10, settings, func) {

  let timesTried = 0
  const attemptsArray = []

  while (timesTried < totalAttempts) {
    const undoChain = []
    const addUndo = (roller) => {
      undoChain.push(() => roller.undo())
    }

    const redoChain = []
    const addRedo = (roller, chosenResource) => {
      redoChain.push(() => roller.roll(chosenResource))
    }

    const newCardObj = func(addUndo, addRedo)

    const similarityRatio = checkSimilarity(cardsArray, newCardObj, settings)

    attemptsArray.push({
      similarityRatio,
      cardObj: _.cloneDeep(newCardObj),
      redoChain
    })

    _.over(undoChain)()
    timesTried++
    
  }

  const {
    similarityRatio,
    cardObj,
    redoChain,
  } = _.sortBy(attemptsArray, 'similarityRatio')[0]
  _.over(redoChain)()  

  document.similarityRatioArray.push(similarityRatio)

  return cardObj

}

export default getLeastSimilarObj

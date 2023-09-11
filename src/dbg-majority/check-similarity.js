import _ from 'lodash'
import {
  effectToValueMapping, topEffectList, bottomEffectList,
  attackList,
} from './CONSTANTS.js'


// for the entire card
// 4 max. 4-x (min 0). x = difference in cost.
// 2 max. +2 if priority is the same.
// 1 max. +1 if comboType is the same.
// 1 max. +1 if combo resource is the same.

// for top AND bottom
// 2 max / resource. 2 per unique resource intersection (not energy)
// 2 max / resource. 2-x (min 0). x = difference in quantity per resource intersection.
  // multiplied by value of resource.
// 2 max. +2 if the resources are exactly the same.
// 2 max. +2 if the same location crossover. (fireTop same as fireBottom)


function compareAllResources (newCardObj, prevCardObj, comparisonSpaceArg, similarityPointsArg) {
  let comparisonSpace = comparisonSpaceArg
  let similarityPoints = similarityPointsArg

  _.forEach(['top', 'bottom'], (cardSide) => {

    let effectList
    if (cardSide === 'top') {
      effectList = topEffectList
    }
    else if (cardSide === 'bottom') {
      effectList = bottomEffectList
    }

    _.forEach(effectList, (effectName) => {
      const newObjEffect = _.get(newCardObj, [cardSide, effectName]) || 0
      const prevObjEffect = _.get(prevCardObj, [cardSide, effectName]) || 0
      if (newObjEffect && prevObjEffect) {
        comparisonSpace += 2
        similarityPoints += 2

        comparisonSpace += 2
        const differenceInQuantity = Math.abs(newObjEffect - prevObjEffect)
        similarityPoints += _.max([0, 2 - differenceInQuantity])
      }
      else if ((newObjEffect && !prevObjEffect) || (!newObjEffect && prevObjEffect)) {
        comparisonSpace += 1
      }
    })
  })
  
  return [comparisonSpace, similarityPoints]

}

export default function checkSimilarity(cardsArray, newCardObjArg) {

  const newCardObj = _.cloneDeep(newCardObjArg)

  let highestSimilarityRatio = 0
  let mostSimilarCardObj = {}

  _.forEach(cardsArray, (prevCardObjArg) => {
    const prevCardObj = _.cloneDeep(prevCardObjArg)
    
    let comparisonSpace = 0
    let similarityPoints = 0

    // 4 max. 4-x (min 0). x = difference in cost.
    comparisonSpace += 3
    const differenceInCost = Math.abs(newCardObj.cost - prevCardObj.cost)
    similarityPoints += _.max([0, 3-differenceInCost])

    // 2 max. +2 if priority is the same.
    comparisonSpace += 2
    if (newCardObj.priority === prevCardObj.priority) {
      similarityPoints += 2
    }

    // 1 max. +1 if comboType is the same.
    comparisonSpace += 1
    if (newCardObj.comboType === prevCardObj.comboType) {
      similarityPoints += 1
    }

    // 1 max. +1 if combo resource is the same.
    comparisonSpace += 1
    const newCardCombo = _.get(newCardObj, 'top.combo') || _.get(newCardObj, 'bottom.combo')
    const prevCardCombo = _.get(prevCardObj, 'top.combo') || _.get(prevCardObj, 'bottom.combo')
    if (newCardCombo === prevCardCombo) {
      similarityPoints += 1
    }


    // compare attack location effects. ex: fireTop and fireBottom are similar.
    const newCardAttackTop = _.chain(newCardObj.top)
      .keys()
      .intersection(attackList)
      .map((attackEffect) => _.chain(attackEffect).trimEnd('Bottom').trimEnd('Top').value())
      .value()
    const newCardAttackBottom = _.chain(newCardObj.bottom)
      .keys()
      .intersection(attackList)
      .map((attackEffect) => _.chain(attackEffect).trimEnd('Bottom').trimEnd('Top').value())
      .value()
    const prevCardAttackTop = _.chain(prevCardObj.top)
      .keys()
      .intersection(attackList)
      .map((attackEffect) => _.chain(attackEffect).trimEnd('Bottom').trimEnd('Top').value())
      .value()
    const prevCardAttackBottom = _.chain(prevCardObj.bottom)
      .keys()
      .intersection(attackList)
      .map((attackEffect) => _.chain(attackEffect).trimEnd('Bottom').trimEnd('Top').value())
      .value()

    // console.log(newCardAttackTop, newCardAttackBottom, prevCardAttackTop, prevCardAttackBottom)
    if (newCardAttackTop.length && prevCardAttackBottom.length) {
      comparisonSpace += 1
      similarityPoints += _.intersection(newCardAttackTop, prevCardAttackBottom).length ? 1 : 0
      // console.log(_.intersection(newCardAttackTop, prevCardAttackBottom))
    }
    if (newCardAttackBottom.length && prevCardAttackTop.length) {
      comparisonSpace += 1
      similarityPoints += _.intersection(newCardAttackBottom, prevCardAttackTop).length ? 1 : 0
      // console.log(_.intersection(newCardAttackBottom, prevCardAttackTop))
    }


    // compare all resources
    [comparisonSpace, similarityPoints] = compareAllResources(
      newCardObj, prevCardObj, comparisonSpace, similarityPoints)

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

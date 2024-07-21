import _ from 'lodash'
import Brng from 'brng'
import {std} from 'mathjs'

import {default as regression } from 'regression'
import {crStrengthToAvailableValueMapping} from './CONSTANTS.js'

// import './index.css'

const strengthArray = [2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6]

const TIMES_RUN = 1000
// const TIMES_RUN = 100000

function getRandomStrength (thisCardStrength) {
  const randomStrength = _.random(2, thisCardStrength*2)/2
  if (randomStrength === 1.5) {
    return getRandomStrength(thisCardStrength)
  }
  else {
    return randomStrength
  }
}

function regressionAndLogMB (functionToRun) {
  if (!TIMES_RUN) {
    return
  }

  const result = regression.linear(
    _.map(strengthArray, (strength) => functionToRun(strength)),
    {precision: 20}
  )
  console.log(`m = ${result.equation[0]}\nb = ${result.equation[1]}`)
}

//////////////////////////////////////
//////////////////////////////////////
//////////////////////////////////////
//////////////////////////////////////
//////////////////////////////////////
//////////////////////////////////////

/// RONDEL MOVE
const RONDEL_LENGTH = 6
function moveValueForStrength(strength) {
  const moveValueArray = []
  _.times(TIMES_RUN, () => {

    let cardValueArray = []
    // _.times(4, () => cardValueArray.push(_.random(1, strength)))
    _.times(RONDEL_LENGTH, () => cardValueArray.push(getRandomStrength(strength)))
    cardValueArray = _.sortBy(cardValueArray)

    const sumOfCardValues = _.sum(cardValueArray)
    const moveValue = _.mean([
      (sumOfCardValues-cardValueArray[0])/(RONDEL_LENGTH-1)*RONDEL_LENGTH - sumOfCardValues,
      (sumOfCardValues-cardValueArray[1])/(RONDEL_LENGTH-1)*RONDEL_LENGTH - sumOfCardValues,
      (sumOfCardValues-cardValueArray[2])/(RONDEL_LENGTH-1)*RONDEL_LENGTH - sumOfCardValues,
      // (sumOfCardValues-cardValueArray[3])/(RONDEL_LENGTH-1)*RONDEL_LENGTH - sumOfCardValues,
    ])
    moveValueArray.push(moveValue)
  })

  // console.log(strength, _.round(_.mean(moveValueArray), 3), _.round(std(moveValueArray), 3))
  // console.log(strength, _.identity(_.mean(moveValueArray), 3), _.identity(std(moveValueArray), 3))
  return [strength, _.mean(moveValueArray)]
}

function doAllMoveValue () {
  console.log('RD: MOVE')
  regressionAndLogMB(moveValueForStrength)
  console.log('\n')
}

// const result = regression.linear([
//   [2.0, 0.35219100000013154], // 0.11226809680517208
//   [2.5, 0.48908000000001056], // 0.14823283485692115
//   [3.0, 0.6230299999999271], // 0.18422203580892543
//   [3.5, 0.7559939999999954], // 0.21995444019962004
//   [4.0, 0.885333], // 0.2562522892842059
//   [4.5, 1.016376000000017], // 0.29277855764529886
//   [5.0, 1.1462370000000053], // 0.3285579390825095
//   [5.5, 1.2749619999999922], // 0.36419613526812683
//   [6.0, 1.402466000000008], // 0.40235324992523624
// ], {precision: 20})
// console.log(result.equation[0], result.equation[1])
// m = 0.3514782366666686. b = -0.23139118000001965


//////////////////////// WP RECALL
const wpStrengthToValueMapping = {
  // strength*100 * 4/3 / 1.2
  // value * 3 / 4 * 1.2 = expected strength
  1:    150,
  1.5:  200,
  2:    225,
  2.5:  275,
  3:    325,
  3.5:  400,
  4:    450,
  4.5:  500,
  5:    550,
  5.5:  600,
  6:    675,
}
const WORKER_COUNT = 3
function recallValueForStrength(strength) {
  const recallValueArray = []
  _.times(TIMES_RUN, () => {

    const cardValueArray = []
    // _.times(WORKER_COUNT, () => cardValueArray.push( getRandomStrength(strength) ))
    _.times(WORKER_COUNT, () => cardValueArray.push(
      getRandomStrength(strength) * 4 / 3
      // wpStrengthToValueMapping[ getRandomStrength(strength) ] / 100
    ))

    const sumOfCardValues = _.sum(cardValueArray)
    // const recallValue = (sumOfCardValues + _.max(cardValueArray))/(WORKER_COUNT+2)*(WORKER_COUNT+1)
    //   - sumOfCardValues

    // (sum / 4) = (total + max - recallvalue) / 5
    const recallValue = sumOfCardValues
      + _.max(cardValueArray)
      - (sumOfCardValues / (WORKER_COUNT+1) * (WORKER_COUNT+ 2))

    recallValueArray.push(recallValue)
  })

  // console.log(strength, _.round(_.mean(recallValueArray), 3), _.round(std(recallValueArray), 3))
  // console.log(strength, _.identity(_.mean(recallValueArray), 3), _.identity(std(recallValueArray), 3))
  return [strength, _.mean(recallValueArray)]
}
function doAllRecallValue () {
  console.log('WP: RECALL')
  regressionAndLogMB(recallValueForStrength)
  console.log('\n')
}


////////////////////// WP SEND ////////////////
function sendValueForStrength(strength) {
  const sendValueArray = []
  _.times(TIMES_RUN, () => {

    const cardValueArray = []
    // _.times(WORKER_COUNT, () => cardValueArray.push(getRandomStrength(strength)))
    _.times(WORKER_COUNT, () => cardValueArray.push(
      wpStrengthToValueMapping[ getRandomStrength(strength) ] / 100
    ))

    const sumOfCardValues = _.sum(cardValueArray)
    // const sendValue = sumOfCardValues/WORKER_COUNT*(WORKER_COUNT+1) - sumOfCardValues

    // (send + sum) / 4 = sum / 3

    // sum / 4 = (sum - sendValue) / 3
    const sendValue = sumOfCardValues - (sumOfCardValues / (WORKER_COUNT+1) * WORKER_COUNT)

    sendValueArray.push(sendValue)


  })

  // console.log(strength, _.round(_.mean(sendValueArray), 3), _.round(std(sendValueArray), 3))
  // console.log(strength, _.identity(_.mean(sendValueArray), 3), _.identity(std(sendValueArray), 3))
  return [strength, _.mean(sendValueArray)]
}
function doAllSendValue () {
  console.log('WP: SEND')
  regressionAndLogMB(sendValueForStrength)
  console.log('\n')
}




//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
//////////////////////////////////////////////////////

const CARD_RIVER_QUANTITY = 4
function activateNthSpotValue(strength, nth) {
  const nthValueArray = []
  _.times(TIMES_RUN, () => {

    const cardValueArray = []

    const randomCardStrength = getRandomStrength(strength)

    _.times(CARD_RIVER_QUANTITY, () => {
      cardValueArray.push( _.sample(crStrengthToAvailableValueMapping[randomCardStrength]) )
    })

    let allValuesCombined = []
    _.forEach(cardValueArray, (cardObj) => {
      allValuesCombined = _.concat( allValuesCombined, cardObj.slice(0, nth) )
    })

    allValuesCombined = _.sortBy(allValuesCombined, (val) => -val)
    nthValueArray.push( (allValuesCombined[0] + allValuesCombined[1]) / 2 )
  })

  // console.log(strength, _.round(_.mean(recallValueArray), 3), _.round(std(recallValueArray), 3))
  // console.log(strength, _.identity(_.mean(nthValueArray), 3), _.identity(std(nthValueArray), 3))
  return [strength, _.mean(nthValueArray)]
}

function doAllActivateNthSpot () {
  console.log('CR: ACTIVATE 2ND SPOT')
  regressionAndLogMB((strength) => activateNthSpotValue(strength, 2))
  console.log('\n')

  console.log('CR: ACTIVATE 3RD SPOT')
  regressionAndLogMB((strength) => activateNthSpotValue(strength, 3))
  console.log('\n')

  console.log('CR: ACTIVATE 4TH SPOT')
  regressionAndLogMB((strength) => activateNthSpotValue(strength, 4))
  console.log('\n')
}


function dropNthSpotValue(strength, nth=4) {
  const nthValueArray = []
  _.times(TIMES_RUN, () => {

    const cardValueArray = []
    const randomCardStrength = getRandomStrength(strength)
    _.times(CARD_RIVER_QUANTITY, () => {
      cardValueArray.push( _.sample(crStrengthToAvailableValueMapping[randomCardStrength]) )
    })

    let allValuesAtNth = []
    _.forEach(cardValueArray, (cardObj) => {
      // allValuesAtNth = _.concat(allValuesAtNth, _.max(cardObj.slice(nth-1, CARD_RIVER_QUANTITY)) )
      allValuesAtNth = _.concat(allValuesAtNth, cardObj[nth-1] )
    })

    // console.log(cardValueArray)
    // console.log(allValuesAtNth)

    const sum = _.sum(allValuesAtNth)
    const min = _.min(allValuesAtNth)
    const dropNthValue = (sum - min)/3*4 - sum

    nthValueArray.push(dropNthValue)

  })

  // console.log(strength, _.round(_.mean(recallValueArray), 3), _.round(std(recallValueArray), 3))
  // console.log(strength, _.identity(_.mean(nthValueArray), 3), _.identity(std(nthValueArray), 3))
  return [strength, _.mean(nthValueArray)]
}

function doAllDropNthSpot () {
  console.log('CR: DROP 4TH SPOT')
  regressionAndLogMB(dropNthSpotValue)
  console.log('\n')
}


// // rd
// doAllMoveValue()

// //wp
// doAllRecallValue()
// doAllSendValue()

// // cr
// doAllActivateNthSpot()
// doAllDropNthSpot()

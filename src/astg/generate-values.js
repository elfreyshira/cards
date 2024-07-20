import _ from 'lodash'
import Brng from 'brng'
import {std} from 'mathjs'

import {default as regression } from 'regression'

// import './index.css'

const strengthArray = [2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6]

const TIMES_RUN = 0
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
doAllMoveValue()

const result = regression.linear([
  [2.0, 0.35219100000013154], // 0.11226809680517208
  [2.5, 0.48908000000001056], // 0.14823283485692115
  [3.0, 0.6230299999999271], // 0.18422203580892543
  [3.5, 0.7559939999999954], // 0.21995444019962004
  [4.0, 0.885333], // 0.2562522892842059
  [4.5, 1.016376000000017], // 0.29277855764529886
  [5.0, 1.1462370000000053], // 0.3285579390825095
  [5.5, 1.2749619999999922], // 0.36419613526812683
  [6.0, 1.402466000000008], // 0.40235324992523624
], {precision: 20})
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
doAllRecallValue()


const recallRegressionResult = regression.linear([
  [2.0, 0.70917], // 0.18855325275171037
  [2.5, 0.9059825], // 0.25249524199919204
  [3.0, 1.09928375], // 0.3139174910351995
  [3.5, 1.29098625], // 0.3763045802435601
  [4.0, 1.48325125], // 0.438614648012998
  [4.5, 1.6703525], // 0.502212029836883
  [5.0, 1.8652625], // 0.5636493108300261
  [5.5, 2.04844875], // 0.6256316120709814
  [6.0, 2.23996], // 0.688405676126909
], {precision: 20})
// console.log(recallRegressionResult.equation[0], recallRegressionResult.equation[1])
// m = 0.38206275000000006 // b = -0.04906238888888902

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
doAllSendValue()


const sendRegressionResult = regression.linear([
  [2.0, 1.5000291666666412], // 0.23584440326137546
  [2.5, 1.7494944999999804], // 0.3227452792844043
  [3.0, 1.9995199999999858], // 0.4082909402092177
  [3.5, 2.249448333333356], // 0.493212141677098
  [4.0, 2.499914499999961], // 0.5772152672604851
  [4.5, 2.7503648333332724], // 0.662315026588951
  [5.0, 3.000886000000031], // 0.745521848346458
  [5.5, 3.2513918333332508], // 0.8281596556900664
  [6.0, 3.4999166666665755], // 0.9134693601476557
], {precision: 20})
// console.log(sendRegressionResult.equation[0], sendRegressionResult.equation[1])
// m = 0.5, b = 0.5


// doAllMoveValue ()
// doAllRecallValue ()
// doAllSendValue ()

//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
//////////////////////////////////////////////////////

// const crStrengthToAvailableValueMapping = {
//   1.0: [[0,0,1,1]],
//   1.5: [[0,0,0,1.5],[0,1.25,1.25,1.25]],
//   2.0: [[0,0,0,2],[0,0,1.75,1.75],[0,1.5,1.5,1.5],[1.25,1.25,1.25,1.25]],
//   2.5: [[0,0,0,2.5],[0,1.75,1.75,1.75]],
//   3.0: [[0,0,0,3],[0,0,2.5,2.5],[0,2,2,2],[1.5,1.5,1.5,1.5]],
//   3.5: [[0,0,0,3.5],[0,2.25,2.25,2.25]],
//   4.0: [[0,0,0,4],[0,0,3.25,3.25],[0,2.5,2.5,2.5],[1.75,1.75,1.75,1.75]],
//   4.5: [[0,0,0,4.5],[0,2.75,2.75,2.75]],
//   5.0: [[0,0,0,5],[0,0,4,4],[0,3,3,3],[2,2,2,2]],
//   5.5: [[0,0,0,5.5],[0,3.25,3.25,3.25]],
//   6.0: [[0,0,0,6],[0,0,4.75,4.75],[0,3.5,3.5,3.5],[2.25,2.25,2.25,2.25]],
// }

////// without the 1.5 strength, and without activation on the lowest value
const crStrengthToAvailableValueMapping = {
  1.0: [[0,0,1,1]],
  2.0: [[0,0,0,2], [0,0,1.75,1.75], [0,1.5,1.5,1.5]],
  2.5: [[0,0,0,2.5], [0,1.75,1.75,1.75]],
  3.0: [[0,0,0,3], [0,0,2.5,2.5], [0,2,2,2]],
  3.5: [[0,0,0,3.5], [0,2.25,2.25,2.25]],
  4.0: [[0,0,0,4], [0,0,3.25,3.25], [0,2.5,2.5,2.5]],
  4.5: [[0,0,0,4.5], [0,2.75,2.75,2.75]],
  5.0: [[0,0,0,5], [0,0,4,4], [0,3,3,3]],
  5.5: [[0,0,0,5.5], [0,3.25,3.25,3.25]],
  6.0: [[0,0,0,6], [0,0,4.75,4.75], [0,3.5,3.5,3.5]],
}

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
doAllActivateNthSpot()

// // CR: ACTIVATE 2ND SPOT
const ACTIVATE2NDSPOTResult = regression.linear([
  [2.0, 0.4539375], // 0.6029156115087433
  [2.5, 0.776625375], // 0.7365906835467559
  [3.0, 0.885398625], // 0.7627739039499994
  [3.5, 1.073828125], // 0.8360174175874362
  [4.0, 1.1463875], // 0.8691011622261804
  [4.5, 1.30154925], // 0.9431181669332585
  [5.0, 1.365249375], // 0.9824603363068019
  [5.5, 1.508364375], // 1.0612009224225423
  [6.0, 1.56814025], // 1.1025395954003012
], {precision: 20})
// console.log(ACTIVATE2NDSPOTResult.equation[0], ACTIVATE2NDSPOTResult.equation[1])
// m = 0.261315020833333, b = 0.07468218055555664


// // CR: ACTIVATE 3RD SPOT
const ACTIVATE3RDSPOTResult = regression.linear([
  [2.0, 1.29790475], // 0.3507369586959902
  [2.5, 1.411421625], // 0.41087451664014507
  [3.0, 1.616227875], // 0.5369714936916784
  [3.5, 1.714914125], // 0.5739580082029744
  [4.0, 1.90617], // 0.7068647719055826
  [4.5, 2.001858], // 0.739623173397906
  [5.0, 2.18622475], // 0.8802826029993165
  [5.5, 2.284841125], // 0.9107488525093625
  [6.0, 2.46834275], // 1.0540889986761803
], {precision: 20})
// console.log(ACTIVATE3RDSPOTResult.equation[0], ACTIVATE3RDSPOTResult.equation[1])
// m = 0.29096493750000046, b = 0.7125741388888871

// // CR: ACTIVATE 4TH SPOT
const ACTIVATE4THSPOTResult = regression.linear([
  [2.0, 1.446162875], // 0.4522485520965623
  [2.5, 1.750804], // 0.5819483480067379
  [3.0, 2.00719825], // 0.6825929615283783
  [3.5, 2.26018675], // 0.8080006817688152
  [4.0, 2.49569275], // 0.9160087194828374
  [4.5, 2.735588125], // 1.050176001963825
  [5.0, 2.966170625], // 1.164098420083239
  [5.5, 3.19954125], // 1.3038284571814025
  [6.0, 3.424197125], // 1.42056631146939
], {precision: 20})
// console.log(ACTIVATE4THSPOTResult.equation[0], ACTIVATE4THSPOTResult.equation[1])
// m = 0.4883898291666658, b = 0.522611988888892



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
doAllDropNthSpot()

const DropNthResult = regression.linear([
  [2.0, 0.17269074999995598], // 0.1854743590815375
  [2.5, 0.23877366666655972], // 0.23137648655555088
  [3.0, 0.339868083333382], // 0.323644618814456
  [3.5, 0.40480308333332776], // 0.368367035751761
  [4.0, 0.5066914999999937], // 0.46024347975026997
  [4.5, 0.5710642500000708], // 0.5040987778947045
  [5.0, 0.6729035833332961], // 0.5967575978577244
  [5.5, 0.736990249999927], // 0.6402985605685588
  [6.0, 0.8392703333332372], // 0.7330131387359751
], {precision: 20})
// console.log(DropNthResult.equation[0], DropNthResult.equation[1])
// m = 0.16644334166665967, b = -0.1676560888888886

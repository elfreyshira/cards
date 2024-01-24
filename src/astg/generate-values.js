import _ from 'lodash'
import Brng from 'brng'
import {std} from 'mathjs'

import {default as regression } from 'regression'

// import './index.css'

const strengthArray = [2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6]


/// RONDEL MOVE
const RONDEL_LENGTH = 6
function moveValueForStrength(strength) {
  const moveValueArray = []
  _.times(100000, () => {

    let cardValueArray = []
    // _.times(4, () => cardValueArray.push(_.random(1, strength)))
    _.times(RONDEL_LENGTH, () => cardValueArray.push(_.random(2, strength*2)/2))
    cardValueArray = _.sortBy(cardValueArray)

    const sumOfCardValues = _.sum(cardValueArray)
    const moveValue = _.mean([
      (sumOfCardValues-cardValueArray[0])/(RONDEL_LENGTH-1)*RONDEL_LENGTH - sumOfCardValues,
      (sumOfCardValues-cardValueArray[1])/(RONDEL_LENGTH-1)*RONDEL_LENGTH - sumOfCardValues,
      // (sumOfCardValues-cardValueArray[2])/(RONDEL_LENGTH-1)*RONDEL_LENGTH - sumOfCardValues,
      // (sumOfCardValues-cardValueArray[3])/(RONDEL_LENGTH-1)*RONDEL_LENGTH - sumOfCardValues,
    ])
    moveValueArray.push(moveValue)
  })

  // console.log(strength, _.round(_.mean(moveValueArray), 3), _.round(std(moveValueArray), 3))
  console.log(strength, _.identity(_.mean(moveValueArray), 3), _.identity(std(moveValueArray), 3))
}

function doAllMoveValue () {
  console.log('RD: MOVE')
  _.forEach(strengthArray, (strength) => moveValueForStrength(strength))
  console.log('\n')
}
doAllMoveValue()

const result = regression.linear([
  [2.0, 0.4626053000001173], // 0.15189775997239793
  [2.5, 0.647680899999702], // 0.19953451227636002
  [3.0, 0.826763700000148], // 0.2477798937712158
  [3.5, 1.0034821999999342], // 0.29641498299702473
  [4.0, 1.1790939000000014], // 0.3451872015831857
  [4.5, 1.3524259999999888], // 0.3939419623685336
  [5.0, 1.5267605000000748], // 0.4424326179058796
  [5.5, 1.698659999999992], // 0.4917341011186827
  [6.0, 1.8732233999999341], // 0.5398159733608531
], {precision: 20})
console.log(result.equation[0], result.equation[1])
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
  _.times(100000, () => {

    const cardValueArray = []
    // _.times(WORKER_COUNT, () => cardValueArray.push( _.random(2, strength*2)/2 ))
    _.times(WORKER_COUNT, () => cardValueArray.push(
      wpStrengthToValueMapping[ _.random(2, strength*2)/2 ] / 100
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
  console.log(strength, _.identity(_.mean(recallValueArray), 3), _.identity(std(recallValueArray), 3))
}
function doAllRecallValue () {
  console.log('WP: RECALL')
  _.forEach(strengthArray, (strength) => recallValueForStrength(strength))
  console.log('\n')
}
console.log('lol')
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
console.log(recallRegressionResult.equation[0], recallRegressionResult.equation[1])
// m = 0.38206275000000006 // b = -0.04906238888888902

////////////////////// WP SEND ////////////////
function sendValueForStrength(strength) {
  const sendValueArray = []
  _.times(100000, () => {

    const cardValueArray = []
    // _.times(WORKER_COUNT, () => cardValueArray.push(_.random(2, strength*2)/2))
    _.times(WORKER_COUNT, () => cardValueArray.push(
      wpStrengthToValueMapping[ _.random(2, strength*2)/2 ] / 100
    ))

    const sumOfCardValues = _.sum(cardValueArray)
    // const sendValue = sumOfCardValues/WORKER_COUNT*(WORKER_COUNT+1) - sumOfCardValues

    // (send + sum) / 4 = sum / 3

    // sum / 4 = (sum - sendValue) / 3
    const sendValue = sumOfCardValues - (sumOfCardValues / (WORKER_COUNT+1) * WORKER_COUNT)

    sendValueArray.push(sendValue)


  })

  // console.log(strength, _.round(_.mean(sendValueArray), 3), _.round(std(sendValueArray), 3))
  console.log(strength, _.identity(_.mean(sendValueArray), 3), _.identity(std(sendValueArray), 3))
}
function doAllSendValue () {
  console.log('WP: SEND')
  _.forEach(strengthArray, (strength) => sendValueForStrength(strength))
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

const crStrengthToAvailableValueMapping = {
  1.0: [[0,0,1,1]],
  1.5: [[0,0,0,1.5],[0,1.25,1.25,1.25]],
  2.0: [[0,0,0,2],[0,0,1.75,1.75],[0,1.5,1.5,1.5],[1.25,1.25,1.25,1.25]],
  2.5: [[0,0,0,2.5],[0,1.75,1.75,1.75]],
  3.0: [[0,0,0,3],[0,0,2.5,2.5],[0,2,2,2],[1.5,1.5,1.5,1.5]],
  3.5: [[0,0,0,3.5],[0,2.25,2.25,2.25]],
  4.0: [[0,0,0,4],[0,0,3.25,3.25],[0,2.5,2.5,2.5],[1.75,1.75,1.75,1.75]],
  4.5: [[0,0,0,4.5],[0,2.75,2.75,2.75]],
  5.0: [[0,0,0,5],[0,0,4,4],[0,3,3,3],[2,2,2,2]],
  5.5: [[0,0,0,5.5],[0,3.25,3.25,3.25]],
  6.0: [[0,0,0,6],[0,0,4.75,4.75],[0,3.5,3.5,3.5],[2.25,2.25,2.25,2.25]],
}

const CARD_RIVER_QUANTITY = 4
function activateNthSpotValue(strength, nth) {
  const nthValueArray = []
  _.times(1000000, () => {

    const cardValueArray = []
    const randomCardStrength = _.random(2, strength*2)/2
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
  console.log(strength, _.identity(_.mean(nthValueArray), 3), _.identity(std(nthValueArray), 3))
}

function doAllActivateNthSpot () {
  console.log('CR: ACTIVATE 2ND SPOT')
  _.forEach(strengthArray, (strength) => activateNthSpotValue(strength, 2))
  console.log('\n')

  console.log('CR: ACTIVATE 3RD SPOT')
  _.forEach(strengthArray, (strength) => activateNthSpotValue(strength, 3))
  console.log('\n')

  console.log('CR: ACTIVATE 4TH SPOT')
  _.forEach(strengthArray, (strength) => activateNthSpotValue(strength, 4))
  console.log('\n')
}
// doAllActivateNthSpot()

// // CR: ACTIVATE 2ND SPOT
const ACTIVATE2NDSPOTResult = regression.linear([
  [2.0, 0.7430335], // 0.6151133286377936
  [2.5, 0.911467625], // 0.6627565569873305
  [3.0, 1.0389235], // 0.6834990908802595
  [3.5, 1.17109325], // 0.7425085650755213
  [4.0, 1.273405375], // 0.7692150218893555
  [4.5, 1.39380275], // 0.8382827471679121
  [5.0, 1.483871875], // 0.8694590248705265
  [5.5, 1.601053], // 0.946678414530621
  [6.0, 1.687729625], // 0.979018938915834
], {precision: 20})
// console.log(ACTIVATE2NDSPOTResult.equation[0], ACTIVATE2NDSPOTResult.equation[1])
// m = 0.2320048958333338, b = 0.3280226944444423


// // CR: ACTIVATE 3RD SPOT
const ACTIVATE3RDSPOTResult = regression.linear([
  [2.0, 1.2481505], // 0.3152316672505743
  [2.5, 1.345904], // 0.3851193362987559
  [3.0, 1.508141625], // 0.4928322874056602
  [3.5, 1.6071445], // 0.5502152317374158
  [4.0, 1.769382375], // 0.6665794673742881
  [4.5, 1.870971625], // 0.7182166165137326
  [5.0, 2.033876625], // 0.839867451648901
  [5.5, 2.135506625], // 0.8883945962121529
  [6.0, 2.2963605], // 1.0119163118966252
], {precision: 20})
// console.log(ACTIVATE3RDSPOTResult.equation[0], ACTIVATE3RDSPOTResult.equation[1])
// m = 0.2625648333333326, b = 0.7070115972222251

// // CR: ACTIVATE 4TH SPOT
const ACTIVATE4THSPOTResult = regression.linear([
  [2.0, 1.429224125], // 0.35270806390927995
  [2.5, 1.662105], // 0.5180857886728544
  [3.0, 1.863455125], // 0.6260330132603777
  [3.5, 2.09627375], // 0.7888777954946737
  [4.0, 2.2984065], // 0.8947930234622016
  [4.5, 2.531137625], // 1.0579758792591523
  [5.0, 2.732711125], // 1.1613880584652825
  [5.5, 2.969303375], // 1.325628984760646
  [6.0, 3.1686815], // 1.4287634219707142
], {precision: 20})
// console.log(ACTIVATE4THSPOTResult.equation[0], ACTIVATE4THSPOTResult.equation[1])
// m = 0.43509335000000005, b = 0.5653263916666664



function dropNthSpotValue(strength, nth) {
  const nthValueArray = []
  _.times(1000000, () => {

    const cardValueArray = []
    const randomCardStrength = _.random(2, strength*2)/2
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
  console.log(strength, _.identity(_.mean(nthValueArray), 3), _.identity(std(nthValueArray), 3))
}

function doAllDropNthSpot () {
  console.log('CR: DROP 4TH SPOT')
  _.forEach(strengthArray, (strength) => dropNthSpotValue(strength, 4))
  console.log('\n')
}
// doAllDropNthSpot()

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

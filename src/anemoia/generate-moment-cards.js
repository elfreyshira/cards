import _ from 'lodash'
import Brng from 'brng'


////////////////////
////////////////////
////////////////////
// !! writes to momentObj
function generateConsistentMoment (momentObj, RESOURCE_GAIN_VALUE) {
  // each resource cost gets 4 points, and +2 for the 50 cost to develop
  let pointsGainedThisStep = momentObj.cost*4 + 2 + 1 // +1 for the while loop
  const finalStep = 5
  let timesLooped = 0

  while (
    Math.abs(pointsGainedThisStep - (momentObj.points[finalStep] || 0)) > 1
    && timesLooped < 10
  ) {

    timesLooped++
    pointsGainedThisStep--

    // generally, don't let the final point be lower than the rest
    // in some cases it will be when the final step has a large action bonus
    if ((pointsGainedThisStep - (momentObj.points[finalStep] || 0)) <= 0) {
      break
    }

    let totalValueWithheld = 0
    _.times(5, (idx) => {
      const step = idx + 1
      
      const stepBonus = momentObj.bonus[step]

      let expectedValueGain = 0
      let actualValueGain = 0

      // set expectedValueGain
      if (step === 1) {
        expectedValueGain = momentObj.cost*100+50
      }
      else {
        expectedValueGain = momentObj.cost*100+50 + totalValueWithheld*1.2
      }

      // set actualValueGain
      // !! WRITE to momentObj.points[step]
      if (step <= 4) { // steps 1-4
        actualValueGain = pointsGainedThisStep*25 + (stepBonus ? RESOURCE_GAIN_VALUE[stepBonus]() : 0)
        momentObj.points[step] = pointsGainedThisStep
      }
      else if (step === 5) { // steps 1-4
        actualValueGain = expectedValueGain
        momentObj.points[step] = Math.round(
          (
            actualValueGain
            - (stepBonus ? RESOURCE_GAIN_VALUE[stepBonus]() : 0)
          )
          / 25
        )
      }

      totalValueWithheld = expectedValueGain - actualValueGain
    })
  }
}





////////////////////
////////////////////
////////////////////
function generateRandomMoment (momentObj, RESOURCE_GAIN_VALUE) {
  // each resource cost gets 4 points, and +2 for the 50 cost to develop
  
  const finalStep = 5
  let timesLooped = 0

  const avgPointsGained = momentObj.cost*4 + 2

  while (
    (
      (_.sum(_.values(momentObj.points)) <= 0)
      || momentObj.points[finalStep] < 0 // if the final step is negative
      // other steps will never be negative
    )
    && timesLooped < 10
  ) {

    timesLooped++

    let totalValueWithheld = 0

    const highOrLowRoller = new Brng({high: 10, low: 10}, {bias: 3})
    
    // LOW
    const randomPointsLowProportions = {}
    _.forEach(
      _.range(avgPointsGained/2-2, avgPointsGained-2),
      (val) => randomPointsLowProportions[val] = 1
    )
    const randomPointsLowRoller = new Brng(randomPointsLowProportions, {bias: 4})

    // HIGH
    const randomPointsHighProportions = {}
    _.forEach(
      _.range(avgPointsGained-2, avgPointsGained*1.5-2),
      (val) => randomPointsHighProportions[val] = 1
    )
    const randomPointsHighRoller = new Brng(randomPointsHighProportions, {bias: 4})


    _.times(5, (idx) => {
      const step = idx + 1
      
      const stepBonus = momentObj.bonus[step]

      let expectedValueGain = 0
      let actualValueGain = 0

      // set expectedValueGain
      if (step === 1) {
        expectedValueGain = momentObj.cost*100+50
      }
      else {
        expectedValueGain = momentObj.cost*100+50 + totalValueWithheld*1.2
      }

      // set actualValueGain
      // !! WRITE to momentObj.points[step]
      if (step <= 4) { // steps 1-4
        
        let pointsGainedThisStep
        const isHighOrLow = highOrLowRoller.roll()
        if (isHighOrLow === 'high') {
          pointsGainedThisStep = _.toNumber(randomPointsHighRoller.roll())
        }
        else { // if 'low'
          pointsGainedThisStep = _.toNumber(randomPointsLowRoller.roll())
        }

        actualValueGain = pointsGainedThisStep*25 + (stepBonus ? RESOURCE_GAIN_VALUE[stepBonus]() : 0)
        momentObj.points[step] = pointsGainedThisStep
      }
      else if (step === 5) { // steps 1-4
        actualValueGain = expectedValueGain
        momentObj.points[step] = Math.round(
          (
            actualValueGain
            - (stepBonus ? RESOURCE_GAIN_VALUE[stepBonus]() : 0)
          )
          / 25
        )
      }

      totalValueWithheld = expectedValueGain - actualValueGain
    })
  }
}



////////////////////
////////////////////
////////////////////
// !! writes to momentObj
function generateIncreaseMoment (momentObj, RESOURCE_GAIN_VALUE) {

  // each resource cost gets 4 points, and +2 for the 50 cost to develop
  const avgPointsGained = momentObj.cost*4 + 2
  const finalStep = 5
  let timesLooped = 0

  let increasePointsPerStep = avgPointsGained

  const initialPoints = _.random(4, avgPointsGained/2+1)

  while (
    ((momentObj.points[5] || 0) - (momentObj.points[4] || 0)) <= 0
    && timesLooped < 20
  ) {

    increasePointsPerStep--
    timesLooped++

    let pointsGainedThisStep = initialPoints
    let totalValueWithheld = 0
    _.times(5, (idx) => {
      const step = idx + 1
      
      const stepBonus = momentObj.bonus[step]

      let expectedValueGain = 0
      let actualValueGain = 0

      // set expectedValueGain
      if (step === 1) {
        expectedValueGain = momentObj.cost*100+50
      }
      else {
        expectedValueGain = momentObj.cost*100+50 + totalValueWithheld*1.2
      }

      // set actualValueGain
      // !! WRITE to momentObj.points[step]
      if (step <= 4) { // steps 1-4
        actualValueGain = pointsGainedThisStep*25 + (stepBonus ? RESOURCE_GAIN_VALUE[stepBonus]() : 0)
        momentObj.points[step] = pointsGainedThisStep
        pointsGainedThisStep += increasePointsPerStep
      }
      else if (step === 5) { // steps 1-4
        actualValueGain = expectedValueGain
        momentObj.points[step] = Math.round(
          (
            actualValueGain
            - (stepBonus ? RESOURCE_GAIN_VALUE[stepBonus]() : 0)
          )
          / 25
        )
      }

      totalValueWithheld = expectedValueGain - actualValueGain
    })

  }
}


function isGoodToGo(points) {
  const isAllFilled = _.keys(points).length === 5

  const allArePositive = _.filter(_.values(points), (val) => val > 0).length === 5


  let isDecreasingSeries = true
  let currentValue = points[0]+1

  _.times(5, idx => {
    if (points[idx+1] > currentValue) {
      isDecreasingSeries = false
    }
    currentValue = points[idx+1]
  })

  return (isAllFilled && allArePositive && isDecreasingSeries)
}

////////////////////
////////////////////
////////////////////
// !! writes to momentObj
function generateDecreaseMoment (momentObj, RESOURCE_GAIN_VALUE) {

  // each resource cost gets 4 points, and +2 for the 50 cost to develop
  const avgPointsGained = momentObj.cost*4 + 2
  const finalStep = 5
  let timesLooped = 0

  let decreasePointsPerStep = avgPointsGained

  let initialPoints = _.random(avgPointsGained+1, _.round(avgPointsGained*1.5+1))
  // let initialPoints = avgPointsGained*1.5

  while (
    !isGoodToGo(momentObj.points)
    && timesLooped < avgPointsGained*3
  ) {

    if (
      decreasePointsPerStep <= 1
      || (momentObj.points[4]-momentObj.points[5]) > (momentObj.points[3]-momentObj.points[4])*2
    ) {
      initialPoints--
    }
    else {
      decreasePointsPerStep--
    }

    timesLooped++

    let pointsGainedThisStep = initialPoints
    let totalValueWithheld = 0
    _.times(5, (idx) => {
      const step = idx + 1
      
      const stepBonus = momentObj.bonus[step]

      let expectedValueGain = 0
      let actualValueGain = 0

      // set expectedValueGain
      if (step === 1) {
        expectedValueGain = momentObj.cost*100+50
      }
      else {
        expectedValueGain = momentObj.cost*100+50 + totalValueWithheld*1.2
      }

      // set actualValueGain
      // !! WRITE to momentObj.points[step]
      if (step <= 4) { // steps 1-4
        actualValueGain = pointsGainedThisStep*25 + (stepBonus ? RESOURCE_GAIN_VALUE[stepBonus]() : 0)
        momentObj.points[step] = pointsGainedThisStep
        pointsGainedThisStep = pointsGainedThisStep - decreasePointsPerStep
      }
      else if (step === 5) { // steps 1-4
        actualValueGain = expectedValueGain
        momentObj.points[step] = Math.round(
          (
            actualValueGain
            - (stepBonus ? RESOURCE_GAIN_VALUE[stepBonus]() : 0)
          )
          / 25
        )
      }

      totalValueWithheld = expectedValueGain - actualValueGain
    })

    if (isGoodToGo(momentObj.points)) {
      break // leave the while loop
    }
  }
}



export {
  generateConsistentMoment,
  generateRandomMoment,
  generateIncreaseMoment,
  generateDecreaseMoment
}

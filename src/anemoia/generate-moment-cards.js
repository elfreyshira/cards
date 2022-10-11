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
    if ((pointsGainedThisStep - (momentObj.points[finalStep] || 0)) < 0) {
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

    const highOrLowRoller = new Brng({high: 10, low: 15}, {bias: 3})
    
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

export {
  generateConsistentMoment,
  generateRandomMoment
}

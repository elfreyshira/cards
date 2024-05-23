import _ from 'lodash'
import Brng from 'brng'

// const log = console.log
const log = _.noop

const whichQuarterRoller = new Brng({0:1, 1:1, 2:1, 3:1})

function biasRandom () {
  const whichQuarter = _.toNumber(whichQuarterRoller.roll())

  const chosenNumber = whichQuarter*0.25 + (Math.random() * 0.25)
  return chosenNumber
}

export default biasRandom

import _ from 'lodash'
import Brng from 'brng'

const tagNumberRoller = new Brng({0:1, 1:1, 2:1}, {bias: 0})
const tagElementRoller = new Brng({fire: 1, water:1, earth:1}, {bias: 0})

const tagNumberEndGameRoller = new Brng({1:1, 2:1}, {bias: 0})

let fireTags = 0
let waterTags = 0
let earthTags = 0

function getStandardDeviation (array) {
  const n = array.length
  const mean = array.reduce((a, b) => a + b) / n
  return Math.sqrt(array.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n)
}

function calculatePointsPerTag (tagArray) {
  return (Math.pow(_.min(tagArray), 3) + Math.pow(_.max(tagArray), 2)/2) / _.sum(tagArray)
}


const arrayOfAttempts = []

_.times(10, () => {


  const tagCount = {
    fire: 0,
    water: 0,
    earth: 0,
  }
  _.times(9, () => {
    tagCount[tagElementRoller.roll()] += _.toNumber(tagNumberRoller.roll())
  })
  _.times(2, () => {
    tagCount[tagElementRoller.roll()] += _.toNumber(tagNumberEndGameRoller.roll())
  })

  arrayOfAttempts.push({
    tagCount: _.cloneDeep(tagCount),
    pointsPerTag: calculatePointsPerTag(_.values(tagCount))
  })

})

const avgPointsPertag = _.mean(_.map(arrayOfAttempts, 'pointsPerTag'))
const stdPointsPerTag = getStandardDeviation(_.map(arrayOfAttempts, 'pointsPerTag'))

console.log('avgPointsPertag', avgPointsPertag)
console.log('stdPointsPerTag', stdPointsPerTag)
console.log('avgPointsPertag + stdPointsPerTag', avgPointsPertag+stdPointsPerTag)

console.log('arrayOfAttempts', arrayOfAttempts)

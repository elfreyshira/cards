import _ from 'lodash'
import Brng from 'brng'

const tagNumberRoller = new Brng({0:1, 1:1, 2:1}, {bias: 0.2})
const tagElementRoller = new Brng({fire: 1, water:1, earth:1}, {bias: 0.2})

const tagNumberEndGameRoller = new Brng({1:1, 2:1}, {bias: 0.2})


function getStandardDeviation (array) {
  const n = array.length
  const mean = array.reduce((a, b) => a + b) / n
  const std = Math.sqrt(array.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n)
  return [mean, std]
  return Math.sqrt(array.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n)
}

function calculateMinPoints (tagArray) {
  return Math.pow(_.min(tagArray), 2)*3
}
function calculateMaxPoints (tagArray) {
  return Math.pow(_.max(tagArray), 2)/2
}

function calculatePointsPerTag (tagArray, pointsFromComparison) {
  return (
    calculateMinPoints(tagArray)
    + calculateMaxPoints(tagArray)
    + pointsFromComparison
  ) / _.sum(tagArray)
}


let arrayOfAttempts = []
const pointsForWinningTagComparison = 8
const pointsForTieTagComparison = 3


_.times(100, (idx) => {

  const tagCount = {
    fire: 0,
    water: 0,
    earth: 0,
  }
  _.times(9, () => {
    tagCount[tagElementRoller.roll()] += _.toNumber(tagNumberRoller.roll())
  })
  tagNumberRoller.reset()
  _.times(2, () => {
    tagCount[tagElementRoller.roll()] += _.toNumber(tagNumberEndGameRoller.roll())
  })
  tagNumberEndGameRoller.reset()

  let pointsFromComparison = 0
  if (idx >= 2) {

    /// compare vs 2 things ago
    if (tagCount.fire > arrayOfAttempts[idx-2].tagCount.fire) {
      pointsFromComparison += pointsForWinningTagComparison}
    else if (tagCount.fire === arrayOfAttempts[idx-2].tagCount.fire) {
      pointsFromComparison += pointsForTieTagComparison}

    if (tagCount.water > arrayOfAttempts[idx-2].tagCount.water) {
      pointsFromComparison += pointsForWinningTagComparison}
    else if (tagCount.water === arrayOfAttempts[idx-2].tagCount.water) {
      pointsFromComparison += pointsForTieTagComparison}

    if (tagCount.earth > arrayOfAttempts[idx-2].tagCount.earth) {
      pointsFromComparison += pointsForWinningTagComparison}
    else if (tagCount.earth === arrayOfAttempts[idx-2].tagCount.earth) {
      pointsFromComparison += pointsForTieTagComparison}

    /// compare vs 1 things ago
    if (tagCount.fire > arrayOfAttempts[idx-1].tagCount.fire) {
      pointsFromComparison += pointsForWinningTagComparison}
    else if (tagCount.fire === arrayOfAttempts[idx-1].tagCount.fire) {
      pointsFromComparison += pointsForTieTagComparison}

    if (tagCount.water > arrayOfAttempts[idx-1].tagCount.water) {
      pointsFromComparison += pointsForWinningTagComparison}
    else if (tagCount.water === arrayOfAttempts[idx-1].tagCount.water) {
      pointsFromComparison += pointsForTieTagComparison}

    if (tagCount.earth > arrayOfAttempts[idx-1].tagCount.earth) {
      pointsFromComparison += pointsForWinningTagComparison}
    else if (tagCount.earth === arrayOfAttempts[idx-1].tagCount.earth) {
      pointsFromComparison += pointsForTieTagComparison}

  }

  const tagCountValues = _.values(tagCount)

  arrayOfAttempts.push({
    tagCount: _.cloneDeep(tagCount),
    numberOfTags: _.sum(tagCountValues),
    minimum: _.min(tagCountValues),
    maximum: _.max(tagCountValues),
    minPoints: calculateMinPoints(tagCountValues),
    maxPoints: calculateMaxPoints(tagCountValues),
    pointsPerTag: calculatePointsPerTag(tagCountValues, pointsFromComparison),
    pointsFromComparison: pointsFromComparison
  })

})

arrayOfAttempts = arrayOfAttempts.slice(2)

const [avgPointsPertag, stdPointsPerTag] = getStandardDeviation(_.map(arrayOfAttempts, 'pointsPerTag'))
const [avgMin, stdMin] = getStandardDeviation(_.map(arrayOfAttempts, 'minimum'))
const [avgMax, stdMax] = getStandardDeviation(_.map(arrayOfAttempts, 'maximum'))

const [avgMinPoints, stdMinPoints] = getStandardDeviation(_.map(arrayOfAttempts, 'minPoints'))
const [avgMaxPoints, stdMaxPoints] = getStandardDeviation(_.map(arrayOfAttempts, 'maxPoints'))

const [avgNumberOfTags, stdNumberOfTags] = getStandardDeviation(_.map(arrayOfAttempts, 'numberOfTags'))

const [avgPointsFromComparison, stdPointsFromComparison] = getStandardDeviation(
  _.map(arrayOfAttempts, 'pointsFromComparison')
)


// const avgPointsPertag = _.mean(_.map(arrayOfAttempts, 'pointsPerTag'))
// const stdPointsPerTag = getStandardDeviation(_.map(arrayOfAttempts, 'pointsPerTag'))

console.log('avgNumberOfTags', avgNumberOfTags)
console.log('stdNumberOfTags', stdNumberOfTags)
console.log('avgNumberOfTags + stdNumberOfTags/2', avgNumberOfTags+stdNumberOfTags/2)

console.log('------------------------------')

console.log('avgPointsFromComparison', avgPointsFromComparison)
console.log('stdPointsFromComparison', stdPointsFromComparison)
console.log('avgPointsFromComparison + stdPointsFromComparison/2',
  avgPointsFromComparison+stdPointsFromComparison/2)

console.log('------------------------------')

console.log('avgPointsPertag', avgPointsPertag)
console.log('stdPointsPerTag', stdPointsPerTag)
console.log('avgPointsPertag + stdPointsPerTag/2', avgPointsPertag+stdPointsPerTag/2)

console.log('------------------------------')

console.log('avgMinPoints', avgMinPoints)
console.log('stdMinPoints', stdMinPoints)
console.log('avgMinPoints + stdMinPoints/2', avgMinPoints+stdMinPoints/2)

console.log('------------------------------')

console.log('avgMaxPoints', avgMaxPoints)
console.log('stdMaxPoints', stdMaxPoints)
console.log('avgMaxPoints + stdMaxPoints/2', avgMaxPoints+stdMaxPoints/2)

console.log('------------------------------')

console.log('avgMin', avgMin)
console.log('stdMin', stdMin)
console.log('avgMin + stdMin/2', avgMin+stdMin/2)

console.log('------------------------------')

console.log('avgMax', avgMax)
console.log('stdMax', stdMax)
console.log('avgMax + stdMax/2', avgMax+stdMax/2)

// console.log('arrayOfAttempts', arrayOfAttempts)

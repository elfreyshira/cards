import _ from 'lodash'
import Brng from 'brng'

const letterFrequencies = {
  E: 11.39356667,
  A: 8.138866667,
  I: 7.684933333,
  T: 7.583633333,
  O: 6.981166667,
  R: 6.966966667,
  N: 6.9348,
  S: 6.905033333,
  L: 4.9231,
  D: 3.8348,
  C: 3.7496,
  H: 3.741133333,
  U: 3.270266667,
  M: 2.7743,
  P: 2.5957,
  G: 2.500166667,
  B: 1.854,
  F: 1.837366667,
  Y: 1.8293,
  K: 1.430533333,
  W: 1.429966667,
  V: 1.039133333,
  
  // Z: 0.2607333333,
  // X: 0.2434,
  // Q: 0.1820666667,
  // J: 0.1688333333
}

const letterRank = {
  E: 1,
  A: 2,
  I: 3,
  T: 4,
  O: 5,
  R: 6,
  N: 7,
  S: 8,
  L: 9,
  D: 10,
  C: 11,
  H: 12,
  U: 13,
  M: 14,
  P: 15,
  G: 16,
  B: 17,
  F: 18,
  Y: 19,
  K: 20,
  W: 21,
  V: 22,
  Z: 23,
  X: 24,
  Q: 25,
  J: 26
}

const FAILURE_MAX = 40000

function consolelog (...args) {
  // return
  console.log(...args)
}

const vowels = ['A', 'E', 'I', 'O', 'U']
// const vowels = []
// const letters = [
//   'A', 'B', 'C', 'D', 'E', 'F', 'G',
//   'H', 'I', 'J', 'K', 'L', 'M', 'N',
//   'O', 'P', 'Q', 'R', 'S', 'T', 'U',
//   'V', 'W', 'X', 'Y', 'Z'
// ]

const isVowel = _.memoize(function (letter) {
  return _.includes(vowels, letter)
})


const firstLetterPicker = new Brng(
  letterFrequencies,
  { // config
    bias: 4,
    // bias: 0,
    keepHistory: true
  }
)
const secondLetterPicker = firstLetterPicker
const thirdLetterPicker = firstLetterPicker

// const secondLetterPicker = new Brng(
//   letterFrequencies,
//   { // config
//     bias: 4,
//     repeatTolerance: 0,
//     keepHistory: true
//   }
// )
// const thirdLetterPicker = new Brng(
//   letterFrequencies,
//   { // config
//     bias: 4,
//     repeatTolerance: 0,
//     keepHistory: true
//   }
// )

function isTooFarApart (firstRank, secondRank) {
  
  if (firstRank <= 8) {
    return secondRank >= 16
  }
  else if (firstRank >= 15) {
    return secondRank <= 7
  }
  else {
    return Math.abs(firstRank - secondRank) > 7
  }
  // return Math.abs(22 - firstrank - secondRank)
}

const failTwoLettersCriteria = _.memoize(function ([firstLetter, secondLetter]) {
  // isSameLetter
  if (secondLetter === firstLetter) return true

  // isTooFarApart
  if (isTooFarApart(letterRank[firstLetter], letterRank[secondLetter])) return true
  
  // isTooStrong
  // if ((letterFrequencies[firstLetter] + letterFrequencies[secondLetter]) > 16) return true

  // isTwoVowels
  if (isVowel(firstLetter) && isVowel(secondLetter)) return true
  
  // IT PASSED!
  return false
})

const failThreeLettersCriteria = _.memoize(function ([firstLetter, secondLetter, thirdLetter]) {
  // isSameLetter
  if ((firstLetter === thirdLetter) || (secondLetter === thirdLetter)) return true

  // isTooFarApart
  const worstRank = Math.max(letterRank[firstLetter], letterRank[secondLetter])
  if (isTooFarApart(worstRank, letterRank[thirdLetter])) return true
  
  // isTooStrong
  // if (
  //   (letterFrequencies[firstLetter]
  //     + letterFrequencies[secondLetter]
  //     + letterFrequencies[thirdLetter]
  //   ) > 14
  // ) return true

  // two vowels in one card
  if (
    (isVowel(firstLetter) || isVowel(secondLetter))
    && isVowel(thirdLetter)
  ) return true

  // IT PASSED!
  return false

})

function pickSecondLetter(firstLetter) {

  let secondLetter = secondLetterPicker.pick()

  let timesFailed = 0
  while (failTwoLettersCriteria([firstLetter, secondLetter])) {
    timesFailed++
    if (timesFailed > FAILURE_MAX) return false
    // consolelog(firstLetter, secondLetter)
    secondLetterPicker.undo()
    secondLetter = secondLetterPicker.pick()
  }
  return secondLetter
}

function pickThirdLetter(firstLetter, secondLetter) {
  
  // NO THIRD LETTER
  return null

  if (letterFrequencies[firstLetter] + letterFrequencies[secondLetter] < 5) {
    let thirdLetter = thirdLetterPicker.pick()

    let timesFailed = 0
    while (failThreeLettersCriteria([firstLetter, secondLetter, thirdLetter])) {
      timesFailed++
      if (timesFailed > FAILURE_MAX) return false
      // consolelog(firstLetter, secondLetter, thirdLetter)
      thirdLetterPicker.undo()
      thirdLetter = thirdLetterPicker.pick()
    }
    return thirdLetter
  }
  else {
    return null
  }
}

const getTotalFrequency = _.memoize(
  function ([firstLetter, secondLetter, thirdLetter]) {
    return letterFrequencies[firstLetter]
      + letterFrequencies[secondLetter]
      + (letterFrequencies[thirdLetter] || 0)
  }
)

const getLetterRankProduct = _.memoize(
  function ([firstLetter, secondLetter, thirdLetter]) {
    return letterRank[firstLetter]
      * letterRank[secondLetter]
      * (letterRank[thirdLetter] || 1)
  }
)

function getPointValue ([firstLetter, secondLetter, thirdLetter]) {
  const initial = 19 - getTotalFrequency([firstLetter, secondLetter, thirdLetter])
  const adjusted = (initial/3) + 1
  // const adjusted = Math.pow(initial, 0.5) + 1
  return adjusted
}

function generateX (letterSets, numberOfCards, alreadyChosenLetters) {

  let cardsCreated = 0
  let consecutiveDuplicates = 0

  while ((cardsCreated < numberOfCards) && (consecutiveDuplicates < FAILURE_MAX)) {
  // _.times(numberOfCards, () => {
    const firstLetter = firstLetterPicker.pick()
    const secondLetter = pickSecondLetter(firstLetter)
    if (secondLetter === false) {
      firstLetterPicker.undo()
      // consolelog('FAIL: picking a 2rd letter')
      continue
    }
    
    const thirdLetter = pickThirdLetter(firstLetter, secondLetter)
    if (thirdLetter === false) {
      firstLetterPicker.undo()
      secondLetterPicker.undo()
      // consolelog('FAIL: picking a 3rd letter')
      continue
    }

    const letters = [firstLetter, secondLetter, thirdLetter]

    const totalFrequency = _.round(getTotalFrequency(letters), 4)
    const letterRankProduct = getLetterRankProduct(letters)
    
    if (alreadyChosenLetters[totalFrequency+letterRankProduct]) {
      firstLetterPicker.undo()
      secondLetterPicker.undo()
      if (!!thirdLetter) thirdLetterPicker.undo()
      // consolelog('THROW AWAY DUPLICATE', letters)
      consecutiveDuplicates++
      continue
    }
    else {
      alreadyChosenLetters[totalFrequency+letterRankProduct] = true
      consecutiveDuplicates = 0
    }

    const totalPoints = getPointValue(letters)
    letterSets.push({letters: [firstLetter, secondLetter, thirdLetter], points: totalPoints})
    cardsCreated++

    // letterSets.push([firstLetter, secondLetter])
  }

}

function generateCards () {
  const letterSets = []
  
  // let shouldKeepGoing = true
  // while (shouldKeepGoing) {
  //   generateX(letterSets, 5)
  //   shouldKeepGoing = !!prompt('keep going (any/blank)?')
  // }
  const alreadyChosenLetters = {}
  generateX(letterSets, 100, alreadyChosenLetters)
  console.log('letterSets.length', letterSets.length)
  
  firstLetterPicker.reset()
  generateX(letterSets, 100, alreadyChosenLetters)
  console.log('letterSets.length', letterSets.length)

  firstLetterPicker.reset()
  generateX(letterSets, 100, alreadyChosenLetters)
  console.log('letterSets.length', letterSets.length)

  firstLetterPicker.reset()
  generateX(letterSets, 100, alreadyChosenLetters)
  console.log('letterSets.length', letterSets.length)

  firstLetterPicker.reset()
  generateX(letterSets, 100, alreadyChosenLetters)
  console.log('letterSets.length', letterSets.length)

  firstLetterPicker.reset()
  generateX(letterSets, 100, alreadyChosenLetters)
  console.log('letterSets.length', letterSets.length)

  firstLetterPicker.reset()
  generateX(letterSets, 100, alreadyChosenLetters)
  console.log('letterSets.length', letterSets.length)

  firstLetterPicker.reset()
  generateX(letterSets, 100, alreadyChosenLetters)
  console.log('letterSets.length', letterSets.length)

  firstLetterPicker.reset()
  generateX(letterSets, 100, alreadyChosenLetters)
  console.log('letterSets.length', letterSets.length)

  firstLetterPicker.reset()
  generateX(letterSets, 100, alreadyChosenLetters)
  console.log('letterSets.length', letterSets.length)

  consolelog('alreadyChosenLetters', Object.keys(alreadyChosenLetters).length, alreadyChosenLetters)

  letterSets.push({letters: ['J', 'Q', 'X', 'Z'], points: 7})
  letterSets.push({letters: ['J', 'Q', 'X', 'Z'], points: 7})
  letterSets.push({letters: ['A', 'E', 'I', 'O', 'U'], points: 0})
  letterSets.push({letters: ['A', 'E', 'I', 'O', 'U'], points: 0})
  letterSets.push({letters: ['A', 'E', 'I', 'O', 'U'], points: 0})
  letterSets.push({letters: ['A', 'E', 'I', 'O', 'U'], points: 0})
  return letterSets
}


const cards = generateCards()
consolelog('TOTAL CARD LENGTH', cards.length)


export default cards

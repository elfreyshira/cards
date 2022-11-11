import _ from 'lodash'

const COMPARISON = 'COMPARISON'
const SIMPLE = 'SIMPLE'

const FIRST_PRIORITY = 'FIRST_PRIORITY'
const LAST_PRIORITY = 'LAST_PRIORITY'

const POINTS_HIGH = [10, 5, 2]
const POINTS_LOW = [6, 3, 1]

const endGameCardObj = {
  type: COMPARISON,
  // toCompare: 'earth',
  toCompare: 'SPOT + HOME',
  priority: FIRST_PRIORITY,
  points: POINTS_HIGH
}


const toCompareArray = [
  'earth',
  'fire',
  'water',
  'card',
  'money',
  'regions',
  'fire track',
  'earth track',
  'water track'
]
let endGameCardArray = []

_.forEach(toCompareArray, (toCompare) => {
  endGameCardArray.push({
    type: COMPARISON,
    toCompare: toCompare,
    priority: FIRST_PRIORITY,
    points: POINTS_HIGH
  })
  endGameCardArray.push({
    type: COMPARISON,
    toCompare: toCompare,
    priority: FIRST_PRIORITY,
    points: POINTS_LOW
  })
})


_.forEach(['total: spot + tap', 'total: spot + home', 'total: tap + home'], (toCompare) => {
  endGameCardArray.push({
    type: COMPARISON,
    toCompare: toCompare,
    priority: FIRST_PRIORITY,
    points: POINTS_HIGH
  })
  endGameCardArray.push({
    type: COMPARISON,
    toCompare: toCompare,
    priority: FIRST_PRIORITY,
    points: POINTS_LOW
  })
  endGameCardArray.push({
    type: COMPARISON,
    toCompare: toCompare,
    priority: LAST_PRIORITY,
    points: POINTS_LOW
  })
})

_.times(6, (idx) => {
  endGameCardArray.push({
    type: SIMPLE,
    points: idx+4
  })
})

console.log(endGameCardArray)

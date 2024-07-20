import _ from 'lodash'
import Brng from 'brng'

import generateValues from './generate-values.js'
import CONSTANTS from './CONSTANTS.js'

// import './index.css'

// console.clear()

const TYPES_OF_CARD = ['wp', 'cr', 'rd']
const QUANTITY_PER_STRENGTH = 1
const strengthArray = [
  2,    2.5,  3,    // tier 1
  3.5,  4,    4.5,  // tier 2
  5,    5.5,  6     // tier 3
]

const cardCostProportions = {
  0: 1,
  1: 1,
  2: 1,
  3: 1,
  4: 1,
  5: 1,
  6: 1,
  7: 1,
  8: 1,
}

function Cards () {
  return <div>hello world</div>
}

export default Cards



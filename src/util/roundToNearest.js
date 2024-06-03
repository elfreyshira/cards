import _ from 'lodash'

// roundToNearest(60, 50) == 50
// roundToNearest(5.48, 0.1) == 5.5

export default function roundToNearest (num, precision) {
  return Math.round(num/precision)*precision
}

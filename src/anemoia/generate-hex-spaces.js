import _ from 'lodash'
import Brng from 'brng'

// const numberOfResourcesRoller = new Brng({1: 4, 2: 3, 3: 2}, {bias: 4})
const numberOfResourcesRoller = new Brng({water: 1, earth: 1, fire: 1}, {bias: 4})



// const numberToTypeMapping = {
//   1: new Brng({water: 1, earth: 1, fire: 1}, {bias: 4}),
//   2: new Brng({water: 1, earth: 1, fire: 1}, {bias: 4}),
//   3: new Brng({water: 1, earth: 1, fire: 1}, {bias: 4}),
// }

const numberToTypeMapping = {
  water: new Brng({1: 4, 2: 3, 3: 2}, {bias: 4}),
  earth: new Brng({1: 4, 2: 3, 3: 2}, {bias: 4}),
  fire: new Brng({1: 4, 2: 3, 3: 2}, {bias: 4}),
}


_.times(30, () => {
  // const resourceCount = _.toNumber(numberOfResourcesRoller.roll())
  const resourceCount = numberOfResourcesRoller.roll()
  const costType = numberToTypeMapping[resourceCount].roll()

  console.log(resourceCount, costType)
})

import _ from 'lodash'
import Brng from 'brng'

const momentArray = [

  // 3 resources
  {wild: 3},
  {wildsame: 3},
  {fire: 1, water: 1, earth: 1},
  {fire: 1, wildsame: 2},
  {water: 1, wildsame: 2},
  {earth: 1, wildsame: 2},

  // 4 resources
  {wildsame: 4},
  {wild: 4},
  {fire: 1, water: 1, earth: 1, wild: 1},
  {fire: 2, wildsame: 2},
  {water: 2, wildsame: 2},
  {earth: 2, wildsame: 2},

  // 5 resources
  {wild: 5},
  {wildsame: 4, wild: 1},
  {fire: 1, water: 1, earth: 1, wild: 2},
  {fire: 2, wildsame: 3},
  {water: 2, wildsame: 3},
  {earth: 2, wildsame: 3},

  // 6 resources
  {fire: 2, water: 2, earth: 2},
  {wildsame: 3, wildsame2: 3},
  {wild: 6},
  {fire: 2, wild: 4},
  {water: 2, wild: 4},
  {earth: 2, wild: 4},
]

const costValueOfSame = [80, 90, 100, 100, 100]

function calculateValueFromResourceCost (resourceCostObj) {
  let costValue = 0

  _.forEach(resourceCostObj, (number, resource) => {
    if (_.includes(['fire','water','earth'], resource)) {
      costValue += number * 100
    }
    else if (resource === 'wild') {
      costValue += number * 80
    }
    else if (_.includes(['wildsame', 'wildsame2'], resource)) {
      costValue += _.sum(costValueOfSame.slice(0, number))
    }
  })

  return costValue
}

const strongMultiplier = 1.35
const weakMultiplier = 1.2
const pointMultiplierMapping = [strongMultiplier, weakMultiplier, 1.0, 1/weakMultiplier, 1/strongMultiplier]

function calculatePointSpaces (costValue) {
  return _.times(5, (idx) => _.round(costValue * pointMultiplierMapping[idx] / 25))

}

_.forEach(momentArray, (resoureceObj) => {
  console.log(
    calculatePointSpaces(calculateValueFromResourceCost(resoureceObj)),
    JSON.stringify(resoureceObj)
  )
})

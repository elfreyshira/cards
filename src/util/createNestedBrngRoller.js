import _ from 'lodash'
import Brng from 'brng'

const elfrey = {
  // a0: 1,
  a: {weight: 1, children: {
    aa: 1,
    ab: {weight: 3, children: {
      aba: 1,
      abb: 3,
      abc: 5,
    }},
    ac: {weight: 5, children: {
      aca: 2,
      acb: 5,
    }}
  }},
  b: 1,
  c: 1
}


// parentRoller = {a: 4, b: 5}
// childARoller = {aa: 2, ab: 3, ac: 2}
// childABRoller = {aaa: 3, abb: 2, abc: 5}

function createFlattenedRoller (nestedProportions, config = {}) {
  const flatProportions = _.mapValues(nestedProportions, (value, key) => {
    let weightNumber = value
    if (_.isObject(weightNumber)) {
      weightNumber = value.weight
    }
    return weightNumber
  })

  return new Brng(flatProportions, config)
}

// !!! writes to `rollers``
function createChildrenRollersFromParent (parentProportions, config = {}, rollers = {}) {

  _.forEach(parentProportions, (value, key) => {
    if (_.isObject(value)) {
      rollers[key] = createFlattenedRoller(value.children, config)
      createChildrenRollersFromParent(value.children, config, rollers)
    }
  })
  return rollers

}

function createNestedBrng (nestedProportions, config = {}) {
  const childrenRollers = createChildrenRollersFromParent(nestedProportions, config)
  const parentRoller = createFlattenedRoller(nestedProportions, config)

  const roll = (settings) => {
    let chosenValue = parentRoller.roll(settings)
    while (_.has(childrenRollers, chosenValue)) {
      chosenValue = childrenRollers[chosenValue].roll(settings)
    }
    return chosenValue
  }

  return {roll: roll}
  

}

export default createNestedBrng



// console.log(createChildrenRollersFromParent(elfrey))

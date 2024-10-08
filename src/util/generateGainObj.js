import _ from 'lodash'

import getNewExcludeList from './getNewExcludeList.js'
import getAvailableResources from './getAvailableResources.js'

function generateGainObj ({

  // REQUIRED
  resourceToValueMapping, // {key: Number | Function}
  cardObj, // {expectedValue, ...}
  expectedValue,
  resourceRoller, // brng object

  // OPTIONAL
  valueSlack = 0,
  exclusionRules = {},
  gainObj = {},
  currentValue = 0,
  excludeList = [],
  addUndo = _.noop(),
  addRedo = _.noop(),
}) {

  const tempGainObj = _.cloneDeep(gainObj)
  let tempCurrentVal = currentValue
  let tempExpectedValue = expectedValue || cardObj.expectedValue

  while (true) {

    const onlyList = getAvailableResources(
      resourceToValueMapping,
      tempExpectedValue - tempCurrentVal,
      valueSlack,
      cardObj
    )

    const newExcludeList = _.uniq(_.concat(
      excludeList,
      getNewExcludeList(tempGainObj, exclusionRules)
    ))

    const chosenResource = _.attempt(
      () => resourceRoller.roll({only: onlyList, exclude: newExcludeList})
    )
    if (_.isError(chosenResource)) {
      break
    }
    else {
      tempGainObj[chosenResource] = tempGainObj[chosenResource]
        ? tempGainObj[chosenResource] + 1 : 1

      const valueIncrease = _.isFunction(resourceToValueMapping[chosenResource]) ?
        resourceToValueMapping[chosenResource](cardObj) : resourceToValueMapping[chosenResource]
      
      tempCurrentVal =  tempCurrentVal + valueIncrease

      addUndo(resourceRoller, chosenResource)
      addRedo(resourceRoller, chosenResource)
    }

  }

  return {gainObj: tempGainObj, currentValue: tempCurrentVal}
}

export default generateGainObj

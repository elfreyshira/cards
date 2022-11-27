import _ from 'lodash'
import {
  ABSTRACT_RESOURCE_ARRAY,
  SPECIAL_RESOURCE_ARRAY,
  PHYSICAL_RESOURCE_ARRAY,
  LATER_RESOURCE_ARRAY,
  NOW_RESOURCE_ARRAY
} from './CONSTANTS.js'


function getNewIncludeExcludeList (gainObj, chosenResource, includeList, excludeList) {

  let newExcludeList = _.cloneDeep(excludeList)
  let newIncludeList = _.cloneDeep(includeList)

  
  ////// WHAT RESOURCE WAS CHOSEN
  ////// WHAT RESOURCE WAS CHOSEN

  // max of 3 money gain
  if (chosenResource === 'money' && gainObj[chosenResource] === 3) {
    newExcludeList = _.concat(newExcludeList, chosenResource)
  }
  // max of 2 'card' resource gain
  else if (chosenResource === 'card' && gainObj[chosenResource] === 2) {
    newExcludeList = _.concat(newExcludeList, chosenResource)
  }

  // don't have money and card together
  if (chosenResource === 'money') {newExcludeList.push('card')}
  else if (chosenResource === 'card') {newExcludeList.push('money')}

  // don't have firelater and fire on the same card
  else if (chosenResource === 'waterlater') {newExcludeList.push('water')}
  else if (chosenResource === 'firelater') {newExcludeList.push('fire')}
  else if (chosenResource === 'earthlater') {newExcludeList.push('earth')}
  // else if (chosenResource === 'wildlater') {newExcludeList.push('wild')}
  else if (chosenResource === 'water') {newExcludeList.push('waterlater')}
  else if (chosenResource === 'fire') {newExcludeList.push('firelater')}
  else if (chosenResource === 'earth') {newExcludeList.push('earthlater')}
  // else if (chosenResource === 'wild') {newExcludeList.push('wildlater')}

  /////////////

  // only 1 abstract resource per card
  if (_.includes(ABSTRACT_RESOURCE_ARRAY, chosenResource)) {
    newExcludeList = _.concat(newExcludeList, ABSTRACT_RESOURCE_ARRAY)
  }

  // don't have `later` and `grabanother` on the same card
  if (_.includes(LATER_RESOURCE_ARRAY, chosenResource)) {
    newExcludeList = _.concat(newExcludeList, 'grabanother')
  }
  else if (chosenResource === 'grabanother') {
    newExcludeList = _.concat(newExcludeList, LATER_RESOURCE_ARRAY)
  }

  ///////////////////// ^ CHOSEN RESOURCE //////////////////
  ///////////////////// ^ CHOSEN RESOURCE //////////////////

  // if it has at least 2 physical resources, don't add anymore physical resources
  if (_.intersection(_.keys(gainObj), PHYSICAL_RESOURCE_ARRAY).length === 2) {
    newExcludeList = _.concat(
      newExcludeList,
      _.without(PHYSICAL_RESOURCE_ARRAY, ..._.keys(gainObj))
    )
  }


  // max of 3 `elementlater` for each element
  if (
    _.includes(LATER_RESOURCE_ARRAY, chosenResource) &&
    _.sumBy(LATER_RESOURCE_ARRAY, (laterKey) => {return gainObj[laterKey] || 0}) === 3
  ) {
    newExcludeList = _.concat(newExcludeList, LATER_RESOURCE_ARRAY)
  }

  // max of 2 `element` now for each element
  else if (
    _.includes(NOW_RESOURCE_ARRAY, chosenResource)
    && gainObj[chosenResource] === 2
  ) {
    newExcludeList = _.concat(excludeList, chosenResource)
  }

  // if there's 3 total resources involved in the gain, absolutely don't add anymore
  if (gainObj[chosenResource] === 1 && _.keys(gainObj).length === 3) {
    newIncludeList = _.without(_.keys(gainObj), ...ABSTRACT_RESOURCE_ARRAY)
  }

  return {
    newIncludeList, newExcludeList
  }

}

export default getNewIncludeExcludeList

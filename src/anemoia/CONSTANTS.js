import _ from 'lodash'


const SPOT = 'SPOT'
const HOME = 'HOME'
const TAP = 'TAP'

const MIN_POINTS_MAP = {
  POINTS_0_3: 0,
  POINTS_1_4: 1,
  POINTS_5_8: 5
}
const LEVELS = {
  LEVEL_1: 'LEVEL_1',
  LEVEL_2: 'LEVEL_2',
  LEVEL_3: 'LEVEL_3',
  LEVEL_4: 'LEVEL_4',
}

const LATER_COUNT_ADDITIONAL_VALUE_MAPPING = {
  0: 0,
  1: 0,
  2: 5,
  3: 15,
}

function getLaterResourceValue (cardObj = {}, isForFuture = false) {
  // _.chain(cardObj.gain)
  //   .pickBy((val, key) => {
  //     return _.includes(key, 'later')
  //   })
  //   .values()
  //   .sum()
  //   .value()
  return 40
}

const RESOURCE_GAIN_VALUE = {
  money: _.constant(25),
  card: _.constant(50),
  fire: _.constant(100),
  firelater: _.constant(40),
  water: _.constant(100),
  waterlater: _.constant(40),
  earth: _.constant(100),
  earthlater: _.constant(40),
  wild: _.constant(120),
  // wildlater: _.constant(50),
  grabanother: _.constant(60),
  untap: (cardObj = {}) => {
    // if (!_.isEmpty(cardObj) && cardObj.type === HOME) {
    if (cardObj.type === HOME) {
      // only valuable when you have more tapped cards than workers you rested
      return 95
    }
    else {
      return 140
    }
  },
  retrieve: _.constant(50),
  chainLevel1: _.constant(75),
  chainLevel2: _.constant(100),
  chainLevel3: _.constant(125),
  chainLevel4: _.constant(150),
  point: _.constant(25),
}

const RESOURCE_LOSS_VALUE = {
  money: 25,
  card: 40, // discarding unwanted cards doesn't hurt as much
  fire: 100,
  water: 100,
  earth: 100,
  wild: 80,
  wildsame: 80, // increases the more you add
  tapAnother: 140,
  points4: 120,
  points2: 60,
}

////////////////////////////////////////////

const ABSTRACT_RESOURCE_ARRAY = ['untap', 'retrieve', 'grabanother',
  'chainLevel1','chainLevel2', 'chainLevel3', 'chainLevel4']

const SPECIAL_RESOURCE_ARRAY = ['money', 'card']

const PHYSICAL_RESOURCE_ARRAY = ['fire', 'water', 'earth', 'wild',
  'firelater', 'waterlater', 'earthlater']

const LATER_RESOURCE_ARRAY = ['firelater', 'waterlater', 'earthlater']
const NOW_RESOURCE_ARRAY = ['fire', 'water', 'earth', 'wild']


////////////////////////////////////////////
////////////////////////////////////////////
/// BRNG ROLLERS

//////// MAXVALUE
const spotLevelProportions = {
  LEVEL_2: 1, // level 2 // 225
  LEVEL_3: 1, // level 3 // 287
  LEVEL_4: 1, // level 4 // 350
}
const spotLevelToMaxvalueMapping = {
  LEVEL_2: 225,
  LEVEL_3: 290,
  LEVEL_4: 350,
}

const homeMaxvalueProportions = {
  125: 1,
  150: 1,
  175: 1,
  200: 1,
  225: 1,
  250: 1,
}

const tapMaxvalueProportions = {
  125: 1,
  150: 1,
  175: 1,
  200: 1,
  225: 1,
}

//////// GAIN

const baseResourceGainProportions = {
  money: 3.5,
  card: 2.5,
  fire: 1.9,
  firelater: 1,
  water: 1.9,
  waterlater: 1,
  earth: 1.9,
  earthlater: 1,
  wild: 3.3,
  chainLevel1: 0.35,
  chainLevel2: 0.35,
  chainLevel3: 0.35,
  chainLevel4: 0.35,
}

const spotResourceGainProportions = _.merge({}, baseResourceGainProportions, {
  grabanother: 0.8, // changed later
  untap: 1.6, // changed later
  retrieve: 1.8, // changed later
})
const homeResourceGainProportions = _.merge({}, baseResourceGainProportions, {
  grabanother: 0.9, // changed
  untap: 1.8, // changed
  // retrieve: 1.8, // removed
})

const tapResourceGainProportions = _.merge({}, baseResourceGainProportions, {
  grabanother: 0.9, // changed
  // untap: 1.6, // removed
  retrieve: 2.0, // changed
})

//////// LOSS

const baseResourceLossProportions = {
  fire: 1.9,
  water: 1.9,
  earth: 1.9,
  wild: 3.3,
  points4: 2,
}
const spotResourceLossProportions = _.merge({}, baseResourceLossProportions, {
  // tapAnother: 3.7
})
const homeResourceLossProportions = {points4: 2, points2: 2}
const tapResourceLossProportions = _.cloneDeep(baseResourceLossProportions)

const pointGeneratorResourceLossProportions = {
  fire: 1,
  water: 1,
  earth: 1,
  wild: 1.5,
  card: 1,
  money: 1,
}

////////////////////////////////////////////

export {
  SPOT,
  HOME,
  TAP,
  MIN_POINTS_MAP,
  LEVELS,
  RESOURCE_GAIN_VALUE,
  RESOURCE_LOSS_VALUE,
  LATER_COUNT_ADDITIONAL_VALUE_MAPPING,
  ////////////////
  ABSTRACT_RESOURCE_ARRAY,
  SPECIAL_RESOURCE_ARRAY,
  PHYSICAL_RESOURCE_ARRAY,
  LATER_RESOURCE_ARRAY,
  NOW_RESOURCE_ARRAY,
  //////////////
  spotResourceGainProportions,
  homeResourceGainProportions,
  tapResourceGainProportions,
  //////////
  spotResourceLossProportions,
  homeResourceLossProportions,
  tapResourceLossProportions,
  pointGeneratorResourceLossProportions,
  //////
  spotLevelProportions,
  spotLevelToMaxvalueMapping,
  homeMaxvalueProportions,
  tapMaxvalueProportions,
}

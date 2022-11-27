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
  grabanother: _.constant(55),
  untap: (cardObj = {}) => {
    // if (!_.isEmpty(cardObj) && cardObj.type === HOME) {
    if (cardObj.type === HOME) {
      // untap for home doesn't have any effect when activated on rest.
      // therefore it's less valuable on a HOME card.
      return 100
    }
    else {
      return 150
    }
  },
  retrieve: _.constant(50),
  chainLevel1: _.constant(50),
  chainLevel2: _.constant(100),
  chainLevel3: _.constant(150),
}

const RESOURCE_LOSS_VALUE = {
  // money: 50,
  // card: 37.5, // discarding unwanted cards doesn't hurt as much
  fire: 100,
  water: 100,
  earth: 100,
  wild: 80,
  tapAnother: 140
}

////////////////////////////////////////////

const ABSTRACT_RESOURCE_ARRAY = ['untap', 'retrieve', 'grabanother',
  'chainLevel1','chainLevel2', 'chainLevel3']

const SPECIAL_RESOURCE_ARRAY = ['money', 'card']

const PHYSICAL_RESOURCE_ARRAY = ['fire', 'water', 'earth', 'wild',
  'firelater', 'waterlater', 'earthlater']

const LATER_RESOURCE_ARRAY = ['firelater', 'waterlater', 'earthlater']
const NOW_RESOURCE_ARRAY = ['fire', 'water', 'earth', 'wild']

export {
  SPOT,
  HOME,
  TAP,
  MIN_POINTS_MAP,
  LEVELS,
  RESOURCE_GAIN_VALUE,
  RESOURCE_LOSS_VALUE,
  ////////////////
  ABSTRACT_RESOURCE_ARRAY,
  SPECIAL_RESOURCE_ARRAY,
  PHYSICAL_RESOURCE_ARRAY,
  LATER_RESOURCE_ARRAY,
  NOW_RESOURCE_ARRAY,
}

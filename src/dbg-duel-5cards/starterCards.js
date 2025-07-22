import _ from 'lodash'

const PLAYER_COUNT = 2

const starterCardsArray = _.flatten(_.times(PLAYER_COUNT, (index) => [
  {
    "cost": "P" + (index + 1),
    "gain": {
      "atk": 2
    },
  },
  {
    "cost": "P" + (index + 1),
    "gain": {
      "atk": 2
    },
  },
  {
    "cost": "P" + (index + 1),
    "gain": {
      "money": 2
    },
  },
  {
    "cost": "P" + (index + 1),
    "gain": {
      "money": 2
    },
  },
  {
    "cost": "P" + (index + 1),
    "gain": {
      "atk": 1,
      "money": 1,
    },
  },
  {
    "cost": "P" + (index + 1),
    "gain": {
      "atk": 1,
      "money": 1,
    },
  },
  {
    "cost": "P" + (index + 1),
    "gain": {
      "nextAtk": 2,
      "bonus": 1,
    },
  },
  {
    "cost": "P" + (index + 1),
    "gain": {
      "money": 1,
      "nextAtk": 1,
      "bonus": 1,
    },
  },

]))

export default starterCardsArray

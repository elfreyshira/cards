import _ from 'lodash'

const PLAYER_COUNT = 1

const starterCardsArray = _.flattenDeep(_.times(PLAYER_COUNT, (index) => [
  _.times(2, () => ({
    "cost": "P" + (index + 1),
    "gain": {
      "cost1": 1,
      "money": 2,
    }
  })),
  {
    "cost": "P" + (index + 1),
    "gain": {
      "cost2": 1,
      "money": 3,
    }
  },
  {
    "cost": "P" + (index + 1),
    "gain": {
      "cost0": 1,
      "deckCycle": 1,
      "reroll": 1,
    }
  },
  {
    "cost": "P" + (index + 1),
    "gain": {
      "cost0": 1,
      "trashMarket": 1,
      "reroll": 1,
    }
  },
  _.times(5, () => ({
    "cost": "P" + (index + 1),
    "gain": {
      "cost0": 1,
      "money": 1,
    }
  })),

]))

export default starterCardsArray

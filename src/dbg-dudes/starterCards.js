import _ from 'lodash'

const PLAYER_COUNT = 2

const starterCardsArray = _.flatten(_.times(PLAYER_COUNT, (index) => [
  {
    "cost": "P" + (index + 1),
    "gainBottom": {
      "retaliate": 1
    },
    "gainTop": {
      "moveTroop": 2,
    },
  },
  {
    "cost": "P" + (index + 1),
    "gainBottom": {
      "atk": 1
    },
    "gainTop": {
      _chooseOne: true,
      "moveTroop": 2,
      "extract": 1,
    },
  },

  {
    "cost": "P" + (index + 1),
    "gainBottom": {
      "def": 1
    },
    "gainTop": {
      _chooseOne: true,
      "moveTroop": 2,
      "extract": 1,
    },
  },
  {
    "cost": "P" + (index + 1),
    "gainBottom": {
      "rally": 1
    },
    "gainTop": {
      _chooseOne: true,
      "addTroop": 1,
      "extract": 1,
    },
  },
  {
    "cost": "P" + (index + 1),
    "gainBottom": {
      "retreat": 1
    },
    "gainTop": {
      _chooseOne: true,
      "addTroop": 1,
      "extract": 1,
    },
  },
  {
    "cost": "P" + (index + 1),
    "gainBottom": {
      "def": 1
    },
    "gainTop": {
      _chooseOne: true,
      "addTroop": 1,
      "extract": 1,
    },
  },

  {
    "cost": "P" + (index + 1),
    "gainBottom": {
      "def": 1
    },
    "gainTop": {
      "addTroop": 1,
    },
  },

  {
    "cost": "P" + (index + 1),
    "gainBottom": {
      "atk": 1
    },
    "gainTop": {
      "addTroop": 1,
    },
  },


  {
    "cost": "P" + (index + 1),
    "gainBottom": {
      "atk": 1
    },
    "gainTop": {
      "addTroop": 1,
    },
  },


]))

export default starterCardsArray

 // {
 //    "cost": "4",
 //    "type": "meat",
 //    "shapeID": "I4",
 //    "size": "4",
 //    "gain": {
 //      "money": 1,
 //      "point": 2,
 //    },
 //    "currentValue": 4.25
 //  },

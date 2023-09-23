import _ from 'lodash'

// {
//   "cost": "5",
//   "comboType": "CC",
//   "priority": "bottom",
//   "top": {
//     "cycle": 2,
//     "money": 2,
//     "energy": 1
//   },
//   "bottom": {
//     "waterBottom": 4.5,
//     "combo": "waterBottom"
//   },
//   "uuid": "knlpuyurtxg",
//   "topValue": 450,
//   "bottomValue": 450
// },

export default [
  {
    cost: "0",
    top: {fireTop: 2},
    bottom: {money: 1},
    index: 1,
  },
  {
    cost: "0",
    top: {waterTop: 2},
    bottom: {money: 1},
    index: 2,
  },
  {
    cost: "0",
    top: {earthTop: 2},
    bottom: {money: 1},
    index: 3,
  },

  {
    cost: "0",
    top: {wildTop: 1, energy: 1},
    bottom: {money: 1},
    index: 4,
  },
  {
    cost: "0",
    top: {wildTop: 1, energy: 1},
    bottom: {money: 1},
    index: 5,
  },
  {
    cost: "0",
    top: {wildTop: 1, energy: 1},
    bottom: {money: 1},
    index: 6,
  },

  {
    cost: "0",
    top: {money: 2},
    bottom: {fireBottom: 1},
    index: 7,
  },
  {
    cost: "0",
    top: {money: 2},
    bottom: {waterBottom: 1},
    index: 8,
  },
  {
    cost: "0",
    top: {money: 2},
    bottom: {earthBottom: 1},
    index: 9,
  },

  {
    cost: "0",
    top: {money: 2},
    bottom: {wildBottom: 1},
    index: 10,
  },
]

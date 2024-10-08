import _ from 'lodash'

const carbs = [
  'T4',
  'S4',
  'L4',
  'L4',
  'I4',
  'O4',
]
const meats = [
  'S4',
  'I4',
]
const veggies = [
  'O4',
  'T4',
]

const PLAYER_COUNT = 4

const starterCardsArray = _.flatten(_.times(PLAYER_COUNT, (index) => _.concat(

  _.map(carbs, shapeID => {
    let gain = {carb4: 1, money: 1}

    // if (shapeID === 'I4') {
    //   gain = {carb4: 1, point: 1}
    // }

    return {
      type: 'carb',
      shapeID,
      gain,
      starter: index+1,
    }
  }),
  
  _.map(meats, shapeID => {

    let gain = {meat4: 1, money: 2}
    if (shapeID === 'I4') {
      gain = {meat4: 1, point: 2}
    }

    return {
      type: 'meat',
      shapeID,
      gain,
      starter: index+1,
    }
  }),
  
  _.map(veggies, shapeID => {

    let gain = {veggie4: 1, point: 1, bonus: 1}
    if (shapeID === 'T4') {
      gain = {veggie4: 1, money: 1, bonus: 1}
    }

    return {
      type: 'veggie',
      shapeID,
      gain,
      starter: index+1,
    }
  }),
)))

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

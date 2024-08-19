import _ from 'lodash'

const normals = [
  'T4',
  'T4',
  'S4',
  'S4',
  'L4',
  'L4',
  'I4',
  'O4',
]
const specials = [
  'I4',
  'O4',
]

const starterCardsArray = _.flatten(_.concat(
  _.times(2, (index) => {
    return _.map(normals, shapeID => {
      let gain = {normal4: 1, money: 1}

      if (shapeID === 'I4') {
        gain = {normal4: 1, point: 1}
      }

      return {
        type: 'normal',
        shapeID,
        gain,
        starter: index+1,
      }
    })
  }),
  _.times(2, (index) => {
    return _.map(specials, shapeID => {

      let gain = {special4: 1, point: 2}
      if (shapeID === 'I4') {
        gain = {special4: 1, money: 2}
      }

      return {
        type: 'special',
        shapeID,
        gain,
        starter: index+1,
      }
    })
  })
))

export default starterCardsArray

 // {
 //    "cost": "4",
 //    "type": "special",
 //    "shapeID": "I4",
 //    "size": "4",
 //    "gain": {
 //      "money": 1,
 //      "point": 2,
 //    },
 //    "currentValue": 4.25
 //  },

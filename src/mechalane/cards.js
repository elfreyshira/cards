import _ from 'lodash'

const cards = [
  {
    type: 'AGENT',
    race: 'HUMAN',
    attack: 4,
    defense: 5,
    effect: 'BEHIND ATTACK + 2'
  }, {
    type: 'ALLY',
    race: 'MECHA',
    effect: 'RECRUIT 1 / TRAIN 2',
    attackBonus: 'RANGE + 1',
    defenseBonus: 'LIFE'
  }
]

export default cards

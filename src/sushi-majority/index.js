import _ from 'lodash'
import Brng from 'brng'
import seed from 'seed-random'

import '../util/base.css'
import generateGainObj from '../util/generateGainObj.js'
import getLeastSimilarObj from '../util/getLeastSimilarObj.js'
import createNestedBrngRoller from '../util/createNestedBrngRoller.js'
import countOccurances from '../util/countOccurances.js'

import cardsArray from './cards.js'


import ICONS from '../util/icons.js'
import './index.css'

// import starterCards from './starterCards.js'

// console.clear()


const params = new URL(document.URL).searchParams
const seedID = params.get('seed')
if (_.isString(seedID)) {
  Brng.random = seed(seedID)
}
else {
  const generatedSeedId = Math.random().toString(36).slice(2,6)
  Brng.random = seed(generatedSeedId)
  console.log('generatedSeedId', generatedSeedId)
}

const CARD_QUANTITY = cardsArray.length

const SymbolIconMap = {
  wild: ICONS.Wild,
  red: ICONS.Fire,
  blue: ICONS.Water,
  green: ICONS.Earth
}


const colorABCMap = {
  red: {red: 'A', green: 'B', blue: 'C'},
  green: {red: 'C', green: 'A', blue: 'B'},
  blue: {red: 'B', green: 'C', blue: 'A'},
}

function Card ({top, bottom, idx}) {

  const color = top.color
  const SymbolIcon = SymbolIconMap[top.wild ? 'wild' : color]
  const symbolGroup = _.times(top.count, () => {
    return <div className="xl"><SymbolIcon /></div>
  })

  const colorMap = colorABCMap[color]


  return (
    <div className="card md-lg">

      <div className="top">
        {symbolGroup}
        {(_.has(top, 'tiebreaker') && top.tiebreaker !== 0) ?
          <div className="tiebreaker"><ICONS.Heart number={top.tiebreaker} /></div> : null
        }
        {(_.has(top, 'point') && top.point !== 0) ?
          <div className="points"><ICONS.Star number={top.point} /></div> : null
        }

        {(_.has(top, 'facedown') && top.facedown !== 0) ?
          <div className="facedown">next turn: <ICONS.FacedownCard /></div> : null
        }

        <div className="idx sm">({idx})</div>
      </div>

      <div className="bottom sm">

        <ICONS.Water number={bottom[colorMap.blue]} />
        <ICONS.Fire number={bottom[colorMap.red]} />
        <ICONS.Earth number={bottom[colorMap.green]} />
        &nbsp;
        <ICONS.Heart number={bottom.tiebreaker} />
        <ICONS.Star number={bottom.point} />
      </div>
      

    </div>
  )
}



// console.log(_.sum(_.sortBy(document.lol, (a) => -a).slice(0,50)))
// console.log(_.round(_.mean(document.lol), 4))

// countOccurances(cardsArray, 'gainTop', 'bonus')

const sortedCards = _.sortBy(cardsArray, [
  ({top}) => {
    let value = top.count * 2
    if (top.wild > 0) {
      value = value * 1.5
    }

    value += top.point || 0
    value += top.tiebreaker || 0
    value += top.facedown*0.5 || 0

    if (top.count === 3) {
      value = 4
    }

    return -value
  },
  () => Math.random()
])

const cardsImportantKeys = [
  'cost',
  'expectedValue',
  'currentValue',
  'gain',
  'uuid',
]

function Cards () {
  return <div>
    {_.map(sortedCards, (cardObj, idx) => <Card top={cardObj.top} bottom={cardObj.bottom} idx={idx+1} /> )}
    <pre className="noprint">
      {/*{JSON.stringify(cardsArray, null, 2)}*/}
      {/*{JSON.stringify(_.chain(cardsArray).map((obj) => _.pick(obj, cardsImportantKeys)).value(), null, 2)}*/}
    </pre>

  </div>
}

export default Cards

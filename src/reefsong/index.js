import _ from 'lodash'
import Brng from 'brng'
import seed from 'seed-random'

import '../util/base.css'
import generateGainObj from '../util/generateGainObj.js'
import getLeastSimilarObj from '../util/getLeastSimilarObj.js'
import createNestedBrngRoller from '../util/createNestedBrngRoller.js'
import countOccurances from '../util/countOccurances.js'

// import Card from './Card.js'


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


const CARD_QUANTITY = 100

const gainRoller = createNestedBrngRoller({
  engine: {weight: 2, children: {

    engineActivate: {weight: 4, children: {
      draw: {weight: 3, children: {
        draw1: 3,
        draw2: 2,
        draw3: 1,
      }},
      drawPerPointLeft: {weight: 1, children: {
        drawPerPointLeft1: 2,
        drawPerPointLeft2: 1,
      }},
      drawXDiscardPerPointRight: {weight: 1, children: {
        drawXDiscardPerPointRight2: 3,
        drawXDiscardPerPointRight3: 2,
        drawXDiscardPerPointRight4: 1,
      }},
    }},

    engineStatic: {weight: 1, children: {
      // discount: {weight: 2, children: {
      //   discount1: 2,
      //   discount2: 1,
      // }},
      // drawOnBuild: {weight: 3, children: {
        drawOnBuild1: 2,
        drawOnBuild2: 1,
      // }},
      // onBuildActivate: 1,
    }},
    // copyEngineCard: 2/10,

  }},
  point: {weight: 1, children: {
    pointPerEngineRight: {weight: 2, children: {
      pointPerEngineRight1_p0: 4,
      // pointPerEngineRight1_p1: 3/2,
      pointPerEngineRight2_p0: 3,
      // pointPerEngineRight2_p1: 2/3,
      // pointPerEngineRight2_p2: 2/3,
      pointPerEngineRight3_p0: 2,
    }},
    pointNegXPerEngineLeft: {weight: 2, children: {
      pointNegXPerEngineLeft1_p4: 3/3,
      pointNegXPerEngineLeft1_p5: 3/3,
      pointNegXPerEngineLeft1_p6: 3/3,
      // pointNegXPerEngineLeft2_p6: 2/3,
      // pointNegXPerEngineLeft2_p7: 2/3,
      pointNegXPerEngineLeft2_p8: 2/2,
      pointNegXPerEngineLeft2_p10: 2/2,
      pointNegXPerEngineLeft2_p12: 2/2,
      // pointNegXPerEngineLeft3_p8: 1/2,
      // pointNegXPerEngineLeft3_p10: 1/1,
    }},
    pointsPerCardStored: {weight: 3, children: {
      pointsPerCardStored1: 3,
      pointsPerCardStored2: 2,
      pointsPerCardStored3: 1,
    }},
    
    // copyPointCard: 2/10,
  }},
  neutral: {weight: .18, children: {
    swapAdjacentCards: 2,
    swapAdjacentCardsOnBuild: 1,
  }},
}, {bias: 4})


const TYPES = {
  draw: 'draw',
  drawPerPointLeft: 'drawPerPointLeft',
  drawXDiscardPerPointRight: 'drawXDiscardPerPointRight',
  drawOnBuild: 'drawOnBuild',
  onBuildActivate: 'onBuildActivate',
  // copyEngineCard: 'copyEngineCard',
  pointPerEngineRight: 'pointPerEngineRight',
  pointNegXPerEngineLeft: 'pointNegXPerEngineLeft',
  pointsPerCardStored: 'pointsPerCardStored',
  // copyPointCard: 'copyPointCard',
  swapAdjacentCards: 'swapAdjacentCards',
  swapAdjacentCardsOnBuild: 'swapAdjacentCardsOnBuild',
}

// [COST, TYPE, NUMBER = 1, POINTS = 0]
const gainMapping = {
  draw1: [1, TYPES.draw, 1],
  draw2: [3, TYPES.draw, 2],
  draw3: [5, TYPES.draw, 3],
  drawPerPointLeft1: [2, TYPES.drawPerPointLeft, 1],
  drawPerPointLeft2: [5, TYPES.drawPerPointLeft, 2],
  drawXDiscardPerPointRight2: [1, TYPES.drawXDiscardPerPointRight, 2],
  drawXDiscardPerPointRight3: [3, TYPES.drawXDiscardPerPointRight, 3],
  drawXDiscardPerPointRight4: [5, TYPES.drawXDiscardPerPointRight, 4],
  drawOnBuild1: [2, TYPES.drawOnBuild, 1],
  drawOnBuild2: [5, TYPES.drawOnBuild, 2],
  // onBuildActivate: [4, TYPES.onBuildActivate],

  pointPerEngineRight1_p0: [1, TYPES.pointPerEngineRight, 1],
  pointPerEngineRight2_p0: [3, TYPES.pointPerEngineRight, 2],
  pointPerEngineRight3_p0: [5, TYPES.pointPerEngineRight, 3],
  pointNegXPerEngineLeft1_p4: [0, TYPES.pointNegXPerEngineLeft, 1, 4],
  pointNegXPerEngineLeft1_p5: [1, TYPES.pointNegXPerEngineLeft, 1, 5],
  pointNegXPerEngineLeft1_p6: [2, TYPES.pointNegXPerEngineLeft, 1, 6],
  pointNegXPerEngineLeft2_p8: [1, TYPES.pointNegXPerEngineLeft, 2, 8],
  pointNegXPerEngineLeft2_p10: [3, TYPES.pointNegXPerEngineLeft, 2, 10],
  pointNegXPerEngineLeft2_p12: [5, TYPES.pointNegXPerEngineLeft, 2, 12],
  pointsPerCardStored1: [1, TYPES.pointsPerCardStored, 1],
  pointsPerCardStored2: [3, TYPES.pointsPerCardStored, 2],
  pointsPerCardStored3: [5, TYPES.pointsPerCardStored, 3],

  swapAdjacentCards: [4, TYPES.swapAdjacentCards, 1, 1],
  swapAdjacentCardsOnBuild: [4, TYPES.swapAdjacentCardsOnBuild, 1, 1],
}


/////////////////////////////


function Card (props) {
  
  const {
    cost,
    type,
    amount,
    endVP,
    row,
  } = props.cardObj

  return (
    <div className="card lg">
      <div className={"outline-"+row}>

        <div className="row-species">{row === 'top' ? <ICONS.Fish/> : <ICONS.Coral/>}</div>
        <div className="cost md">{cost}</div>
      </div>
    </div>
  )
}

/////////////////////////////

const sortOrderArray = [
  'type',
  (cardObj) => -cardObj.cost,
]

let cardsArray = []
_.times(CARD_QUANTITY, (index) => {
  const gain = gainRoller.roll()

  cardsArray.push({
    // cost: cardCost,
    // expectedValue: costToValueMapping[cardCost],
    uuid: Math.random().toString(36).slice(2),
    cost: gainMapping[gain][0],
    type: gainMapping[gain][1],
    amount: gainMapping[gain][2] || 1,
    endVP: gainMapping[gain][3] || 0,
    // gain: gain,
  })
})
cardsArray = _.sortBy(cardsArray, sortOrderArray)

_.forEach(cardsArray, (cardObj, index) => {
  cardObj.row = (index % 2 === 1) ? 'top' : 'bottom'
})


// console.log(_.sum(_.sortBy(document.lol, (a) => -a).slice(0,50)))
// console.log(_.round(_.mean(document.lol), 4))

// countOccurances(cardsArray, 'gainTop', 'bonus')

// !! TO ADD STARTER CARDS
// cardsArray = cardsArray.concat(starterCards)

const cardsImportantKeys = [
  'cost',
  'expectedValue',
  'currentValue',
  'gain',
  'uuid',
]

function Cards () {
  return <div>
    {_.map(cardsArray, (cardObj, idx) => <Card key={idx} cardObj={cardObj} /> )}
    <pre className="noprint">
      {JSON.stringify(cardsArray, null, 2)}
      {/*{JSON.stringify(_.chain(cardsArray).map((obj) => _.pick(obj, cardsImportantKeys)).value(), null, 2)}*/}
    </pre>

  </div>
}

export default Cards

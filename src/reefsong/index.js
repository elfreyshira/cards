import _ from 'lodash'
import Brng from 'brng'
import seed from 'seed-random'

import '../util/base.css'
import generateGainObj from '../util/generateGainObj.js'
import getLeastSimilarObj from '../util/getLeastSimilarObj.js'
import createNestedBrngRoller from '../util/createNestedBrngRoller.js'
import countOccurances from '../util/countOccurances.js'

// import Card from './Card.js'



// import './index.css'

// import starterCards from './starterCards.js'

// console.clear()


const params = new URL(document.URL).searchParams
const seedID = params.get('seed')
if (_.isString(seedID)) {
  Brng.random = seed(seedID)
}


const CARD_QUANTITY = 200

const gainRoller = createNestedBrngRoller({
  engine: {weight: 2, children: {

    engineActivate: {weight: 2, children: {
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
      discount: {weight: 2, children: {
        discount1: 2,
        discount2: 1,
      }},
      onBuildDraw: {weight: 2, children: {
        onBuildDraw1: 2,
        onBuildDraw2: 1,
      }},
      onBuildActivate: 1,
    }},
    copyEngineCard: 3/10,

  }},
  point: {weight: 1, children: {
    pointPerEngineRight: {weight: 1, children: {
      pointPerEngineRight1_p0: 3/2,
      pointPerEngineRight1_p1: 3/2,
      pointPerEngineRight2_p0: 2/3,
      pointPerEngineRight2_p1: 2/3,
      pointPerEngineRight2_p2: 2/3,
      pointPerEngineRight3_p0: 1/1,
    }},
    pointNegXPerEngineLeft: {weight: 1, children: {
      pointNegXPerEngineLeft1_p4: 3/2,
      pointNegXPerEngineLeft1_p5: 3/2,
      pointNegXPerEngineLeft2_p6: 2/3,
      pointNegXPerEngineLeft2_p7: 2/3,
      pointNegXPerEngineLeft2_p8: 2/3,
      pointNegXPerEngineLeft3_p8: 1/2,
      pointNegXPerEngineLeft3_p9: 1/2,
    }},
    pointsPerCardStored: {weight: 1, children: {
      pointsPerCardStored1: 3,
      pointsPerCardStored2: 2,
      pointsPerCardStored3: 1,
    }},
    copyPointCard: 3/10,
  }}
}, {bias: 4})

/////////////////////////////

const sortOrderArray = [
  (cardObj) => -cardObj.cost,
]

let cardsArray = []
_.times(CARD_QUANTITY, (index) => {
  const cardCost = gainRoller.roll()
  cardsArray.push({
    // cost: cardCost,
    // expectedValue: costToValueMapping[cardCost],
    uuid: Math.random().toString(36).slice(2),
    gain: gainRoller.roll(),
  })
})
// cardsArray = _.sortBy(cardsArray, sortOrderArray)


// console.log(_.sum(_.sortBy(document.lol, (a) => -a).slice(0,50)))
console.log(_.round(_.mean(document.lol), 4))

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
    {/*{_.map(cardsArray, (cardObj, idx) => <Card key={idx} cardObj={cardObj} /> )}*/}
    <pre className="noprint">
      {JSON.stringify(cardsArray, null, 2)}
      {/*{JSON.stringify(_.chain(cardsArray).map((obj) => _.pick(obj, cardsImportantKeys)).value(), null, 2)}*/}
    </pre>

  </div>
}

export default Cards

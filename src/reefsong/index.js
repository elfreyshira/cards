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


const CARD_QUANTITY = 45

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
      pointNegXPerEngineLeft2_p8: 2/3,
      pointNegXPerEngineLeft2_p10: 2/3,
      pointNegXPerEngineLeft2_p12: 2/3,
      // pointNegXPerEngineLeft3_p8: 1/2,
      // pointNegXPerEngineLeft3_p10: 1/1,
    }},
    pointsPerCardStored: {weight: 3, children: {
      pointsPerCardStored1: 4,
      pointsPerCardStored2: 3,
      pointsPerCardStored3: 2,
    }},
    
    // copyPointCard: 2/10,
  }},
  neutral: {weight: .27, children: {
    swapAdjacentCards: 5,
    swapAdjacentCardsOnBuild: 3,
  }},
}, {bias: 4})


const TYPES = {
  draw: 'draw',
  drawPerPointLeft: 'drawPerPointLeft',
  drawXDiscardPerPointRight: 'drawXDiscardPerPointRight',
  drawOnBuild: 'drawOnBuild',
  pointPerEngineRight: 'pointPerEngineRight',
  pointNegXPerEngineLeft: 'pointNegXPerEngineLeft',
  pointsPerCardStored: 'pointsPerCardStored',
  swapAdjacentCards: 'swapAdjacentCards',
  swapAdjacentCardsOnBuild: 'swapAdjacentCardsOnBuild',
}

const TYPE_COMPONENT = {
  draw: ({number}) => <><ICONS.ArrowRight/>: <ICONS.DrawCard number={number}/></>,
  drawPerPointLeft: ({number}) => <><ICONS.ArrowRight/>: <ICONS.DrawCard number={number}/>&#215; <ICONS.Star/><ICONS.PointLeft/></>,
  drawXDiscardPerPointRight: ({number}) => <>
    <ICONS.ArrowRight/>: <ICONS.DrawCard number={number}/>
    <br/>
    <ICONS.TrashCard number={1}/>&#215; <ICONS.Star/><ICONS.PointRight/>
  </>,
  drawOnBuild: ({number}) => <><ICONS.PlayCard/>: <ICONS.DrawCard number={number}/></>,
  pointPerEngineRight: ({number}) => <>
    <ICONS.CoinStar number={number}/>&#215; <ICONS.Wave/><ICONS.PointRight/>
  </>,
  pointNegXPerEngineLeft: ({number, endVP}) => <>
    <ICONS.CoinStar number={endVP}/>
    <br/>
    <ICONS.CoinStar number={-number}/>&#215; <ICONS.Wave/><ICONS.PointLeft/>
  </>,
  pointsPerCardStored: ({number}) => <>
    <ICONS.ArrowRight/>: <ICONS.ThisCard/>
    <br/>
    <ICONS.CoinStar number={number}/>&#215; <ICONS.CardSingle/>
  </>,

  swapAdjacentCards: ({row}) => <>
    <ICONS.ArrowRight/>: {row === 'top' ? <ICONS.Coral/> : <ICONS.Fish/>}<ICONS.SwapCards/>
  </>,
  swapAdjacentCardsOnBuild: ({row}) => <>
    <ICONS.PlayCard/>: {row === 'top' ? <ICONS.Coral/> : <ICONS.Fish/>}<ICONS.SwapCards/>
  </>,
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

  swapAdjacentCards: [4, TYPES.swapAdjacentCards],
  swapAdjacentCardsOnBuild: [4, TYPES.swapAdjacentCardsOnBuild],
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

  const TypeComponent = TYPE_COMPONENT[type]

  return (
    <div className="card lg">
      <div className={"outline-"+row}>

        <div className="species">
          {row === 'top' ? <ICONS.Fish/> : <ICONS.Coral/>}
          {_.startsWith(type, 'draw') ? <ICONS.Wave/> : null}
          {_.startsWith(type, 'point') ? <ICONS.Star/> : null}
        </div>

        <div className="cost sm-md">
          {cost}&nbsp;&nbsp;
          <ICONS.CardSingle/>
          <b>/</b>&nbsp;
          {row === 'bottom' ? <ICONS.Fish/> : <ICONS.Coral/>}
        </div>

        <div className="effect md-lg">
          <TypeComponent number={amount} row={row} endVP={endVP} />
        </div>
        

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

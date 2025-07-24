import _ from 'lodash'
import Brng from 'brng'
import classnames from 'classnames'

import '../util/base.css'
import setSeedForBrng from '../util/setSeedForBrng.js'
import generateGainObj from '../util/generateGainObj.js'
import getLeastSimilarObj from '../util/getLeastSimilarObj.js'
import createNestedBrngRoller from '../util/createNestedBrngRoller.js'
import countOccurances from '../util/countOccurances.js'
import ICONS from '../util/icons.js'


// import Card from './Card.js'
import './index.css'
// import starterCards from './starterCards.js'

// console.clear()
setSeedForBrng(Brng)

const CARD_QUANTITY = 50


/// vv COST vv ///
const costToValueMapping = {
  1: 200,
  2: 300,
  3: 400
}

const costRoller = new Brng({
  1: 1,
  2: 3,
  3: 2,
}, {bias: 4})
/// ^^ COST ^^ ///


const resourceToValueMapping = {
  money: 100,
  draw: 200,
  point: 100,
}

// or createNestedBrngRoller({})
const gainRoller = new Brng({
  money: 2,
  draw: 1,
  point: 3,
}, {bias: 4, keepHistory: true})


// for getLeastSimilarObj()
const cardObjSimilaritySettings = {
  cost: [1, 3], // multiplier = 1, max diff = 3, type = Number, 
  gain: {
    money: [1, 3],
    draw: [1, 2],
  },
}

//////////////////////

// A = move   --  15%
// B = fruit  --  25%
// C = film   --  60%
const effectRoller = createNestedBrngRoller({
  cost1: {weight: 1, children: {
    cost1_single: {weight: 3, children: {
      A3__1: 15,
      B3__1: 25,
      C3__1: 60,
      token1_opp$discard1__1: 20,
    }},
    cost1_double: {weight: 2, children: {
      A2_B2__1: 20,
      A2_C2__1: 37.5,
      B2_C2__1: 42.5,
    }}
    
  }},
  cost2: {weight: .5, children: {
    draw2_discard1__2: 4,
    draw2_opp$draw1__2: 3,
  }},
  cost3: {weight: 1, children: {
    A2_B2_C2__3: 30,
    cost3_single_A: {weight: 15, children: {
      A2_token1__3: 3,
      A3_opp$losetoken1__3: 2,
      // A4__3: 2,
    }},
    B4__3: 25,
    C4__3: 60,
    draw2_opp$token1__3: 25,
  }},
  cost4: {weight: 1, children: {
    cost4_special: {weight: 3, children: {
      draw2__4: 3,
      draw1_token1__4: 1,
    }},
    cost4_double: {weight: 2, children: {
      A3_B3__4: 20,
      A3_C3__4: 37.5,
      B3_C3__4: 42.5,
    }},
  }},
}, {bias: 4})

const scoringRoller = createNestedBrngRoller({
  large: {weight: 2/3, children: {
    large1_opp$trash1__1: 1,
    large1__2: 2,
    large1_point1__3: 1,
    large1_trash1__4: 1,
  }},
  small: {weight: 1/3, children: {
    small1_opp$trash1__4: 1,
    small1__5: 2,
    small1_point1__6: 1,
  }}
}, {bias: 4}) 

const effectCodeMapping = {
  A: 'move',
  B: 'fruit',
  C: 'film'
}

/////////////////////////////
/////////////////////////////
/////////////////////////////

const sortOrderArray = [
  (cardObj) => -cardObj.cost,
]

let cardsArray = []

_.times(CARD_QUANTITY, (index) => {
  
  const cardEffectArray = _.split(effectRoller.roll(), '__')
  const cost = _.toNumber(cardEffectArray[1])
  const effect = cardEffectArray[0]

  const gainObj = {}

  const gainArray = _.split(effect, '_') // ['A3', 'B3', 'opp$losetoken1']
  _.forEach(gainArray, (key, index) => {
    // splits the string with the ending digit
    const [effectName, effectNumber] = _.split(key, /(?=\d)/)
    gainObj[effectCodeMapping[effectName] || effectName] = _.toNumber(effectNumber)
  })

  cardsArray.push({
    uuid: Math.random().toString(36).slice(2),
    cost: cost,
    gain: gainObj
  })
})
cardsArray = _.sortBy(cardsArray, sortOrderArray)



let scoreArray = []
_.times(CARD_QUANTITY, (index) => {
  
  const scoreEffect = _.split(scoringRoller.roll(), '__')
  const cost = _.toNumber(scoreEffect[1])
  const effect = scoreEffect[0]

  const scoreObj = {}

  const gainArray = _.split(effect, '_') // ['A3', 'B3', 'opp$losetoken1']
  _.forEach(gainArray, (key, index) => {
    // splits the string with the ending digit
    const [effectName, effectNumber] = _.split(key, /(?=\d)/)
    scoreObj[effectName] = _.toNumber(effectNumber)
  })

  scoreArray.push({cost, ...scoreObj})
})
scoreArray = _.sortBy(scoreArray, ['cost', (obj) => obj.large])

_.forEach(cardsArray, (cardObj, index) => {
  cardObj.scoring = scoreArray[index]
})



/////////////////////////////
/////////////////////////////
/////////////////////////////

const mainEffectToIconMapping = {
  move: ICONS.Shoe,
  fruit: ICONS.Mango,
  film: ICONS.FilmReel,
}

const specialEffectToIconMapping = {
  draw: ICONS.DrawCard,
  discard: ICONS.DiscardCard,
  token: ICONS.CompassToken,
  opp$draw: ({number}) => <><ICONS.People4Directions/>: <ICONS.DrawCard number={number} /></>,
  opp$discard: ({number}) => <><ICONS.People4Directions/>: <ICONS.DiscardCard number={number} /></>,
  opp$token: ({number}) => <><ICONS.People4Directions/>: <ICONS.CompassToken number={number} /></>,
  opp$losetoken: ({number}) =>
    <><ICONS.People4Directions/>: <ICONS.TrashCan/><ICONS.CompassToken number={number} /></>,

  point: ICONS.Star,
  trash: ICONS.TrashCard,
  opp$trash: ({number}) => <><ICONS.People4Directions/>: <ICONS.TrashCard number={number} /></>,
}

function Card (props) {
  
  const {
    cost,
    gain,
    uuid,
    scoring,
  } = props.cardObj

  return (
    <div className="card md">
        
        <div className="top-container">
          <img className="background-art" src={scoring.large ? "https://i.pinimg.com/236x/f8/e7/ef/f8e7ef4afcd60f2b0ff52be85b69836d.jpg" : "https://i.pinimg.com/236x/e1/cc/60/e1cc604e2488c7a185b2e67038a6cc6d.jpg"}/>
          <div className="cost">
            <ICONS.Mango number={cost}/>
          </div>
          <div className="main-effects">
            {_.map(mainEffectToIconMapping, (ChosenIcon, effect) => {
              if (_.has(gain, effect)) {
                return <div key={effect} className={classnames(effect, 'effect')}>
                  <ChosenIcon number={gain[effect]} />
                </div>
              }
              else {
                return null
              }
            })}
          </div>

          {_.intersection(_.keys(specialEffectToIconMapping), _.keys(gain)).length > 0 ?
            <div className="special-effects">
              {_.map(specialEffectToIconMapping, (ChosenIcon, effect) => {
                if (_.has(gain, effect)) {
                  return <div key={effect} className={classnames(effect, 'effect')}>
                    <ChosenIcon number={gain[effect]} />
                  </div>
                }
                else {
                  return null
                }
              })}
            </div>
            : null
          }
        </div>

        <div className="scoring-container">
          <div className="point-symbol lg-xl">
            {scoring.small ? <ICONS.ShyKoala/> : <ICONS.BraveLion/>}
          </div>
          <div className="score-effect">
            {_.map(specialEffectToIconMapping, (ChosenIcon, effect) => {
              if (_.has(scoring, effect)) {
                return <div key={effect} className={classnames(effect, 'score-effect')}>
                  <ChosenIcon number={scoring[effect]} />
                </div>
              }
              else {
                return null
              }
            })}
          </div>
          <div className="score-cost">
            <ICONS.FilmReel number={scoring.cost}/>
          </div>
        
        </div>
        
    </div>
  )
}

/////////////////////////////
/////////////////////////////
/////////////////////////////


// console.log(gainRoller.proportions)
// console.log(_.sum(_.sortBy(document.similarityRatioArray, (a) => -a).slice(0, 10)))
// console.log(_.round(_.mean(document.similarityRatioArray), 4))

// countOccurances(cardsArray, 'gain', 'money')
// countOccurances(cardsArray, 'gain', 'point')

// !! TO ADD STARTER CARDS
// cardsArray = cardsArray.concat(starterCards)

const cardsImportantKeys = [
  'cost',
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

import _ from 'lodash'
import Brng from 'brng'

import setSeedForBrng from '../util/setSeedForBrng.js'
import generateGainObj from '../util/generateGainObj.js'
import getLeastSimilarObj from '../util/getLeastSimilarObj.js'
import createNestedBrngRoller from '../util/createNestedBrngRoller.js'
import countOccurances from '../util/countOccurances.js'
import ICONS from '../util/icons.js'


// import Card from './Card.js'
import './index.css'
import starterCards from './starterCards.js'

// console.clear()
setSeedForBrng(Brng)

const CARD_QUANTITY = 38


/// vv COST vv ///
const costToValueMapping = {
  1: 300,
  2: 350,
  3: 400,
  4: 450,
  5: 500,
  // 6: 524,
  7: 550,
}

const costRoller = new Brng({
  1: 3,
  2: 5,
  3: 6,
  4: 6,
  5: 4,
  // 6: 3,
  7: 2,
}, {bias: 4})
/// ^^ COST ^^ ///


const resourceToValueMapping = {
  atk: 100,
  money: 100,
  draw: 150,
  playFromHand: 250,
  playFromDeck: 300,
  nextAtk: 75,
  futureAtk: 250,
  // atkHand: 400,
  // atkCardsPlayed: 400,
  bonus: 50,
}

// or createNestedBrngRoller({})
const gainRoller = new Brng({
  atk: 30,
  nextAtk: 8,
  futureAtk: 3,

  money: 15,

  draw: 5.5,
  playFromHand: 5,
  playFromDeck: 5,
}, {bias: 4, keepHistory: true})


const alternateEffectRoller = createNestedBrngRoller({
  atk: {weight: 2, children: {
    atk1: 1,
    atk2: 1,
  }},
  moreHandAtk: {weight: 1, children: {
    moreHandAtk1: 1,
    moreHandAtk2: 1,
    moreHandAtk3: 1,
  }},
  moreLaneAtk: {weight: 1.5, children: {
    moreLaneAtk1: 1,
    moreLaneAtk2: 1,
    moreLaneAtk3: 1,
  }},
  moreMoneyAtk: {weight: 1, children: {
    moreMoneyAtk1: 1,
    moreMoneyAtk2: 1,
    moreMoneyAtk3: 1,
  }},
  trash: 2,
}, {bias: 4})

const alternateEffectCostMapping = {
  atk1: 2,
  atk2: 7,
  moreHandAtk1: 1,
  moreHandAtk2: 4,
  moreHandAtk3: 7,
  moreLaneAtk1: 1,
  moreLaneAtk2: 4,
  moreLaneAtk3: 7,
  moreMoneyAtk1: 1,
  moreMoneyAtk2: 4,
  moreMoneyAtk3: 7,

  trash: 3,
}


// for getLeastSimilarObj()
const cardObjSimilaritySettings = {
  cost: [2, 4], // multiplier = 1, max diff = 3, type = Number, 
  alternate: [1, 1, String],
  gain: {
    atk: [1, 3],
    money: [1, 2],
    draw: [1, 1],
    playFromHand: [1, 1],
    playFromDeck: [1, 1],
    nextAtk: [1, 3],
    futureAtk: [1, 1],
    bonus: [1, 1],
  },
}



/////////////////////////////
/////////////////////////////
/////////////////////////////

const sortOrderArray = [
  (cardObj) => -cardObj.cost,
  (cardObj) => -(
    _.get(cardObj, 'gain.atk', 0)
    + _.get(cardObj, 'gain.nextAtk', 0) * .75
    + _.get(cardObj, 'gain.futureAtk', 0) * 2.5
  ),
]

let cardsArray = []

_.times(CARD_QUANTITY, (index) => {
  const cardCost = _.toNumber(costRoller.roll())
  cardsArray.push({
    uuid: Math.random().toString(36).slice(2),
    cost: cardCost,
    expectedValue: costToValueMapping[cardCost], // required when using generateGainObj()
  })
})
cardsArray = _.sortBy(cardsArray, sortOrderArray)


// add the alternate purchase to the cards
let alternateEffectArray = []
_.times(CARD_QUANTITY, (index) => {
  const alternateEffect = alternateEffectRoller.roll()
  alternateEffectArray.push(alternateEffect)
})
alternateEffectArray = _.sortBy(alternateEffectArray, (effect) => alternateEffectCostMapping[effect])

_.forEach(cardsArray, (cardObj, index) => {
  cardObj.alternate = alternateEffectArray[index]
})
cardsArray = _.sortBy(cardsArray, sortOrderArray)


_.forEach(cardsArray, (cardObj, index) => {

  const leastSimilarObj = getLeastSimilarObj (
    cardsArray.slice(0, index),
    10, // max attempts
    cardObjSimilaritySettings,
    (addUndo, addRedo) => {

      const newCardObj = _.cloneDeep(cardObj)

      const exclusionRules = {
        groupingMaxVariety: [
          {resourceList: ['draw', 'playFromHand', 'playFromDeck'],
            max: 1},
          {resourceList: ['nextAtk', 'futureAtk'], max: 1},
          {resourceList: _.keys(resourceToValueMapping), max: 2}
        ],
        groupingMaxQuantity: [
          {resourceList: ['draw', 'playFromHand', 'playFromDeck'], max: 1},
          // {resourceList: [ 'nextAtk'], max: 3}
        ]
      }

      let {gainObj, currentValue} = generateGainObj({
        // REQUIRED
        resourceToValueMapping: resourceToValueMapping,
        cardObj: newCardObj, // {expectedValue, ...}
        resourceRoller: gainRoller,

        // OPTIONAL
        // valueSlack: 0,
        exclusionRules,
        // gainObj: cardObj.gain,
        // currentValue: cardObj.currentValue,
        addUndo,
        addRedo,
        
      })

      //// BONUS
      let bonus = _.round((newCardObj.expectedValue - currentValue)/resourceToValueMapping.bonus)
      // if (bonus >= 2) {
      //   const moneyGain = _.floor(bonus/2)
      //   gainObj.money = gainObj.money ? gainObj.money + moneyGain : moneyGain
      //   bonus = bonus - moneyGain*2
      //   currentValue += moneyGain * resourceToValueMapping.money
      // }
      if (bonus > 0) {
        gainObj.bonus = bonus
        currentValue += bonus * resourceToValueMapping.bonus
      }
      //// BONUS

      newCardObj.gain = gainObj
      newCardObj.currentValue = currentValue

      return newCardObj
    }
  )


  _.merge(cardObj, leastSimilarObj)
})
cardsArray = _.sortBy(cardsArray, sortOrderArray)

/////////////////////////////
/////////////////////////////
/////////////////////////////


// draw: 150,
//   playFromHand: 250,
//   playFromDeck: 300,
//   nextAtk: 75,
//   // atkHand: 400,
//   // atkCardsPlayed: 400,
//   // futureAtk: 250,
//   bonus: 50,
const effectToIconMapping = {
  // atk: ICONS.Sword, // MANUALLY ADDED
  money: ICONS.Dollar,

  // draw: () => <><ICONS.Deck/><ICONS.ArrowRight/><ICONS.Hand/></>,
  draw: () => <ICONS.DrawCard />,
  playFromHand: () => <><ICONS.Hand/><ICONS.ArrowRight/><ICONS.WarBanner/></>,
  playFromDeck: () => <><ICONS.Deck/><ICONS.ArrowRight/><ICONS.WarBanner/></>,
  nextAtk: (props) => <><ICONS.OneTurn/>: +<ICONS.TwoSwords {...props} /></>,
  futureAtk: (props) => <><ICONS.InfiniteTurn/>: +<ICONS.TwoSwords {...props} /></>,
  
}

const alternateToIconMapping = {
  atk1: () => <>+<ICONS.TwoSwords number={1}/></>,
  atk2: () => <>+<ICONS.TwoSwords number={2}/></>,
  moreHandAtk1: () => <><ICONS.Hand/>> <ICONS.Opponent/>: +<ICONS.TwoSwords number={1}/></>,
  moreHandAtk2: () => <><ICONS.Hand/>> <ICONS.Opponent/>: +<ICONS.TwoSwords number={2}/></>,
  moreHandAtk3: () => <><ICONS.Hand/>> <ICONS.Opponent/>: +<ICONS.TwoSwords number={3}/></>,
  moreLaneAtk1: () => <><ICONS.WarBanner/>> <ICONS.Opponent/>: +<ICONS.TwoSwords number={1}/></>,
  moreLaneAtk2: () => <><ICONS.WarBanner/>> <ICONS.Opponent/>: +<ICONS.TwoSwords number={2}/></>,
  moreLaneAtk3: () => <><ICONS.WarBanner/>> <ICONS.Opponent/>: +<ICONS.TwoSwords number={3}/></>,
  moreMoneyAtk1: () => <>$ > <ICONS.Opponent/>: +<ICONS.TwoSwords number={1}/></>,
  moreMoneyAtk2: () => <>$ > <ICONS.Opponent/>: +<ICONS.TwoSwords number={2}/></>,
  moreMoneyAtk3: () => <>$ > <ICONS.Opponent/>: +<ICONS.TwoSwords number={3}/></>,
  trash: () => <><ICONS.Lightning className="sm"/> <ICONS.TrashCard/></>,
}

function AlternateEffect ({alternate}) {

  if (alternate) {
    const AlternateEffectIcon = alternateToIconMapping[alternate]
    return <>
      <div className="alternate-cost">
        ${alternateEffectCostMapping[alternate]}
      </div>
      <div className="alternate-effect inverse">
        <AlternateEffectIcon/>
      </div>
    </>
  }
  else {
    return null
  }
}

function Card (props) {
  
  const {
    cost,
    gain,
    alternate,
  } = props.cardObj

  // for starter cards
  let costSymbol = '$'
  let costClass = 'cost'
  if (_.startsWith(cost, 'P')) {
    costSymbol = ''
    costClass += ' starter'
  }
  
  return (
    <div className="card md">
      <div className={costClass}>
        {costSymbol}{cost}
      </div>

      <div className="main-effect">
        <div className="effect">
          <div className="lg sub-effect">
            <ICONS.TwoSwords number={gain.atk || 0} />
            &nbsp;{gain.bonus ? <ICONS.Star className="md-sm"/> : null}
          </div>
          {_.map(effectToIconMapping, (ChosenIcon, effect) => {
            if (_.has(gain, effect)) {
              return <div key={effect} className={effect + ' sub-effect'} >
                <ChosenIcon number={gain[effect]} />
              </div>
            }
            else {
              return null
            }
          })}
        </div>
      </div>

      {/*<div className="sm">{JSON.stringify(gain)}</div>*/}

      <AlternateEffect alternate={alternate} />
    </div>
  )
}

/////////////////////////////
/////////////////////////////
/////////////////////////////


console.log(gainRoller.proportions)
// console.log(_.sum(_.sortBy(document.similarityRatioArray, (a) => -a).slice(0, 10)))
// console.log(_.round(_.mean(document.similarityRatioArray), 4))

countOccurances(cardsArray, 'gain', 'draw')
countOccurances(cardsArray, 'gain', 'playFromHand')
countOccurances(cardsArray, 'gain', 'playFromDeck')
countOccurances(cardsArray, 'gain', ['atk', 'nextAtk'])
countOccurances(cardsArray, 'gain', 'money')
countOccurances(cardsArray, 'gain', 'bonus')

// !! TO ADD STARTER CARDS
cardsArray = cardsArray.concat(starterCards)

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

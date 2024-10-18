import _ from 'lodash'
import classnames from 'classnames'

import ICONS from '../util/icons.js'


function Cost({cost}) {
  // for starter cards
  if (_.startsWith(cost, 'P')) {
    return <div className="cost starter">{cost}</div>
  }

  return <div className="cost">${cost}</div>
}


function DiceCost ({gain}) {
  const diceCostNumber = _.chain(gain)
    .keys()
    .find(effect => _.startsWith(effect, 'cost'))
    .last()
    .toNumber()
    .value()

  if (diceCostNumber === 0) {
    return null
  }
  return <div className="dice-cost">{diceCostNumber}</div>
}

function Effect ({gain, effectsAndIcons, type}) {

  const effectElements = _.compact(_.map(effectsAndIcons, (ChosenIcon, effect) => {
    if (_.has(gain, effect)) {
      return <div key={effect}>
        <ChosenIcon number={gain[effect]} />
        {/*<span className="sm subtitle">{effect}</span>*/}
      </div>
    }
    else {
      return null
    }
  }))

  if (_.isEmpty(effectElements)) {
    return null
  }

  return <div className={"effects-container " + type}>
    {effectElements}
  </div>
}


const instantEffects = {
  drawCard: ICONS.DrawCard,
  drawDice: ICONS.DrawDice,
  reroll: ICONS.RerollDice,
  deckCycle: ICONS.DeckCycle,
}

const endTurnEffects = {
  trashMarket: ICONS.MarketStall,
  money: ICONS.Dollar,
  trashCard: ICONS.TrashCard,
  trashDice: ICONS.TrashDice,
}




function Card (props) {
  
  const {
    cost,
    gain,
  } = props.cardObj

  return (
    <div className="card lg">
      <DiceCost gain={gain} />
      <Cost cost={cost} />
      <Effect gain={gain} effectsAndIcons={instantEffects} type="instant" />
      <Effect gain={gain} effectsAndIcons={endTurnEffects} type="endturn" />

    </div>
  )
}

export default Card

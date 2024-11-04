import _ from 'lodash'
import classnames from 'classnames'

import ICONS from '../util/icons.js'


function PurchaseCost({cost}) {
  // for starter cards
  if (_.startsWith(cost, 'P')) {
    return <div className="md purchase-cost starter">{cost}</div>
  }

  const costType = (cost <= 5)
    ? 'cost-cheap'
    : 'cost-expensive'
  return <div className={classnames('md purchase-cost', costType)}>${cost}</div>
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
      return <div className="effect-line" key={effect}>
        <ChosenIcon number={gain[effect]} />
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
  
  doubleNextCard: () => <div className="sm">Double the next card played (activation cost & effects).</div>,
  discardDiceDrawCard: () => <div className="md">
    <ICONS.DiscardDice number="X" /> &#8680; &nbsp;<ICONS.DrawCard number="X"/>
  </div>, // card
  discardCardDrawDice: () => <div className="md">
    <ICONS.DiscardCard number="X" /> &#8680; &nbsp;<ICONS.DrawDice number="X"/>
  </div>, // dice

  discountDiceCost: () => <div className="sm">Decrease all dice activation cost by 1.</div>, // dice
  discountValueToDrawDice: () => <div className="sm">Anytime: discard cards/dice of total value 3 to <ICONS.DrawDice/> </div>, // dice
  discountValueToDrawCard: () => <div className="sm">Anytime: discard cards/dice of total value 3 to <ICONS.DrawCard/> </div>, // card
}

const endTurnEffects = {
  money: ICONS.Dollar,
  trashCard: ICONS.TrashCard,
  trashDice: ICONS.TrashDice,

  moneyPerDiceUsed: () => <div className="md">+<ICONS.Dollar number="1" />/ <ICONS.DiceSingle/> <ICONS.InPlay /></div>,
  moneyPer2CardsUsed: () => <div className="md">+<ICONS.Dollar number="1" />/ 2<ICONS.CardSingle/> <ICONS.InPlay /></div>,
  
  purchasedCardsToTopDeck: () => <div className="w90 sm">
    [<ICONS.MarketStall/><ICONS.CardSingle/> &#8680; <ICONS.Deck/>]<br/>&nbsp;&nbsp;OR [+$1]
  </div>,
  purchasedDiceToBag: () => <div className="w90 sm">
    [<ICONS.MarketStall/><ICONS.DiceSingle/> &#8680; <ICONS.Bag/>]<br/>&nbsp;&nbsp;OR [+$1]
  </div>,
  
  doubleBaseMoneyOfCard: () => <div className="w90 sm"><b>+$X</b> equal to the base <b>$X</b> of any other card. (Max +$5)</div>,

  discountPurchaseCard: () => <div className="w90 sm">[<ICONS.MarketStall/><ICONS.CardSingle/> : -$1] OR [+$1]</div>, // money
  discountPurchaseDice: () => <div className="w90 sm">[<ICONS.MarketStall/><ICONS.DiceSingle/> : -$1] OR [+$1]</div>, // money
  discountTrash: () => <div className="w90 sm">[ <ICONS.TrashCan/>: -$1 ] OR [+$1]</div>, // trash
}



function Discard ({discardValue = 1}) {
  return <div className="discard-value md">{discardValue}</div>
}


function Card (props) {
  
  const {
    cost,
    gain,
    discardValue,
  } = props.cardObj

  return (
    <div className="card lg">
      <DiceCost gain={gain} />
      <PurchaseCost cost={cost} />
      <Effect gain={gain} effectsAndIcons={instantEffects} type="instant" />
      <Effect gain={gain} effectsAndIcons={endTurnEffects} type="endturn" />
      <Discard discardValue={discardValue} />

    </div>
  )
}

export default Card

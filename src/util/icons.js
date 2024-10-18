import _ from 'lodash'


import grab from './images/grab.png'
import meeple from './images/meeple.png'
import shoe from './images/shoe.png'
import wing from './images/wing.png'
import truck from './images/truck.png'
// import mech from './images/mech.png'
import mech from './images/vintage-robot.png'

import sword from './images/sword.png'
import shield from './images/shield.png'
import skullBurning from './images/skull-burning.png'
import whiteFlag from './images/white-flag.png'
import bugle from './images/bugle.png'
import potion from './images/potion.png'
import push from './images/push.png'
import deckCycle from './images/deck-cycle.png'

import drawCard from './images/draw-card.png'
import trashCard from './images/trash-card.png'

import rerollDice from './images/reroll-dice.png'
import diceSingle from './images/dice-single.png'
import trashCan from './images/trash-can.png'
import marketStall from './images/market-stall.png'




// push: 2, // both

function makeIconComponent (...imgSrcList) {
  return ({number}) => (
    <div className="icon-container">
      {_.map(imgSrcList, (imgSrc) => <img key={imgSrc} className="icon" src={imgSrc}/>) }
      &nbsp;<span className="number">{number}</span>
    </div>
  )
}

export default {
  Grab: makeIconComponent(grab),
  Shoe: makeIconComponent(shoe),
  ShoeWing: makeIconComponent(shoe, wing),
  Meeple: makeIconComponent(meeple),
  MeepleWing: makeIconComponent(meeple, wing),
  Truck: makeIconComponent(truck),
  MechShoe: makeIconComponent(mech, shoe),
  
  Sword: makeIconComponent(sword),
  Shield: makeIconComponent(shield),
  SkullBurning: makeIconComponent(skullBurning),
  WhiteFlag: makeIconComponent(whiteFlag),
  Bugle: makeIconComponent(bugle),
  Potion: makeIconComponent(potion),
  Push: makeIconComponent(push),
  DeckCycle: makeIconComponent(deckCycle),

  DrawCard: makeIconComponent(drawCard),
  TrashCard: makeIconComponent(trashCard),
  RerollDice: makeIconComponent(rerollDice),
  DrawDice: ({number}) => (
    <div className="icon-container">
      +<img className="icon" src={diceSingle}/>
      &nbsp;<span className="number">{number}</span>
    </div>
  ),

  TrashDice: makeIconComponent(trashCan, diceSingle),

  Dollar: ({number}) => (
    <div className="icon-container">
      <span className="icon">$</span>
      <span className="number">{number}</span>
    </div>
  ),
  MarketStall: makeIconComponent(trashCan, marketStall),

}

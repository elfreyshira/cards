import {ReactComponent as DrawSvg} from './images/draw.svg'
import {ReactComponent as AttackSvg} from './images/attack.svg'
import {ReactComponent as DefenseSvg} from './images/defense-3.svg'
import {ReactComponent as EnergySvg} from './images/energy.svg'
import {ReactComponent as ArrowSvg} from './images/arrow.svg'
import {ReactComponent as RangeSvg} from './images/range.svg'
import {ReactComponent as TwiceSvg} from './images/twice.svg'
import {ReactComponent as LethalSvg} from './images/lethal.svg'
import {ReactComponent as DiscardSvg} from './images/discard.svg'

import recruit from './images/recruit.png'
import train from './images/train.png'
import arrowThin from './images/arrow-thin.jpg'
import deck from './images/deck.png'
import inOrderTo from './images/in-order-to.png'
import hand from './images/hand.png'
import defense from './images/defense.png'




function Draw () {
  return <DrawSvg className="icon draw-card" />
}

function Attack () {
  // return <img className="icon attack" src={attack} />
  return <AttackSvg className="icon attack" style={{height: "", width: ""}} />
}

function Defense () {
  return <DefenseSvg className="icon defense" style={{height: "", width: ""}} />
  // return <img className="icon defense" src={defense} />
}

function Energy () {
  return <EnergySvg className="icon energy" style={{height: "", width: ""}} />
}

function Ahead () {
  return <ArrowSvg className="icon ahead" style={{height: "", width: ""}} />
}
function Behind () {
  return <ArrowSvg className="icon behind" style={{height: "", width: ""}} />
}

function Range () {
  return <RangeSvg className="icon range" style={{height: "", width: ""}} />
}

function Twice () {
  return <TwiceSvg className="icon twice" style={{height: "", width: ""}} />
}

function Poison () {
  return <LethalSvg className="icon poison" style={{height: "", width: ""}} />
}

function Recruit () {
  return <img className="icon recruit" src={recruit} />
}

function Train () {
  return <img className="icon train" src={train} />
}

function Towards () {
  return <img className="icon to-direction" src={arrowThin} />
}

function Deck () {
  return <img className="icon deck" src={deck} />
}

function InOrderTo () {
  return <img className="icon in-order-to" src={inOrderTo} />
}

function Hand () {
  return <img className="icon hand" src={hand} />
}

function Discard () {
  return <DiscardSvg className="icon discard" style={{height: "", width: ""}} />
}

export default {
  Draw,
  Attack,
  Defense,
  Energy,
  Ahead,
  Behind,
  Range,
  Twice,
  Poison,
  Recruit,
  Train,
  Towards,
  Deck,
  InOrderTo,
  Hand,
  Discard,
}

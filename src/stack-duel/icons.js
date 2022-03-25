import {ReactComponent as DrawSvg} from './images/draw.svg'
import {ReactComponent as AttackSvg} from './images/attack.svg'
import {ReactComponent as DefenseSvg} from './images/defense.svg'
import {ReactComponent as EnergySvg} from './images/energy.svg'
import {ReactComponent as ArrowSvg} from './images/arrow.svg'
import {ReactComponent as RangeSvg} from './images/range.svg'
import {ReactComponent as TwiceSvg} from './images/twice.svg'
import {ReactComponent as LethalSvg} from './images/lethal.svg'



function Draw () {
  return <DrawSvg className="icon draw-card" />
}

function Attack () {
  // return <img className="icon attack" src={attack} />
  return <AttackSvg className="icon attack" style={{height: "", width: ""}} />
}

function Defense () {
  return <DefenseSvg className="icon defense" style={{height: "", width: ""}} />
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



export default {
  Draw,
  Attack,
  Defense,
  Energy,
  Ahead,
  Behind,
  Range,
  Twice,
  Poison
}

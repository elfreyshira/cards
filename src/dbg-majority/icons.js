import _ from 'lodash'

import forestIcon from './images/forest.png'
import desertIcon from './images/desert.png'
import islandIcon from './images/island.png'
import drawIcon from './images/draw.png'
import wildIcon from './images/wild.png'
import energyIcon from './images/energy.png'
import trashIcon from './images/trash.png'
import cycleIcon from './images/cycle.png'
import moneyIcon from './images/money.png'
import dayIcon from './images/day.png'
import moveIcon from './images/move.png'
import actionIcon from './images/action.png'


const flr1 = (amount) => {
  const floored = _.floor(amount)
  if (floored <= 1 || !amount) {
    return ''
  }
  return floored
}

function Earth ({amount}) {
  return <span><img className="icon forest" src={forestIcon} />{flr1(amount)}</span>
}

function Fire ({amount}) {
  return <span><img className="icon desert" src={desertIcon} />{flr1(amount)}</span>
}

function Water ({amount}) {
  return <span><img className="icon island" src={islandIcon} />{flr1(amount)}</span>
}

function Wild ({amount}) {
  return <span><img className="icon wild" src={wildIcon} />{flr1(amount)}</span>
}
function Move ({amount}) {
  return <span><img className="icon move" src={moveIcon} />{flr1(amount)}</span>
}



function Money ({amount}) {
  return <span><img className="icon money" src={moneyIcon} />{flr1(amount)}</span>
}
function Draw ({amount}) {
  return _.times(_.floor(amount) || 1, (idx) => <img key={idx} className="icon draw" src={drawIcon} />)
}
function Cycle ({amount}) {
  return _.times(_.floor(amount) || 1, (idx) => <img key={idx} className="icon cycle" src={cycleIcon} />)
}
function Trash ({amount}) {
  return <img className="icon trash" src={trashIcon} />
}
function Energy ({amount}) {
  return _.times(_.floor(amount) || 1, (idx) => <img key={idx} className="icon energy" src={energyIcon} />)
  // return <img className="icon energy" src={energyIcon} />
}
function Day () {
  return <img className="icon day" src={dayIcon} />
}

function Action () {
  return <img className="icon action" src={actionIcon} />
}


export default {
  Earth,
  Fire,
  Water,
  Wild,
  Money,
  Draw,
  Cycle,
  Trash,
  Energy,
  Day,
  Move,
  Action
}

import _ from 'lodash'

import red from './images/red.png'
import green from './images/green.png'
import blue from './images/blue.png'

import tap from './images/tap.png'
import draw from './images/draw.png'
import rest from './images/rest.png'
import point from './images/point.png'


// import point from './images/point.png'
// import draw from './images/draw.png'
// import arrow from './images/arrow-right.png'
// import timePassed from './images/time-passed.png'
// import crown from './images/crown.png'

// import desertIcon from './images/desert.png'
// import islandIcon from './images/island.png'
// import drawIcon from './images/draw.png'
// import wildIcon from './images/wild.png'
// import energyIcon from './images/energy.png'
// import trashIcon from './images/trash.png'
// import cycleIcon from './images/cycle.png'
// import moneyIcon from './images/money.png'
// import dayIcon from './images/day.png'
// import moveIcon from './images/move.png'
// import actionIcon from './images/action.png'


const flr1 = (amount) => {
  const floored = _.floor(amount)
  if (floored <= 1 || !amount) {
    return ''
  }
  return floored
}

function Red ({number=0}) {
  return <span className="icon tag">
    <img src={red} />
    {number > 0 ? <span className="number">{number}</span> : null}
  </span>
}

function Green ({number=0}) {
  return <span className="icon tag">
    <img src={green} />
    {number > 0 ? <span className="number">{number}</span> : null}
  </span>
}

function Blue ({number=0}) {
  return <span className="icon tag">
    <img src={blue} />
    {number > 0 ? <span className="number">{number}</span> : null}
  </span>
}

function Tap () {
  return <span className="icon"><img src={tap} /></span>
}

function Draw ({number=0}) {
  return <span className="icon draw">
    <img src={draw} />
    {number > 0 ? <span className="number">{number}</span> : null}
  </span>
}

function Point ({number=0}) {
  return <span className="icon point">
    <img src={point} />
    {number > 0 ? <span className="number">{number}</span> : null}
  </span>
}

function Rest () {
  return <span className="icon"><img src={rest} /></span>
}


export default {
  Red,
  Green,
  Blue,
  Tap,
  Draw,
  Rest,
  Point
}

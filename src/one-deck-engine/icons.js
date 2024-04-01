import _ from 'lodash'

import fire from './images/fire.png'
import earth from './images/earth.png'
import water from './images/water.png'
import wild from './images/wild.png'

import point from './images/point.png'
import draw from './images/draw.png'
import arrow from './images/arrow-right.png'

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

function Fire () {
  return <img className="icon" src={fire} />
}

function Earth () {
  return <img className="icon" src={earth} />
}

function Water () {
  return <img className="icon" src={water} />
}

function Wild () {
  return <img className="icon wild" src={wild} />
}


function Point () {
  return <img className="icon point" src={point} />
}

function Draw () {
  return <img className="icon draw" src={draw} />
}



function Arrow () {
  return <img className="icon arrow-right" src={arrow} />
}



export default {
  Fire,
  Earth,
  Water,
  Wild,
  
  Draw,
  Point, // wind
  Arrow,
}

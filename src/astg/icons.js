import _ from 'lodash'

// import taxes from './images/taxes.png'
// import goods from './images/goods.png'
// import labor from './images/labor.png'

import taxes from './images/red.png'
import goods from './images/green.png'
import labor from './images/blue.png'

import draw from './images/draw.png'
import favor from './images/favor.png'

import thiscard from './images/thiscard.png'
import grab from './images/grab.png'

import send from './images/send.png'
import recall from './images/recall.png'
import move from './images/move.png'
import check from './images/check.png'
import none from './images/none.png'

import drop from './images/drop.png'
import cr2 from './images/cr2.png'
import cr3 from './images/cr3.png'
import cr4 from './images/cr4.png'

import typecr from './images/type-cr.png'
import typewp from './images/type-wp.png'
import typerd from './images/type-rd.png'

import points from './images/points.png'


function Taxes ({number=0}) {
  return <div className="icon-container">
    <img className="icon" src={taxes} />
    <span className="number">{number}</span>
  </div>
}

function Goods ({number=0}) {
  return <div className="icon-container">
    <img className="icon" src={goods} />
    <span className="number">{number}</span>
  </div>
}

function Labor ({number=0}) {
  return <div className="icon-container">
    <img className="icon" src={labor} />
    <span className="number">{number}</span>
  </div>
}


function Draw ({number=0}) {
  return <div className="icon-container">
    <img className="icon" src={draw} />
    <span className="number">{number}</span>
  </div>
}

function Favor ({number=0}) {
  return <div className="icon-container md">
    <img className="icon" src={favor} />
    <span className="number">{number}</span>
  </div>
}

const RESOURCES = {
  taxes: Taxes,
  goods: Goods,
  labor: Labor,
  draw: Draw,
}

function Delay ({number=0, resource}) {
  const ChosenResource = RESOURCES[resource]

  return <div className="icon-container">
    <img className="icon" src={thiscard} />&nbsp;:&nbsp;
    <ChosenResource number={number} />
    /&nbsp;
    <img className="icon" src={grab} />
  </div>
}

function OnLeave ({number=0, resource}) {
  const ChosenResource = RESOURCES[resource]

  return <div className="icon-container">
    <img className="icon" src={recall} />&nbsp;:&nbsp;
    <ChosenResource number={number} />
  </div>
}


function Rdmove () {
  return <div className="icon-container">
    <img className="icon" src={typerd} /> :&nbsp;
    <img className="icon" src={move} />&nbsp;
    <img className="icon" src={none} />
  </div>
}
function Rdmoveandactivate () {
  return <div className="icon-container">
    <img className="icon" src={typerd} /> :&nbsp;
    <img className="icon" src={move} />&nbsp;
    <img className="icon" src={check} />
    {/*<img className="icon" src={recall} />*/}
  </div>
}


function Wprecall () {
  return <div className="icon-container">
    <img className="icon" src={typewp} /> :&nbsp;
    <img className="icon" src={recall} />
  </div>
}
function Wpsend () {
  return <div className="icon-container">
    <img className="icon" src={typewp} /> :&nbsp;
    <img className="icon" src={send} />&nbsp;
    <img className="icon" src={check} />
  </div>
}

function Crdrop () {
  return <div className="icon-container">
    <img className="icon" src={typecr} /> :&nbsp;
    <img className="icon" src={drop} />&nbsp;
    <img className="icon" src={none} />
  </div>
}
function Cractivate2 () {
  return <div className="icon-container">
    <img className="icon" src={typecr} /> :&nbsp;
    <img className="icon" src={cr2} />&nbsp;<img className="icon" src={check} />
  </div>
}
function Cractivate3 () {
  return <div className="icon-container">
    <img className="icon" src={typecr} /> :&nbsp;
    <img className="icon" src={cr3} />&nbsp;<img className="icon" src={check} />
  </div>
}
function Cractivate4 () {
  return <div className="icon-container">
    <img className="icon" src={typecr} /> :&nbsp;
    <img className="icon" src={cr4} />&nbsp;<img className="icon" src={check} />
  </div>
}


function Typecr () {
  return <div className="icon-container">
    <img className="icon" src={typecr} />
  </div>
}

function Typewp () {
  return <div className="icon-container">
    <img className="icon" src={typewp} />
  </div>
}

function Typerd () {
  return <div className="icon-container">
    <img className="icon" src={typerd} />
  </div>
}


function Points ({number=0}) {
  return <div className="icon-container">
    <img className="icon" src={points} />
    <span className="number">{number}</span>
  </div>
}


export default {
  Taxes,
  Goods,
  Labor,
  Draw,
  Favor,

  Delay,
  OnLeave,

  Rdmove,
  Rdmoveandactivate,
  Wprecall,
  Wpsend,
  Crdrop,
  Cractivate2,
  Cractivate3,
  Cractivate4,

  Typecr,
  Typewp,
  Typerd,

  Points,
}

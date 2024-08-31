import _ from 'lodash'

import money from './images/money.png'
import point from './images/point.png'
// import cycle from './images/cycle.png'
import trash from './images/trash.png'
import bonus from './images/bonus.png'

// function Empty () {
//   return <span></span>
// }

function Remove1 () {
  return <div className="icon-container">
    REMOVE 1
  </div>
}
function Remove2 () {
  return <div className="icon-container">
    REMOVE 2
  </div>
}
const Remove205 = Remove2
function Remove3 () {
  return <div className="icon-container">
    REMOVE 3
  </div>
}
const Remove305 = Remove3
function Remove4 () {
  return <div className="icon-container">
    REMOVE 4
  </div>
}

function Carb1 () {
  return <div className="icon-container">
    CARB 1
  </div>
}
function Carb2 () {
  return <div className="icon-container">
    CARB 2
  </div>
}
const Carb205 = Carb2
function Carb3 () {
  return <div className="icon-container">
    CARB 3
  </div>
}
const Carb305 = Carb3
function Carb4 () {
  return <div className="icon-container">
    CARB 4
  </div>
}


function Veggie1 () {
  return <div className="icon-container">
    VEGGIE 1
  </div>
}
function Veggie2 () {
  return <div className="icon-container">
    VEGGIE 2
  </div>
}
const Veggie205 = Veggie2
function Veggie3 () {
  return <div className="icon-container">
    VEGGIE 3
  </div>
}
const Veggie305 = Veggie3
function Veggie4 () {
  return <div className="icon-container">
    VEGGIE 4
  </div>
}


function Meat1 () {
  return <div className="icon-container">
    MEAT 1
  </div>
}
function Meat2 () {
  return <div className="icon-container">
    MEAT 2
  </div>
}
const Meat205 = Meat2
function Meat3 () {
  return <div className="icon-container">
    MEAT 3
  </div>
}
const Meat305 = Meat3
function Meat4 () {
  return <div className="icon-container">
    MEAT 4
  </div>
}

function Edge1 () {
  return <div className="icon-container">
    EDGE 1
  </div>
}
function Edge2 () {
  return <div className="icon-container">
    EDGE 2
  </div>
}
function Edge3 () {
  return <div className="icon-container">
    EDGE 3
  </div>
}

function Money ({number=0}) {
  return <div className="icon-container">
    {/*<img className="icon" src={money}/>*/}
    <span className="money-icon">$</span><span className="number">{number}</span>
  </div>
}

function Point ({number=0}) {
  return <div className="icon-container">
    <img className="icon" src={point}/>
    {/*&#x1F604;*/}
    <span className="number">{number}</span>
  </div>
}

// function Cycle ({number=0}) {
//   return <div className="icon-container">
//     <img className="icon" src={cycle}/>
//     <span className="number">{number}</span>
//   </div>
// }

function Trash () {
  return <div className="icon-container">
    <img className="icon" src={trash}/>
  </div>
}

function Bonus () {
  return <div className="icon-container md">
    <img className="icon" src={bonus}/>
  </div>
}



export default {
  // Empty,
  Remove1,
  Remove2,
  Remove205,
  Remove3,
  Remove305,
  Remove4,

  Carb1,
  Carb2,
  Carb205,
  Carb3,
  Carb305,
  Carb4,

  Veggie1,
  Veggie2,
  Veggie205,
  Veggie3,
  Veggie305,
  Veggie4,

  Meat1,
  Meat2,
  Meat205,
  Meat3,
  Meat305,
  Meat4,

  Edge1,
  Edge2,
  Edge3,

  Money,
  Point,
  Trash,

  Bonus,
}

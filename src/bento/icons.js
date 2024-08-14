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
function Remove3 () {
  return <div className="icon-container">
    REMOVE 3
  </div>
}
function Remove4 () {
  return <div className="icon-container">
    REMOVE 4
  </div>
}

function Normal1 () {
  return <div className="icon-container">
    NORMAL 1
  </div>
}
function Normal2 () {
  return <div className="icon-container">
    NORMAL 2
  </div>
}
function Normal3 () {
  return <div className="icon-container">
    NORMAL 3
  </div>
}
function Normal4 () {
  return <div className="icon-container">
    NORMAL 4
  </div>
}

function Special1 () {
  return <div className="icon-container">
    SPECIAL 1
  </div>
}
function Special2 () {
  return <div className="icon-container">
    SPECIAL 2
  </div>
}
function Special3 () {
  return <div className="icon-container">
    SPECIAL 3
  </div>
}
function Special4 () {
  return <div className="icon-container">
    SPECIAL 4
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
    $<span className="number">{number}</span>
  </div>
}

function Point ({number=0}) {
  return <div className="icon-container">
    {/*<img className="icon" src={point}/>*/}
    &#x1F604;
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
  return <div className="icon-container">
    <img className="icon" src={bonus}/>
  </div>
}



export default {
  // Empty,
  Remove1,
  Remove2,
  Remove3,
  Remove4,
  Normal1,
  Normal2,
  Normal3,
  Normal4,
  Special1,
  Special2,
  Special3,
  Special4,
  Edge1,
  Edge2,
  Edge3,
  Money,
  Point,
  // Cycle,
  Trash,
  Bonus,
}

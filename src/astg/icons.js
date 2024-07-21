import _ from 'lodash'

// import taxes from './images/taxes.png'
// import goods from './images/goods.png'
// import labor from './images/labor.png'

import taxes from './images/red.png'
import goods from './images/green.png'
import labor from './images/blue.png'

import draw from './images/draw.png'


function Taxes ({number=0}) {
  return <div className="icon-container">
    <img className="icon" src={taxes} />
    {number > 0 ? <span className="number">{number}</span> : null}
  </div>
}

function Goods ({number=0}) {
  return <div className="icon-container">
    <img className="icon" src={goods} />
    {number > 0 ? <span className="number">{number}</span> : null}
  </div>
}

function Labor ({number=0}) {
  return <div className="icon-container">
    <img className="icon" src={labor} />
    {number > 0 ? <span className="number">{number}</span> : null}
  </div>
}


function Draw ({number=0}) {
  return <div className="icon-container">
    <img className="icon" src={draw} />
    {number > 0 ? <span className="number">{number}</span> : null}
  </div>
}




export default {
  Taxes,
  Goods,
  Labor,
  Draw,
}

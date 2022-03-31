import _ from 'lodash';
import './index.css';

import cards from './cards.js';
// import ICONS from './icons.js'

// import sniper from './images/sniper.png'


function Agent (props) {
  return (
    <div className="card">
      agent
    </div>
  )
}

function Ally (props) {
  return (
    <div className="card">
      ally
    </div>
  )
}

function Cards() {
  return (
    <div>
      {_.map(cards, (cardObj) => {
        if (cardObj.type === 'AGENT') {
          return <Agent {...cardObj} />  
          // return <div> agent </div>  
        }
        else if (cardObj.type === 'ALLY') {
          return <Ally {...cardObj} />
          // return <div> ally </div>
        }
      })}
    </div>
  );
}

export default Cards;

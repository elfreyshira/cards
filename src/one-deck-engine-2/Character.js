import _ from 'lodash'
import classnames from 'classnames'

import {Storage} from './Card.js'

import ICONS from './icons.js'


function Crowns () {
  return <div className="crowns"><ICONS.Crown /></div>
}

function WindCollection () {
  return <div className="wind-collection"><ICONS.Point /></div>
}

function Character () {

  return (
    <div className="card">
      <div className="character">
        Each turn, choose 1 action:
        <div className="character-grouping">
          <span className="character-action">CONSTRUCT</span> Pay <ICONS.Fire/> to play card to top row. For each
            <span className="rotate-icon" style={{fontSize: '25px', bottom: '24px'}}>&#10607;</span> on the card, draw & discard 2 cards.
        </div>
        <div className="character-grouping">
          <span className="character-action">PRODUCE</span> Trigger <ICONS.Arrow /> effects.
        </div>
        <div className="character-grouping">
          <span className="character-action">DEVELOP</span> Pay <ICONS.Water/> to play card to bottom row.
        </div>
        <div className="character-grouping">
          <span className="character-action">FARM</span> Rotate
            <span className="rotate-icon">&#10558;</span>
            all bottom row cards.
        </div>
        <div className="character-grouping">
          <span className="character-action">PURCHASE</span> Pay for any number of point cards.
          <span style={{display: 'inline-block'}}>Restore<span className="rotate-icon">&#10559;</span></span>
          any cards used.
        </div>
      </div>
      <hr/>
      <div className="end-of-turn">End of turn: <ICONS.Draw /></div>
      <hr/>
      <Storage gain={{wildStorage: 2}} />
    </div>
  )
}


export default Character

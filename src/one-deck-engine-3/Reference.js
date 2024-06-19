import _ from 'lodash'
import classnames from 'classnames'

import {Rest} from './Card.js'

import ICONS from './icons.js'



function Reference () {

  return (
    <div className="card">
      <div className="ref">
        Each turn, choose 1 action:

        <div className="ref-grouping">
          <span className="ref-action" style={{borderLeft: '8px solid #8338ec'}}>HIRE</span> Pay $ (or tags for free) to play the top half of the card. All new hires come tapped.
        </div>

        <div className="ref-grouping">
          <span className="ref-action" style={{borderLeft: '8px solid #5c8001'}}>CONSTRUCT</span> Pay $ to play the bottom half of the card. Place it sideways.
        </div>

        <div className="ref-grouping">
          <span className="ref-action" style={{borderLeft: '8px solid #fb5607'}}>INVITE</span> Pay $ to invite a special guest. Each special guest is <ICONS.Point/>10
        </div>

        <div className="ref-grouping">
          <span className="ref-action" style={{borderLeft: '8px solid rgb(0,208,182)'}}>REST <ICONS.Rest/></span> Untap top row cards. Activate <ICONS.Rest/> effects.
        </div>

      </div>
      <hr/>
      <Rest gain={{draw: 1}} />
    </div>
  )
}


export default Reference

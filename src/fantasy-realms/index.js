import _ from 'lodash'
import classnames from 'classnames'

import './index.css'



function Card ({suit, name, baseStr, bonus, penalty, baseText, filetype, imgZoom, imgTop, imgLeft}) {
  return (
    <div className={classnames('card', 'suit-'+suit)}>
      <img
        src={'./images/fantasy-realms/'+ suit + '-' + name + '.' + filetype}
        style={{zoom: imgZoom, top: imgTop, left: imgLeft}}/>
      
      <div className="suit">
        {suit}
      </div>


    </div>
  )
}

function Cards () {
  return (
    <Card
      suit="army"
      name="celestial-knights"
      baseStr={20}
      bonus="Just a random test."
      penalty="-8 unless with at least one Leader"
      baseText="Putting more filler text here."
      filetype="jpg"
      imgZoom='31%'
      imgTop='-100px'
      imgLeft={0}
    />
  )
}

export default Cards

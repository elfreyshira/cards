import _ from 'lodash'
import classnames from 'classnames'
import Brng from 'brng'

import ICONS from './icons.js'


const squareResourcesList = [
  'remove1',
  'remove2',
  'remove3',
  'remove4',

  'normal1',
  'normal2',
  'normal3',
  'normal4',

  'special1',
  'special2',
  'special3',
  'special4',

  'edge1',
  'edge2',
  'edge3',
]

const otherResourcesList = [
  'trash',

  'money',
  'point',
  'bonus',
]
// _.capitalize(resource)

function Card (props) {
  
  const {
    cost,
    gain,
    uuid,
  } = props.cardObj


  return (
    <div className="card lg">
      <div className="md">
        {_.compact(_.map(squareResourcesList, (resource) => {
          const ChosenIcon = ICONS[_.capitalize(resource)]
          if (gain[resource] > 0) {
            return <div key={resource}><ChosenIcon number={gain[resource]} /></div>
          }
        }))}
      </div>

      <div className="card-container">
        {_.compact(_.map(otherResourcesList, (resource) => {
          const ChosenIcon = ICONS[_.capitalize(resource)]
          if (gain[resource] > 0) {
            return <div key={resource}><ChosenIcon number={gain[resource]} /></div>
          }
        }))}
      </div>

      <div className="cost">
        ${cost}
      </div>

    </div>
  )
}

export default Card

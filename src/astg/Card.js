import _ from 'lodash'
import classnames from 'classnames'
import Brng from 'brng'

import {
  ACTION_RESOURCE_LIST,
  PHYSICAL_RESOURCE_LIST,
  PHYSICAL_NORMAL_RESOURCE_LIST,
  PHYSICAL_SPECIAL_RESOURCE_LIST,
  PHYSICAL_DELAY_RESOURCE_LIST,
  PHYSICAL_ON_LEAVE_RESOURCE_LIST,
} from './CONSTANTS.js'

import ICONS from './icons.js'


function Card (props) {
  
  const {
    gain
  } = props.cardObj

  return (
    <div className="card lg">
      <div className="gain">

        <div>
          {_.map(PHYSICAL_DELAY_RESOURCE_LIST, (resource) => {
            if (!gain[resource]) {
              return null
            }
            const ChosenIcon = ICONS[_.capitalize(_.replace(resource, 'Delay', ''))]
            return <div key={resource}>
              <span className="md">Choose: </span>
              <ChosenIcon number={gain[resource]} />
              <span className="md">on this card OR grab all</span>
            </div>
          })}
        </div>

        <div>
          {_.map(PHYSICAL_ON_LEAVE_RESOURCE_LIST, (resource) => {
            if (!gain[resource]) {
              return null
            }
            const ChosenIcon = ICONS[_.capitalize(_.replace(resource, 'OnWPLeave', ''))]
            return <div key={resource}>
              <span className="md">On leave: </span>
              <ChosenIcon number={gain[resource]} />
            </div>
          })}
        </div>


        <div>
          {_.map(PHYSICAL_NORMAL_RESOURCE_LIST, (resource) => {
            if (!gain[resource]) {
              return null
            }
            const ChosenIcon = ICONS[_.capitalize(resource)]
            return <ChosenIcon key={resource} number={gain[resource]} />
          })}
        </div>
        
      </div>
      {/*{JSON.stringify(props.cardObj)}*/}
      {/*{props.cardObj.uuid}*/}
    </div>
  )
}

export default Card

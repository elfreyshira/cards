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

const TYPE_TO_CARD_ICON = {
  wp: ICONS.Typewp,
  rd: ICONS.Typerd,
  cr: ICONS.Typecr,
}
const TYPE_TO_COST_ICON = {
  wp: ICONS.Labor,
  rd: ICONS.Goods,
  cr: ICONS.Taxes,
}
const STRENGTH_TO_TIER = {
  2.0: 'I',
  2.5: 'I',
  3.0: 'I',
  3.5: 'II',
  4.0: 'II',
  4.5: 'II',
  5.0: 'III',
  5.5: 'III',
  6.0: 'III',
}

function Card (props) {
  
  const {
    gain,
    type,
    cost,
    points,
    strength,
    crActivation, // only for cr
  } = props.cardObj

  const TypeIcon = TYPE_TO_CARD_ICON[type]
  const CostIcon = TYPE_TO_COST_ICON[type]

  const physicalDelayResourceGain = _.compact(_.map(PHYSICAL_DELAY_RESOURCE_LIST, (resource) => {
    if (!gain[resource]) {
      return null
    }
    const cleanedResource = _.replace(resource, 'Delay', '')

    {/*const ChosenIcon = ICONS[_.capitalize(_.replace(resource, 'Delay', ''))]*/}
    return <div key={resource}>
      <ICONS.Delay resource={cleanedResource} number={gain[resource]} />
    </div>
  }))

  const onLeaveResourceGain = _.compact(_.map(PHYSICAL_ON_LEAVE_RESOURCE_LIST, (resource) => {
    if (!gain[resource]) {
      return null
    }
    const cleanedResource = _.replace(resource, 'OnWPLeave', '')

    return <div key={resource}>
      <ICONS.OnLeave resource={cleanedResource} number={gain[resource]} />
    </div>

  }))

  const normalResourceGain = _.compact(_.map(PHYSICAL_NORMAL_RESOURCE_LIST.concat('favor'),
    (resource) => {
      if (!gain[resource]) {
        return null
      }
      const ChosenIcon = ICONS[_.capitalize(resource)]
      return <ChosenIcon key={resource} number={gain[resource]} />
    }
  ))

  const actionResourceGain = _.compact(_.map(ACTION_RESOURCE_LIST, (resource) => {
    if (!gain[resource]) {
      return null
    }
    const ChosenIcon = ICONS[_.capitalize(resource)]
    return <ChosenIcon key={resource}/>
  }))



  return (
    <div className="card lg"><div className={type + ' card-type-container'}>
      <div className="info">
        <TypeIcon />
        <div className="md"><CostIcon number={cost/100} /></div>
        <div className="info-right">
          {STRENGTH_TO_TIER[strength]}
          <div className="md"><ICONS.Points number={points} /></div>
        </div>
      </div>
      {type === 'cr' ? 
        <div className="cr-guide-container sm">
          {_.times(4, (idx) => {
            return <span className="cr-guide">{idx+1 >= crActivation ? <>&#x2714;</> : null}</span>
          })}
        </div>
        : null
      }
      <div className="gain">

        {_.isEmpty(physicalDelayResourceGain) ? null :
          <div className="md gain-group">{physicalDelayResourceGain}</div>
        }

        {_.isEmpty(onLeaveResourceGain) ? null :
          <div className="md gain-group">{onLeaveResourceGain}</div>
        }

        {_.isEmpty(normalResourceGain) ? null :
          <div className="gain-group">{normalResourceGain}</div>
        }

        {_.isEmpty(actionResourceGain) ? null :
          <div className="gain-group">{actionResourceGain}</div>
        }
      </div>
      {/*{JSON.stringify(props.cardObj)}*/}
      {/*{props.cardObj.uuid}*/}
    </div></div>
  )
}

export default Card

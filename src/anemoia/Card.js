// 'type',
// 'spotLevel',
// 'pointsOnCard',
// 'resourceCost',
// 'loss',
// 'gain',

import ICONS from './icons.js'
import _ from 'lodash'

function TypeIcon ({type}) {
  const typeStripped = type.replaceAll('_', '')

  if (typeStripped === 'SPOT') {
    return <ICONS.Spot />
  }
  if (typeStripped === 'HOME') {
    return <ICONS.Home />
  }
  if (typeStripped === 'TAP') {
    return <ICONS.Tap />
  }
}

function SpotLevel ({level}) {
  if (!level) { return null}
  else {
    return <div className="level">{level.replace('LEVEL_', '')}</div>
  }
}

function Points ({pointsOnCard}) {

  if (!pointsOnCard) {
    return null
  }

  return (
    <div className="points">
      &#x274B;{pointsOnCard}
    </div>
  )
}

function ResourceIcon ({resource, amount}) {
  const ChosenIcon = ICONS[_.capitalize(resource)]
  if (_.isUndefined(ChosenIcon)) {
    return null
  }
  return <ChosenIcon amount={amount}/>
}

function Cost ({resourceCost}) {
  const resourceArray = []

  const resourceCostOrder = _.sortBy(
    _.keys(resourceCost),
    (resource) => -resourceCost[resource]
  )

  _.forEach(resourceCostOrder, (resource) => {
    const resourceDiv = (
      <span className="resource-cost-group" key={resource}>
        {_.times(resourceCost[resource], (idx) => {
          return <ResourceIcon key={idx} resource={resource} />
        })}
      </span>
    )
    resourceArray.push(resourceDiv)
  })
  return (
    <div className="cost">
      {resourceArray}
    </div>
  )
  // return <ICONS.Earth />
}

function Loss({loss}) {
  if (_.isEmpty(loss)) {
    return null
  }
  return (
    <div className="loss">
      <ResourceIcon resource={_.keys(loss)[0]} amount={1}/>
    </div>
  )
}


function Gain({gain}) {
  if (_.isEmpty(gain)) {
    return null
  }

  const resourceArray = []
  _.forEach(gain, (amount, resource) => {
    const resourceDiv = (
      <div className="gain-family" key={resource}>
        {_.times(amount, (idx) => {
          if (resource === 'money' && idx >= 1) {
            return null
          }
          return <ResourceIcon key={idx} resource={resource} amount={amount} />
        })}
      </div>
    )
    resourceArray.push(resourceDiv)
  })

  return (
    <div className="gain">
      {resourceArray}
    </div>
  )
}

function Effect ({loss, gain}) {
  return (
    <div className="effect">
      <Loss loss={loss} />
      <Gain gain={gain} />
    </div>
  )
  // return null
}

function Card (props) {
  const {type, spotLevel, pointsOnCard, resourceCost, loss, gain, uuid, _usageValue} = props.cardObj

  return (
    <div className={'card ' + _.lowerCase(type.replaceAll('_', ''))}>

      <div className="type">
        <TypeIcon type={type} />
        <SpotLevel level={spotLevel} />
      </div>
      
      <Points pointsOnCard={pointsOnCard} />

      <Cost resourceCost={resourceCost} />

      <Effect loss={loss} gain={gain} />
      <div>{uuid}</div>
      <div>{_usageValue}</div>

      {/*<div>{JSON.stringify(loss)}</div>
      <div>{JSON.stringify(gain)}</div>*/}
      <pre>
        {/*{JSON.stringify(props.cardObj, null, 2)}*/}
        {/*{JSON.stringify(cardsArray, null, 2)}*/}
      </pre>
    </div>
  )
}

export default Card

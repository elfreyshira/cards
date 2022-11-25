// 'type',
// 'spotLevel',
// 'pointsOnCard',
// 'resourceCost',
// 'loss',
// 'gain',

import ICONS from './icons.js'
import _ from 'lodash'

function getStrippedType (rawTypeString) {
  return rawTypeString ? rawTypeString.replaceAll('_', '') : ''
}

function Type ({type, spotLevel}) {

  if (_.isEmpty(type)) {
    return null
  }
  return (
    <div className="type">
      <TypeIcon type={type} />
      <SpotLevel spotLevel={spotLevel} />
    </div>
  )
  
}

function TypeIcon ({type}) {
  const typeStripped = getStrippedType(type)

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

function SpotLevel ({spotLevel}) {
  if (!spotLevel) { return null}
  else {
    return <div className="level">{spotLevel.replace('LEVEL_', '')}</div>
  }
}

function Points ({pointsOnCard}) {

  if (!_.isNumber(pointsOnCard)) {
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

function LaterResources ({gain}) {
  const resourceArray = []
  _.forEach(gain, (amount, resource) => {
    // ignore the normal resources
    if (!_.includes(resource, 'later')) {
      return
    }

    const resourceDiv = (
      <span key={resource}>
        {_.times(amount, (idx) => {
          return <ResourceIcon key={idx} resource={resource.replace(/later$/, '')} />
        })}
      </span>
      
    )
    resourceArray.push(resourceDiv)
  })

  if (_.isEmpty(resourceArray)) {
    return null
  }

  return (
    <div className="later-resources-group">
      <ICONS.ThisCard />
      <span className="later-colon">&nbsp;:&nbsp;</span>
      {resourceArray}
      <span className="later-colon">&nbsp;/&nbsp;</span>
      <ICONS.Grab />
    </div>
  )
}

const RESOURCE_ORDER_MAP = {
  untap: 1,
  retrieve: 1,
  chainLevel1: 1,
  chainLevel2: 1,
  chainLevel3: 1,
  grabanother: 1,
  fire: 2,
  water: 2,
  earth: 2,
  wild: 3,
  card: 4,
  money: 5,
}

function Gain({gain}) {
  if (_.isEmpty(gain)) {
    return null
  }

  const gainKeys = _.sortBy(_.keys(gain), (key) => RESOURCE_ORDER_MAP[key])

  const resourceArray = []
  _.forEach(gainKeys, (resource) => {
    // ignore the 'later' resources
    if (_.includes(resource, 'later')) {
      return
    }

    const resourceDiv = (
      <div className="gain-family" key={resource}>
        {_.times(gain[resource], (idx) => {
          if (resource === 'money' && idx >= 1) {
            // money is all at once, so don't do it multiple times
            return null
          }
          return <ResourceIcon key={idx} resource={resource} amount={gain[resource]} />
        })}
      </div>
    )
    resourceArray.push(resourceDiv)
  })

  return (
    <div className="gain">
      <LaterResources gain={gain} />
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
  const {
    type, spotLevel,
    pointsOnCard, resourceCost,
    loss, gain, uuid,
    totalCostValue, _usageValue,
    ExtraStuff
  } = props.cardObj

  if (!_.isEmpty(ExtraStuff)) {
    return (
      <div className="card">
        {ExtraStuff}
      </div>
    )
  }

  return (
    <div className={'card ' + _.lowerCase(getStrippedType(type))}>

      <Type type={type} spotLevel={spotLevel} />
      
      <Points pointsOnCard={pointsOnCard} />

      <Cost resourceCost={resourceCost} />

      <Effect loss={loss} gain={gain} />
      <div>{uuid}</div>
      <div>{_usageValue}</div>



      {/*<div>{JSON.stringify(loss)}</div>*/}
      {/*<div>{JSON.stringify(gain, null, 1)}</div>*/}
      <pre>
        {/*{JSON.stringify(props.cardObj, null, 2)}*/}
        {/*{JSON.stringify(cardsArray, null, 2)}*/}
      </pre>
    </div>
  )
}

export default Card

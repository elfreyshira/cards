// 'type',
// 'spotLevel',
// 'pointsOnCard',
// 'resourceCost',
// 'loss',
// 'gain',

import ICONS from './icons.js'
import _ from 'lodash'
import classnames from 'classnames'

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
  if (type === 'SPOT') {
    return <ICONS.Spot />
  }
  if (type === 'HOME') {
    return <ICONS.Home />
  }
  if (type === 'TAP') {
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
      &#x274B;<span className={classnames({negative: pointsOnCard < 0})}>{pointsOnCard}</span>
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

// mostly for moments/contracts
const costOrderFunc = (resource) => {
  if (resource === 'wildsame') {
    return 1
  }
  else if (resource === 'wild') {
    return 2
  }
  else {
    return 0
  }
}

function Cost ({resourceCost}) {

  const resourceArray = []

  let resourceCostOrder = _.sortBy(
    _.keys(resourceCost),
    (resource) => -resourceCost[resource]
  )
  resourceCostOrder = _.sortBy(resourceCostOrder, costOrderFunc)

  _.forEach(resourceCostOrder, (resource) => {
    const resourceDiv = (
      <span className={classnames("resource-cost-group", resource)} key={resource}>
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

function Tags ({tagNumber, tagElement}) {
  const tagsArray = []

  _.times(tagNumber, (idx) => {
    tagsArray.push(
      <div className="tag-container tag-in-corner" key={idx}>
        <div className="tag-single">
          <ResourceIcon resource={tagElement} />
        </div>
      </div>
    )
  })

  return (
    <div>{tagsArray}
    </div>
  )
}


const conditionalPerMapping = {
  earth: (
    <div className="tag-container tag-in-conditional">
      <div className="tag-single">
        <ResourceIcon resource="earth" />
      </div>
    </div>
  ),
  fire: (
    <div className="tag-container tag-in-conditional">
      <div className="tag-single">
        <ResourceIcon resource="fire" />
      </div>
    </div>
  ),
  water: (
    <div className="tag-container tag-in-conditional">
      <div className="tag-single">
        <ResourceIcon resource="water" />
      </div>
    </div>
  ),
  HOME: <ICONS.Home />,
  TAP: <ICONS.Tap />,
  SPOT: <ICONS.Spot />,
}

function ConditionalPoints ({conditionalType, conditionalPoints, conditionalPer}) {
  if (_.isUndefined(conditionalType) || _.isUndefined(conditionalPoints) || _.isUndefined(conditionalPer)) {
    return null
  }

  return (
    <div className="conditional-top-container">
      &#x274B;{conditionalPoints} for each {conditionalPerMapping[conditionalPer]}
      {_.includes(['card','cardcost'], conditionalType) ?
        <span className="conditional-card-text">
          {conditionalType === 'card' ? "built" : null}
          {conditionalType === 'cardcost' ? "cost" : null}
        </span>
        : null
      }
      
    </div>
  )
}

function Moment(props) {

  const {
    type, resourceCost, totalCostValue, resourceCostObj, basePoints,
  } = props.momentObj


  return (
    <div className="card contract">
      <div className="contract-type">
        <ICONS.Moment />
        <span className="contract-type-text">{type.slice(-1)}</span>
      </div>
      <Points pointsOnCard={basePoints} />
      <Cost resourceCost={resourceCostObj} />
      {/*{JSON.stringify(props.contractObj)}*/}
    </div>
  )
}

function Contract (props) {
  const {
    type, resourceCost, totalCostValue, tagNumber, tagElement, conditionalType,
    conditionalPer, conditionalPoints, resourceCostObj, basePoints,
  } = props.contractObj

  return (
    <div className="card contract">
      <div className="contract-type">
        <ICONS.Moment />
        <span className="contract-type-text">{type.slice(-1)}</span>
      </div>
      <Points pointsOnCard={basePoints} />
      <Cost resourceCost={resourceCostObj} />
      <ConditionalPoints
        conditionalType={conditionalType}
        conditionalPoints={conditionalPoints}
        conditionalPer={conditionalPer}
      />
      <Tags tagNumber={tagNumber} tagElement={tagElement} />
      {/*{JSON.stringify(props.contractObj)}*/}
    </div>
  )
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
    <div className={'card ' + _.lowerCase(type)}>

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

export {Card, Contract}

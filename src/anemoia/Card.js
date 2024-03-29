// 'type',
// 'spotLevel',
// 'pointsOnCard',
// 'resourceCost',
// 'loss',
// 'gain',

import ICONS from './icons.js'
import _ from 'lodash'
import classnames from 'classnames'

// import backgroundArt1 from './images/background-art/spot-point-001.jpg'
// import backgroundArt2 from './images/background-art/spot-point-002.jpg'
// import backgroundArt3 from './images/background-art/spot-point-003.jpg'
// import backgroundArt4 from './images/background-art/spot-point-004.jpg'
// import backgroundArt5 from './images/background-art/spot-point-005.jpg'
// import backgroundArt6 from './images/background-art/spot-point-006.jpg'
// import backgroundArt7 from './images/background-art/spot-point-007.jpg'
// import backgroundArt8 from './images/background-art/spot-point-008.jpg'
// import backgroundArt9 from './images/background-art/spot-point-009.jpg'

const BACKGROUND_ART_MAPPING = {
  // 1: backgroundArt1,
  // 2: backgroundArt2,
  // 3: backgroundArt3,
  // 4: backgroundArt4,
  // 5: backgroundArt5,
  // 6: backgroundArt6,
  // 7: backgroundArt7,
  // 8: backgroundArt8,
  // 9: backgroundArt9,
}

const RESOURCES_WITH_DIGITS_AFTER = ['money', 'point']

function Type ({type, spotLevel, isPointGenerator}) {

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
    <div className="points-on-card">
      &#x274B;<span className={classnames({negative: pointsOnCard < 0})}>{pointsOnCard}</span>
    </div>
  )
}

function ResourceIcon ({resource, amount}) {
  const ChosenIcon = ICONS[_.capitalize(resource)]
  if (_.isUndefined(ChosenIcon)) {
    return null
  }
  else if (_.includes(RESOURCES_WITH_DIGITS_AFTER, resource) || amount === 1) {
    return <ChosenIcon amount={amount}/>
  }
  else {
    return (
      <span className="resource-icon-container">
        <ChosenIcon amount={amount} />
        <span className="amount-text">{amount}</span>
      </span>
    )
  }
  // return <ChosenIcon amount={amount}/>
}

// mostly for moments/contracts
const costOrderFunc = (resource) => {
  if (resource === 'wildsame') {
    return 3
  }
  else if (resource === 'money') {
    return 2
  }
  else if (resource === 'wild') {
    return 1
  }
  else {
    return 0
  }
}

function Cost ({resourceCost}) {

  if (_.isEmpty(resourceCost)) {
    return null
  }

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

  const lossKeysInOrder = _.sortBy(_.keys(loss), costOrderFunc)

  return (
    <div className="loss">
    {_.map(lossKeysInOrder, (resourceKey) => {
      return (
        <ResourceIcon
          key={resourceKey}
          resource={resourceKey}
          amount={loss[resourceKey]}
        />
      )
    })}
    </div>
  )
}

function LaterResources ({gain}) {
  const resourceArray = []
  _.forEach(gain, (amount, resourceKey) => {
    // ignore the normal resources
    if (!_.includes(resourceKey, 'later')) {
      return
    }

    resourceArray.push(
      <ResourceIcon
        key={resourceKey}
        resource={resourceKey.replace(/later$/, '')}
        amount={gain[resourceKey]}
      />
    )

    // const resourceDiv = (
    //   <span key={resource}>
    //     {_.times(amount, (idx) => {
    //       return <ResourceIcon key={idx} resource={resource.replace(/later$/, '')} />
    //     })}
    //   </span>
      
    // )
    // resourceArray.push(resourceDiv)
  })

  if (_.isEmpty(resourceArray)) {
    return null
  }

  // the first div is needed so the later-resources-group div can be inline-block
  return (
    <div>
      <div className="later-resources-group">
        <ICONS.ThisCard />
        <span className="later-colon">&nbsp;:&nbsp;</span>
        {resourceArray}
        <span className="later-colon">&nbsp;/&nbsp;</span>
        <ICONS.Grab />
      </div>
    </div>
  )
}

const RESOURCE_ORDER_MAP = {
  card: 1,
  money: 2,
  fire: 3,
  water: 3,
  earth: 3,
  wild: 4,
  grabanother: 5,
  untap: 5,
  retrieve: 5,
  chainLevel1: 5,
  chainLevel2: 5,
  chainLevel3: 5,
  chainLevel4: 5,
}

function Gain({gain}) {
  if (_.isEmpty(gain)) {
    return null
  }

  const gainKeys = _.sortBy(_.keys(gain), (key) => RESOURCE_ORDER_MAP[key])

  const resourceArray = []
  _.forEach(gainKeys, (resourceKey) => {
    // ignore the 'later' resources
    if (_.includes(resourceKey, 'later')) {
      return
    }

    resourceArray.push(
      <div className="gain-family" key={resourceKey}>
        <ResourceIcon resource={resourceKey} amount={gain[resourceKey]} />
      </div>
    )

    // const resourceDiv = (
    //   <div className="gain-family" key={resourceKey}>
    //     {_.times(gain[resourceKey], (idx) => {
    //       if (idx >= 1 && _.includes(RESOURCES_WITH_DIGITS_AFTER, resourceKey)) {
    //         // money/point is all at once, so don't do it multiple times
    //         return null
    //       }
    //       return <ResourceIcon key={idx} resource={resourceKey} amount={gain[resourceKey]} />
    //     })}
    //   </div>
    // )
    // resourceArray.push(resourceDiv)
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
      <table>
        <tbody>
        <tr>
          <td>
            <Loss loss={loss} />
          </td>
          <td>
            <Gain gain={gain} />
          </td>
        </tr>
        </tbody>
      </table>
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

function Background () {
  return (
    <div className="background">
      <img src={BACKGROUND_ART_MAPPING[_.random(1,9)]}/>
      <div className="background-bottom"></div>
    </div>
  )
}

function Card (props) {
  const {
    type, spotLevel,
    pointsOnCard, resourceCost,
    loss, gain, uuid,
    totalCostValue, _usageValue,
    isPointGenerator,
    ExtraStuff, maxValue,
  } = props.cardObj

  if (!_.isEmpty(ExtraStuff)) {
    return (
      <div className="card">
        {ExtraStuff}
      </div>
    )
  }

  return (
    <div className={classnames('card', _.lowerCase(type), isPointGenerator ? 'point-generator' : false)}>

      <Type type={type} spotLevel={spotLevel} isPointGenerator={isPointGenerator} />
      
      <Points pointsOnCard={pointsOnCard} />

      <Cost resourceCost={resourceCost} />

      {/*<Background />*/}

      <Effect loss={loss} gain={gain} />
      {/*<div>{uuid}</div>*/}
      <div style={{textAlign: 'right', padding: '5px', fontSize: '.8rem'}}>{_usageValue} / {maxValue}</div>



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

import _ from 'lodash'
import classnames from 'classnames'

import ICONS from './icons.js'


const cleanup = (effectKey) => {
  return _.chain(effectKey)
    .replace(/Produce\b/, '')
    .replace(/Storage\b/, '')
    .replace(/Discount\b/, '')
    .capitalize()
    .value()
}

// {
//   costTotal,
//   costVariety,
//   timePassed,
//   cost: {
//     fire: ...,
//     earth: ...,
//     water: ...,
//   },
//   tiebreaker: NUMBER,
//   expectedValue: NUMBER,
//   gain: {
//     fireProduce: ...,
//   }
// }


function Cost({cost}) {
  return (
    <div className="cost">
      {
        _.map(cost, (costQuantity, costKey) => {
          const ChosenIcon = ICONS[cleanup(costKey)]
          {/*return <span>{_.times(costQuantity, () => <ChosenIcon />)}</span>*/}
          return _.times(costQuantity, () => <ChosenIcon />)
        })
      }
    </div>
  )
}

function Point ({gain}) {
  if (_.has(gain, 'point')) {
    // const PointIcon = ICONS.Point
    return <div className="point-container"> {_.times(gain.point, () => <ICONS.Point />)} </div>
  }
  else {
    return null
  }
}

function Discount({gain}) {
  const discountList = _.filter(_.keys(gain), (resource) => {
    return _.endsWith(resource, 'Discount')
  })

  if (_.isEmpty(discountList)) {
    return null
  }

  return (
    <div className="discount">
      {
        _.map(discountList, (resource) => {
          const ChosenIcon = ICONS[cleanup(resource)]

          return (
            <div className="discount-group">
              {_.times(gain[resource], () => <ChosenIcon />)}
            </div>
            
          )
        })
      }
    </div>
  )
}


 // _.map(gain, (discountQuantity, resource) => {
 //          if (_.endsWith(resource, 'Produce') || resource === 'draw') {
 //            const ChosenIcon = ICONS[cleanup(resource)]
 //            return _.times(discountQuantity, () => <ChosenIcon />)
 //          }
          
 //        })


function Activation({gain}) {
  const activationList = _.filter(_.keys(gain), (resource) => {
    return _.endsWith(resource, 'Produce') || resource === 'draw'
  })

  if (_.isEmpty(activationList)) {
    return null
  }

  return (
    <div className="activation">
        <ICONS.Arrow/>
      {
        _.map(activationList, (resource) => {
          const ChosenIcon = ICONS[cleanup(resource)]
          return _.times(gain[resource], () => <ChosenIcon />)
        })
      }
    </div>
  )
}

function Storage ({gain}) {
  const storageList = _.filter(_.keys(gain), (resource) => _.endsWith(resource, 'Storage'))

  if (_.isEmpty(storageList)) {
    return null
  }

  return (
    <div className="storage">
      {
        _.map(storageList, (resource) => {
          const ChosenIcon = ICONS[cleanup(resource)]
          return _.times(gain[resource], () => <ChosenIcon />)
        })
      }
    </div>
  )
}

function Special ({gain}) {
  const specialResource = _.filter(_.keys(gain), (resource) => _.startsWith(resource, 'build'))[0]

  let specialText = ''

  if (_.isEmpty(specialResource)) {
    return null
  }

  else if (specialResource === 'buildWithOnlyProduced') {
    specialText = <>After DEVELOP: play a card using only <span className="special-produced">produced</span> resources.</>
  }
  else if (specialResource === 'buildWithOnlyDiscounted') {
    specialText = <>After PRODUCE: play a card using only <span className="special-discounted">discounted</span> resources.</>
  }

  return (
    <div className="special">
      {specialText}
    </div>
  )

}

function Discard ({discard}) {
  const ChosenIcon = ICONS[cleanup(discard)]
  return (
    <div className="discard">
      <ChosenIcon />
    </div>
  )
}

function TimePassed({timePassed}) {
  return (
    <div className="time-passed-container">
      <ICONS.TimePassed />{timePassed}
    </div>
  )
}

function Card (props) {
  const {
    cost,
    gain,
    tiebreaker,
    uuid,
    discard,
    timePassed,
  } = props.cardObj


  return (
    <div className="card">
      <Cost cost={cost} />
      <Discard discard={discard} />
      <Point gain={gain} />
      <Discount gain={gain} />
      <Activation gain={gain} />
      <Special gain={gain} />
      <Storage gain={gain} />

      <TimePassed timePassed={timePassed} />

      <div className="noprint" style={{position: 'absolute', top: '30px', right: 0, opacity: .1}}>{uuid}</div>


    </div>
  )
}

export {Card, Storage}

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
  return (
    <div className="discount">
      {
        _.map(gain, (discountQuantity, resource) => {
          if (_.endsWith(resource, 'Discount')) {
            const ChosenIcon = ICONS[cleanup(resource)]
            return <div className="discount-group">
            {_.times(discountQuantity, () => <ChosenIcon />)}
            </div>
          }
          
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

function Card (props) {
  const {
    cost,
    gain,
    tiebreaker,
  } = props.cardObj


  return (
    <div className="card">
      <Cost cost={cost} />
      <Point gain={gain} />
      <Discount gain={gain} />
      <Activation gain={gain} />
      <Storage gain={gain} />


    </div>
  )
}

export default Card

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

function Discount({gain}) {
  return (
    <div className="discount">
      {
        _.map(gain, (discountQuantity, resource) => {
          if (_.endsWith(resource, 'Discount')) {
            const ChosenIcon = ICONS[cleanup(resource)]
            return _.times(discountQuantity, () => <ChosenIcon />)
          }
          
        })
      }
    </div>
  )
}

function Activation({gain}) {
  return (
    <div className="activation">
      {
        _.map(gain, (discountQuantity, resource) => {
          if (_.endsWith(resource, 'Produce') || resource === 'draw') {
            const ChosenIcon = ICONS[cleanup(resource)]
            return _.times(discountQuantity, () => <ChosenIcon />)
          }
          
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
      <Discount gain={gain} />
      <Activation gain={gain} />


    </div>
  )
}

export default Card

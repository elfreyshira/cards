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


function Cost({costTotal, type, tieBreaker}) {
  return (
    <div className="cost">
      {
        _.times(costTotal, () => {
          return type === 'engine' ? <ICONS.Fire/> : <ICONS.Water/>
        })
      }
      <span className="tiebreaker">{_.times(tieBreaker, () => <>&#10607;</>)}</span>
    </div>
  )
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
  const specialResource = _.filter(_.keys(gain), (resource) => _.startsWith(resource, 'drawAfter'))[0]

  let specialText = ''

  if (_.isEmpty(specialResource)) {
    return null
  }


  else if (specialResource === 'drawAfterBuildEngine') {
    specialText = <>After CONSTRUCT: <ICONS.Draw/></>
  }
  else if (specialResource === 'drawAfterBuildPurchase') {
    specialText = <>After DEVELOP: <ICONS.Draw/></>
  }

  return (
    <div className="special">
      {specialText}
    </div>
  )

}

function EngineSide ({cardObj}) {

  const {
    costTotal,
    gain,
    tieBreaker
  } = cardObj

  return (
    <div className="engine-side">
      <Cost costTotal={costTotal} type="engine" tieBreaker={tieBreaker}/>
      <Discount gain={gain} />
      <Activation gain={gain} />
      <Special gain={gain} />
      <Storage gain={gain} />
    </div>
  )
}

function PurchasePowerSummary ({purchaseArray}) {
  return <div className="purchase-power-summary">
    {purchaseArray[0]} / {purchaseArray[1]} / {purchaseArray[2]}
    {/*{purchaseArray[0]} &#10148; {purchaseArray[1]} &#10148; {purchaseArray[2]}*/}
  </div>
}

function FirstPurchasePower ({purchaseArray}) {
  return <div className="purchase-power first-purchase-power">{purchaseArray[0]}</div>
}
function SecondPurchasePower ({purchaseArray}) {
  return <div className="purchase-power second-purchase-power">
    <div className="purchase-power-border-container">{purchaseArray[1]}</div>
    
  </div>
}
function ThirdPurchasePower ({purchaseArray}) {
  let purchasePowerStyle = {}
  if (purchaseArray[2] >= 10) {
    purchasePowerStyle = {right: '5px', top: '39px'}
  }
  return <div className="purchase-power third-purchase-power" style={purchasePowerStyle}>
    <div className="purchase-power-border-container">
    <div className="purchase-power-border-container">
      {purchaseArray[2]}
    </div>
    </div>
  </div>
}

function PurchaseSide ({cardObj}) {

  const {
    costPurchaseSide,
    gain,
    purchaseArray,
  } = cardObj

  return <div className="purchase-side">
    <Cost costTotal={costPurchaseSide} />

    <PurchasePowerSummary purchaseArray={purchaseArray} />

    <FirstPurchasePower purchaseArray={purchaseArray} />
    <SecondPurchasePower purchaseArray={purchaseArray} />
    <ThirdPurchasePower purchaseArray={purchaseArray} />
  </div>
}

function PointCost ({pointCost}) {
  return <div className="point-cost">{pointCost}</div>
}

function Card (props) {
  
  const {
    uuid,
    pointCost
  } = props.cardObj

  return (
    <div className="card">
      <PointCost pointCost={pointCost} />
      <EngineSide cardObj={props.cardObj} />
      <PurchaseSide cardObj={props.cardObj} />

      <div className="noprint" style={{position: 'absolute', top: '30px', right: 0, opacity: .1}}>{uuid}</div>


    </div>
  )
}

export {Card, Storage}

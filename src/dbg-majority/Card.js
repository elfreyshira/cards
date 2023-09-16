import _ from 'lodash'
import classnames from 'classnames'

import ICONS from './icons'

import {effectDisplayPriority} from './CONSTANTS'

function Cost({cost, index}) {
  return (
    <div className={classnames('cost', _.toString(cost) === '0' ? 'dark-mode' : '')}>
      ${cost}
      {!_.isNumber(index) ? null :
        <>
          <br/>
          <span style={{fontSize: '1rem', verticalAlign: 'top', float: 'right'}}>
            ({index})
          </span>
        </>
      }
    </div>
  )
}

function GainForEachCard () {
  return (
    <div className="custom-card" style={{fontSize: '1rem', textAlign: 'center'}}>
      For each <span className="small-icon"><ICONS.Day /></span>card
      played that costs $2 or less:<br/><br/>
      <ICONS.Wild />
    </div>
  )
}
function DrawWhenPurchase () {
  return (
    <div className="custom-card" style={{fontSize: '1.1rem', textAlign: 'center'}}>
      When purchasing<br/>a card: <br/><br/>
      <ICONS.Draw />
    </div>
  )
}
function DoubleUnits () {
  return (
    <div className="custom-card" style={{fontSize: '1.1rem', textAlign: 'center'}}>
      Any 1 location: gain units equal to the number of your units already there.
    </div>
  )
}
function LossForEachCard () {
  return (
    <div className="custom-card" style={{textAlign: 'center'}}>
      <ICONS.Wild amount={7}/><br/>
      <div className="small-icon" style={{fontSize: '1.1rem'}}>
        Reduce 1 <ICONS.Wild/> for
        <br/>each <ICONS.Day />card.
      </div>
      
    </div>
  )
}
function MoneyForEachUnit () {
  return (
    <div className="custom-card" style={{fontSize: '1.1rem', textAlign: 'center'}}>
      For each unit on<br/>this location:<br/><br/>
      <ICONS.Money amount={1}/>
    </div>
  )
}

const CUSTOM_CARD_MAPPING = {
  gainForEachCard: <GainForEachCard />,
  drawWhenPurchase: <DrawWhenPurchase />,
  doubleUnits: <DoubleUnits />,
  lossForEachCard: <LossForEachCard />,
  moneyForEachUnit: <MoneyForEachUnit />,
}

const cleanup = (effectKey) => _.chain(effectKey).trimEnd('Bottom').trimEnd('Top').capitalize().value()

function EffectContainer({effectSide, effects, comboType, customCard, customSide}) {

  const effectKeys = _.without(_.keys(effects), 'combo')

  let ComboEffect = <span></span>
  if (_.has(effects, 'combo')) {
    const ChosenIcon = ICONS[cleanup(effects.combo)]
    ComboEffect = (
      <div className="combo-container">
        <span className="combo">{comboType}: <ChosenIcon /></span>
      </div>
      
    )
  }

  if (customCard && customSide === effectSide) {

    return (
      <div className={classnames('effects-container', effectSide)}>
        {CUSTOM_CARD_MAPPING[customCard]}
      </div>
    )
  }

  // else not a custom card
  return (
    <div className={classnames('effects-container', effectSide)}>
      {_.compact(_.map(effectDisplayPriority, (effectKey, idx) => {
        if (_.has(effects, effectKey) && effects[effectKey] >= 1) {
          const ChosenIcon = ICONS[cleanup(effectKey)]
          return <span key={idx} className="single-effect"><ChosenIcon amount={effects[effectKey]}/></span>
        }
      }))}
      {ComboEffect}
      {/*<span style={{fontSize: '.5rem'}}>{JSON.stringify(effects)}</span>*/}
    </div>
  )
}

function Card (props) {
  const {
    cost, comboType, top, bottom, customCard, customSide, index
  } = props.cardObj


  return (
    <div className="card">
      <Cost cost={cost} index={index}/>
      <EffectContainer
        effectSide="top" effects={top} comboType={comboType}
        customCard={customCard} customSide={customSide}
      />
      <EffectContainer
        effectSide="bottom" effects={bottom} comboType={comboType}
        customCard={customCard} customSide={customSide}
      />
    </div>
  )
}

export default Card

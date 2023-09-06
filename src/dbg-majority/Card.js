import _ from 'lodash'
import classnames from 'classnames'

import ICONS from './icons'

import {effectDisplayPriority} from './CONSTANTS'

function Cost({cost}) {
  return (
    <div className="cost">
      ${cost}
    </div>
  )
}


const cleanup = (effectKey) => _.chain(effectKey).trimEnd('Bottom').trimEnd('Top').capitalize().value()

function EffectContainer({effectSide, effects, comboType}) {

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

  return (
    <div className={classnames('effects-container', effectSide)}>
      {_.compact(_.map(effectDisplayPriority, (effectKey, idx) => {
        if (_.has(effects, effectKey) && effects[effectKey] >= 1) {
          const ChosenIcon = ICONS[cleanup(effectKey)]
          return <span key={idx} className="single-effect"><ChosenIcon amount={effects[effectKey]}/></span>
        }
      }))}
      {/*{JSON.stringify(effects)}*/}
      {ComboEffect}
    </div>
  )
}

function Card (props) {
  const {
    cost, comboType, top, bottom
  } = props.cardObj


  return (
    <div className="card">
      <Cost cost={cost}/>
      <EffectContainer effectSide="top" effects={top} comboType={comboType} />
      <EffectContainer effectSide="bottom" effects={bottom} comboType={comboType} />
    </div>
  )
}

export default Card

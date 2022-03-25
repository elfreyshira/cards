import _ from 'lodash';
import './index.css';

import cards from './cards.js';
import CONSTANTS from './constants.js'


function Energy (props) {
  return (
    <div className="energy">
      <div className="energy-left">{props.children}</div>
      <div className="energy-right">{props.children}</div>
    </div>
  )
}

function Effect ({effect}) {
  if (!effect) {
    return null;
  }

  return (
    <div className="effect">
      {effect}
    </div>
  )
}

function PublicTrigger ({type, text}) {
  if (!type && !text) {
    return null
  }

  let once = ''
  if (type === CONSTANTS.PUBLIC_TRIGGER_TYPE_ONCE) {
    once = ' (Once)'
  }

  return (
    <div className="public-trigger">
      <div className="trigger-header">[Public Trigger{once}]</div>
      <div>{text}</div>
    </div>
  )
}

function PrivateTrigger ({cause, effect}) {
  if (!cause && !effect) {
    return null
  }

  return (
    <div>
      <div className="private-trigger">
        <div className="private-trigger-title">Private Trigger</div>
        <div className="private-trigger-effects">
          <div><span className="trigger-header">[Trigger]</span> {cause}</div>
          <div><span className="trigger-header">[Effect]</span> {effect}</div>
        </div>
      </div>
    </div>
  )
}

function Card ({
  energy,
  combo,
  effect,
  publicTriggerType,
  publicTriggerText,
  privateTriggerCause,
  privateTriggerEffect
}) {

  return (
    <div className={"card " + combo}>
      <Energy>{energy}</Energy>
      <Effect effect={effect} />
      <PublicTrigger type={publicTriggerType} text={publicTriggerText} />
      <PrivateTrigger cause={privateTriggerCause} effect={privateTriggerEffect} />
    </div>
  )
}


function Cards() {
  return (
    <div>
      {_.map(cards, (cardObj) => {
        return <Card {...cardObj} />
      })}
    </div>
  );
}

export default Cards;

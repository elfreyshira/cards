import _ from 'lodash';
import './index.css';

import cards from './cards.js';
import ICONS from './icons.js'
// import CONSTANTS from './constants.js'

import sniper from './images/sniper.png'

function Energy (props) {
  return (
    <div className="energy">
      <div className="energy-left">{props.children}</div>
      <div className="energy-right">{props.children}</div>
    </div>
  )
}


const codeToComponentMapping = {
  AHEAD: <ICONS.Ahead />,
  BEHIND: <ICONS.Behind />,
  ATTACK: <ICONS.Attack />,
  DEFENSE: <ICONS.Defense />,
  RANGE: <ICONS.Range />,
  TWICE: <ICONS.Twice />,
  POISON: <ICONS.Poison />,
  X2: <span>×2</span>,
  '/': <br />,
  recruit: <ICONS.Recruit/>,
  train: <ICONS.Train/>,
  towards: <span>&nbsp;<ICONS.Towards/>&nbsp;</span>,
  deck: <ICONS.Deck/>,
  to: <span>&nbsp;<ICONS.InOrderTo/>&nbsp;</span>,
  energy: <ICONS.Energy />,
  draw: <ICONS.Draw />,
  hand: <ICONS.Hand />,
  discard: <ICONS.Discard />,
}

function AgentEffect ({agentEffect}) {
  if (agentEffect === 'none') {
    return null
  }

  const effectCodes = agentEffect.split(' ')
  const agentEffectArray = _.map(effectCodes, (codeObj) => {
    return codeToComponentMapping[codeObj] || codeObj
  })

  return agentEffectArray
}

function Top (props) {
  return (
    <div className="top">
      <div className="base-attack">
        <span className="base-value">{props.attack}</span>
        <div><ICONS.Attack /></div>
      </div>
      <div className="agent-effect">
        <AgentEffect {...props} />
      </div>
      <div className="base-defense">
        <span className="base-value">{props.defense}</span>
        <div className="base-defense-icon-container"><ICONS.Defense /></div>
      </div>
      <div className="agent-type">{props.type} AGENT</div>
    </div>
  )
}

function Middle (props) {
  return (
    <div className="middle">
      {/*<div className="image-container"><img src={sniper} /></div>*/}
      <div className="energy-container">
        <span className="energy-value">{props.energy}</span>
        <ICONS.Energy />
      </div>
      {/*<div className="card-name">SNIPER</div>*/}
    </div>
  )
}

function AllyEffect ({allyEffect, type}) {

  if (type == 'MECHA') {
    return <div className="ally-effect-mecha">{allyEffect}</div>
  }
  
  const effectCodes = allyEffect.split(' ')
  const allyEffectArray = _.map(effectCodes, (codeObj) => {
    return codeToComponentMapping[codeObj] || codeObj
    // return <span>{codeToComponentMapping[codeObj] || codeObj}</span>
  })

  return allyEffectArray

}

function getBonusType({allyBonus}) {
  if (allyBonus === 'none') {
    return 'no'
  }
  else if (allyBonus.startsWith('DEFENSE')) {
    return 'defense'
  }
  else {
    return 'attack'
  }
}

function Bottom (props) {
  return (
    <div className="bottom">
      <div className={"ally-effect with-" + getBonusType(props) + "-bonus"}>
        <div className="ally-type">{props.type} ALLY</div>
        <AllyEffect {...props} />
      </div>
    </div>
  )
}
/*
<div className={"bonus-container-" + getBonusType(props)}>
        {codeToComponentMapping[_.toUpper(getBonusType(props))]}
        <span className="ally-bonus-text">
          hi
        </span>
      </div>
*/

function AllyBonusText ({allyBonus}) {
  const effectCodes = allyBonus.split(' ')
  const agentEffectArray = _.map(effectCodes, (codeObj) => {
    return codeToComponentMapping[codeObj] || codeObj
  })
  return agentEffectArray
}

function Bonus (props) {
  if (props.allyBonus === 'none') {
    return null
  }

  const bonusType = getBonusType(props)
  return (
    <div className={"ally-bonus " + bonusType + "-bonus"}>

      <div className={"bonus-icon-" + bonusType + "-container"}>
        <div className={"bonus-icon-" + bonusType}>
          {codeToComponentMapping[_.toUpper(bonusType)]}
        </div>
      </div>
      <div className={"bonus-text-" + bonusType + "-container"}>
        <div className={"bonus-text-" + bonusType}>
          <AllyBonusText {...props} />
        </div>
      </div>
    </div>
  )
}


// function Card ({agentEffect}) {
function Card (props) {

  return (
    <div className="card">
      <Top {...props} />
      <Middle {...props} />
      <Bottom {...props} />
      <Bonus {...props} />
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

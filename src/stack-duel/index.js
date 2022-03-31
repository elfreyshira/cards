import _ from 'lodash';
import './index.css';

import cards from './cards.js';
import ICONS from './icons.js'
// import CONSTANTS from './constants.js'

import sniper from './images/sniper.png'


const codeToComponentMapping = {
  AHEAD: <ICONS.Ahead />,
  BEHIND: <ICONS.Behind />,
  ATTACK: <ICONS.Attack />,
  DEFENSE: <ICONS.Defense />,
  RANGE: <ICONS.Range />,
  TWICE: <ICONS.Twice />,
  LETHAL: <ICONS.Lethal />,
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

function EnergyCost (props) {
  if (_.isString(props.energy) && props.energy.startsWith('D')) {
    return <span><ICONS.Deploy />{props.energy[1]}</span>
  }
  else {
    return <span>{props.energy}<ICONS.Energy /></span>
  }
}

function Middle (props) {
  return (
    <div className="middle">
      {/*<div className="image-container"><img src={sniper} /></div>*/}
      <div className="energy-container">
        <EnergyCost {...props} />
      </div>
      {/*<div className="card-name">SNIPER</div>*/}
      <div className="serial-number">{props.serialNumber}</div>
    </div>
  )
}

function AllyEffect ({allyEffect, type}) {

  if (type === 'MECHA') {
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
        <div className={"bonus-text-" + bonusType + "-title"}>
          ALLY BONUS
        </div>
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
    <div className={"card " + _.toLower(props.type)}>
      <Top {...props} />
      <Middle {...props} />
      <Bottom {...props} />
      <Bonus {...props} />
    </div>
  )
}

function Warden (props) {
  return (
    <div className="card warden-card">
      <div className="warden-name">{props.wardenName}</div>
      <div className="warden-trigger-title">[TRIGGER]</div>
      <div className="warden-trigger">{props.wardenTrigger}</div>
      <div className="warden-effect-title">[ <ICONS.Deploy/>1 ]</div>
      <div className="warden-effect">{props.wardenEffect}</div>
    </div>
  )
}

function Rules () {
  const iconsList = [
    <ICONS.Attack/>,
    <ICONS.Defense/>,
    <ICONS.Draw/>,
    <ICONS.Energy/>,
    <ICONS.Ahead/>,
    <ICONS.Behind/>,
    <ICONS.Range/>,
    <ICONS.Twice/>,
    <ICONS.Lethal/>,
    <ICONS.Recruit/>,
    <ICONS.Train/>,
    <ICONS.Towards/>,
    <ICONS.Deck/>,
    <ICONS.InOrderTo/>,
    <ICONS.Hand/>,
    <ICONS.Discard/>,
    <ICONS.Deploy/>,
    'T'
  ]
  const iconsExplanation = [
    'Attack level',
    'Defense level',
    'Draw a card',
    'Energy cost',
    'Affects the agent AHEAD',
    'Affects the agent BEHIND',
    'Range (default 1)',
    'Can attack twice',
    'Lethal (defeats enemy after battle)',
    'Recruit: take a card from the market',
    'Train: move card from hand/lane to your Trained pile',
    'Towards',
    'top of your deck',
    '"... in order to..."',
    'your hand',
    'Discard',
    'Deploy: move card from Trained to market deck',
    'Current number of cards in Trained pile'
  ]

  const stuff = []
  for (var i = 0; i < iconsList.length; i++) {
    stuff.push(
      <tr>
        <td>{iconsList[i]}</td>
        <td className="icon-description">{iconsExplanation[i]}</td>
      </tr>
    )
  }
  return (
    <div className="card rules">
    <table className="rules-table">
      {stuff}
    </table>
    </div>
  )
}

function AlwaysAvailable () {
  return (
    <div className="card always-available">
      <div className="always-available-title">[ 2<ICONS.Energy/> ] or [ <ICONS.Discard/>2 ]</div>
      <br/>Choose one:
      <ul style={{margin: 0}}>
        <li><ICONS.Draw/>1</li>
        <li><ICONS.Energy/>+1</li>
        <li><ICONS.Recruit/>1</li>
        <li><ICONS.Train/>1</li>
      </ul>
    </div>
  )
}

function Cards() {
  return (
    <div>
      {_.map(cards, (cardObj) => {
        if (cardObj.type === 'HUMAN' || cardObj.type === 'MECHA') {
          return <Card {...cardObj} />  
        }
        else if (cardObj.type === 'WARDEN') {
          return <Warden {...cardObj} />
        }
        else if (cardObj.type === 'ICON-SUMMARY') {
          return <Rules />
        }
        else if (cardObj.type === 'ALWAYS-AVAILABLE') {
          return <AlwaysAvailable />
        }
      })}
    </div>
  );
}

export default Cards;

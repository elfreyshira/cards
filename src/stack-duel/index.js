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
  '/': <br />
}

function AgentEffect ({agentEffect}) {
  if (agentEffect === 'none') {
    return null
  }

  const effectCodes = agentEffect.split(' ')
  const agentEffectArray = _.map(effectCodes, (codeObj) => {
    return codeToComponentMapping[codeObj] || codeObj
    // return <span>{codeToComponentMapping[codeObj] || codeObj}</span>
  })
  console.log(agentEffectArray)


  // if (agentEffect.startsWith('AHEAD')) {
  //   return null
  // }
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
    </div>
  )
}

function Middle (props) {
  return (
    <div className="middle">
      <div className="image-container"><img src={sniper} /></div>
      <div className="energy-container">
        <span className="energy-value">{props.energy}</span>
        <ICONS.Energy />
      </div>
      <div className="card-name">
        SNIPER
      </div>
    </div>
  )
}
function Bottom (props) {
  return (
    <div className="bottom">
      hello world
    </div>
  )
}
function Bonus (props) {
  return (
    <div className="bonus">
      {/*hello world*/}
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

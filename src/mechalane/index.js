import _ from 'lodash'
import classnames from 'classnames'

import './styles/index.css'
import './styles/icons.css'
import './styles/ally-bonus.css'

import cards from './cards.js'
import ICONS from './icons.js'

// import sniper from './images/sniper.png'



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
  RECRUIT: <ICONS.Recruit/>,
  TRAIN: <ICONS.Train/>,
  towards: <span>&nbsp;<ICONS.Towards/>&nbsp;</span>,
  deck: <ICONS.Deck/>,
  to: <span>&nbsp;<ICONS.InOrderTo/>&nbsp;</span>,
  energy: <ICONS.Energy />,
  draw: <ICONS.Draw />,
  hand: <ICONS.Hand />,
  discard: <ICONS.Discard />,
  LIFE: <ICONS.Life />,
}

function CardCost (props) {
  if (props.race === 'HUMAN') {
    return <div className="cost-container"><ICONS.Discard/>{props.cost}</div>
  }

  else if (props.race === 'MECHA') {
    return <div className="cost-container"><ICONS.Deploy />{props.cost}</div>
  }
}

function Agent (props) {
  return (
    <div className={classnames("card", _.toLower(props.type), _.toLower(props.race))}>
      <CardCost {...props} />
    </div>
  )
}

function AllyBonusText ({bonusCode}) {
  const effectCodes = bonusCode.split(' ')
  const agentEffectArray = _.map(effectCodes, (codeObj) => {
    return codeToComponentMapping[codeObj] || codeObj
  })
  return <div className="ally-bonus-text">
    {agentEffectArray}
    </div>
}

function AttackBonus (props) {
  return (
    <div className="ally-bonus attack-bonus">
      <AllyBonusText bonusCode={props.attackBonus} />
      <div className="ally-bonus-attack-icon"><ICONS.Attack/></div>
    </div>
  )
}

function DefenseBonus (props) {
  return (
    <div className="ally-bonus defense-bonus">
      <AllyBonusText bonusCode={props.defenseBonus} />
      <div className="ally-bonus-defense-icon"><ICONS.Defense/></div>
    </div>
  )
}

function AllyEffect (props) {
  const effectCodes = props.effect.split(' ')
  const allyEffectArray = _.map(effectCodes, (codeObj) => {
    return codeToComponentMapping[codeObj] || codeObj
    // return <span>{codeToComponentMapping[codeObj] || codeObj}</span>
  })

  // return allyEffectArray
  return (
    <div className="ally-effect">
      {allyEffectArray}
    </div>
  )
}

function Ally (props) {
  return (
    <div className={classnames("card", _.toLower(props.type), _.toLower(props.race))}>
      <AttackBonus {...props} />
      <DefenseBonus {...props} />
      <CardCost {...props} />
      <AllyEffect {...props} />
    </div>
  )
}

function Cards() {
  return (
    <div>
      {_.map(cards, (cardObj) => {
        if (cardObj.type === 'AGENT') {
          return <Agent {...cardObj} />  
          // return <div> agent </div>  
        }
        else if (cardObj.type === 'ALLY') {
          return <Ally {...cardObj} />
          // return <div> ally </div>
        }
      })}
    </div>
  );
}

export default Cards;

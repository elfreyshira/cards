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
  DRAW: <ICONS.Draw />,
  hand: <ICONS.Hand />,
  DISCARD: <ICONS.Discard />,
  LIFE: <ICONS.Life />,
  QUICK: <ICONS.Quick />,
  TOUGH: <ICONS.Tough />,
}

function getComponentsFromCode(effect) {
  const effectCodes = effect.split(' ')
  const effectArray = _.map(effectCodes, (codeObj) => {
    return codeToComponentMapping[codeObj] || codeObj
  })
  return effectArray
}

function RaceAndType (props) {
  return (
    <div className="race-and-type">
      {props.race}
      <br/>
      {props.type}
    </div>
  )
}

function CardCost (props) {
  if (props.race === 'HUMAN') {
    return <div className="cost-container"><ICONS.Discard/>{props.cost}</div>
  }

  else if (props.race === 'MECHA' || props.type === 'GUARDIAN') {
    return <div className="cost-container"><ICONS.Deploy />{props.cost}</div>
  }
}

function AgentEffect (props) {
  if (props.effect === 'none') {
    return null
  }
  else {
    return (
      <div className="agent-effect-container">
      <div className="agent-effect-text">
        {getComponentsFromCode(props.effect)}
      </div>
      </div>
    )
  }
}

function AgentTop (props) {
  return (
    <div className="agent-top">
      <div className="agent-attack">
        {props.attack}
        <div><ICONS.Attack/></div>
      </div>
      <AgentEffect {...props} />
      <div className="agent-defense">
        {props.defense}
        <div><ICONS.Defense/></div>
      </div>
    </div>
  )
}

function Agent (props) {
  return (
    <div className={classnames("card", _.toLower(props.type), _.toLower(props.race))}>
      <AgentTop {...props} />
      <CardCost {...props} />
      <RaceAndType {...props} />
    </div>
  )
}

function AllyBonusText ({bonusCode}) {
  return (
    <div className="ally-bonus-text">
      {getComponentsFromCode(bonusCode)}
    </div>
  )
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
  if (props.effect === 'none') {
    return null
  }
  
  if (props.race === 'MECHA') {
    return <div className="ally-effect">
      {props.effect}
    </div>
  }
  else if (props.race === 'HUMAN') {
    return (
      <div className="ally-effect">
        {getComponentsFromCode(props.effect)}
      </div>
    )
  }

}

function Ally (props) {
  return (
    <div className={classnames("card", _.toLower(props.type), _.toLower(props.race))}>
      <AttackBonus {...props} />
      <DefenseBonus {...props} />
      <CardCost {...props} />
      <AllyEffect {...props} />
      <RaceAndType {...props} />
    </div>
  )
}

function WithFlexibleFont({children}) {
  const totalLength = _.sum(_.map(children, (child) => {
    if (_.isString(child)) {
      return child.length
    }
    else {
      return 2
    }
  }))
  console.log(totalLength)
  return <span
    style={{
      fontSize: _.round(110/Math.pow(totalLength, .5), 1)+'px',
      lineHeight: _.round(1/Math.pow(totalLength, .5), 3)
    }}>{children}</span>
}

function Guardian (props) {
  return (
    <div class="card guardian">
      <CardCost {...props} />
      <div className="guardian-name">{props.name}</div>
      <div className="guardian-trigger">
        [TRIGGER] {props.trigger}
      </div>
      <div className="guardian-effect">
        {props.effect}
      </div>
      {/*{JSON.stringify(props)}*/}
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
        else if (cardObj.type === 'GUARDIAN') {
          return <Guardian {...cardObj} />
        }
      })}
    </div>
  );
}

export default Cards;

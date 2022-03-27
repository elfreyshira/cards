// import CONSTANTS from './constants.js'
import ICONS from './icons.js'
import _ from 'lodash'

const serialNumber = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
  16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27,
  28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39,
  40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52
]

const energy = [
  1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2,
  3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4,
  5, 5, 5, 5, 5, 5, 5, 5,
  'D1', 'D1', 'D1', 'D1', 'D1', 'D1',
  'D2', 'D2', 'D2', 'D2', 'D2', 'D2'
]

const attack = [
  '2', 'T', '1', '0', '1', '2', '0', '1', '3',
  'T+1', '1', '1', '2', '1', '0', '1', '4', '2T',
  '3', 'T', 'T', '2', '1', 'T', '5', 'T+4', 'T+1',
  '3', 'T+2', 'T+1', '4', 'T+1', '6', 'T+6', '2',
  '3', '3', 'T+2', '2T', '3', 'T', '1', 'T', '0',
  'T+1', '2', 'T+3', '7', '6', '3T', 'T+2', '5'
]

const defense = [
  '2', '0', 'T+1', '2', '1', '0', '3', '2', 'T',
  '1', 'T+1', '1', '2', 'T+4', '1', '1', 'T+1',
  '0', 'T', '0', '2', 'T+1', 'T+1', '2', 'T+2',
  '1', '2', '2T', '2', '1', 'T+1', '2', '2T', '0',
  '2', 'T+1', 'T+4', '3', '3', 'T+3', '4', 'T+3',
  '1', 'T', '2', 'T', '3', 'T+1', 'T+5', '6', '3', 'T+2'
]

const agentEffect = [
  'none',
  'none',
  'none',
  'AHEAD ATTACK + 2',
  'AHEAD DEFENSE + T',
  'RANGE = 2',
  'BEHIND ATTACK + T',
  'TWICE',
  'none',
  'none',
  'BEHIND RANGE + 1',
  'DEFENSE LETHAL',
  'AHEAD RANGE + 1',
  'none',
  'AHEAD ATTACK X2',
  'AHEAD ATTACK + T',
  'none',
  'none',
  'AHEAD RANGE + 1',
  'AHEAD TWICE',
  'AHEAD ATTACK + 2',
  'BEHIND ATTACK X2',
  'AHEAD ATTACK LETHAL',
  'RANGE = 3',
  'none',
  'none',
  'AHEAD RANGE + 2',
  'BEHIND TWICE',
  'AHEAD DEFENSE X2',
  'DEFENSE LETHAL',
  'BEHIND RANGE + 1',
  'TWICE',
  'none',
  'none',
  'AHEAD ATTACK + 2T',
  'AHEAD ATTACK X2',
  'BEHIND RANGE + 2',
  'RANGE = 2',
  'AHEAD DEFENSE + 3',
  'ATTACK LETHAL',
  'AHEAD RANGE + 1',
  'BEHIND RANGE + 2',
  'AHEAD ATTACK LETHAL',
  'AHEAD ATTACK + 5',
  'AHEAD DEFENSE X2',
  'ATTACK LETHAL',
  'RANGE = 3',
  'DEFENSE LETHAL',
  'BEHIND ATTACK X2',
  'none',
  'TWICE / RANGE = 2',
  'AHEAD DEFENSE + 4 / RANGE = 2',
]

function Block(props) {
  return <span style={{display: 'inline-block'}}>{props.children}</span>
}

function WithFont({children, px}) {
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
      lineHeight: _.round(9/Math.pow(totalLength, .5), 3)
    }}>{children}</span>
}

// only for humans
const allyEffect = [
  'recruit 1',
  'train 1',
  'recruit 1 towards deck',
  'train 1',
  'discard 1 to energy +3',
  'draw 1 / train 1',
  'recruit 1 / draw 1',
  'recruit 1',
  'discard 1 / train 1',
  'discard 1 to energy +2',
  'draw 1 / recruit 1',
  'recruit 1 towards hand',
  'discard 1 to train 1',
  'recruit 2',
  'train 1 / draw 1',
  'recruit 1 towards deck',
  'discard 1 to train 1',
  'recruit 1 towards deck',
  'train 1',
  'recruit 1 towards hand',
  'draw 1 / recruit 1',
  'discard 1 to train 2',
  'discard 1 to energy +5',
  'train 1',
  'train 1 / draw 1',
  'recruit 1 towards hand / energy +1',
  'recruit 1 / train 1',
  'discard 1 to recruit 2',
  'discard 1 to recruit 1',
  'draw 1 / train 2',
  'train 1 / energy +2',
  'recruit 2 towards deck',
  'recruit 2 towards hand',
  'recruit 1 / train 2',
  'train 1 / energy +1',
  'train 2 / energy +2',
  'discard 1 to recruit 1',
  'recruit 1 / train 2',
  'recruit 1 towards hand / energy +1',
  'recruit 2 towards hand',
  
  // for mecha ally
  <WithFont px="15">
    Remove 0-3 agents; for each agent removed, <ICONS.Draw/>1 and <ICONS.Energy/>+2.
  </WithFont>,
  <WithFont px="20">This turn: every time you defeat an enemy, <ICONS.Draw/>1.</WithFont>,
  <WithFont px="20">This turn: every card you play has its <ICONS.Energy/> cost reduced by 1.</WithFont>,
  <WithFont px="20">This turn: every time you defeat an enemy, <ICONS.Recruit/>1.</WithFont>,
  <WithFont px="20">
    Remove 1 agent; replace it by playing an agent from hand without cost in the same position.
  </WithFont>,
  <WithFont px="20">
    Remove 0-4 agents; for each agent removed, <Block>
    <ICONS.Recruit/>1 <ICONS.Towards/> <ICONS.Hand/>.</Block>
  </WithFont>,
  <WithFont px="20">Link 2 agents together; you may unlink them at the end of the turn without discarding them.</WithFont>,
  <WithFont>Remove 2 agents, then play any 2 human cards from hand without cost.</WithFont>,
  <WithFont>
    This turn: every time you defeat an enemy, <Block>
    <ICONS.Recruit/>1 <ICONS.Towards/> <ICONS.Hand/>.</Block>
  </WithFont>,
  (<WithFont>
    <ICONS.Recruit/>2; you may play any of them without cost if it costs 3 or less <ICONS.Energy/>.
  </WithFont>),
  (<WithFont>
    This turn: every time you damage a Warden, <Block>
    <ICONS.Recruit/>1 <ICONS.Towards/> <ICONS.Hand/>.</Block>
  </WithFont>),
  <WithFont>
    Remove 2 agents, then <Block><ICONS.Draw/>3</Block> and <Block><ICONS.Energy/>+7.</Block>
  </WithFont>
]

const allyBonus = [
  'ATTACK + 1',
  'DEFENSE + 2',
  'DEFENSE + 1',
  'DEFENSE + 2',
  'none',
  'none',
  'none',
  'ATTACK + 1',
  'RANGE + 2',
  'ATTACK + 2',
  'DEFENSE + 2',
  'DEFENSE + 1',
  'ATTACK LETHAL',
  'DEFENSE + 2',
  'ATTACK + 1',
  'RANGE + 1',
  'ATTACK X2',
  'RANGE + 2',
  'TWICE',
  'RANGE + 1',
  'DEFENSE + 4',
  'ATTACK + 3',
  'none',
  'DEFENSE LETHAL',
  'ATTACK LETHAL',
  'RANGE + 1',
  'DEFENSE + 6',
  'ATTACK X2',
  'ATTACK + 5',
  'RANGE + 1',
  'DEFENSE X2',
  'RANGE + 2',
  'DEFENSE + 3',
  'DEFENSE LETHAL',
  'ATTACK X2',
  'RANGE + 1',
  'ATTACK + 6',
  'TWICE',
  'RANGE + 2',
  'RANGE + 1',
  'none',
  'ATTACK + 1',
  'DEFENSE + 3',
  'DEFENSE + 2',
  'none',
  'ATTACK + 1',
  'ATTACK + 1',
  'RANGE + 1',
  'DEFENSE + 4',
  'DEFENSE + 2',
  'ATTACK + 4',
  'none'
]


const wardens = [
  {
    name: 'Enforcer of Peace',
    trigger: 'When enemy agent attacks',
    effect: <span>Enemy agent <ICONS.Attack/>-3.</span>
  },
  {
    name: 'Pillar of Power',
    trigger: 'When enemy agent attacks',
    effect: 'Reduce damage to your Warden by 5.'
  },
  {
    name: 'Shepherd of the Lanes',
    trigger: 'When enemy agent attacks',
    effect: <span>Move enemy agent to the back, then <ICONS.Draw/>1.</span>
  },
  {
    name: 'Loyal Steward',
    trigger: 'When enemy agent attacks',
    effect: <span>Enemy agent <ICONS.Range/>-1, then <ICONS.Draw/>1.</span>
  },
  {
    name: 'Steady Protector',
    trigger: 'When enemy agent attacks',
    effect: 'Your Warden cannot take more than 2 damage from the attack.'
  },
  {
    name: 'Caretaker of the Lanes',
    trigger: 'When enemy agent attacks',
    effect: 'Move enemy agent to another lane.'
  },
  {
    name: 'Sentinel of Truth',
    trigger: 'When enemy agent attacks',
    effect: 'Negate any agent cards that affect the enemy agent.'
  },
  {
    name: 'Sustainer of the Self',
    trigger: 'When enemy agent attacks',
    effect: <span>Negate any ally bonus the enemy agent is receiving, then <ICONS.Draw/>1.</span>
  },
  {
    name: 'Resolute Sentry',
    trigger: 'When your agent is being attacked',
    effect: <span>Your agent <ICONS.Defense/>+4.</span>
  },
  {
    name: 'Keeper of the Lanes',
    trigger: 'When your agent is being attacked',
    effect: <span>Move your agent to the back, then <ICONS.Draw/>1.</span>
  },
  {
    name: 'Silent Angel',
    trigger: 'When your agent is destroyed',
    effect: <span>Play a human agent from hand without cost, then opponent <ICONS.Draw/>1.</span>
  }
]



const cards = []


for (var i = 0; i < 52; i++) {
// for (var i = 0; i < 10; i++) {
  cards.push({
    type: i <= 39 ? 'HUMAN' : 'MECHA',
    serialNumber: serialNumber[i],
    energy: energy[i],
    attack: attack[i],
    defense: defense[i],
    agentEffect: agentEffect[i],
    allyEffect: allyEffect[i],
    allyBonus: allyBonus[i]
  })
}


for (var i = 0; i < 11; i++) {
  cards.push({
    type: 'WARDEN',
    wardenName: _.toUpper(wardens[i].name),
    wardenTrigger: wardens[i].trigger,
    wardenEffect: wardens[i].effect
  })
}

_.times(3, () => {
  cards.push({
    type: 'ICON-SUMMARY'
  })
})

_.times(3, () => {
  cards.push({
    type: 'ALWAYS-AVAILABLE'
  })
})



export default cards

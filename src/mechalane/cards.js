import _ from 'lodash'
import ICONS from './icons'

function Block(props) {
  return <span style={{display: 'inline-block'}}>{props.children}</span>
}

const guardians = [
  {
    type: 'GUARDIAN',
    cost: 2,
    name: 'Enforcer of Peace',
    trigger: 'When enemy agent attacks',
    effect: <span>Enemy agent <ICONS.Attack/>-5.</span>,
  },
  {
    type: 'GUARDIAN',
    cost: 1,
    name: 'Pillar of Power',
    trigger: 'When enemy agent attacks a Guardian',
    effect: "Reduce damage to your Guardian by 5.",
  },
  {
    type: 'GUARDIAN',
    cost: 1,
    name: 'Shepherd of the Lanes',
    trigger: 'When enemy agent attacks',
    effect: "Move enemy agent to the back.",
  },
  {
    type: 'GUARDIAN',
    cost: 1,
    name: 'Loyal Steward',
    trigger: 'When enemy agent attacks',
    effect: <span>
      Enemy agent <Block><ICONS.Range/>-1</Block><br/>(cannot
      go below <Block><ICONS.Range/>=1</Block> )
    </span>,
  },
  {
    type: 'GUARDIAN',
    cost: 1,
    name: 'Steady Protector',
    trigger: 'When enemy agent attacks a Guardian',
    effect: "Your Guardian cannot take more than 1 damage from the attack.",
  },
  {
    type: 'GUARDIAN',
    cost: 2,
    name: 'Caretaker of the Lanes',
    trigger: 'When enemy agent attacks',
    effect: "Move enemy agent to another lane (you must still have a Guardian alive in that lane).",
  },
  {
    type: 'GUARDIAN',
    cost: 2,
    name: 'Sentinel of Truth',
    trigger: 'When enemy agent attacks',
    effect: "Negate all opponent agent effects.",
  },
  {
    type: 'GUARDIAN',
    cost: 2,
    name: 'Sustainer of the Self',
    trigger: 'When enemy agent attacks',
    effect: "Negate all opponent ally effects.",
  },
  {
    type: 'GUARDIAN',
    cost: 1,
    name: 'Resolute Sentry',
    trigger: 'When your agent is being attacked',
    effect: <span>Your agent <Block><ICONS.Defense/>+4</Block>.</span>,
  },
  {
    type: 'GUARDIAN',
    cost: 1,
    name: 'Director of the Lanes',
    trigger: 'When your agent is being attacked',
    effect: "Move your agent to the back of ANY lane of your choice.",
  },
  {
    type: 'GUARDIAN',
    cost: 3,
    name: 'Silent Angel',
    trigger: 'When your agent is destroyed',
    effect: "Play a human without cost. Opponent draws 1 card.",
  },
  {
    type: 'GUARDIAN',
    cost: 2,
    name: 'Gentle Patron',
    trigger: 'When your agent is being attacked',
    effect: <span>Your agent is immune <Block>to <ICONS.Lethal/></Block>.</span>,
  },
  {
    type: 'GUARDIAN',
    cost: 2,
    name: 'Caretaker of Life',
    trigger: 'When your agent is destroyed',
    effect: "Replace your destroyed agent with an agent in the same position. (Pay its cost as normal.)",
  },
  {
    type: 'GUARDIAN',
    cost: 2,
    name: 'Curator of the Afterlife',
    trigger: 'When your agent is destroyed',
    effect: "Draw as many cards equal to the discard cost of your destroyed agent (if it's a MECHA, draw 1 card)",
  },
  {
    type: 'GUARDIAN',
    cost: 2,
    name: 'Righteous Keeper',
    trigger: 'When your agent is destroyed',
    effect: "Return your destroyed agent to your hand.",
  },
  {
    type: 'GUARDIAN',
    cost: 1,
    name: 'Resilient Champion',
    trigger: 'When your agent is being attacked',
    effect: <span>Your agent gains <ICONS.Tough/>.</span>,
  },
  {
    type: 'GUARDIAN',
    cost: 3,
    name: 'Kind Preserver',
    trigger: 'When your agent is destroyed',
    effect: "If your destroyed agent had any allies, move the allies to another agent.",
  }
]


const units = [
  {
    "cost": 0,
    "race": "HUMAN",
    "serialNumber": 1,
    "type": "AGENT",
    "attack": 1,
    "defense": "2",
    "effect": "BEHIND ATTACK + 2",
    "attackBonus": null,
    "defenseBonus": null
  },
  {
    "cost": 0,
    "race": "HUMAN",
    "serialNumber": 2,
    "type": "AGENT",
    "attack": 2,
    "defense": "2",
    "effect": "none",
    "attackBonus": null,
    "defenseBonus": null
  },
  {
    "cost": 0,
    "race": "HUMAN",
    "serialNumber": 3,
    "type": "AGENT",
    "attack": 1,
    "defense": "0",
    "effect": "AHEAD ATTACK + T",
    "attackBonus": null,
    "defenseBonus": null
  },
  {
    "cost": 0,
    "race": "HUMAN",
    "serialNumber": 4,
    "type": "AGENT",
    "attack": 2,
    "defense": "0",
    "effect": "TWICE",
    "attackBonus": null,
    "defenseBonus": null
  },
  {
    "cost": 0,
    "race": "HUMAN",
    "serialNumber": 5,
    "type": "AGENT",
    "attack": 1,
    "defense": 2,
    "effect": "QUICK",
    "attackBonus": null,
    "defenseBonus": null
  },
  {
    "cost": 0,
    "race": "HUMAN",
    "serialNumber": 6,
    "type": "AGENT",
    "attack": 1,
    "defense": "T+1",
    "effect": "BEHIND RANGE + 1",
    "attackBonus": null,
    "defenseBonus": null
  },
  {
    "cost": 0,
    "race": "HUMAN",
    "serialNumber": 7,
    "type": "AGENT",
    "attack": 1,
    "defense": "0",
    "effect": "AHEAD DEFENSE + 4",
    "attackBonus": null,
    "defenseBonus": null
  },
  {
    "cost": 0,
    "race": "HUMAN",
    "serialNumber": 8,
    "type": "ALLY",
    "attack": null,
    "defense": null,
    "effect": "none",
    "attackBonus": "QUICK",
    "defenseBonus": "DEFENSE LETHAL"
  },
  {
    "cost": 0,
    "race": "HUMAN",
    "serialNumber": 9,
    "type": "ALLY",
    "attack": null,
    "defense": null,
    "effect": "RECRUIT 1 / TRAIN 1",
    "attackBonus": "ATTACK + 1",
    "defenseBonus": "DEFENSE + 2"
  },
  {
    "cost": 0,
    "race": "HUMAN",
    "serialNumber": 10,
    "type": "ALLY",
    "attack": null,
    "defense": null,
    "effect": "TRAIN 1",
    "attackBonus": "TWICE",
    "defenseBonus": "DEFENSE X2"
  },
  {
    "cost": 0,
    "race": "HUMAN",
    "serialNumber": 11,
    "type": "ALLY",
    "attack": null,
    "defense": null,
    "effect": "none",
    "attackBonus": "RANGE + 1",
    "defenseBonus": "TOUGH"
  },
  {
    "cost": 0,
    "race": "HUMAN",
    "serialNumber": 12,
    "type": "ALLY",
    "attack": null,
    "defense": null,
    "effect": "none",
    "attackBonus": "QUICK",
    "defenseBonus": "TOUGH"
  },
  {
    "cost": 0,
    "race": "HUMAN",
    "serialNumber": 13,
    "type": "ALLY",
    "attack": null,
    "defense": null,
    "effect": "RECRUIT 1",
    "attackBonus": "ATTACK + 2",
    "defenseBonus": "DEFENSE + 3"
  },
  {
    "cost": 0,
    "race": "HUMAN",
    "serialNumber": 14,
    "type": "ALLY",
    "attack": null,
    "defense": null,
    "effect": "none",
    "attackBonus": "RANGE + 1",
    "defenseBonus": "DEFENSE + 4"
  },
  {
    "cost": 1,
    "race": "HUMAN",
    "serialNumber": 1,
    "type": "AGENT",
    "attack": "4",
    "defense": "T+1",
    "effect": "none",
    "attackBonus": null,
    "defenseBonus": null
  },
  {
    "cost": 1,
    "race": "HUMAN",
    "serialNumber": 2,
    "type": "AGENT",
    "attack": "T",
    "defense": "2",
    "effect": "DEFENSE LETHAL",
    "attackBonus": null,
    "defenseBonus": null
  },
  {
    "cost": 1,
    "race": "HUMAN",
    "serialNumber": 3,
    "type": "AGENT",
    "attack": "T+1",
    "defense": "1",
    "effect": "RANGE = 2",
    "attackBonus": null,
    "defenseBonus": null
  },
  {
    "cost": 1,
    "race": "HUMAN",
    "serialNumber": 4,
    "type": "AGENT",
    "attack": "1",
    "defense": "T+3",
    "effect": "BEHIND QUICK",
    "attackBonus": null,
    "defenseBonus": null
  },
  {
    "cost": 1,
    "race": "HUMAN",
    "serialNumber": 5,
    "type": "AGENT",
    "attack": "T",
    "defense": "1",
    "effect": "AHEAD ATTACK + 4",
    "attackBonus": null,
    "defenseBonus": null
  },
  {
    "cost": 1,
    "race": "HUMAN",
    "serialNumber": 6,
    "type": "AGENT",
    "attack": "2",
    "defense": "T+1",
    "effect": "AHEAD RANGE + 1",
    "attackBonus": null,
    "defenseBonus": null
  },
  {
    "cost": 1,
    "race": "HUMAN",
    "serialNumber": 7,
    "type": "AGENT",
    "attack": "T+1",
    "defense": "0",
    "effect": "AHEAD DEFENSE + 5",
    "attackBonus": null,
    "defenseBonus": null
  },
  {
    "cost": 1,
    "race": "HUMAN",
    "serialNumber": 8,
    "type": "ALLY",
    "attack": null,
    "defense": null,
    "effect": "RECRUIT 2 / TRAIN 2",
    "attackBonus": "QUICK",
    "defenseBonus": "TOUGH"
  },
  {
    "cost": 1,
    "race": "HUMAN",
    "serialNumber": 9,
    "type": "ALLY",
    "attack": null,
    "defense": null,
    "effect": "RECRUIT 1",
    "attackBonus": "ATTACK LETHAL",
    "defenseBonus": "DEFENSE + 6"
  },
  {
    "cost": 1,
    "race": "HUMAN",
    "serialNumber": 10,
    "type": "ALLY",
    "attack": null,
    "defense": null,
    "effect": "RECRUIT 2 / TRAIN 2",
    "attackBonus": "RANGE + 1",
    "defenseBonus": "DEFENSE X2"
  },
  {
    "cost": 1,
    "race": "HUMAN",
    "serialNumber": 11,
    "type": "ALLY",
    "attack": null,
    "defense": null,
    "effect": "RECRUIT 2 / TRAIN 2",
    "attackBonus": "QUICK",
    "defenseBonus": "DEFENSE X2"
  },
  {
    "cost": 1,
    "race": "HUMAN",
    "serialNumber": 12,
    "type": "ALLY",
    "attack": null,
    "defense": null,
    "effect": "RECRUIT 2 / TRAIN 2",
    "attackBonus": "TWICE",
    "defenseBonus": "DEFENSE LETHAL"
  },
  {
    "cost": 1,
    "race": "HUMAN",
    "serialNumber": 13,
    "type": "ALLY",
    "attack": null,
    "defense": null,
    "effect": "none",
    "attackBonus": "ATTACK + 3",
    "defenseBonus": "LIFE"
  },
  {
    "cost": 1,
    "race": "HUMAN",
    "serialNumber": 14,
    "type": "ALLY",
    "attack": null,
    "defense": null,
    "effect": "RECRUIT 1 / TRAIN 1",
    "attackBonus": "RANGE + 2",
    "defenseBonus": "DEFENSE + 5"
  },
  {
    "cost": 2,
    "race": "HUMAN",
    "serialNumber": 1,
    "type": "AGENT",
    "attack": "T+3",
    "defense": "6",
    "effect": "none",
    "attackBonus": null,
    "defenseBonus": null
  },
  {
    "cost": 2,
    "race": "HUMAN",
    "serialNumber": 2,
    "type": "AGENT",
    "attack": "3",
    "defense": "T+2",
    "effect": "ATTACK LETHAL",
    "attackBonus": null,
    "defenseBonus": null
  },
  {
    "cost": 2,
    "race": "HUMAN",
    "serialNumber": 3,
    "type": "AGENT",
    "attack": "T+2",
    "defense": "3",
    "effect": "QUICK",
    "attackBonus": null,
    "defenseBonus": null
  },
  {
    "cost": 2,
    "race": "HUMAN",
    "serialNumber": 4,
    "type": "AGENT",
    "attack": "4",
    "defense": "T",
    "effect": "AHEAD ATTACK X2",
    "attackBonus": null,
    "defenseBonus": null
  },
  {
    "cost": 2,
    "race": "HUMAN",
    "serialNumber": 5,
    "type": "AGENT",
    "attack": "2",
    "defense": "T+5",
    "effect": "BEHIND RANGE + 2",
    "attackBonus": null,
    "defenseBonus": null
  },
  {
    "cost": 2,
    "race": "HUMAN",
    "serialNumber": 6,
    "type": "AGENT",
    "attack": "2T",
    "defense": "1",
    "effect": "AHEAD DEFENSE LETHAL",
    "attackBonus": null,
    "defenseBonus": null
  },
  {
    "cost": 2,
    "race": "HUMAN",
    "serialNumber": 7,
    "type": "AGENT",
    "attack": "T+1",
    "defense": "8",
    "effect": "BEHIND TWICE",
    "attackBonus": null,
    "defenseBonus": null
  },
  {
    "cost": 2,
    "race": "HUMAN",
    "serialNumber": 8,
    "type": "ALLY",
    "attack": null,
    "defense": null,
    "effect": "RECRUIT 2 / TRAIN 1",
    "attackBonus": "ATTACK + 5",
    "defenseBonus": "LIFE"
  },
  {
    "cost": 2,
    "race": "HUMAN",
    "serialNumber": 9,
    "type": "ALLY",
    "attack": null,
    "defense": null,
    "effect": "RECRUIT 2 / TRAIN 2",
    "attackBonus": "ATTACK LETHAL",
    "defenseBonus": "LIFE"
  },
  {
    "cost": 2,
    "race": "HUMAN",
    "serialNumber": 10,
    "type": "ALLY",
    "attack": null,
    "defense": null,
    "effect": "RECRUIT 2 / TRAIN 2",
    "attackBonus": "ATTACK X2",
    "defenseBonus": "LIFE"
  },
  {
    "cost": 2,
    "race": "HUMAN",
    "serialNumber": 11,
    "type": "ALLY",
    "attack": null,
    "defense": null,
    "effect": "RECRUIT 5 / TRAIN 4",
    "attackBonus": "QUICK",
    "defenseBonus": "DEFENSE X2"
  },
  {
    "cost": 2,
    "race": "HUMAN",
    "serialNumber": 12,
    "type": "ALLY",
    "attack": null,
    "defense": null,
    "effect": "RECRUIT 4 / TRAIN 3",
    "attackBonus": "RANGE + 2",
    "defenseBonus": "DEFENSE LETHAL"
  },
  {
    "cost": 2,
    "race": "HUMAN",
    "serialNumber": 13,
    "type": "ALLY",
    "attack": null,
    "defense": null,
    "effect": "RECRUIT 1 / DRAW 1",
    "attackBonus": "TWICE",
    "defenseBonus": "LIFE"
  },
  {
    "cost": 2,
    "race": "HUMAN",
    "serialNumber": 14,
    "type": "ALLY",
    "attack": null,
    "defense": null,
    "effect": "DRAW 3 / DISCARD 1",
    "attackBonus": "RANGE + 1",
    "defenseBonus": "DEFENSE + 4"
  },
  {
    "cost": "1",
    "race": "MECHA",
    "serialNumber": 1,
    "type": "AGENT",
    "attack": 1,
    "defense": 2,
    "effect": "ATTACK LETHAL",
    "attackBonus": null,
    "defenseBonus": null
  },
  {
    "cost": "1",
    "race": "MECHA",
    "serialNumber": 2,
    "type": "AGENT",
    "attack": 3,
    "defense": 1,
    "effect": "QUICK",
    "attackBonus": null,
    "defenseBonus": null
  },
  {
    "cost": "1",
    "race": "MECHA",
    "serialNumber": 3,
    "type": "ALLY",
    "attack": null,
    "defense": null,
    "effect": "Draw 1 card. Your opponent's Guardian gains 1 health (their choice).",
    "attackBonus": "TWICE",
    "defenseBonus": "TOUGH"
  },
  {
    "cost": "2",
    "race": "MECHA",
    "serialNumber": 1,
    "type": "AGENT",
    "attack": 4,
    "defense": 0,
    "effect": "TWICE / RANGE = 2",
    "attackBonus": null,
    "defenseBonus": null
  },
  {
    "cost": "2",
    "race": "MECHA",
    "serialNumber": 2,
    "type": "AGENT",
    "attack": 3,
    "defense": 5,
    "effect": "QUICK",
    "attackBonus": null,
    "defenseBonus": null
  },
  {
    "cost": "2",
    "race": "MECHA",
    "serialNumber": 3,
    "type": "ALLY",
    "attack": null,
    "defense": null,
    "effect": <span>Play any human card while reducing its discard cost by 1. If you play a <ICONS.Discard/>0, draw 1 card.</span>,
    "attackBonus": "ATTACK X2",
    "defenseBonus": "DEFENSE + 6"
  },
  {
    "cost": "3",
    "race": "MECHA",
    "serialNumber": 1,
    "type": "AGENT",
    "attack": 7,
    "defense": 0,
    "effect": "QUICK",
    "attackBonus": null,
    "defenseBonus": null
  },
  {
    "cost": "3",
    "race": "MECHA",
    "serialNumber": 2,
    "type": "AGENT",
    "attack": 4,
    "defense": 4,
    "effect": "RANGE = 2 / DEFENSE LETHAL",
    "attackBonus": null,
    "defenseBonus": null
  },
  {
    "cost": "3",
    "race": "MECHA",
    "serialNumber": 3,
    "type": "ALLY",
    "attack": null,
    "defense": null,
    "effect": "Opponent draws 1 card. Play any human card without cost.",
    "attackBonus": "ATTACK + 5",
    "defenseBonus": "LIFE"
  }
]

export default units.concat(guardians)

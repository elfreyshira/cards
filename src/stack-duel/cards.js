// import CONSTANTS from './constants.js'
import ICONS from './icons.js'


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
  'DEFENSE POISON',
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
  'AHEAD ATTACK POISON',
  'RANGE = 3',
  'none',
  'none',
  'AHEAD RANGE + 2',
  'BEHIND TWICE',
  'AHEAD DEFENSE X2',
  'DEFENSE POISON',
  'BEHIND RANGE + 1',
  'TWICE',
  'none',
  'none',
  'AHEAD ATTACK + 2T',
  'AHEAD ATTACK X2',
  'BEHIND RANGE + 2',
  'RANGE = 2',
  'AHEAD DEFENSE + 3',
  'POISON ATTACK',
  'AHEAD RANGE + 1',
  'BEHIND RANGE + 2',
  'AHEAD ATTACK POISON',
  'AHEAD ATTACK + 5',
  'AHEAD DEFENSE X2',
  'POISON ATTACK',
  'AHEAD DEFENSE + 3 / RANGE = 2',
  'DEFENSE POISON',
  'BEHIND ATTACK X2',
  'none',
  'TWICE / RANGE = 2',
  'AHEAD DEFENSE + 4 / RANGE = 2',
]

// only for humans
const allyEffect = [
  'recruit 1',
  'train 1',
  'recruit 1 to deck',
  'train 1',
  'discard 1 to energy 3',
  'draw 1 / train 1',
  'recruit 1 / draw 1',
  'recruit 1',
  'discard 1 / train 1',
  'discard 1 to energy 2',
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
  'discard 1 to energy 5',
  'train 1',
  'train 1 / draw 1',
  'recruit 1 towards hand / energy 1',
  'recruit 1 / train 1',
  'discard 1 to recruit 2',
  'discard 1 to recruit 1',
  'draw 1 / train 2',
  'train 1 / energy 2',
  'recruit 2 towards deck',
  'recruit 2 towards hand',
  'recruit 1 / train 2',
  'train 1 / energy 1',
  'train 2 / energy 2',
  'discard 1 to recruit 1',
  'recruit 1 / train 2',
  'recruit 1 towards hand / energy 1',
  'recruit 2 towards hand',
  // for mecha ally
  'Remove 0-3 units; for each unit removed, draw 1 card and energy +2.',
  'This turn: every time you defeat an enemy, draw 1 card.',
  'This turn: every card you play has its energy cost reduced by 1.',
  'This turn: every time you defeat an enemy, recruit 1 card.',
  'Remove 1 unit; replace it by playing an agent from hand without cost in the same position.',
  'Remove 0-4 units; for each unit removed, recruit 1 card to the top of your deck.',
  'Link 2 units together; you may unlink them at the end of the turn without discarding them.',
  'Remove 2 units, then play any 2 human cards from hand without cost.',
  'This turn: every time you defeat an enemy, recruit 1 card to hand.',
  'Recruit 2 cards; you may play any of them without cost if it costs 3 or less energy.',
  'This turn: every time you damage an opponent Warden, recruit 1 card to hand.',
  'Remove 2 units, then draw 3 cards and energy +7.'
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
  'POISON_ATTACK',
  'DEFENSE + 2',
  'ATTACK + 1',
  'RANGE + 1',
  'DOUBLE_ATTACK',
  'RANGE + 2',
  'TWICE',
  'RANGE + 1',
  'DEFENSE + 4',
  'ATTACK + 3',
  'none',
  'POISON_DEFENSE',
  'POISON_ATTACK',
  'RANGE + 1',
  'DEFENSE + 6',
  'DOUBLE_ATTACK',
  'ATTACK + 5',
  'RANGE + 1',
  'DOUBLE_DEFENSE',
  'RANGE + 2',
  'DEFENSE + 3',
  'POISON_DEFENSE',
  'DOUBLE_ATTACK',
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
  'none',
  'ATTACK + 1',
  'RANGE + 1',
  'DEFENSE + 4',
  'DEFENSE + 2',
  'ATTACK + 4',
  'none'
]

function Trained (props) {
  return <span class="trained">T</span>
}


const cards = [
  // {
  //   agentEffect: (
  //     <span>
  //       <Trained/>
  //       <ICONS.Attack />
  //       <ICONS.Defense />
  //     </span>
  //   )
  // }
]



for (var i = 0; i < 52; i++) {
// for (var i = 0; i < 10; i++) {
  cards.push({
    energy: energy[i],
    attack: attack[i],
    defense: defense[i],
    agentEffect: agentEffect[i],
    allyEffect: allyEffect[i],
    allyBonus: allyBonus[i]
  })
}
export default cards

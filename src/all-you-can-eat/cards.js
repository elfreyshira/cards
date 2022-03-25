import CONSTANTS from './constants.js'
import ICONS from './icons.js'


// const cards = [
//   {
//     energy: 4,
//     combo: CONSTANTS.COMBOS.STARTER,
//     effect: 'Claim 1 card.',
//     publicTriggerType: CONSTANTS.PUBLIC_TRIGGER_TYPE_NORMAL,
//     publicTriggerText: 'For each card your opponent claims, eat 1 card from hand.',
//     privateTriggerCause: 'Opponent claims a card.',
//     privateTriggerEffect: 'Eat 2 cards.'
//   },
//   {
//     energy: 2,
//     combo: CONSTANTS.COMBOS.HAND,
//     effect: 'Claim 2 cards.',
//     privateTriggerCause: 'Opponent eats a card.',
//     privateTriggerEffect: 'Get full +H (H = cards in hand).'
//   },
//   {
//     energy: 3,
//     combo: CONSTANTS.COMBOS.PLAY,
//     publicTriggerType: CONSTANTS.PUBLIC_TRIGGER_TYPE_ONCE,
//     publicTriggerText: 'If your opponent gets full, eat 2 cards from play.',
//     privateTriggerCause: 'Opponent gets full.',
//     privateTriggerEffect: 'Next turn: energy +3.'
//   }
// ]
// export default cards

const cards = []
var effects = [
<span><ICONS.DrawCard /> [Public Trigger, once] If your opponent claims a card, Claim 1 card.</span>,
<span>(Must have at least 1 other card in play.) Energy -2. Digest 3-4 cards. if digest 3: get full +H*6 (max 36), get full +20. if digest 4: get full +H*9 (max 54), get full +27.</span>,
<span>Draw 2 cards.</span>,
<span>(Must have at least 1 other card in play.) Digest 1-2 cards. if digest 1: energy -1, get full +H*4 (max 24). if digest 2: energy -2, get full +H*8 (max 48). Next turn: draw +1 card.</span>,
<span>Claim 1 card. Draw 2 cards.</span>,
<span>(Must have at least 1 other card in play.) You must discard 1 card. Claim 1 card. Digest 2 cards. If digest 2: get full +H*5 (max 30), get full +E*5.</span>,
<span>Eat 1 card from hand.</span>,
<span>[Public Trigger, once] If opponent gets full: get full +H*2, get full +E.</span>,
<span>Claim 2 cards. Draw 2 cards.</span>,
<span>Claim 2 cards. [Public Trigger] each time you play a card, draw 1 card.</span>,
<span>(Must have at least 1 other card in play.) Energy -1. Get full +H*E.</span>,
<span>You must discard 2 cards. Eat 2 cards from hand.</span>,
<span>Claim 2 cards to hand. Next turn: draw +1 card.</span>,
<span>Eat 2 cards from hand. Next turn: draw +1 card.</span>,
<span>Next turn: draw +1 card. [Public Trigger] For each card your opponent eats, eat 1 card from hand.</span>,
<span>(Must have at least 1 other card in play.) You must discard 1 card. Claim 1 card. Digest 1 or 4 cards. If digest 1: get full +16. If digest 4: get full +H*6 (max 36), get full +40. Next turn: draw +2 cards.</span>,
<span>Claim 3 cards. Draw 2 cards. Next turn: draw +2 cards.</span>,
<span>Eat 3 cards from hand. Digest 2-3 cards. If digest 2: get full +22. If digest 3: get full +36.</span>,
<span>Get full +H*E. Next turn: draw +1 card.</span>,
<span>Eat 1 card from hand. [Public Trigger] For each card your opponent claims, eat 1 card from hand.</span>
]
var energy = [
1,1,1,1,
2,2,2,2,
3,3,3,3,
4,4,4,4,
5,5,5,5
]

var privateTriggerCause = [
'Opponent gets full.',
'Opponent claims a card.',
'Opponent eats a card.',
'Opponent claims a card.',
'Opponent gets full.',
'Opponent eats a card.',
'Opponent gets full.',
'Opponent claims a card.',
'Opponent eats a card.',
'Opponent claims a card.',
'Opponent gets full.',
'Opponent eats a card.',
'Opponent claims a card.',
'Opponent gets full.',
'Opponent claims a card.',
'Opponent eats a card.',
'Opponent gets full.',
'Opponent eats a card.',
'Opponent claims a card.',
'Opponent gets full.']

var privateTriggerEffect = [
'Digest 2 cards. If digest 2: get full +H*4, get full +12.',
'Claim 1 card.',
'Claim 1 card.',
'Claim 1 card.',
'Get full +H. Get full +E.',
'Eat 1 card from hand.',
'Claim 2 cards.',
'Eat 1 card from hand.',
'Get full +H*E.',
'Digest 3 cards. If digest 3: get full +H*7, get full +23.',
'Claim 2 cards.',
'Eat 2 cards from hand.',
'Digest 1 card. If digest 1: get full +H*3, get full +12.',
'Eat 3 cards from hand.',
'Claim 2 cards. Get full +H. Get full +E.',
'Eat 2 cards from hand. Next turn: draw +1 card.',
'Claim 2 cards. Eat 2 cards from hand.',
'Claim 3 cards. Eat 1 card from hand.',
'Get full +H*E*2.',
'Digest 4: get full +H*10, get full +36.'
]

for (var i = 0; i < 20; i++) {
  cards.push({
    energy: energy[i],
    combo: CONSTANTS.COMBOS.HAND,
    effect: effects[i],
    privateTriggerCause: privateTriggerCause[i],
    privateTriggerEffect: privateTriggerEffect[i]
  })
}
export default cards

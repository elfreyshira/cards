import _ from 'lodash'


import grab from './images/grab.png'
import meeple from './images/meeple.png'
import shoe from './images/shoe.png'
import wing from './images/wing.png'
import truck from './images/truck.png'
// import mech from './images/mech.png'
import mech from './images/vintage-robot.png'

import sword from './images/sword.png'
import shield from './images/shield.png'
import skullBurning from './images/skull-burning.png'
import whiteFlag from './images/white-flag.png'
import bugle from './images/bugle.png'
import potion from './images/potion.png'
import push from './images/push.png'
import deckCycle from './images/deck-cycle.png'
import deck from './images/deck.png'

import drawCard from './images/draw-card.png'
import trashCard from './images/trash-card.png'
import discardCard from './images/discard-card.png'
import card from './images/card.png'

import rerollDice from './images/reroll-dice.png'
import diceSingle from './images/dice-single.png'
import trashCan from './images/trash-can.png'
import marketStall from './images/market-stall.png'
import areaBox from './images/area-box.png'
import bag from './images/bag.png'
import steal from './images/steal.png'
import battery from './images/battery.png'
import ninja from './images/ninja.png'

import fish from './images/fish.png'
import coral from './images/coral.png'
import arrowRight from './images/arrow-right.png'
import playCard from './images/play-card.png'
import swapCards from './images/swap-cards.png'
import coinStar from './images/coin-star.png'
import thisCard from './images/this-card.png'
import wave from './images/wave.png'
import star from './images/star.png'
import pointLeft from './images/point-left.png'
import pointRight from './images/point-right.png'

import warBanner from './images/war-banner.png'
import hand from './images/hand.png'
import oneTurn from './images/one-turn.png'
import twoSwords from './images/two-swords.png'
import infiniteTurn from './images/infinite-turn.png'
import opponent from './images/opponent.png'
import lightning from './images/lightning.png'

import filmReel from './images/film-reel.png'
import mango from './images/mango.png'
import compassToken from './images/compass-token.png'
import people4Directions from './images/people-4-directions.png'
import shyKoala from './images/shy-koala.png'
import braveLion from './images/brave-lion.png'


// push: 2, // both

function makeIconComponent (...imgSrcList) {
  return ({number, className = ''}) => (
    <div className={"icon-container " + className}>
      {_.map(imgSrcList, (imgSrc) =>
        <span key={imgSrc}><img key={imgSrc} className="icon" src={imgSrc}/></span>
      )}
      {_.isUndefined(number) ? null : <span className="number">{number}</span>}
    </div>
  )
}

const ALL_ICONS = {
  Grab: makeIconComponent(grab),
  Shoe: makeIconComponent(shoe),
  ShoeWing: makeIconComponent(shoe, wing),
  Meeple: makeIconComponent(meeple),
  MeepleWing: makeIconComponent(meeple, wing),
  Truck: makeIconComponent(truck),
  MechShoe: makeIconComponent(mech, shoe),
  
  Sword: makeIconComponent(sword),
  Shield: makeIconComponent(shield),
  SkullBurning: makeIconComponent(skullBurning),
  WhiteFlag: makeIconComponent(whiteFlag),
  Bugle: makeIconComponent(bugle),
  Potion: makeIconComponent(potion),
  Push: makeIconComponent(push),
  DeckCycle: makeIconComponent(deckCycle),
  Steal: makeIconComponent(steal),
  Energy: makeIconComponent(battery),
  Ninja: makeIconComponent(ninja),

  DrawCard: makeIconComponent(drawCard),
  CardSingle: makeIconComponent(card),
  TrashCard: makeIconComponent(trashCard),
  DiscardCard: makeIconComponent(discardCard),
  RerollDice: makeIconComponent(rerollDice),
  DiceSingle: makeIconComponent(diceSingle),


  DrawDice: ({number}) => (
    <div className="icon-container">
      <b>+</b><img className="icon" src={diceSingle}/>
      &nbsp;<span className="number">{number}</span>
    </div>
  ),
  DiscardDice: ({number}) => (
    <div className="icon-container">
      <b>–</b> <img className="icon" src={diceSingle}/>
      &nbsp;<span className="number">{number}</span>
    </div>
  ),

  TrashDice: makeIconComponent(trashCan, diceSingle),
  TrashCan: makeIconComponent(trashCan),

  Dollar: ({number}) => (
    <div className="icon-container">
      <span className="icon">$</span>
      <span className="number">{number}</span>
    </div>
  ),
  MarketStall: makeIconComponent(marketStall),
  InPlay: makeIconComponent(areaBox),
  Deck: makeIconComponent(deck),
  Bag: makeIconComponent(bag),
  
  Fish: makeIconComponent(fish),
  Coral: makeIconComponent(coral),
  ArrowRight: makeIconComponent(arrowRight),
  PlayCard: makeIconComponent(playCard),
  SwapCards: makeIconComponent(swapCards),
  CoinStar: makeIconComponent(coinStar),
  ThisCard: makeIconComponent(thisCard),
  Wave: makeIconComponent(wave),
  Star: makeIconComponent(star),
  PointLeft: makeIconComponent(pointLeft),
  PointRight: makeIconComponent(pointRight),

  WarBanner: makeIconComponent(warBanner),
  Hand: makeIconComponent(hand),
  OneTurn: makeIconComponent(oneTurn),
  TwoSwords: makeIconComponent(twoSwords),
  InfiniteTurn: makeIconComponent(infiniteTurn),
  Opponent: makeIconComponent(opponent),
  Lightning: makeIconComponent(lightning),

  FilmReel: makeIconComponent(filmReel),
  Mango: makeIconComponent(mango),
  CompassToken: makeIconComponent(compassToken),
  People4Directions: makeIconComponent(people4Directions),
  BraveLion: makeIconComponent(braveLion),
  ShyKoala: makeIconComponent(shyKoala),
}


export default ALL_ICONS

export const Cards = () => {
  return _.map(ALL_ICONS, (IconComponent, name) => {
    return <div key={name} style={{marginLeft: '10px'}}>
      <span style={{display: 'inline-block', width: '40px'}}><IconComponent /></span> : {name}
    </div>
  })
}

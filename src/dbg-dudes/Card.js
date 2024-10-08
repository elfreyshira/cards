import _ from 'lodash'
import classnames from 'classnames'

import ICONS from '../util/icons.js'


function Cost({cost}) {
  // for starter cards
  if (_.startsWith(cost, 'P')) {
    return <div className="cost">{cost}</div>
  }
  
  return <div className="cost">${cost}</div>
}

// extract: 60,

//   // add troops = 115
//   addTroop: 110,
//   addToAny: 15, // add = 1 * 15 = 15, move = 2 * 15 = 30
  
//   // move troops = 200
//   moveTroop: 50, // x 1 = 50
//   moveToAny: 15, // x 2 = 30
//   moveAll: 10, // x 3 = 30
//   moveMech: 20, // x 3 = 60

const effectTopToIconMapping = {
  addTroop: ICONS.Meeple,
  addToAny: ICONS.MeepleWing,

  moveTroop: ICONS.Shoe,
  moveToAny: ICONS.ShoeWing,
  moveAll: ICONS.Truck,

  moveMech: ICONS.MechShoe,

  extract: ICONS.Grab,
  bonus: ICONS.DeckCycle,
}

function Top ({gainTop}) {
  return <div className="top">
    

    {gainTop._chooseOne ?
      <div className="md">Choose one:</div> : null
      // for starter cards
    }

    {_.map(effectTopToIconMapping, (ChosenIcon, effect) => {
      if (_.has(gainTop, effect)) {
        return <div key={effect}>
          <ChosenIcon number={gainTop[effect]} />
          <span className="sm subtitle">{effect}</span>
        </div>
      }
      else {
        return null
      }
    })}
  </div>
}


const effectBottomToIconMapping = {
  atk: ICONS.Sword,

  def: ICONS.Shield,
  retaliate: ICONS.SkullBurning,
  retreat: ICONS.WhiteFlag,
  resurrect: ICONS.Potion,

  rally: ICONS.Bugle,
  push: ICONS.Push,
}

function Bottom ({gainBottom}) {
  return <div className="bottom">
    {_.map(effectBottomToIconMapping, (ChosenIcon, effect) => {
      if (_.has(gainBottom, effect)) {
        return <div key={effect}>
          <ChosenIcon number={gainBottom[effect]} />
          <span className="sm subtitle">{effect}</span>
        </div>
      }
      else {
        return null
      }
    })}
  </div>
}

function Card (props) {
  
  const {
    cost,
    gainTop,
    gainBottom,
  } = props.cardObj

  return (
    <div className="card lg">
      <Cost cost={cost} />
      <br/>
      <Top gainTop={gainTop} />
      <Bottom gainBottom={gainBottom} />

    </div>
  )
}

export default Card

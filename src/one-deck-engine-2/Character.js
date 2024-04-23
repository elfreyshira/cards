import _ from 'lodash'
import classnames from 'classnames'

import {Storage} from './Card.js'

import ICONS from './icons.js'


function Crowns () {
  return <div className="crowns"><ICONS.Crown /></div>
}

function WindCollection () {
  return <div className="wind-collection"><ICONS.Point /></div>
}


const FarmOne = () => <>Gain <ICONS.Point /> for every 3 resources only 1 element type paid.</>
const FarmWild = () => <>Gain <ICONS.Point /> for every 5 resources paid.</>
const FarmDiscounted = () => <>Gain <ICONS.Point /> for every 4 discounted resources paid.</>
const FarmProduced = () => <>Gain <ICONS.Point /> for every 4 produced resources paid.</>

const FARM_TYPE_MAPPING = {
  one: FarmOne,
  wild: FarmWild,
  discount: FarmDiscounted,
  produce: FarmProduced,
}

function Character ({farmType="one"}) {
  const ChosenFarmType = FARM_TYPE_MAPPING[farmType]

  return (
    <div className="card">
      <div className={classnames("character", "character-type-"+farmType)}>
        Each turn, choose 1 action:
        <div className="character-grouping">
          <span className="character-action">DEVELOP</span> Play 1 card from hand.
        </div>
        <div className="character-grouping">
          <span className="character-action">PRODUCE</span> Trigger <ICONS.Arrow /> effects.
        </div>
        <div className="character-grouping">
          <span className="character-action">FARM</span> <ChosenFarmType/>
        </div>
        <div className="character-grouping">
          <span className="character-action">RECYCLE</span> Discard &#119909; cards, draw &#119909; cards. (&#119909; = any number)
        </div>
      </div>
      <hr/>
      <Crowns />
      <WindCollection />
      <Storage gain={{wildStorage: 2}} />
    </div>
  )
}


export default Character

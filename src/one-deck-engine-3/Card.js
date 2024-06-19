import _ from 'lodash'
import classnames from 'classnames'
import Brng from 'brng'

import ICONS from './icons.js'

import crown1 from './images/crowns/crown-1.png'
import crown2 from './images/crowns/crown-2.png'
import crown3 from './images/crowns/crown-3.png'
import crown4 from './images/crowns/crown-4.png'
import crown5 from './images/crowns/crown-5.png'
import crown6 from './images/crowns/crown-6.png'
import crown7 from './images/crowns/crown-7.png'
import crown8 from './images/crowns/crown-8.png'
import crown9 from './images/crowns/crown-9.png'

const CROWN_ART_MAPPING = {
  1: crown1,
  2: crown2,
  3: crown3,
  4: crown4,
  5: crown5,
  6: crown6,
  7: crown7,
  8: crown8,
  9: crown9,
}
const crownArtRoller = new Brng(_.countBy(_.range(1, 9+1)), {bias: 4})

function CostTagCombo ({tagComboCost}) {
  if (_.isEmpty(tagComboCost)) {
    return null
  }
  return (
    <span className="cost-tag-combo">
      &nbsp;/&nbsp;
      {tagComboCost.red ? <ICONS.Red number={tagComboCost.red} /> : null}
      {tagComboCost.green ? <ICONS.Green number={tagComboCost.green} /> : null}
      {tagComboCost.blue ? <ICONS.Blue number={tagComboCost.blue} /> : null}
    </span>
  )
}

function CostResources ({costForResources, tagComboCost, points}) {
  return (
    <div className="cost-resource">
      <span>${costForResources}</span>
      <CostTagCombo tagComboCost={tagComboCost} />
      {points > 0 ? <span className="points-container"><ICONS.Point/>{points}</span> : null}
    </div>
  )
}


function ComboActivate ({tagComboActivate, filter='money'}) {
  const sortedTagCombo = _.keys(tagComboActivate).sort()
  return _.map(_.sortBy(sortedTagCombo), (tagKey) => {
    const gain = tagComboActivate[tagKey]
    if (gain !== filter) {
      return
    }

    const number = _.last(tagKey)
    const tagColor = tagKey.replace(/\d/g, '')

    const TagIcon = ICONS[_.capitalize(tagColor)]

    const gainHtml = (filter === 'money' ? '$1' : <ICONS.Draw number={1} />)

    return <span key={tagKey} className="combo-activate-item">
      <TagIcon number={number}/> : {gainHtml}
    </span>
  })
}

function Tap ({gain = {}, tagComboActivate = {}}) {
  if (!_.isNumber(gain.money) && !_.includes(tagComboActivate, 'money')) {
    return null
  }

  return (
    <div className="tap">
      <div className="tap-icon-container"><ICONS.Tap /></div>
      <div className="tap-gain-container">
        {gain.money ? <span>${gain.money}</span> : null}
        <ComboActivate tagComboActivate={tagComboActivate} />
      </div>
    </div>
  )
}

function Rest ({gain = {}, tagComboActivate = {}}) {
  if (!_.isNumber(gain.draw) && !_.includes(tagComboActivate, 'draw')) {
    return null
  }

  return (
    <div className="tap">
      <div className="tap-icon-container"><ICONS.Rest /></div>
      <div className="tap-gain-container">
        {gain.draw ? <span><ICONS.Draw number={gain.draw}/></span> : null}
        <ComboActivate tagComboActivate={tagComboActivate} filter="draw"/>
      </div>
    </div>
  )
}

function Qt (props) {
  return <div className="qualifier-text">{props.children}</div>
}

const PASSIVE_TO_HTML = {
  untapTheCardOnHire: <><b>HIRE</b>: <ICONS.Rest/> the new card
    <Qt>(does not apply when this card is played)</Qt>
  </>,
  untapOnConstruct: <><b>CONSTRUCT</b>: <ICONS.Rest/> any card</>,
  untapOnInvite: <><b>INVITE</b>: <ICONS.Rest/> any card</>,

  // passive build discount
  discountHire: <><b>HIRE</b>: discount $1</>,
  discountConstruct: <><b>CONSTRUCT</b>: discount $1</>,
  discountInvite: <><b>INVITE</b>: discount $1</>,

  // passive build draw
  drawOnHire: <><b>HIRE</b>: <ICONS.Draw number={1}/>
    <Qt>(does not apply when this card is played)</Qt>
  </>,
  drawOnConstruct: <><b>CONSTRUCT</b>: <ICONS.Draw number={1}/></>,
  drawOnInvite: <><b>INVITE</b>: <ICONS.Draw number={1}/></>,

  // increase build
  extraHire: <><b>HIRE</b>: +1 extra hire
    <Qt>(does not apply when this card is played)</Qt>
  </>,
  extraConstruct: <><b>CONSTRUCT</b>: +1 extra construct</>,
  extraInvite: <><b>INVITE</b>: +1 extra invite</>,
}
const passiveKeys = _.keys(PASSIVE_TO_HTML)

function getPassiveActionTrigger (passiveEffect) {
  if (_.endsWith(passiveEffect, 'Hire')) {
    return 'hire'
  }
  if (_.endsWith(passiveEffect, 'Construct')) {
    return 'construct'
  }
  if (_.endsWith(passiveEffect, 'Invite')) {
    return 'invite'
  }
}

function Passive ({gain={}}) {
  const passiveList = []
  _.forEach(passiveKeys, (passiveEffect) => {
    if (_.has(gain, passiveEffect)) {
      passiveList.push(
        <div key={passiveEffect} className={"passive-item " + getPassiveActionTrigger(passiveEffect)}>
          {PASSIVE_TO_HTML[passiveEffect]}
        </div>
      )
    }
  })

  return (
    <div className="passive">
      {passiveList}
    </div>
  )
  return null
}

function ComboPoint ({tagComboPoint={}}) {
  if (_.isEmpty(tagComboPoint)) {
    return null
  }
  const tags = _(tagComboPoint)
    .keys()
    .first()
    .split('_')
    .map((tagKey) => {
      const TagIcon = ICONS[_.capitalize(tagKey)]
      return <TagIcon key={tagKey} />
    })

  const pointsPerTags = _.values(tagComboPoint)[0]

  return (
    <div className="tc-point">
      <div className="tc-point-inner">
        <ICONS.Point/>{pointsPerTags} <small>for each</small> {tags}
      </div>
    </div>
  )
}

function TagSide ({tagSideCost, tagSide, tagSidePoints}) {
  const tags = _.keys(tagSide)

  const FirstTagIcon = ICONS[_.capitalize(tags[0])]

  return (
    <div className="tag-side-container">
      <div className="tag-side-cost">${tagSideCost}</div>

      <div className="ts-tag ts-tag-red">
        {tagSide.red > 0 ? <ICONS.Red number={tagSide.red}/> : null}
      </div>

      <div className="ts-tag ts-tag-green">
        {tagSide.green > 0 ? <ICONS.Green number={tagSide.green}/> : null}
      </div>

      <div className="ts-tag ts-tag-blue">
        {tagSide.blue > 0 ? <ICONS.Blue number={tagSide.blue}/> : null}
      </div>
      
      {tagSidePoints > 0 ? <div className="ts-tag ts-points"><ICONS.Point/>{tagSidePoints}</div> : null}
    </div>
  )
}

function CrownCost ({crownCost}) {
  return (
    <div className="crown-cost">
      ${crownCost}
      <img className="crown-cost-image" src={CROWN_ART_MAPPING[crownArtRoller.roll()]}/>
    </div>
  )
}

function Card (props) {
  
  const {
    uuid,
    costForResources,
    tagComboCost,
    tagComboPoint,
    points,
    gain,
    tagComboActivate,

    tagSideCost,
    tagSide,
    tagSidePoints,

    crownCost,
  } = props.cardObj

  return (
    <div className="card">
      <CostResources costForResources={costForResources} tagComboCost={tagComboCost} points={points} />
      <ComboPoint tagComboPoint={tagComboPoint} />
      <Tap gain={gain} tagComboActivate={tagComboActivate} />
      <Rest gain={gain} tagComboActivate={tagComboActivate} />
      <Passive gain={gain} />
      <TagSide tagSideCost={tagSideCost} tagSide={tagSide} tagSidePoints={tagSidePoints} />
      <CrownCost crownCost={crownCost} />
      
      {/*{props.cardObj.uuid}*/}
    </div>
  )
}

export {Card, Rest}

import _ from 'lodash'
import classnames from 'classnames'

import ICONS from './icons.js'

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

function CostResources ({costForResources, tagComboCost}) {
  return (
    <div className="cost-resource">
      <span>${costForResources}</span>
      <CostTagCombo tagComboCost={tagComboCost} />
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

    return <div key={tagKey}>
      <TagIcon number={number}/> : {gainHtml}
    </div>
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
        {gain.money ? <div>${gain.money}</div> : null}
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
        {gain.draw ? <div><ICONS.Draw number={gain.draw}/></div> : null}
        <ComboActivate tagComboActivate={tagComboActivate} filter="draw"/>
      </div>
    </div>
  )
}

const PASSIVE_TO_HTML = {
  untapTheCardOnRecruit: <>RECRUIT: instantly <ICONS.Rest/> the newly played card</>,
  untapOnConstruct: <>CONSTRUCT: <ICONS.Rest/> any 1 card</>,
  untapOnInvite: <>INVITE: <ICONS.Rest/> any 1 card</>,

  // passive build discount
  discountRecruit: <>RECRUIT: cost -$1</>,
  discountConstruct: <>CONSTRUCT: cost -$1</>,
  discountInvite: <>INVITE: cost -$1</>,

  // passive build draw
  drawOnRecruit: <>RECRUIT: <ICONS.Draw number={1}/></>,
  drawOnConstruct: <>CONSTRUCT: <ICONS.Draw number={1}/></>,
  drawOnInvite: <>INVITE: <ICONS.Draw number={1}/></>,

  // increase build
  extraRecruit: <>RECRUIT: you may recruit 1 additional time</>,
  extraConstruct: <>CONSTRUCT: you may construct 1 additional time</>,
  extraInvite: <>INVITE: you may invite 1 additional time</>,
}
const passiveKeys = _.keys(PASSIVE_TO_HTML)

function getPassiveActionTrigger (passiveEffect) {
  if (_.endsWith(passiveEffect, 'Recruit')) {
    return 'recruit'
  }
  if (_.endsWith(passiveEffect, 'Construct')) {
    return 'construct'
  }
  if (_.endsWith(passiveEffect, 'Invite')) {
    return 'invite'
  }
}

function Passive({gain={}}) {
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

function Card (props) {
  
  const {
    uuid,
    costForResources,
    tagComboCost,
    gain,
    tagComboActivate,
  } = props.cardObj

  return (
    <div className="card">
      <CostResources costForResources={costForResources} tagComboCost={tagComboCost} />
      <Tap gain={gain} tagComboActivate={tagComboActivate} />
      <Rest gain={gain} tagComboActivate={tagComboActivate} />
      <Passive gain={gain} />
      {/*{JSON.stringify(props.cardObj.uuid)}*/}
      {props.cardObj.uuid}
    </div>
  )
}

export {Card}

import _ from 'lodash'
import classnames from 'classnames'

import ICONS from './icons.js'

function CostTagCombo ({tagComboCost}) {
  if (_.isEmpty(tagComboCost)) {
    return null
  }
  return (
    <span classnames="cost-tag-combo">
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


function TapComboActivate ({tagComboActivate}) {
  const sortedTagCombo = _.keys(tagComboActivate).sort()
  return _.map(_.sortBy(sortedTagCombo), (tagKey) => {
    const gain = tagComboActivate[tagKey]
    if (gain !== 'money') {
      return
    }

    const number = _.last(tagKey)
    const tagColor = tagKey.replace(/\d/g, '')

    const TagIcon = ICONS[_.capitalize(tagColor)]
    return <div>
      <TagIcon number={number}/> : $1
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
        <TapComboActivate tagComboActivate={tagComboActivate} />
      </div>
    </div>
  )
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
      {JSON.stringify(props.cardObj)}
    </div>
  )
}

export {Card}

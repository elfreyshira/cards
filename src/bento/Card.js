import _ from 'lodash'
import classnames from 'classnames'
import Brng from 'brng'

import ICONS from './icons.js'


const squareResourcesList = [
  'remove1',
  'remove2',
  'remove3',
  'remove4',

  'carb1',
  'carb2',
  'carb3',
  'carb4',

  'meat1',
  'meat2',
  'meat3',
  'meat4',

  'veggie1',
  'veggie2',
  'veggie3',
  'veggie4',

  'edge1',
  'edge2',
  'edge3',
]

const otherResourcesList = [
  'trash',
  'money',
  'point',
  'bonus',
]
// _.capitalize(resource)


const typeRenderMapping = {
  carb: <>&#9675;</>,
  veggie: <>&#8964;</>,
  meat: <>&#10005;</>,
  remove: null
}

const shapes = {
  T4: ` 111
        010`,

  L4: ` 111
        100`,

  S4: ` 110
        011`,

  I4: ` 1111`,

  O4: ` 11
        11`,

  I3: ` 111`,

  L3: ` 11
        10`,

  I2: ` 11`,

  O1: ` 1`,
}

function Polyomino ({shapeLayout =`
111
010`,
  type = 'carb'
}) {
  if (type === 'edge') return null

  const shapeList = shapeLayout.trim().replace(/ /g, '').split('\n')
  const typeRender = typeRenderMapping[type]

  return _.map(shapeList, (line, idx) => {
    const lineRender = _.map(line, (square, idx2) => {
      const displayClass = square === '1' ? 'shown' : 'hidden'
      return <div key={square + idx2} className={classnames("square", displayClass)}> <span className="icon">{typeRender}</span> </div>
    })
    return <div key={line+idx} className={"line " + type}>{lineRender}</div>
  })
}

function Cost ({cost}) {
  if (!_.isEmpty(cost)) {
    return <div className="cost">
      ${cost}
    </div>
  }
  else {
    return null
  }
}

function Starter ({starter}) {
  // return <div>lol</div>
  if (_.isNumber(starter)) {
    return <div className="starter-card-player md">
      P{starter}
    </div>
  }
  else {
    return null
  }
}

function Card (props) {
  
  const {
    cost,
    gain,
    type,
    shapeID,
    uuid,
    starter,
  } = props.cardObj

  return (
    <div className="card lg">
      <div className="md">
        {_.compact(_.map(squareResourcesList, (resource) => {
          const ChosenIcon = ICONS[_.capitalize(resource)]
          if (gain[resource] > 0) {
            return <div key={resource}><ChosenIcon number={gain[resource]} /></div>
          }
        }))}
      </div>
      <div className="shape-container">
        <Polyomino type={type} shapeLayout={shapes[shapeID]} />
      </div>
      <div className="card-container">
        {_.compact(_.map(otherResourcesList, (resource) => {
          const ChosenIcon = ICONS[_.capitalize(resource)]
          return (
            <div
              key={resource}
              className={classnames("resource-gain", resource, gain[resource] > 0 ? 'shown' : '')}
            >
              {gain[resource] > 0 ? <ChosenIcon number={gain[resource]} /> : null}
            </div>
          )
        }))}
      </div>

      <Cost cost={cost} />

      <Starter starter={starter} />

    </div>
  )
}

export default Card

import _ from 'lodash'
import classnames from 'classnames'

import './index.css'
import cardList from './card-list.js'

import scrollImg from './scroll.png'

function importAll(r) {
  let images = {};
  r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
  return images;
}

const backgroundImages = importAll(require.context('./images', false, /\.(png|jpe?g|svg)$/));
const suitImages = importAll(require.context('./suits', false, /\.(png|jpe?g|svg)$/));

const suitsThatNeedWhiteShadow = ['army', 'beast', 'flood', 'leader']


function Card ({
  baseStr, bonus, penalty, baseText,
  imageSrc,
  value,
  name,
  suit,
}) {

  let whiteShadow = ''
  if (_.includes(suitsThatNeedWhiteShadow, suit)) {
    whiteShadow = 'white-shadow'
  }

  return (
    <div className={classnames('card', 'suit-' + suit)}>
      <img src={scrollImg} className="scroll" />
      <img
        // src={'./images/fantasy-realms/'+ suit + '-' + name + '.' + filetype}
        // src={celestialKnight}
        // src={images['army-celestial-knight.png']}
        className="background-image"
        src={imageSrc}
      />

      <div className={classnames("suit-container", whiteShadow)}>
        <img src={suitImages[suit + '.png']} className={classnames("suit", suit)} />
      </div>

      <div className="suit-text-container">
        <div className="suit-text">{_.toUpper(suit)}</div>
      </div>

      <div className="value">{value}</div>
      <div className="name">{_.upperCase(name)}</div>


    </div>
  )
}

function Cards () {

  // return _.map(images, (imgSrc, imageName) => (
  return _.map(cardList, (cardObj, cardIndex) => (
    <Card
      key={cardObj.id}
      imageSrc={backgroundImages[cardObj.id + '.png']}
      value={cardObj.value}
      name={cardObj.name}
      suit={cardObj.suit}
    />
  ))

  return (
    <Card
      suit="army"
      name="celestial-knight"
      baseStr={20}
      bonus="Just a random test."
      penalty="-8 unless with at least one Leader"
      baseText="Putting more filler text here."
      filetype="png"

      // imgZoom='31%'
      // imgTop='-100px'
      // imgLeft={0}
    />
  )
}

export default Cards

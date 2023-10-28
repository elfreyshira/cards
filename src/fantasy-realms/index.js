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

// const suitsThatNeedWhiteShadow = ['army', 'beast', 'flood', 'leader', 'flame']
const suitsThatNeedWhiteShadow = ['wild', 'beast', 'land', 'leader',
  'flame', 'wizard', 'flood', 'artifact']


const suitArray = ['army', 'beast', 'land', 'leader',
  'flame', 'weapon', 'weather', 'wizard', 'flood', 'wild', 'artifact',]

function Effect ({text}) {
  return _.map(_.split(text, ' '), (word) => {
    const lowerCaseWord = _.toLower(_.replace(word, /[,;.]/, ''))
    if (_.includes(suitArray, lowerCaseWord )) {
      return <span style={{display: 'inline-block'}}>
        <img
          src={suitImages[lowerCaseWord+'.png']}
          className={classnames("suit-in-text", lowerCaseWord)}
        />{word} </span>
    }
    else {
      // return <span>{word}</span>
      return word+' '
    }
  })
}

function Card ({
  imageSrc,
  value,
  name,
  suit,
  bonus,
  neutral,
  penalty,
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

      <div className="effect-container">
        {!!bonus ?
          <div className="bonus">
            <div><b>BONUS:</b></div>
            <Effect text={bonus} />
          </div>
          : null
        }

        {!!penalty ?
          <div className="penalty">
            <div><b>PENALTY:</b></div>
            <Effect text={penalty} />
          </div>
          : null
        }

        {!!neutral ?
          <div className="neutral">
            <Effect text={neutral} />
          </div>
          : null
        }
      </div>


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
      bonus={cardObj.bonus}
      neutral={cardObj.neutral}
      penalty={cardObj.penalty}
    />
  ))

  return (
    <Card
      suit="army"
      name="celestial-knight"
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

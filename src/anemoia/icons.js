import {ReactComponent as SpotSvg} from './images/spot.svg'
import {ReactComponent as HomeSvg} from './images/home.svg'
import {ReactComponent as TapSvg} from './images/tap.svg'
import {ReactComponent as CardSvg} from './images/card.svg'

import earthIcon from './images/earth.png'
import fireIcon from './images/fire.png'
import waterIcon from './images/water.png'
import wildIcon from './images/wild.png'
import tapanotherIcon from './images/tapanother.png'
import untapIcon from './images/untap.png'
import grabIcon from './images/grab.png'
import thisCardIcon from './images/this-card.png'
import momentIcon from './images/moment.png'
import tapIcon from './images/tap3.png'
import retrieveIcon from './images/retrieve3.png'
import cardIcon from './images/card.png'

function Spot () {
  return <SpotSvg className="icon" />
}
function Home () {
  return <HomeSvg className="icon" />
}
function Tap () {
  return <TapSvg className="icon" />
  // return <img className="icon" src={tapIcon} />
}
function Moment () {
  return <img className="icon" src={momentIcon} />
}

function Card () {
  // return <CardSvg className="icon gaincard" />
  return <img className="icon card-icon" src={cardIcon} />
}

function Earth () {
  return <img className="icon with-shadow earth" src={earthIcon} />
}
function Fire () {
  return <img className="icon with-shadow fire" src={fireIcon} />
}
function Water () {
  return <img className="icon with-shadow water" src={waterIcon} />
}
function Wild () {
  return <img className="icon with-shadow wild" src={wildIcon} />
}
function Wildsame () {
  return (
    <span>
      <img className="icon with-shadow wild" src={wildIcon} />
      <span className="wildsame-equal-sign">=</span>
    </span>
  )
}

function Tapanother () {
  return <img className="icon" src={tapanotherIcon} />
}
function Untap () {
  return <img className="icon untap" src={untapIcon} />
}

function Grabanother () {
  return <img className="icon grab" src={grabIcon} />
}
const Grab = Grabanother

function ThisCard () {
  return <img className="icon this-card" src={thisCardIcon} />
}

function Retrieve () {
  // return <div className="retrieve"> <Home /> </div>
  return <img className="icon" src={retrieveIcon} />
}

function Chainlevel1 () {
  return <div className="chain"><Spot /><span className="level">1</span></div>
}
function Chainlevel2 () {
  return <div className="chain"><Spot /><span className="level">2</span></div>
}
function Chainlevel3 () {
  return <div className="chain"><Spot /><span className="level">3</span></div>
}
function Chainlevel4 () {
  return <div className="chain"><Spot /><span className="level">4</span></div>
}

function Money ({amount}) {
  return <span className="icon money">${amount}</span>
}

function Point ({amount}) {
  return <span className="icon money">❋{amount}</span>
}

function Points4 ({amount}) {
  return <Point amount={4} />
}
function Points2 ({amount}) {
  return <Point amount={2} />
}

export default {
  Spot,
  Home,
  Tap,
  Earth,
  Fire,
  Water,
  Wild,
  Wildsame,
  Card,
  Tapanother,
  Untap,
  Retrieve,
  Chainlevel1,
  Chainlevel2,
  Chainlevel3,
  Chainlevel4,
  Money,
  Grab,
  Grabanother,
  ThisCard,
  Moment,
  Point,
  Points4,
  Points2,
}

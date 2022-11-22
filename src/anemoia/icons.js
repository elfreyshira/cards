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

function Spot () {
  return <SpotSvg className="icon" />
}
function Home () {
  return <HomeSvg className="icon" />
}
function Tap () {
  return <TapSvg className="icon" />
}

function Card () {
  return <CardSvg className="icon gaincard" />
}

function Earth () {
  return <img className="icon with-shadow" src={earthIcon} />
}
function Fire () {
  return <img className="icon with-shadow" src={fireIcon} />
}
function Water () {
  return <img className="icon with-shadow" src={waterIcon} />
}
function Wild () {
  return <img className="icon with-shadow wild" src={wildIcon} />
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
  return <div className="retrieve"> <Home /> </div>
}

function Chainlevel1 () {
  return <div className="chain"> <Spot /><span className="level">1</span> </div>
}
function Chainlevel2 () {
  return <div className="chain"> <Spot /><span className="level">2</span> </div>
}

function Money ({amount}) {
  return <span className="icon money">${amount}</span>
}

export default {
  Spot,
  Home,
  Tap,
  Earth,
  Fire,
  Water,
  Wild,
  Card,
  Tapanother,
  Untap,
  Retrieve,
  Chainlevel1,
  Chainlevel2,
  Money,
  Grab,
  Grabanother,
  ThisCard
}

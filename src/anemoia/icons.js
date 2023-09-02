import spotIcon from './images/spot.png'
import homeIcon from './images/home.png'
import tapIcon from './images/tap.png'

import earthIcon from './images/earth.png'
import fireIcon from './images/fire.png'
import waterIcon from './images/water.png'

// import wildIcon from './images/wild.png'
import wildIcon from './images/wild2.png'

import tapanotherIcon from './images/tapanother.png'
import untapIcon from './images/untap.png'
import grabIcon from './images/grab.png'
import thisCardIcon from './images/this-card.png'
import momentIcon from './images/moment.png'
import windmillIcon from './images/windmill.png'
import scoutIcon from './images/scout.png'
import arrowIcon from './images/arrow.png'


// import windIcon from './images/wind.png'
import windIcon from './images/wind2.png'

import retrieveIcon from './images/retrieve.png'
import cardIcon from './images/card.png'

function Spot () {
  return <img className="icon spot" src={spotIcon} />
}
function Home () {
  return <img className="icon home" src={homeIcon} />
}
function Tap () {
  // return <TapSvg className="icon" />
  return <img className="icon tap" src={tapIcon} />
}
function Moment () {
  return <img className="icon" src={momentIcon} />
}

function Card () {
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
    <span className="icon wildsame">
      <img className="with-shadow" src={wildIcon} />
      <span className="wildsame-equal-sign">=</span>
    </span>
  )
}

function Tapanother () {
  return <img className="icon tapanother" src={tapanotherIcon} />
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
  return <img className="icon" src={homeIcon} />
}

function RetrieveLevelHolder ({level}) {
  return (
    <span className="icon chain">
      <div className="retrieve-level-spot-container">
        <img src={spotIcon}/>
        <span className="chain-level">{level}</span>
      </div>
      <img className="arrow-icon" src={arrowIcon} />
      <img src={homeIcon} />
    </span>
  )
}

function Retrievelevel1 () {
  return <RetrieveLevelHolder level="1" />
}
function Retrievelevel2 () {
  return <RetrieveLevelHolder level="2" />
}
function Retrievelevel3 () {
  return <RetrieveLevelHolder level="3" />
}
function Retrievelevel4 () {
  return <RetrieveLevelHolder level="4" />
}
function RetrievelevelX () {
  return <RetrieveLevelHolder level="X" />
}

function Windmill () {
  return <img className="icon" src={windmillIcon} />
}

function Scout () {
  return <img className="icon" src={scoutIcon} />
}

function ChainLevelHolder ({level}) {
  return (
    <span className="icon chain">
      <img src={scoutIcon} />
      <img className="arrow-icon" src={arrowIcon} />
      <img src={spotIcon}/>
      <span className="chain-level">{level}</span>
    </span>
  )
}

function Chainlevel1 () {
  return <ChainLevelHolder level="1" />
}
function Chainlevel2 () {
  return <ChainLevelHolder level="2" />
}
function Chainlevel3 () {
  return <ChainLevelHolder level="3" />
}
function Chainlevel4 () {
  return <ChainLevelHolder level="4" />
}
function ChainlevelX () {
  return <ChainLevelHolder level="X" />
}

function Money ({amount}) {
  return (
    <span className="icon text-icon">
      <span className="text-icon-content">$</span>
    </span>
  )
}


function Point ({amount}) {

  return (
    <span className="icon text-icon for-points">
      <img className="wind" src={windIcon} /><span className="text-icon-content">{amount}</span>
    </span>
  )
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
  Retrievelevel1,
  Retrievelevel2,
  Retrievelevel3,
  Retrievelevel4,
  RetrievelevelX,
  Chainlevel1,
  Chainlevel2,
  Chainlevel3,
  Chainlevel4,
  ChainlevelX,
  Money,
  Grab,
  Grabanother,
  ThisCard,
  Moment,
  Point,
  Points4,
  Points2,
  Windmill
}

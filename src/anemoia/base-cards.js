import _ from 'lodash'
import ICONS from './icons.js'

function Reference () {
  return (
    <div className="reference-container">
      <div className="reference-title">REFERENCE</div>
      <div className="reference-row"><ICONS.Wild/> : <ICONS.Fire/> or <ICONS.Water/> or <ICONS.Earth/></div>
      <div className="reference-row"><ICONS.Card/> : card</div>
      <div className="reference-row">
          <span style={{border: '1px solid #ddd', borderRadius: '3px', padding: '0px 2px 1px'}}>
            <ICONS.ThisCard /> : <ICONS.Wild/> / <ICONS.Grab />
          </span> : on this card, place resources OR grab resources
      </div>
      {/*<div className="reference-row"><ICONS.Grabanother/> : grab your resources placed on another card</div>*/}
      <div className="reference-row"><ICONS.Untap/> : restore one <ICONS.Tap/> card</div>
      {/*<div className="reference-row"><ICONS.Tapanother/> : tap a <ICONS.Tap/> card without activating it</div>*/}
      <div className="reference-row"><ICONS.ChainlevelX/> : send 1 scout to a <ICONS.Spot/> card that's level X or lower</div>
      <div className="reference-row"><ICONS.RetrievelevelX/> : return 1 traveler/scout from a <ICONS.Spot/> card that's level X or lower</div>
    </div>
  )
}

function Arrow () {
  return <span className="anytime-arrow">&rarr;</span>
}

function Exchange () {
  return (
    <div className="anytime-container">
      <div className="anytime-title">EXCHANGE RATE</div>
      <div className="anytime-row"><ICONS.Money amount={5}/> <Arrow/> <ICONS.Wild /></div>
      <div className="anytime-row"><ICONS.Money amount={3}/> <Arrow/> <ICONS.Card /></div>
      <div className="anytime-row"><ICONS.Card /> <Arrow/> <ICONS.Money amount={1}/></div>
      <div className="anytime-row"><ICONS.Card /> <ICONS.Card /> <Arrow/> <ICONS.Money amount={3}/></div>
      <div className="anytime-row"><ICONS.Card /> <ICONS.Money amount={1}/> <Arrow/> <ICONS.Card /></div>
      <div className="anytime-row"><ICONS.Wild/> <Arrow/> <ICONS.Money amount={3}/></div>
      <div className="anytime-row"><ICONS.Wild/> <ICONS.Money amount={2}/> <Arrow/> <ICONS.Wild/></div>
    </div>
  )
}

function Txt (props) {
  return <span style={{display:'inline-block'}}>{props.children}</span>
}
function PlayATurn () {
  return (
    <div className="reference-container play-a-turn-container">
      <div className="reference-title">PLAY A TURN</div>
      <h3>Choose 1 main action</h3>
      <ul>
        <li>TRAVEL: send 1 traveler to an available <ICONS.Spot/> card.</li>
        <li>REST: return any number of travelers back home. For each traveler that returns, return 1 scout AND restore 1 <Txt><ICONS.Tap/> card.</Txt> Activate any <Txt><ICONS.Home/> cards</Txt> your traveler returns to.</li>
      </ul>
      <h3>Extra actions at any time</h3>
      <ul>
        <li>Exchange resources.</li>
        <li>Activate a <Txt><ICONS.Tap/> card.</Txt></li>
        <li>Play a card to your tableau by spending the required resources.</li>
      </ul>
    </div>
  )
}

function PlayATurnSimultaneous () {
  return (
    <div className="reference-container simultaneous-container">
      <div className="reference-title">PLAY A TURN (SIMULTANEOUS)</div>
      <h3>[1] Build</h3>
      <p>Build cards to your play area by spending the required resources.</p>
      
      <h3>[2] Choose 1 main action</h3>
      <ul>
        <li><b>GO</b>: send 1 traveler to an available <ICONS.Spot/> card.</li>
        <li><b>REST</b>: return any number of travelers back home. For each traveler that returns, return 1 scout AND restore 1 <Txt><ICONS.Tap/> card.</Txt> Activate any <Txt><ICONS.Home/> cards</Txt> your traveler returns to.</li>
      </ul>
      <h3>Extra actions at any time</h3>
      <ul>
        <li>Exchange resources.</li>
        <li>Restore a <Txt><ICONS.Tap/> card. (step [2])</Txt></li>
      </ul>
    </div>
  )
}


export {Reference, Exchange, PlayATurn, PlayATurnSimultaneous}

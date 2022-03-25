import cards from './cards.js';
import _ from 'lodash';
import './index.css';


function Letter (props) {
  return (
    <div className="letter">{props.children}</div>
  )
}

function Card ({letters, points}) {
  let extraClass = ""
  if (!!letters[4]) {
    extraClass = "five"
  }
  else if (!!letters[3]) {
    extraClass = "four"
  }

  return (
    <div className={"card-word-game " + extraClass}>
      <div className="letter-box">
        <Letter>{letters[0]}</Letter>
        <Letter>{letters[1]}</Letter>
        {letters[2] ? <Letter>{letters[2]}</Letter> : null}
        {letters[3] ? <Letter>{letters[3]}</Letter> : null}
        {letters[4] ? <Letter>{letters[4]}</Letter> : null}
      </div>
      <div className="points">{_.round(points)}</div>
    </div>
  )
}


function Cards() {
  return (
    <div>
      {_.map(cards, ({letters, points}) => {
        return (
          <Card
            letters={letters}
            points={points}
            key={letters[0]+letters[1]+(letters[2]||'')}
          />
        )
      })}
    </div>
  );
}

export default Cards;

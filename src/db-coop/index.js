import Brng from 'brng'
import _ from 'lodash'

const cardsArray = [1,2,3]

function Cards () {
  return (
    <div>
      <pre>
        {JSON.stringify(cardsArray, null, 2)}
      </pre>

      
    </div>
  )
}

export default Cards

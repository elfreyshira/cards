import _ from 'lodash'
import seed from 'seed-random'


const params = new URL(document.URL).searchParams
const seedID = params.get('seed')

export default function (Brng) {

  const params = new URL(document.URL).searchParams
  const seedID = params.get('seed')

  if (_.isString(seedID)) {
    Brng.random = seed(seedID)
  }
  else {
    const generatedSeedId = Math.random().toString(36).slice(2,6)
    Brng.random = seed(generatedSeedId)
    console.log('generatedSeedId', generatedSeedId)
  }
}

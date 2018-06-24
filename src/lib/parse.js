import * as R from 'ramda'

const reducer = (store, keyValue) => {
  const [key, value] = R.split('=', keyValue)
  return R.assoc(key, value, store)
}

export default R.compose(
  R.reduce(reducer, {}),
  R.split('&'),
  R.replace('#', '')
)

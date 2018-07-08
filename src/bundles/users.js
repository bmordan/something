import auth from '../lib/auth'
import db from '../lib/pouch'

export default {
  name: 'users',

  getReducer: () => {
    const initialState = {
      user: null,
      fetching: false,
      userError: null
    }

    return (state = initialState, { type, payload }) => {
      switch (type) {
        case 'FETCH_AUTH_TOKEN_START':
        return Object.assign({}, state, {
          fetching: true
        })
        case 'FETCH_AUTH_TOKEN_SUCCESS':
        return Object.assign({}, state, {
          fetching: false
        })
        case 'FETCH_USER_START':
        return Object.assign({}, state, {
          fetching: true
        })
        case 'FETCH_USER_SUCCESS':
        return Object.assign({}, state, {
          user: payload,
          fetching: false
        })
        case 'FETCH_USER_ERROR':
        return Object.assign({}, state, {
          fetching: false,
          userError: JSON.stringify(payload, null, 2)
        })
        case 'RESET_USER':
        return Object.assign({}, initialState)
        default:
        return state
      }
    }
  },
  doFetchAuthToken: () => ({ dispatch }) => {
    dispatch({ type: 'FETCH_AUTH_TOKEN_START' })
    auth.authorize()
  },
  doSetAuthToken: () => ({ dispatch }) => {
    dispatch({ type: 'FETCH_AUTH_TOKEN_SUCCESS' })
  },
  doFetchOrCreateUser: (auth0) => ({ dispatch }) => {

    dispatch({ type: 'FETCH_USER_START' })

    if (auth0) dispatch({ type: 'FETCH_AUTH_TOKEN_SUCCESS' })

    db.get(auth0, (err, payload) => {
      if (err && err.status === 404) {
        db.put({
          _id: auth0,
          name: null,
          level: null,
          time: null
        }).then(({id}) => {
          return db.get(id)
        }).then(payload => {
          const type = 'FETCH_USER_SUCCESS'
          dispatch({ type, payload })
        })
      } else {
        const type = 'FETCH_USER_SUCCESS'
        dispatch({ type, payload })
      }
    })
  },
  doUpdateUser: (update) => ({ dispatch }) => {
    dispatch({ type: 'FETCH_USER_START' })
    db.put(update)
      .then(({id}) => db.get(id))
      .then(payload => {
        const type = 'FETCH_USER_SUCCESS'
        dispatch({ type, payload })
      })
      .catch(payload => {
        const type = 'FETCH_USER_ERROR'
        dispatch({ type, payload })
      })
  },
  doRemoveUser: () => ({ dispatch }) => {
    dispatch({ type: 'RESET_USER' })
  },
  selectUserState: state => state.users
}

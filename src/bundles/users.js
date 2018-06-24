import auth from '../lib/auth'
import db from '../lib/pouch'

export default {
  name: 'users',

  getReducer: () => {
    const initialState = {
      id: null,
      name: 'default_user',
      auth0: null,
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
          fetching: false,
          auth0: payload.userId
        })
        case 'FETCH_USER_START':
        return Object.assign({}, state, {
          fetching: true
        })
        case 'FETCH_USER_SUCCESS':
        return Object.assign({}, state, {
          id: payload._id,
          name: payload.name,
          fetching: false
        })
        case 'FETCH_USER_ERROR':
        return Object.assign({}, state, {
          fetching: false,
          userError: JSON.stringify(payload, null, 2)
        })
        default:
        return state
      }
    }
  },
  doFetchAuthToken: () => ({ dispatch }) => {
    dispatch({ type: 'FETCH_AUTH_TOKEN_START' })
    auth.authorize()
  },
  doSetAuthToken: (payload) => ({ dispatch }) => {
    const type = 'FETCH_AUTH_TOKEN_SUCCESS'
    dispatch({ type, payload })
  },
  doFetchUser: (user) => ({ dispatch }) => {

    dispatch({ type: 'FETCH_USER_START' })

    if (user.id) {
      db.get(user.id)
        .then(payload => {
          const type = 'FETCH_USER_SUCCESS'
          dispatch({ type, payload })
        })
        .catch(payload => {
          const type = 'FETCH_USER_ERROR'
          dispatch({ type, payload })
        })
    } else if (!user.name || user.name === '') {
      const type = 'FETCH_USER_ERROR'
      dispatch({ type, payload: new Error('User name is empty') })
    } else {
      db.post(user)
        .then(payload => {
          return db.get(payload.id)
        })
        .then(payload => {
          window.localStorage.setItem('something_user', payload._id)
          const type = 'FETCH_USER_SUCCESS'
          dispatch({ type, payload })
        })
        .catch(payload => {
          const type = 'FETCH_USER_ERROR'
          dispatch({ type, payload })
        })
    }
  },
  selectUserState: state => state.users
}

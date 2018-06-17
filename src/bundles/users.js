import auth from '../lib/auth'

export default {
  name: 'users',
  
  getReducer: () => {
    const initialState = {
      user: null,
      fetching: false,
      userId: null
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
          userId: payload.userId
        })
        case 'FETCH_USER_START':
        return Object.assign({}, state, {
          fetching: true
        })
        case 'FETCH_USER_SUCCESS':
        return Object.assign({}, state, {
          fetching: false,
          user: payload
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
  selectUserState: state => state.users
}

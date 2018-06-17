export default {
  name: 'users',
  // the Redux reducer function
  reducer: (state = [], action) => {
    // ...
    return state
  },
  // anything that starts with `select` is treated as a selector
  // selectActiveUsers: state => state.users.filter(user => user.isActive),
  // anything that starts with `do` is treated as an action creator
  doUpdateUser: (userId, attrs) => ({ dispatch, apiFetch }) => {
    dispatch({ type: 'USER_UPDATE_STARTED' })
    setTimeout(() => {
      dispatch({ type: 'USER_UPDATE_FINISHED' })
    }, 3000)
  },
  // optional init method is ran after store is created and passed the
  // store object.
  init: store => {
    // action creators are bound and attached to store as methods
    store.doUpdateUser()
  }
}

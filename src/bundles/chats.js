import { createDB } from '../lib/pouch'
import chartCreator from '../lib/chart-creator'

let local, remote;

export default {
  name: 'chats',
  reducer: (state = {}, {type, payload}) => {
    switch (type) {
      case 'FETCH_CHAT_START':
      return Object.assign({}, state, {
        fetching: true
      })
      case 'FETCH_CHATS_SUCCESS':
      return Object.assign({}, state, {
        fetching: false,
        ...payload
      })
      case 'FETCH_CHATS_ERROR':
      return Object.assign({}, state, {
        fetching: false,
        error: payload
      })
      default:
      return state
    }
  },
  doFetchOrCreateChat: (_id) => ({ dispatch }) => {
    dispatch({ type: 'FETCH_USER_CHAT_START' })

    const dbs = createDB(_id)

    local = dbs.local
    remote = dbs.remote

    local.replicate.to(remote)

    local.allDocs({include_docs: true})
      .then(payload => {
        dispatch({ type: 'FETCH_CHATS_SUCCESS', payload })
      })
      .catch(payload => {
        dispatch({ type: 'FETCH_CHATS_ERROR', payload })
      })
  },
  doAddToChat: (value) => ({ dispatch }) => {
    if (value.timer) {
      chartCreator(value.text, local)
        .then(chart => local.put(chart))
        .then(() => local.allDocs({ include_docs: true }))
        .then(payload => dispatch({ type: 'FETCH_CHATS_SUCCESS', payload }))
        .catch(payload => dispatch({ type: 'FETCH_CHATS_ERROR', payload }))
    } else {
      local.put(value)
        .then(() => local.allDocs({ include_docs: true }))
        .then(payload => dispatch({ type: 'FETCH_CHATS_SUCCESS', payload }))
        .catch(payload => dispatch({ type: 'FETCH_CHATS_ERROR', payload }))
    }
  },
  selectChats: state => state.chats
}

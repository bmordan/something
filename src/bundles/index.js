import { composeBundles } from 'redux-bundler'
import usersBundle from './users'
import chatsBundle from './chats'

export default composeBundles(
  usersBundle,
  chatsBundle
)

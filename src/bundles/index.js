import { composeBundles } from 'redux-bundler'
import usersBundle from './users'

export default composeBundles(
  usersBundle
)

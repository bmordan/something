import React from 'react'
import RiveScript from 'rivescript'
import { concat, last, merge } from 'ramda'
import InputBox from './InputBox'
import ChatPane from './ChatPane'
import Timer from './Timer'
import Buttons from './Buttons'
import { connect } from 'redux-bundler-react'
import createHistory from 'history/createBrowserHistory'
import parseHash from '../lib/parse'
import IdTokenVerifier from 'idtoken-verifier'

const history = createHistory()
const bot = new RiveScript()
const jwt = new IdTokenVerifier({
  issuer: 'https://my.auth0.com/',
  audience: '_G2atzNRwzG_sGQCAX8L8Zrj3r0Drqkz'
})

const initConversation = (_id, name) => {
  let conversation = [];

  if (_id && name) {
    conversation.push({
      text: `Hello again ${name}`,
      actor: 'bot'
    })
  } else if (_id && !name) {
    const welcomes = [
      'Hello again',
      `Now. I know you as ${_id}`,
      `That's not a great name`,
      'What would you like to be known as?'
    ]

    welcomes.forEach(text => conversation.push({ text, actor: 'bot' }))
  } else if (!_id && !name) {
    conversation.push({
      text: `Hello`,
      actor: 'bot'
    })
  }

  return conversation
}

class App extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      conversation: [],
      timer: false,
      buttons: []
    }
    // Users Auth0 id
    const something_user = window.localStorage.getItem('something_user')
    // Get or create
    if (something_user) props.doFetchOrCreateUser(something_user)
    // token coming in via window.location from Auth0
    const { id_token } = parseHash(window.location.hash)

    if (id_token) {
      const {payload: {sub: userId}} = jwt.decode(id_token)
      window.localStorage.setItem('something_user', userId)
      props.doFetchOrCreateUser(userId)
      history.push('/')
    }

    bot.loadFile([
      'begin.rive',
      'main.rive'
    ], () => {
      bot.sortReplies()
    })
  }

  componentWillReceiveProps (props) {
    if (!props.userState.user) return

    const { _id , name } = props.userState.user

    if (!this.state.conversation.length) {
      this.setState({conversation: initConversation(_id , name)})
    }

    console.log(props)
  }

  onLogin = () => this.props.doFetchAuthToken()

  onSetName = (rivescriptContext, currentUser) => {
    const user = this.props.userState && this.props.userState.user
    const { name } = rivescriptContext[user._id || 'default_user']
    const update = merge(this.props.userState.user, { name })
    this.props.doUpdateUser(update)
  }

  onSetTimer = (rivescriptContext) => {
    const {mins, secs} = rivescriptContext[this.props.userState.user._id]
    this.setState({time: {m: mins, s: secs}})
  }

  onTimerFinish = (timeInfo) => {
    this.setState({
      time: false,
      conversation: concat(this.state.conversation, [{
        text: `${timeInfo} meditation session`,
        actor: 'bot'
      }])
    })
  }

  onUserInput = (value) => {
    const _id = this.props.userState
      && this.props.userState.user
      && this.props.userState.user._id

    const replies = bot.reply(_id || 'default_user', value, this).split('|')

    // Have we got buttons?
    let maybeButtons;

    try {
      maybeButtons = JSON.parse(last(replies))
    } catch (err) {
      maybeButtons = null
    }
    // if we have buttons knock them off the array
    const buttons = maybeButtons ? JSON.parse(replies.pop()) : []

    // build next portion of conversation
    let conversation = [
      {text: value, actor: _id || 'default_user'}
    ]

    replies.forEach(reply => {
      conversation.push({text: reply, actor: 'bot'})
    })

    this.setState({
      conversation: concat(this.state.conversation, conversation),
      buttons: buttons
    })
  }

  render() {
    const { onUserInput, onTimerFinish } = this

    return (
      <div className='aspect-ratio--object flex flex-column items-center justify-end'>
        <ChatPane conversation={this.state.conversation} />
        {!this.state.time && !this.state.buttons.length
          ? <InputBox bot={bot} onUserInput={onUserInput} userState={this.props.userState} />
          : null}
        {this.state.time
          ? <Timer time={this.state.time} onTimerFinish={onTimerFinish} />
          : null}
        {!this.state.buttons.length
          ? null
          : <Buttons onUserInput={onUserInput} buttons={this.state.buttons} />}
      </div>
    )
  }
}

export default connect(
  'doFetchAuthToken',
  'doSetAuthToken',
  'doFetchOrCreateUser',
  'doUpdateUser',
  'selectUserState',
  App)

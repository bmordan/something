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
const bot = new RiveScript({debug: true})
const jwt = new IdTokenVerifier({
  issuer: 'https://my.auth0.com/',
  audience: '_G2atzNRwzG_sGQCAX8L8Zrj3r0Drqkz'
})

class App extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      conversation: [{text: 'Hello', actor: 'bot'}],
      timer: false,
      buttons: []
    }
    // Users Auth0 id
    const something_user = window.localStorage.getItem('something_user')
    // Get or create
    if (something_user) {
      props.doFetchOrCreateUser(something_user)
      bot.setVariable('auth0', something_user)
    }
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

  initConversationState = (_id, name) => {
    let state = {
      conversation: [],
      buttons: []
    }

    if (_id && name) {
      state.conversation.push({
        text: `Hello again ${name}`,
        actor: 'bot'
      })

      state.buttons = [
        "Set a new timer",
        "Give me Something to meditate on"
      ]
    } else if (_id && !name) {
      [
        'Hello again',
        `Now. I have not learnt your name`,
        'Who would you like to be known as?'
      ].forEach(text => state.conversation.push({ text, actor: 'bot' }))

    } else if (!_id && !name) {
      state.conversation.push({
        text: `Hello`,
        actor: 'bot'
      })
    }

    this.setState(state)
  }

  addRepliesToState = (_id, reply) => {
    const replies = reply.split('|')
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
    let conversation = []

    replies.forEach(reply => conversation.push({text: reply, actor: 'bot'}))

    this.setState({
      conversation: concat(this.state.conversation, conversation),
      buttons: buttons
    })
  }

  componentWillReceiveProps (props) {
    if (!props.userState.user) return

    const { _id , name = 'default_user' } = props.userState.user

    bot.setVariable('user_name', name)

    if (this.state.conversation.length === 1) this.initConversationState(_id , name)
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

  onTimerFinish = (timer) => {
    this.setState({
      time: false,
      conversation: concat(this.state.conversation, [{
        text: `${timer.formattedDuration} meditation session`,
        actor: 'bot'
      }])
    })

    console.log('save', timer)
  }

  onUserInput = (value) => {
    const _id = this.props.userState
      && this.props.userState.user
      && this.props.userState.user._id

    this.setState({
      conversation: concat(this.state.conversation, [{
        text: value,
        actor: _id || 'default_user'
      }])
    })

    const reply = bot.reply(_id || 'default_user', value, this)

    this.addRepliesToState(_id, reply)
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

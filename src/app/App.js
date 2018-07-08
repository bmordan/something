import React from 'react'
import RiveScript from 'rivescript'
import { last, merge, isEmpty, concat } from 'ramda'
import moment from 'moment'
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

class App extends React.Component {
  constructor (props) {
    super(props)

    const something_user = window.localStorage.getItem('something_user')
    const { id_token } = parseHash(window.location.hash)

    this.state = {
      timer: false,
      buttons: [],
      conversation: [],
      openingGambit: true
    }

    if (something_user) {
      props.doFetchOrCreateUser(something_user)
      props.doFetchOrCreateChat(something_user)
      bot.setVariable('auth0', something_user)
    }
    // token coming in via window.location from Auth0
    if (id_token) {
      const {payload: {sub: userId}} = jwt.decode(id_token)
      window.localStorage.setItem('something_user', userId)
      bot.setVariable('auth0', userId)
      props.doFetchOrCreateUser(userId)
      props.doFetchOrCreateChat(userId)
      history.push('/')
    }

    bot.loadFile([
      'begin.rive',
      'main.rive'
    ], () => {
      bot.sortReplies()

      if (!id_token && !something_user) {
        const _id = moment().unix().toString()
        const reply = bot.reply('default_user', 'hello', this)
        const text = this.stripAndSetButtons(reply)

        this.setState({conversation: [{
          doc: { actor: 'bot', text },
          _id,
          key: _id
        }]})
      }
    })
  }

  stripAndSetButtons = (reply) => {
    const replies = reply.split('|')

    let maybeButtons;

    try {
      maybeButtons = JSON.parse(last(replies))
    } catch (err) {
      maybeButtons = null
    }

    this.setState({
      buttons: maybeButtons ? JSON.parse(replies.pop()) : []
    })

    return replies
  }

  addRepliesToChat = (actor, reply) => {
    const replies = this.stripAndSetButtons(reply)
    replies.forEach(reply => {
      this.props.doAddToChat({
        _id: moment().unix().toString(),
        actor,
        text: reply
      })
    })
  }

  onLogin = () => this.props.doFetchAuthToken()

  onLogout = () => {
    this.props.doRemoveUser()
    window.localStorage.removeItem('something_user')
  }

  onSetName = (rivescriptContext, currentUser) => {
    const { name } = rivescriptContext['default_user']
    const update = merge(this.props.userState.user, { name })
    this.props.doUpdateUser(update)
  }

  onSetTimer = (rivescriptContext) => {
    const {mins, secs} = rivescriptContext[this.props.userState.user._id]
    this.setState({time: {m: mins, s: secs}})
  }

  onTimerFinish = (timer) => {
    this.setState({ time: false })

    if (timer) {
      this.props.doAddToChat({
        _id: moment().unix().toString(),
        actor: 'bot',
        text: timer.formattedDuration,
        timer: true
      })
    } else {
      // cancel timer reset vars
      const { _id } = this.props.userState.user
      bot.reply(_id, 'botpromptresettimer', this)
      // prompt with opening gambit
      const reply = bot.reply(_id, 'botpromptopeninggambit', this)
      this.addRepliesToChat('bot', reply)
    }
  }

  noNameInput = (text) => {
    if (text === 'No I\'m new to this') return this.onLogin()

    const noId = moment().unix().toString()
    const botId = moment().add(1, 'seconds').unix().toString()

    this.setState({
      conversation: concat(this.state.conversation, [{
        doc: { actor: 'user', text },
        _id: noId,
        key: noId
      }, {
        doc: { actor: 'bot', text: 'Whats your name?'},
        _id: botId,
        key: botId
      }])
    })

    bot.reply('default_user', 'botpromptaskforname', this)
  }

  onUserInput = (text) => {
    const _id = this.props.userState
      && this.props.userState.user
      && this.props.userState.user._id

    const name = this.props.userState
      && this.props.userState.user
      && this.props.userState.user.name

    if (!name) return this.noNameInput(text)

    this.addRepliesToChat('user', text)
    const reply = bot.reply(_id || 'default_user', text, this)
    this.addRepliesToChat('bot', reply)
  }

  componentWillReceiveProps (props) {
    const name = props.userState.user ? props.userState.user.name : 'default_user'
    const _id = props.userState.user && props.userState.user._id

    bot.setVariable('user_name', name)

    if (this.state.openingGambit && _id && name && name !== 'default_user') {
      const reply = bot.reply(_id, 'botpromptopeninggambit', this)
      this.addRepliesToChat('bot', reply)
      this.setState({openingGambit: false})
    }
  }

  render() {
    const { onUserInput, onTimerFinish } = this
    const chats = isEmpty(this.props.chats)
      ? {rows: this.state.conversation}
      :  this.props.chats

    return (
      <div className='aspect-ratio--object flex flex-column items-center justify-end'>
        <ChatPane chats={chats} />
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
  'doRemoveUser',
  'doFetchOrCreateChat',
  'doAddToChat',
  'selectUserState',
  'selectChats',
  App)

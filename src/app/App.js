import React from 'react'
import RiveScript from 'rivescript'
import { concat } from 'ramda'
import InputBox from './InputBox'
import ChatPane from './ChatPane'
import Timer from './Timer'
import { connect } from 'redux-bundler-react'
import createHistory from 'history/createBrowserHistory'
import parseHash from '../lib/parse'
import IdTokenVerifier from 'idtoken-verifier'
import db from '../lib/pouch'

const history = createHistory()
const bot = new RiveScript()
const user = 'temp_user'
const jwt = new IdTokenVerifier({
  issuer: 'https://my.auth0.com/',
  audience: '_G2atzNRwzG_sGQCAX8L8Zrj3r0Drqkz'
})

class App extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      welcome: 'Hello',
      conversation: [],
      timer: false
    }

    const {id_token} = parseHash(window.location.hash)

    if (id_token) {
      const {payload: {sub: userId}} = jwt.decode(id_token)
      props.doSetAuthToken({userId})
      history.push('/')
    }

    bot.loadFile([
      'begin.rive',
      'main.rive'
    ], () => {

      const conversation = [
        {text: this.state.welcome, actor: 'bot'},
      ]

      bot.sortReplies()
      this.setState({conversation})
    })
  }

  onLogin = () => this.props.doFetchAuthToken()

  onSetTimer = (rivescriptContext) => {
    const {mins, secs} = rivescriptContext[user]
    this.setState({time: {m: mins, s: secs}})
  }

  onTimerFinish = (timeInfo) => {
    this.setState({
      time: false,
      conversation: concat(this.state.conversation, [{text: `${timeInfo} meditation session`, actor: 'bot'}])
    })

    if (this.props.userState.userId) {
      
      const created = new Date().getTime()

      db.put({
        _id: `${this.props.userState.userId}|${created}`,
        type: 'time',
        value: timeInfo,
        created
      })
    }
  }

  onUserInput = (value) => {
    let conversation = [
      {text: value, actor: 'user'}
    ]

    const reply = bot.reply(user, value, this)

    if (reply && reply !== '_set_timer') {
      conversation.push({text: reply, actor: 'bot'})
    }

    this.setState({
      conversation: concat(this.state.conversation, conversation)
    })

  }

  componentWillReceiveProps (props) {
    if (props.userState.userId && !props.userState.user) {
      console.log('fetch or create', props.userState.userId)
    }
  }

  render() {
    const { onUserInput, onTimerFinish } = this

    return (
      <div className='aspect-ratio--object flex flex-column items-center justify-end'>
        <ChatPane conversation={this.state.conversation} />
        {!this.state.time
          ? <InputBox bot={bot} onUserInput={onUserInput} />
          : <Timer time={this.state.time} onTimerFinish={onTimerFinish} />}
      </div>
    )
  }
}

export default connect('doFetchAuthToken', 'doSetAuthToken', 'selectUserState', App)

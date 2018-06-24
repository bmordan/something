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

const history = createHistory()
const something_user = window.localStorage.getItem('something_user')
const bot = new RiveScript()
const jwt = new IdTokenVerifier({
  issuer: 'https://my.auth0.com/',
  audience: '_G2atzNRwzG_sGQCAX8L8Zrj3r0Drqkz'
})

class App extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      conversation: [],
      timer: false
    }
    // token coming in via window.location from Auth0
    const {id_token} = parseHash(window.location.hash)

    if (id_token) {
      const {payload: {sub: userId}} = jwt.decode(id_token)
      props.doSetAuthToken({userId})
      history.push('/')
    }

    if (something_user) {
      props.doFetchUser({id: something_user})
    }

    bot.loadFile([
      'begin.rive',
      'main.rive'
    ], () => {

      const conversation = [
        {text: 'hello', actor: 'bot'},
      ]

      bot.sortReplies()

      this.setState({conversation})
    })
  }

  componentWillReceiveProps (props) {
    if (props.userState.id) bot.setVariable('name', props.userState.name)
  }

  onLogin = () => this.props.doFetchAuthToken()

  onSetName = (rivescriptContext) => {
    const { id } = this.props.userState
    const { name } = rivescriptContext[id || 'default_user']
    this.props.doFetchUser({ name, type: 'user' })
  }

  onSetTimer = (rivescriptContext) => {
    const {mins, secs} = rivescriptContext[this.props.userState.id]
    this.setState({time: {m: mins, s: secs}})
  }

  onTimerFinish = (timeInfo) => {
    this.setState({
      time: false,
      conversation: concat(this.state.conversation, [{text: `${timeInfo} meditation session`, actor: 'bot'}])
    })
  }

  onUserInput = (value) => {
    const { id } = this.props.userState
    let conversation = [
      {text: value, actor: id || 'default_user'}
    ]

    const reply = bot.reply(id || 'default_user', value, this)

    conversation.push({text: reply, actor: 'bot'})

    this.setState({
      conversation: concat(this.state.conversation, conversation)
    })
  }

  render() {
    const { onUserInput, onTimerFinish } = this

    return (
      <div className='aspect-ratio--object flex flex-column items-center justify-end'>
        <ChatPane conversation={this.state.conversation} />
        {!this.state.time
          ? <InputBox bot={bot} onUserInput={onUserInput} userState={this.props.userState} />
          : <Timer time={this.state.time} onTimerFinish={onTimerFinish} />}
      </div>
    )
  }
}

export default connect(
  'doFetchAuthToken',
  'doSetAuthToken',
  'doFetchUser',
  'selectUserState',
  App)

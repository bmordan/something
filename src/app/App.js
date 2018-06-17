import React from 'react'
import RiveScript from 'rivescript'
import { concat } from 'ramda'
import InputBox from './InputBox'
import ChatPane from './ChatPane'
import Timer from './Timer'
import { connect } from 'redux-bundler-react'
import auth from '../lib/auth'
import createHistory from 'history/createBrowserHistory'

const history = createHistory()
const bot = new RiveScript()
const user = 'temp_user'

class App extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      welcome: props.userState.user ? `Hi ${props.userState.user.name}` : `I don't know who you are`,
      conversation: [],
      timer: false
    }

    auth.parseHash((err, authResult) => {
      if (authResult && authResult.idTokenPayload) {

        const {idTokenPayload: { sub: userId }} = authResult

        props.doSetAuthToken({userId})
        history.push('/')
      } else if (err) {
        history.push('/error')
        console.error(err)
      }
    })

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
      conversation: concat(this.state.conversation, [{text: `logged ${timeInfo} session`, actor: 'bot'}])
    })
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

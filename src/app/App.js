import React from 'react'
import RiveScript from 'rivescript'
import { concat } from 'ramda'
import InputBox from './InputBox'
import ChatPane from './ChatPane'
import Timer from './Timer'

const bot = new RiveScript()
const user = 'temp_user'

class App extends React.Component {
  constructor () {
    super()

    this.state = {
      conversation: [],
      timer: false
    }

    bot.loadFile([
      'begin.rive',
      'main.rive'
    ], () => {
      const conversation = [
        {text: 'Ok - I\'m Ready', actor: 'bot'},
      ]

      bot.sortReplies()
      this.setState({conversation})
    })
  }

  onTimerFinish = (timeInfo) => {
    this.setState({
      time: false,
      conversation: concat(this.state.conversation, [{text: `logged ${timeInfo} session`, actor: 'bot'}])
    })
  }

  onSetTimer = (rivescriptContext) => {
    const {mins, secs} = rivescriptContext[user]
    this.setState({time: {m: mins, s: secs}})
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

export default App
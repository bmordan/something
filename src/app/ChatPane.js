import React from 'react'

const messageClasses = {
  bot: 'bg-light-red washed-red tr',
  user: 'bg-washed-red light-red tl',
  timer: 'bg-dark-red near-white tc'
}

class ChatPane extends React.Component {
  render () {
    setTimeout(() => {
      document.getElementById('chat-pane').scrollIntoView({block: 'end'})
    }, 0)

    return (
      <div className="absolute top-0 left-0 right-0 overflow-scroll" style={{bottom: '25vh'}}>
        <div id="chat-pane" className="flex flex-column justify-end bg-near-white overflow-scroll" style={{minHeight: '75vh'}}>
          {this.props.conversation.map((message, key) => {
            return (
              <div className={`ma1 pa2 ${messageClasses[message.actor]}`} key={key}>{message.text}</div>
            )
          })}
        </div>
      </div>
    )
  }
}

export default ChatPane

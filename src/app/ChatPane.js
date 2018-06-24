import React from 'react'
// import db from '../lib/pouch'

const messageClasses = {
  bot: 'bg-light-red washed-red tr',
  user: 'bg-washed-red light-red tl',
  timer: 'bg-dark-red near-white tc'
}

class ChatPane extends React.Component {
  componentDidMount () {
    setTimeout(() => {
      document.getElementById('chat-pane').scrollIntoView({block: 'end'})
    }, 0)

    // db.allDocs({include_docs: true, limit: 5})
    //   .then(docs => {
    //     console.log(docs)
    //   }).catch(err => console.error(err));
  }
  render () {
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

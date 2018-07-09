import React from 'react'
import { isEmpty } from 'ramda'
import Chart from './Chart'

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
          {isEmpty(this.props.chats) ? (
            null
          ) : (
            this.props.chats.rows.map((row, i) => {
              const { doc: {actor = 'user', text, chart}, key } = row

              return chart ? (
                <div className={`ma1 pa2 ${messageClasses.bot}`} key={key}>
                  <Chart datum={row} open={i === this.props.chats.rows.length - 1} />
                </div>
              ) : (
                <div className={`ma1 pa2 ${messageClasses[actor]}`} key={key}>{text}</div>
              )
            })
          )}
        </div>
      </div>
    )
  }
}

export default ChatPane

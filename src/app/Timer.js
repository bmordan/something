import React from 'react'
import Countdown from 'simple-countdown'

class Timer extends React.Component {
  constructor (props) {
    super(props)

    this.timer = new Countdown(props.time)

    this.state = {
      time: this.timer.formattedDuration
    }

    this.timer.on('tick', (evt) => {
      this.setState({time: evt.formatted})
    })

    this.timer.on('finish', (evt) => {
      this.props.onTimerFinish(this.timer)
    })
  }

  onStart = () => {
    this.timer.start()
  }

  onCancel = () => {
    this.props.onTimerFinish()
  }

  render () {
    return (
      <div className="absolute bottom-0 left-0 right-0 mt1" style={{top: '74.5vh'}}>
        <div className="f1 tc w-100 bg-washed-red red pv4"><samp>{this.state.time}</samp></div>
        <div className="flex items-center justify-between pa2 mb2">
          <button onClick={this.onStart} className="w4 b--transparent pa2 bg-washed-red red">Start</button>
          <button onClick={this.onCancel} className="w4 b--transparent pa2 bg-near-white gray">Cancel</button>
        </div>
      </div>
    )
  }
}

export default Timer

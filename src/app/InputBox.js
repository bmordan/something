import React, { Component } from 'react'

class InputBox extends Component {
  constructor (props) {
    super(props)
    this.state = {
      value: ''
    }
  }
  onChange = (e) => {
    const { value } = e.target
    this.setState({value})
  }
  onSubmit = (e) => {
    e.preventDefault()

    const { value } = this.state
    if (!value) return

    this.props.onUserInput(value)

    this.setState({value: ''})
  }
  render() {
    const {onSubmit, onChange, state} = this
    const isKnown = this.props.userState
      && this.props.userState.user
      && this.props.userState.user._id

    return (
      <form className='absolute left-0 right-0 bottom-0 pv2 flex items-center justify-center'
      style={{top: '75vh'}} onSubmit={onSubmit}>
        <span className={`dib bb bw1 ${isKnown ? 'b--dark-red' : 'b--washed-red'}`}>
          <input className='pa2 outline-transparent' type="text" onChange={onChange} value={state.value} placeholder="Ask me something" />
        </span>
        <button className='w4 ml2 pa2 b--transparent bg-washed-red red' type='submit'>Send</button>
      </form>
    )
  }
}

export default InputBox

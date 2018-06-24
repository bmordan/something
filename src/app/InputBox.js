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

    return (
      <form className='pb5' onSubmit={onSubmit}>
        <span className={`dib bb bw1 ${this.props.userState.auth0 ? 'b--dark-red' : 'b--washed-red'}`}>
          <input className='pa2 outline-transparent' type="text" onChange={onChange} value={state.value} placeholder="Ask me something" />
        </span>
        <button className='w4 ml2 pa2 b--transparent bg-washed-red red' type='submit'>Send</button>
      </form>
    )
  }
}

export default InputBox

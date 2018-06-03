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
        <input className='pa2' type="text" onChange={onChange} value={state.value} placeholder="Ask me something" />
        <button className='w4 ml2 pa2 b--transparent bg-washed-red red' type='submit'>Send</button>
      </form>
    )
  }
}

export default InputBox

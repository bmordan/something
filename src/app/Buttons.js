import React from 'react'
import { replace } from 'ramda'

class Buttons extends React.Component {
  render () {
    return (
      <div className='pb5'>
        {this.props.buttons.map((text, key) => (
          <button
            className='w4 ma2 pa2 b--transparent bg-washed-red red'
            onClick={() => this.props.onUserInput(text)}
            key={`${key}-${replace(/\s/g, '-', text)}`}>
            {text}
          </button>
        ))}
      </div>
    )
  }
}

export default Buttons

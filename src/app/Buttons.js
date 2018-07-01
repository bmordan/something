import React from 'react'
import { replace } from 'ramda'

class Buttons extends React.Component {
  render () {
    return (
      <div className='absolute left-0 right-0 bottom-0 pv2 flex flex-column items-center justify-center'
      style={{top: '75vh'}}>
        {this.props.buttons.map((text, key) => (
          <button
            className='ma2 pa2 b--transparent bg-washed-red red'
            style={{minWidth: '4rem'}}
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

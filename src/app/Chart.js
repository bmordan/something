import React from 'react'
import moment from 'moment'

class Chart extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      open: props.open
    }
  }

  toggleOpen = () => {
    console.log('open')
    this.setState({open: !this.state.open})
  }

  render () {
    const { toggleOpen, state: {open} } = this
    const { total, last, chart } = this.props.datum.doc
    const t = moment.duration(total, 'seconds')
    const h = moment(t.hours(), 'h').format('HH')
    const m = moment(t.minutes(), 'm').format('mm')
    const s = moment(t.seconds(), 's').format('ss')

    const chartWrapperStyle = {
      height: '143px',
      position: 'relative',
      whiteSpace: 'nowrap',
      overflowX: 'scroll',
    }

    if (open) {
      setTimeout(() => {
        document.getElementById(this.props.datum.id).scrollLeft = (10 * chart.length)
      }, 0)
    }

    return (
      <div>
        <div className='flex align-center justify-between'>
          <div>last: {last}</div>
          <div onClick={toggleOpen}>total: {`${h}:${m}:${s}`}
            <span className='ml1'>{open ? '-' : '+'}</span>
          </div>
        </div>
        {open ? (
          <div id={this.props.datum.id} style={chartWrapperStyle} className='mt2'>
          {chart.map(col)}
          </div>
        ) : null}
      </div>
    )
  }
}

const col = ({ date, time }) => {
  const colStyle = {
    height: `${time}px`,
    width: '10px',
    marginRight: '2px'
  }

  const dateStyle = {
    height: '20px',
    transform: 'translate(-2.5px,0)',
    position: 'absolute',
    textAlign: 'center',
    fontSize: '8px',
    paddingTop: '0.25rem'
  }

  return (
    <div key={date} className='dib'>
      <div style={colStyle} className='bg-near-white'></div>
      <div style={dateStyle}>
        {moment(date).format('D') % 7 === 0 ? (
          <div>
            <div>{moment(date).format('ddd')}</div>
            <div>{moment(date).format('Do')}</div>
            <div>{moment(date).format('MMM')}</div>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default Chart

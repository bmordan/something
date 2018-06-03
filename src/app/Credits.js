import React from 'react'
import { Link } from 'simple-react-router'

export default () => {
  return (
    <div>
      <div>Something</div>
      <div>to meditate on</div>
      <hr />
      <div>an app by Bernard Mordan <Link href="https://github.com/bmordan/cv">@bmordan</Link></div>
      <div>For all the people who come to my classes and everyone who wants to meditate</div>
      <div>
        <Link href="/">Login</Link>
      </div>
    </div>
  )
}

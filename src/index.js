import React from 'react'
import ReactDOM from 'react-dom'
import SimpleReactRouter from 'simple-react-router'

import App from './app/App'
import Auth from './app/Auth'
import NotFound from './app/NotFound'
import Error from './app/Error'
import Credits from './app/Credits'

class Router extends SimpleReactRouter {
  routes(map){
    map('/', App)
    map('/auth', Auth)
    map('/error', Error)
    map('/credits', Credits)
    map('/:path*', NotFound)
  }
}

ReactDOM.render(<Router />, document.getElementById('root'))

// import registerServiceWorker from './registerServiceWorker'
// registerServiceWorker()

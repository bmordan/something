import React from 'react'
import ReactDOM from 'react-dom'
import SimpleReactRouter from 'simple-react-router'
import { Provider } from 'redux-bundler-react'
import createStore from './bundles'

import App from './app/App'
import NotFound from './app/NotFound'
import Error from './app/Error'
import Credits from './app/Credits'

const store = createStore()

class Router extends SimpleReactRouter {
  routes(map){
    map('/', App)
    map('/error', Error)
    map('/credits', Credits)
    map('/:path*', NotFound)
  }
}

ReactDOM.render(
  <Provider store={store}>
    <Router />
  </Provider>, document.getElementById('root'))

// import registerServiceWorker from './registerServiceWorker'
// registerServiceWorker()

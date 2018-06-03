import React from 'react'
import auth0 from 'auth0-js'
import createHistory from 'history/createBrowserHistory'

const history = createHistory()

class Auth extends React.Component {
  constructor () {
    super()

    this.auth0 = new auth0.WebAuth({
      domain: 'somethingtomeditateon.eu.auth0.com',
      clientID: '_G2atzNRwzG_sGQCAX8L8Zrj3r0Drqkz',
      redirectUri: 'http://localhost:3000/auth',
      audience: 'https://somethingtomeditateon.eu.auth0.com/userinfo',
      responseType: 'token id_token',
      scope: 'openid'
    })
  }

  login = () => {
    this.auth0.authorize()
  }

  handleAuthentication = () => {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        console.log(authResult)
        this.setSession(authResult)
        history.push('/')
      } else if (err) {
        history.push('/error')
        console.log(err)
      }
    })
  }

  setSession = (authResult) => {
    // Set the time that the Access Token will expire at
    let expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
    localStorage.setItem('something_access_token', authResult.accessToken);
    localStorage.setItem('something_id_token', authResult.idToken);
    localStorage.setItem('something_expires_at', expiresAt);
    // navigate to the home route
    history.push('/');
  }

  logout = () => {
    // Clear Access Token and ID Token from local storage
    localStorage.removeItem('something_access_token');
    localStorage.removeItem('something_id_token');
    localStorage.removeItem('something_expires_at');
    history.push('/credits');
  }

  isAuthenticated = () => {
    let expiresAt = JSON.parse(localStorage.getItem('something_expires_at'));
    return new Date().getTime() < expiresAt;
  }

  componentDidMount () {
    this.handleAuthentication()
  }

  render () {
    return <div>ok auth</div>
  }
}

export default Auth

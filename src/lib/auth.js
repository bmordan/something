import auth0 from 'auth0-js'

export default new auth0.WebAuth({
  domain: 'somethingtomeditateon.eu.auth0.com',
  clientID: '_G2atzNRwzG_sGQCAX8L8Zrj3r0Drqkz',
  redirectUri: 'http://localhost:3000/',
  audience: 'https://somethingtomeditateon.eu.auth0.com/userinfo',
  responseType: 'token id_token',
  scope: 'openid'
})

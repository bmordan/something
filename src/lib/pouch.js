import PouchDB from 'pouchdb'

const db = new PouchDB('something_sessions')
const remoteDB = new PouchDB('http://localhost:5984/bear_bear_test')

db.replicate.to(remoteDB)
  .on('complete', () => console.log('sync ok'))
  .on('error', () => console.log('err syncing'))

export default db

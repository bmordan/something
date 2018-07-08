import PouchDB from 'pouchdb'
PouchDB.debug.disable('*')

const db = new PouchDB('beta05_something')
const remoteDB = new PouchDB('http://localhost:4000/beta_something')

db.replicate.to(remoteDB)
  .on('complete', () => console.log('sync ok'))
  .on('error', () => console.log('err syncing'))

export default db

export const createDB = (name) => {
  const db = `userdb-${name.replace(/auth0\|/g, '')}`
  return {
    local: new PouchDB(db),
    remote: new PouchDB(`http://localhost:4000/${db}`)
  }
}

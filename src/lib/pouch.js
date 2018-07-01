import PouchDB from 'pouchdb'
PouchDB.debug.disable('*')

const db = new PouchDB('beta05_something')
// const remoteDB = new PouchDB('http://localhost:4000/beta_something')
//
// db.replicate.to(remoteDB)
//   .on('complete', () => console.log('sync ok'))
//   .on('error', () => console.log('err syncing'))
//
// export const replicate = db.replicate.to.bind(null, remoteDB)

export default db

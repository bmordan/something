const Hapi = require('hapi')

const server = Hapi.server({
  host: 'localhost',
  port: 3030
})

server.route({
  method: 'GET',
  path: '/',
  handler: function (req, res) {
    return 'Something is coming...'
  }
})

server.route({
  method: 'GET',
  path: '/auth',
  handler: function (req, res) {
    return 'auth'
  }
})

const go = async () => {
  await server.start()
  console.log(`server running at ${server.info.uri}`)
}

process.on('unhandledRejection', err => {
    console.error(err)
    process.exit(1)
})

go()

import config from './config/config'
import app, {io} from './express'
import mongoose from 'mongoose'
import calling from './controllers/calling.controller'
// import http from 'http'
// import https from 'https'
// async connect to MongoDB via mongoose
mongoose.Promise = global.Promise
mongoose.connect(config.mongoUri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true,  useFindAndModify: false  })
mongoose.connection.on('error', (err) => {
  throw new Error(`Mongoose unable to connect to database ${err}`)
})
mongoose.connection.on('connected', function () {
  console.log('Mongoose connected', config.mongoUri);
});
mongoose.connection.on('error',function (err) {
console.log('Mongoose connection error: ' + err);
});
mongoose.connection.on('disconnected', function () {
console.log('Mongoose disconnected');
});
// const http_server = app.listen(80, (err) => {
//   if (err) {
//     console.log(err)
//   }
//   e.info('HTTP Server started on port %s.', config.port)
// })
// const https_server = app.listen(443, (err) => {
//   if (err) {
//     console.log(err)
//   }
//   console.info('HTTPS Server started on port %s.', config.port)
// })
const server = app.listen(config.port, (err) => {
  if (err) {
    throw new Error(`Server unable to spin up: ${err}`)
  }
  console.info('Server started on port %s.', config.port)
})
/** Augment Express server with Websocket functional to enhannce MongoDB with real-time funcitonalities*/
io.listen(server)
io.on('connection', function(socket){
  calling(io, socket)
})

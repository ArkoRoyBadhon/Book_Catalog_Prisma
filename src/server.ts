/* eslint-disable no-console */
import app from './app'
import config from './config'
import { Server } from 'http'

let server: Server

async function boostrap() {
  try {
    server = app.listen(config.port, () => {
      console.log(`Application app listening on port ${config.port}`)
    })
  } catch (error) {
    console.log(`failed to connect database`, error)
  }

  process.on('unhandledRejection', error => {
    if (server) {
      server.close(() => {
        console.log(error)
        process.exit(1)
      })
    } else {
      process.exit(1)
    }
  })
}

boostrap()

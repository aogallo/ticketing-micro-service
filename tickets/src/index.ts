import mongoose from 'mongoose'
import { app } from './app'
import { natsWrapper } from './nats-wrapper'
import { OrderCreatedListener } from './events/listeners/order-created-listener'
import { OrderCancelledListener } from './events/listeners/order-cancelled-listener'

const PORT = 3000

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined')
  }

  if (!process.env.MONGO_URI) {
    throw new Error('Mongo URI must be defined')
  }

  if (!process.env.NATS_URL) {
    throw new Error('NATS Server must be defined')
  }

  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('Cluster Id must be defined')
  }

  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('Client Id must be defined')
  }

  try {
    await natsWrapper.connect(process.env.NATS_CLUSTER_ID, process.env.NATS_CLIENT_ID, process.env.NATS_URL)

    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed!')
      process.exit()
    })

    process.on('SIGINT', () => natsWrapper.client.close())
    process.on('SIGTERM', () => natsWrapper.client.close())

    new OrderCreatedListener(natsWrapper.client).listen()
    new OrderCancelledListener(natsWrapper.client).listen()

    await mongoose.connect(process.env.MONGO_URI, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
      // useCreateIndex: true,
    })

    console.log('Connected to Mongodb')
  } catch (error) {
    console.error(error)
  }

  app.listen(PORT, () => {
    console.log(`The tickets service is listening in the port: ${PORT}`)
  })
}

start()

import mongoose from 'mongoose'
import { app } from './app'

const PORT = 3000

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined')
  }

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined')
  }

  try {
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
    console.log(`The auth service is istening in the port: ${PORT}`)
  })
}

start()
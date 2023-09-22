import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'

jest.mock('../nats-wrapper')

let mongo: MongoMemoryServer

declare global {
  let signin: () => string[]
}

beforeAll(async () => {
  process.env.JWT_KEY = 'whatevervalue'
  mongo = await MongoMemoryServer.create()
  const mongoUri = mongo.getUri()

  await mongoose.connect(mongoUri, {})
})

beforeEach(async () => {
  jest.clearAllMocks()
  const collections = await mongoose.connection.db.collections()
  for (const collection of collections) {
    await collection.deleteMany({})
  }
})

afterAll(async () => {
  if (mongo) {
    await mongo.stop()
  }
  await mongoose.connection.close()
})

signin = () => {
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com',
  }

  // Create a JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!)

  // Build session Object {jwt: MY_JWT}
  const session = { jwt: token }

  // turn that session into json
  const sessionJson = JSON.stringify(session)

  // Take json and encode it as base64
  const base64 = Buffer.from(sessionJson).toString('base64')

  return [`session=${base64}`]
}

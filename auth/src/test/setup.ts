import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import request from 'supertest'

import { app } from '../app'

let mongo: MongoMemoryServer

declare global {
  let signin: () => Promise<string[]>
}

beforeAll(async () => {
  process.env.JWT_KEY = 'whatevervalue'
  mongo = await MongoMemoryServer.create()
  const mongoUri = mongo.getUri()

  await mongoose.connect(mongoUri, {})
})

beforeEach(async () => {
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

signin = async () => {
  const email = 'test@test.com'
  const password = 'test1234'

  const response = await request(app)
    .post('/api/users/signup')
    .send({ email, password })
    .expect(201)

  const cookie = response.get('Set-Cookie')

  return cookie
}

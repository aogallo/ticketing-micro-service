import request from 'supertest'
import { app } from '../../app'

it('returns a 201 on successful signup', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'pass',
    })
    .expect(201)
})

it('returns a 400 with invalid email', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'test',
      password: 'pass',
    })
    .expect(400)
})

it('returns a 400 with invalid password', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'pa',
    })
    .expect(400)
})

it('returns a 400 with missing email and password', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test2@test.com',
    })
    .expect(400)

  await request(app)
    .post('/api/users/signup')
    .send({
      password: 'test22',
    })
    .expect(400)
})

it('disallows duplicate emails', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({ email: 'test@test.com', password: '222jjj' })
    .expect(201)

  await request(app)
    .post('/api/users/signup')
    .send({ email: 'test@test.com', password: '222jjj' })
    .expect(400)
})

it('sets a cookie after successful signup', async () => {
  const response = await request(app)
    .post('/api/users/signup')
    .send({ email: 'test@test.com', password: '222jjj' })
    .expect(201)

  expect(response.get('Set-Cookie')).toBeDefined()
})

import request from 'supertest'
import { app } from '../../app'

it('fails when an email that does not exist is supplied', async () => {
  await request(app).post('/api/users/signin').send({
    email: 'pmaster2@test.com',
    password: 'whatever22',
  }).expect(400)
})

it('returns a 400 ', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'pass',
    })
    .expect(201)

  return request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'pass',
    })
    .expect(201)
})

it('returns a 201 on successful signup', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'pass',
    })
    .expect(201)

  return request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'pass',
    })
    .expect(201)
})


it('sets a cookie after successful signin', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({ email: 'test@test.com', password: '222jjj' })
    .expect(201)

  const response = await request(app)
    .post('/api/users/signin')
    .send({ email: 'test@test.com', password: '222jjj' })
    .expect(201)

  expect(response.get('Set-Cookie')).toBeDefined()
})


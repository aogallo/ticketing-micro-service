import request from 'supertest'

import { app } from '../../app'

it('can fetch a list of tickets', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', signin())
    .send({ title: 'what ever', price: 34.1 })
  await request(app)
    .post('/api/tickets')
    .set('Cookie', signin())
    .send({ title: 'somenthjing great', price: 1004.1 })

  const response = await request(app).get('/api/tickets').send().expect(200)

  expect(response.body.length).toEqual(2)
})

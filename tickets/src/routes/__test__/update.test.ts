import request from 'supertest'
import { app } from '../../app'
import mongoose from 'mongoose'
import { natsWrapper } from '../../nats-wrapper'
import { Ticket } from '../../models/ticket'

it('returns a 404 if the provided id does not exists', async () => {
  const id = new mongoose.Types.ObjectId().toHexString()

  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', signin())
    .send({ title: 'asdfewg', price: 11.11 })
    .expect(404)
})

it('returns a 401 if the user is not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString()

  await request(app)
    .put(`/api/tickets/${id}`)
    .send({ title: 'ticket to update', price: 4012.11 })
    .expect(401)
})

it('returns a 401 if the user does not own the ticket', async () => {
  const response = await request(app)
    .post(`/api/tickets`)
    .set('Cookie', signin())
    .send({ title: 'asdfewg', price: 11.11 })

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', signin())
    .send({ title: 'ticket to update', price: 4012.11 })
    .expect(401)
})

it('return a 400 if the user provides an invalid title or price', async () => {
  const cookie = signin()
  const response = await request(app)
    .post(`/api/tickets`)
    .set('Cookie', cookie)
    .send({ title: 'asdfewg', price: 11.11 })

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title: '', price: 4012.11 })
    .expect(400)

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title: 'test 2', price: -4012.11 })
    .expect(400)
})

it('updates the ticket provided valid inputs', async () => {
  const cookie = signin()
  const response = await request(app)
    .post(`/api/tickets`)
    .set('Cookie', cookie)
    .send({ title: 'asdfewg', price: 11.11 })

  const title = 'holta test'
  const updateResponse = await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title, price: 4012.11 })
    .expect(200)

  expect(updateResponse.body.title).toEqual(title)
})

it('publish an event', async () => {
  const cookie = signin()
  const title = 'holta test'

  const response = await request(app)
    .post(`/api/tickets`)
    .set('Cookie', cookie)
    .send({ title: 'asdfewg', price: 11.11 })

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title, price: 4012.11 })
    .expect(200)

  expect(natsWrapper.client.publish).toHaveBeenCalled()
})

it('rejects updates if the ticket is reserved', async () => {
  const cookie = signin()
  const title = 'holta test'

  const response = await request(app)
    .post(`/api/tickets`)
    .set('Cookie', cookie)
    .send({
      title: 'asdfewg',
      price: 11.11
    })

  const ticket = await Ticket.findById(response.body.id)

  ticket!.set({ orderId: new mongoose.Types.ObjectId().toHexString() })

  await ticket!.save()

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title, price: 4012.11 })
    .expect(400)
})

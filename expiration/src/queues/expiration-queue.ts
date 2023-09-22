import Queue from 'bull'
import { ExpirationCompletePublisher } from '../event/publishers/expiration-complete-publisher'
import { natsWrapper } from '../nats-wrapper'

interface Payload {
  orderId: string
}

const expirationQue = new Queue<Payload>(
  'order:expiration',
  {
    redis: {
      host: 'expiration-redis-srv',
    },
  },
)

expirationQue.process(async (job) => {
  console.log(
    'i want to publish and expieration:complete event for orderId',
    job.data.orderId,
  )

  new ExpirationCompletePublisher(natsWrapper.client).publish({
    orderId: job.data.orderId
  })
})

export { expirationQue }

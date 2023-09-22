import { Listener, OrderCreatedEvent, Subjects } from '@aogallotickets/common'
import { Message } from 'node-nats-streaming'
import { queueGroupName } from './queue-group-name'
import { expirationQue } from '../../queues/expiration-queue'

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated
  queueGroupName = queueGroupName

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime()

    await expirationQue.add(
      {
        orderId: data.id,
      },
      {
        delay,
      },
    )

    msg.ack()
  }
}

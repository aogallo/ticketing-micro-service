import { Message } from 'node-nats-streaming'
import { Listner } from './base-listener'
import { TicketCreatedEvent } from './ticket-created-event'
import { Subjects } from './subjects'

export default class TicketCreatedListener extends Listner<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated
  queueGroupName = 'payments-service'

  onMessage(data: TicketCreatedEvent['data'], msg: Message): void {
    console.log('event data', data)
    msg.ack()
  }
}

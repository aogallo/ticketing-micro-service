import { Publisher, OrderCreatedEvent, Subjects } from '@aogallotickets/common'

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated
}

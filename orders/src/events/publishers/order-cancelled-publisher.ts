import {
  Publisher,
  OrderCancelledEvent,
  Subjects,
} from '@aogallotickets/common'

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled
}

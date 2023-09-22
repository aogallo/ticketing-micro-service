import { Publisher, Subjects, TicketUpdatedEvent } from '@aogallotickets/common'

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated
}


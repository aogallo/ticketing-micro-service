import { Publisher, Subjects, TicketCreatedEvent } from '@aogallotickets/common'

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated
}

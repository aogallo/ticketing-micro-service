import { Publisher, PaymentCreatedEvent, Subjects } from "@aogallotickets/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent>{
  readonly subject = Subjects.PaymentCreated;
}

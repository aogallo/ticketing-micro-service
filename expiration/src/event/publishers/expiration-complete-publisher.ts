import { ExpirationCompleteEvent, Publisher, Subjects } from "@aogallotickets/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent>{
  readonly subject = Subjects.ExpirationComple;
}

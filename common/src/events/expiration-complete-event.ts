import { Subjects } from "./subjects";

export interface ExpirationCompleteEvent {
  subject: Subjects.ExpirationComple
  data: {
    orderId: string
  }
}

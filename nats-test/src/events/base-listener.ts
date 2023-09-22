import { Message, Stan } from 'node-nats-streaming'
import { Subjects } from './subjects'

interface Event {
  subject: Subjects
  data: any
}

export abstract class Listner<T extends Event> {
  private client: Stan

  abstract subject: T['subject'] // Name of the channel this listener is going to listen to
  abstract queueGroupName: string // Name of the queue group this lsitener will join

  protected ackWait = 5 * 1000
  abstract onMessage(data: T['data'], msg: Message): void //Function to run when a message is received

  constructor(client: Stan) {
    this.client = client
  }

  subscriptionOptions() {
    return this.client
      .subscriptionOptions()
      .setDeliverAllAvailable()
      .setManualAckMode(true)
      .setAckWait(this.ackWait)
      .setDurableName(this.queueGroupName)
  }

  listen() {
    const subscription = this.client.subscribe(
      this.subject,
      this.queueGroupName,
      this.subscriptionOptions(),
    )

    subscription.on('message', (msg: Message) => {
      console.log(`Message received: ${this.subject} / ${this.queueGroupName}`)

      const parsedData = this.parseMessage(msg)

      this.onMessage(parsedData, msg)
    })
  }

  parseMessage(msg: Message) {
    const data = msg.getData()

    return typeof data === 'string'
      ? JSON.parse(data)
      : JSON.parse(data.toString('utf8'))
  }
}

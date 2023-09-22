import { OrderStatus } from '@aogallotickets/common'
import mongoose from 'mongoose'
import { Order } from './orders'
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'

interface TicketAttrs {
  id: string
  title: string
  price: number
}

export interface TicketDoc extends mongoose.Document {
  title: string
  price: number
  isReserved(): Promise<boolean>
  version: number
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc
  findByEvent(event: { id: string; version: number }): Promise<TicketDoc | null>
}

const schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    toJSON: {
      // versionKey: false,
      transform(_doc, ret) {
        ret.id = ret._id
        delete ret._id
      },
    },
  },
)

schema.set('versionKey', 'version')
schema.plugin(updateIfCurrentPlugin)
// schema.pre('save', function (done) {
//   this.$where = {
//     version: this.get('version') - 1,
//   }

//   done()
// })

schema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket({
    _id: attrs.id,
    title: attrs.title,
    price: attrs.price,
  })
}

schema.statics.findByEvent = (event: { id: string; version: number }) => {
  return Ticket.findOne({
    _id: event.id,
    version: event.version - 1,
  })
}

schema.methods.isReserved = async function () {
  const existingOrder = await Order.findOne({
    ticket: this,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete,
      ],
    },
  })

  return !!existingOrder
}

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', schema)

export { Ticket }

import { Router, Request, Response } from "express";

import { BadRequestError, NotAuthorizedError, NotFoundError, OrderStatus, requireAuth, validateRequest } from "@aogallotickets/common";
import { body } from "express-validator";
import { Order } from "../models/order";
import { stripe } from "../stripe";
import { Payment } from "../models/payments";
import { PaymentCreatedPublisher } from "../events/publishers/payment-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = Router()

router.post('/api/payments', requireAuth, [body('token').not().isEmpty(), body('orderId').not().isEmpty()], validateRequest, async (req: Request, res: Response) => {
  const { orderId, token } = req.body
  const order = await Order.findById(orderId)

  if (!order) {
    throw new NotFoundError()
  }

  if (order.userId !== req.currentUser!.id) {
    throw new NotAuthorizedError()
  }

  if (order.status === OrderStatus.Cancelled) {
    throw new BadRequestError('Cannot pay for an cancelled order')
  }

  const charge = await stripe.charges.create({
    amount: order.price * 100,
    currency: 'usd',
    source: token
  })

  const payment = Payment.build({
    orderId,
    stripeId: charge.id
  })

  await payment.save()

  new PaymentCreatedPublisher(natsWrapper.client).publish({
    id: payment.id,
    orderId: payment.orderId,
    stripeId: payment.stripeId
  })

  res.status(201).send({ success: true })
})

export { router as newPaymentRouter }

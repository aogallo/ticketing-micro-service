import { Response, Request, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

interface UserPayload {
  email: string
  id: string
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload
    }
  }
}

export const currentUser = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  if (!req.session?.jwt) {
    return next()
  }

  try {
    const payload = jwt.verify(
      req.session.jwt,
      process.env.JWT_KEY!
    ) as UserPayload
    req.currentUser = payload
  } catch (error) {
    req.currentUser = undefined
  }
  next()
}
